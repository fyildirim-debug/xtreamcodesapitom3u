const express = require('express');
const axios = require('axios');
const { URL } = require('url');
const path = require('path');

// --- Dil Verileri --- (languages.php içeriğinden alındı)
const languages = {
    tr: {
        title: 'Xtream Codes M3U Dönüştürücü',
        info: 'IPTV bilgilerinizi girerek M3U playlist oluşturabilirsiniz.',
        url_label: 'IPTV URL',
        url_placeholder: 'http://example.com:8080',
        url_help: 'Sunucu adresini port ile birlikte giriniz (örn: http://example.com:8080)',
        username_label: 'Kullanıcı Adı',
        password_label: 'Şifre',
        content_type_label: 'İçerik Türü',
        content_all: 'Tümü (Canlı + Film)',
        content_live: 'Sadece Canlı Yayınlar',
        content_movies: 'Sadece Filmler',
        submit_button: 'M3U Oluştur',
        error_invalid_credentials: 'Geçersiz kullanıcı bilgileri veya sunucu yanıtı.',
        error_connection: 'Sunucuya bağlanırken hata: ',
        error_fetching_data: 'Veri alınırken hata: ',
        error_generating_m3u: 'M3U oluşturulurken hata: ',
        error_missing_field: 'Lütfen tüm zorunlu alanları doldurun.',
        live_category_prefix: '',
        vod_category_prefix: 'Film: ',
        epg_support: 'EPG & Catch-up',
        epg_enabled: 'Program Rehberi (EPG) Ekle',
        catchup_enabled: 'Geriye Dönük İzleme (Catch-up) Ekle',
        days_to_include: 'Catch-up Gün Sayısı',
        epg_timeshift: 'EPG Zaman Kaydırma (Saat)'
    }
    // Diğer diller eklenebilir
};

// Varsayılan dil
const langCode = 'tr';
const lang = languages[langCode];

const app = express();
const port = 3000; // Uygulamanın çalışacağı port

// Middleware
app.set('view engine', 'ejs'); // Şablon motorunu EJS olarak ayarla
app.set('views', path.join(__dirname, 'views')); // Şablonların bulunduğu klasörü belirt
app.use(express.urlencoded({ extended: true })); // Form verilerini parse etmek için

// --- API İstek Fonksiyonu --- (Hata mesajı döndürecek şekilde)
async function curlRequest(url) {
    try {
        const response = await axios.get(url, { timeout: 15000 }); // Timeout artırıldı
        return { data: response.data, error: null };
    } catch (error) {
        let errorMessage;
        if (error.code === 'ECONNABORTED') {
             errorMessage = `${lang.error_connection} Zaman aşımı (${url})`;
        } else if (error.response) {
            errorMessage = `${lang.error_fetching_data} Sunucu yanıtı: ${error.response.status} (${url})`;
        } else if (error.request) {
            errorMessage = `${lang.error_connection} Yanıt alınamadı (${url})`;
        } else {
            errorMessage = `${lang.error_connection} ${error.message} (${url})`;
        }
        return { data: null, error: errorMessage };
    }
}

// --- M3U Oluşturma Mantığı --- (Hata mesajı döndürecek şekilde)
function escapeM3UValue(value) {
    return typeof value === 'string' ? value.replace(/"/g, '\\"') : '';
}

async function generateM3uContent(baseUrl, username, password, contentType = 'all', epgEnabled = false, catchupEnabled = false, daysToInclude = 7, epgTimeshift = 0) {
    try {
        const authUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
        const { data: authResponse, error: authError } = await curlRequest(authUrl);

        if (authError) return { m3u: null, error: authError };
        if (!authResponse || typeof authResponse !== 'object' || !authResponse.user_info || !authResponse.user_info.auth) {
            return { m3u: null, error: lang.error_invalid_credentials };
        }

        const userInfo = authResponse.user_info;
        const serverInfo = authResponse.server_info || {};
        const apiUsername = userInfo.username || username;
        const apiPassword = userInfo.password || password;

        let streamBaseUrl;
        if (serverInfo.url && serverInfo.port) {
            const scheme = String(serverInfo.https_port) === String(serverInfo.port) ? 'https://' : 'http://';
            streamBaseUrl = `${scheme}${serverInfo.url}:${serverInfo.port}`;
        } else {
             try {
                const parsedUrl = new URL(baseUrl);
                streamBaseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
            } catch (e) {
                 return { m3u: null, error: `Geçersiz temel URL: ${baseUrl}` };
            }
        }

        let m3uContentList = ['#EXTM3U'];
        if (epgEnabled) {
            const epgUrl = `${baseUrl}/xmltv.php?username=${apiUsername}&password=${apiPassword}`;
            m3uContentList.push(`#EXTM3U url-tvg="${epgUrl}" tvg-shift="${epgTimeshift}"`);
        }

        const categoryData = { live: {}, vod: {} };
        const streamsData = { live: [], vod: [] };
        const errors = [];
        const fetchPromises = [];

        // Fetch requests
        if (contentType === 'all' || contentType === 'live') {
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_live_categories`).then(res => ({ type: 'live_cats', ...res })));
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_live_streams`).then(res => ({ type: 'live_streams', ...res })));
        }
        if (contentType === 'all' || contentType === 'vod') {
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_vod_categories`).then(res => ({ type: 'vod_cats', ...res })));
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_vod_streams`).then(res => ({ type: 'vod_streams', ...res })));
        }

        const results = await Promise.all(fetchPromises);

        // Process results
        results.forEach(result => {
            if (result.error) {
                 errors.push(result.error); // Hataları biriktir
                 return;
            }
            if (!result.data) return;

            if (result.type === 'live_cats' && Array.isArray(result.data)) {
                result.data.forEach(cat => { if (cat?.category_id && cat.category_name) categoryData.live[String(cat.category_id)] = cat.category_name; });
            } else if (result.type === 'live_streams' && Array.isArray(result.data)) {
                streamsData.live = result.data.filter(s => s && typeof s === 'object');
            } else if (result.type === 'vod_cats' && Array.isArray(result.data)) {
                result.data.forEach(cat => { if (cat?.category_id && cat.category_name) categoryData.vod[String(cat.category_id)] = cat.category_name; });
            } else if (result.type === 'vod_streams' && Array.isArray(result.data)) {
                streamsData.vod = result.data.filter(s => s && typeof s === 'object');
            }
        });

        if (errors.length > 0 && streamsData.live.length === 0 && streamsData.vod.length === 0) {
             return { m3u: null, error: errors.join('\n') };
        }

        let liveCount = 0, vodCount = 0;

        // Build Live Streams
        if (contentType === 'all' || contentType === 'live') {
            streamsData.live.forEach(stream => {
                const catId = String(stream.category_id);
                if (categoryData.live[catId]) {
                    const tvgId = stream.epg_channel_id || stream.stream_id || '';
                    const tvgName = stream.name || '';
                    const groupTitle = categoryData.live[catId];
                    const streamId = stream.stream_id || '';
                    const logo = stream.stream_icon || '';

                    let extinf = `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${escapeM3UValue(tvgName)}"`;
                    if (logo) extinf += ` tvg-logo="${logo}"`;
                    if (epgTimeshift) extinf += ` tvg-shift="${epgTimeshift}"`;
                    extinf += ` group-title="${lang.live_category_prefix}${escapeM3UValue(groupTitle)}"`;

                    if (catchupEnabled && stream.tv_archive == 1) {
                        const days = stream.tv_archive_duration || daysToInclude;
                        extinf += ` catchup="append" catchup-days="${days}" catchup-source="?utc={utc}&lutc={lutc}"`;
                    }
                    extinf += `,${escapeM3UValue(tvgName)}`;
                    m3uContentList.push(extinf);
                    m3uContentList.push(`${streamBaseUrl}/live/${apiUsername}/${apiPassword}/${streamId}.ts`);
                    liveCount++;
                }
            });
        }

        // Build VOD Streams
        if (contentType === 'all' || contentType === 'vod') {
            streamsData.vod.forEach(vod => {
                const catId = String(vod.category_id);
                if (categoryData.vod[catId]) {
                    const tvgId = vod.stream_id || '';
                    const tvgName = vod.name || '';
                    const groupTitle = categoryData.vod[catId];
                    const streamId = vod.stream_id || '';
                    const ext = vod.container_extension || 'mp4';
                    const logo = vod.stream_icon || '';

                    let extinf = `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${escapeM3UValue(tvgName)}"`;
                    if (logo) extinf += ` tvg-logo="${logo}"`;
                    extinf += ` group-title="${lang.vod_category_prefix}${escapeM3UValue(groupTitle)}"`;
                    extinf += `,${escapeM3UValue(tvgName)}`;
                    m3uContentList.push(extinf);
                    m3uContentList.push(`${streamBaseUrl}/movie/${apiUsername}/${apiPassword}/${streamId}.${ext}`);
                    vodCount++;
                }
            });
        }

         if (liveCount === 0 && vodCount === 0) {
             const errorMsg = errors.length > 0 ? errors.join('\n') : "Belirtilen kriterlere uygun yayın veya film bulunamadı.";
             return { m3u: null, error: errorMsg };
         }

        // Hatalar varsa logla (isteğe bağlı)
        if (errors.length > 0) {
             console.warn("API Hataları:", errors.join('\n'));
        }

        return { m3u: m3uContentList.join('\n') + '\n', error: null };

    } catch (error) {
        console.error("generateM3uContent Hatası:", error);
        return { m3u: null, error: `${lang.error_generating_m3u} ${error.message}` };
    }
}

// --- Express Route'ları ---
app.get('/', (req, res) => {
    res.render('index', { lang: lang, error: null, formData: null }); // Formu boş göster
});

app.post('/', async (req, res) => {
    const { url, username, password, content_type, days_to_include, epg_timeshift } = req.body;
    const epg_enabled = req.body.epg_enabled === 'on';
    const catchup_enabled = req.body.catchup_enabled === 'on';

    const formData = req.body; // Hata durumunda formu tekrar doldurmak için

    if (!url || !username || !password) {
        return res.render('index', { lang: lang, error: lang.error_missing_field, formData });
    }

    let baseUrl = url;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'http://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, ''); // Sondaki slash'ı kaldır

    const days = parseInt(days_to_include, 10) || 7;
    const shift = parseInt(epg_timeshift, 10) || 0;

    const { m3u, error } = await generateM3uContent(
        baseUrl,
        username,
        password,
        content_type || 'all',
        epg_enabled,
        catchup_enabled,
        days,
        shift
    );

    if (error) {
        return res.render('index', { lang: lang, error: error, formData });
    } else {
        res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u"');
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3u);
    }
});

app.listen(port, () => {
    console.log(`Node.js Xtream M3U Converter http://localhost:${port} adresinde çalışıyor`);
}); 