const express = require('express');
const axios = require('axios');
const { URL } = require('url');
const path = require('path');
const cookieParser = require('cookie-parser');

// --- Çoklu Dil Desteği (TR, EN, DE, FR) ---
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
        epg_timeshift: 'EPG Zaman Kaydırma (Saat)',
        select_language: 'Dil Seçimi',
        no_streams_found: 'Belirtilen kriterlere uygun yayın veya film bulunamadı.',
        // Yeni Eklenenler
        category_selection_title: 'Kategori Seçimi',
        fetch_btn_initial: 'Kategorileri Getir & Düzenle',
        fetch_btn_loading: 'Yükleniyor...',
        select_all: 'Tümünü Seç',
        deselect_all: 'Tümünü Kaldır',
        search_placeholder: 'Kategori ara...',
        tab_live: 'CANLI TV',
        tab_vod: 'FİLMLER',
        back_btn: 'Geri Dön',
        submit_download: 'M3U İndir',
        toast_success: 'İşlem başarılı!',
        toast_error_fetch: 'Kategoriler alınırken hata oluştu.',
        toast_error_select: 'Lütfen en az bir kategori seçin.',
        toast_download_start: 'M3U dosyanız inmeye başladı!',
        no_live_cats: 'Canlı yayın kategorisi bulunamadı.',
        no_vod_cats: 'Film kategorisi bulunamadı.',
        preparing_btn: 'Hazırlanıyor...'
    },
    en: {
        title: 'Xtream Codes M3U Converter',
        info: 'Create M3U playlist by entering your IPTV credentials.',
        url_label: 'IPTV URL',
        url_placeholder: 'http://example.com:8080',
        url_help: 'Enter server address with port (e.g., http://example.com:8080)',
        username_label: 'Username',
        password_label: 'Password',
        content_type_label: 'Content Type',
        content_all: 'All (Live + Movies)',
        content_live: 'Live Channels Only',
        content_movies: 'Movies Only',
        submit_button: 'Generate M3U',
        error_invalid_credentials: 'Invalid credentials or server response.',
        error_connection: 'Connection error: ',
        error_fetching_data: 'Error fetching data: ',
        error_generating_m3u: 'Error generating M3U: ',
        error_missing_field: 'Please fill in all required fields.',
        live_category_prefix: '',
        vod_category_prefix: 'Movie: ',
        epg_support: 'EPG & Catch-up',
        epg_enabled: 'Include Program Guide (EPG)',
        catchup_enabled: 'Include Catch-up',
        days_to_include: 'Days to Include',
        epg_timeshift: 'EPG Timeshift (Hours)',
        select_language: 'Select Language',
        no_streams_found: 'No streams or movies found matching the specified criteria.',
        // Use English for new fields
        category_selection_title: 'Category Selection',
        fetch_btn_initial: 'Fetch Categories & Edit',
        fetch_btn_loading: 'Loading...',
        select_all: 'Select All',
        deselect_all: 'Deselect All',
        search_placeholder: 'Search categories...',
        tab_live: 'LIVE TV',
        tab_vod: 'VOD / MOVIES',
        back_btn: 'Go Back',
        submit_download: 'Download M3U',
        toast_success: 'Success!',
        toast_error_fetch: 'Error fetching categories.',
        toast_error_select: 'Please select at least one category.',
        toast_download_start: 'Your M3U download has started!',
        no_live_cats: 'No live categories found.',
        no_vod_cats: 'No VOD categories found.',
        preparing_btn: 'Preparing...'
    },
    de: {
        title: 'Xtream Codes M3U Konverter',
        info: 'Erstellen Sie M3U-Playlist durch Eingabe Ihrer IPTV-Anmeldeinformationen.',
        url_label: 'IPTV URL',
        url_placeholder: 'http://example.com:8080',
        url_help: 'Serveradresse mit Port eingeben (z.B. http://example.com:8080)',
        username_label: 'Benutzername',
        password_label: 'Passwort',
        content_type_label: 'Inhaltstyp',
        content_all: 'Alle (Live + Filme)',
        content_live: 'Nur Live-Kanäle',
        content_movies: 'Nur Filme',
        submit_button: 'M3U Generieren',
        error_invalid_credentials: 'Ungültige Anmeldeinformationen oder Serverantwort.',
        error_connection: 'Verbindungsfehler: ',
        error_fetching_data: 'Fehler beim Abrufen der Daten: ',
        error_generating_m3u: 'Fehler beim Generieren der M3U: ',
        error_missing_field: 'Bitte füllen Sie alle Pflichtfelder aus.',
        live_category_prefix: '',
        vod_category_prefix: 'Film: ',
        epg_support: 'EPG & Catch-up',
        epg_enabled: 'Programmführer (EPG) hinzufügen',
        catchup_enabled: 'Catch-up hinzufügen',
        days_to_include: 'Anzahl der Tage',
        epg_timeshift: 'EPG Zeitverschiebung (Stunden)',
        select_language: 'Sprache wählen',
        no_streams_found: 'Keine Streams oder Filme gefunden, die den angegebenen Kriterien entsprechen.',
        // New German translations
        category_selection_title: 'Kategorieauswahl',
        fetch_btn_initial: 'Kategorien abrufen & bearbeiten',
        fetch_btn_loading: 'Laden...',
        select_all: 'Alles auswählen',
        deselect_all: 'Alle abwählen',
        search_placeholder: 'Kategorien suchen...',
        tab_live: 'LIVE TV',
        tab_vod: 'FILME',
        back_btn: 'Zurück',
        submit_download: 'M3U Herunterladen',
        toast_success: 'Erfolg!',
        toast_error_fetch: 'Fehler beim Abrufen der Kategorien.',
        toast_error_select: 'Bitte wählen Sie mindestens eine Kategorie aus.',
        toast_download_start: 'Ihr M3U-Download hat begonnen!',
        no_live_cats: 'Keine Live-Kategorien gefunden.',
        no_vod_cats: 'Keine VOD-Kategorien gefunden.',
        preparing_btn: 'Vorbereiten...'
    },
    fr: {
        title: 'Convertisseur Xtream Codes M3U',
        info: 'Créez une playlist M3U en saisissant vos informations IPTV.',
        url_label: 'URL IPTV',
        url_placeholder: 'http://example.com:8080',
        url_help: 'Entrez l\'adresse du serveur avec le port (ex: http://example.com:8080)',
        username_label: 'Nom d\'utilisateur',
        password_label: 'Mot de passe',
        content_type_label: 'Type de contenu',
        content_all: 'Tout (Direct + Films)',
        content_live: 'Chaînes en direct uniquement',
        content_movies: 'Films uniquement',
        submit_button: 'Générer M3U',
        error_invalid_credentials: 'Identifiants invalides ou réponse du serveur.',
        error_connection: 'Erreur de connexion: ',
        error_fetching_data: 'Erreur lors de la récupération des données: ',
        error_generating_m3u: 'Erreur lors de la génération M3U: ',
        error_missing_field: 'Veuillez remplir tous les champs obligatoires.',
        live_category_prefix: '',
        vod_category_prefix: 'Film: ',
        epg_support: 'EPG & Catch-up',
        epg_enabled: 'Inclure Guide des Programmes (EPG)',
        catchup_enabled: 'Inclure Catch-up',
        days_to_include: 'Jours à inclure',
        epg_timeshift: 'Décalage EPG (Heures)',
        select_language: 'Sélectionner la langue',
        no_streams_found: 'Aucun flux ou film trouvé correspondant aux critères spécifiés.',
        // New French translations
        category_selection_title: 'Sélection des catégories',
        fetch_btn_initial: 'Récupérer et éditer les catégories',
        fetch_btn_loading: 'Chargement...',
        select_all: 'Tout sélectionner',
        deselect_all: 'Tout désélectionner',
        search_placeholder: 'Rechercher des catégories...',
        tab_live: 'TV EN DIRECT',
        tab_vod: 'FILMS',
        back_btn: 'Retour',
        submit_download: 'Télécharger M3U',
        toast_success: 'Succès!',
        toast_error_fetch: 'Erreur lors de la récupération des catégories.',
        toast_error_select: 'Veuillez sélectionner au moins une catégorie.',
        toast_download_start: 'Le téléchargement de votre M3U a commencé!',
        no_live_cats: 'Aucune catégorie en direct trouvée.',
        no_vod_cats: 'Aucune catégorie VOD trouvée.',
        preparing_btn: 'Préparation...'
    }
};

// Dil bayrakları ve isimleri
const languageOptions = {
    tr: { flag: '🇹🇷', name: 'Türkçe' },
    en: { flag: '🇬🇧', name: 'English' },
    de: { flag: '🇩🇪', name: 'Deutsch' },
    fr: { flag: '🇫🇷', name: 'Français' }
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON body parser eklendi
app.use(cookieParser());

// Dil middleware - Her istekte dili belirle
app.use((req, res, next) => {
    // POST ile dil değişikliği kontrolü
    if (req.body && req.body.language && languages[req.body.language]) {
        req.currentLang = req.body.language;
        res.cookie('language', req.body.language, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // 1 yıl
    }
    // Cookie'den dil al
    else if (req.cookies && req.cookies.language && languages[req.cookies.language]) {
        req.currentLang = req.cookies.language;
    }
    // Varsayılan dil
    else {
        req.currentLang = 'en'; // Global varsayılan İngilizce
    }
    next();
});

// --- API İstek Fonksiyonu ---
async function curlRequest(url, lang) {
    try {
        const response = await axios.get(url, { timeout: 15000 });
        return { data: response.data, error: null };
    } catch (error) {
        let errorMessage;
        if (error.code === 'ECONNABORTED') {
            errorMessage = `${lang.error_connection} Timeout (${url})`;
        } else if (error.response) {
            errorMessage = `${lang.error_fetching_data} Server: ${error.response.status} (${url})`;
        } else if (error.request) {
            errorMessage = `${lang.error_connection} No response (${url})`;
        } else {
            errorMessage = `${lang.error_connection} ${error.message} (${url})`;
        }
        return { data: null, error: errorMessage };
    }
}

// --- M3U Escape Fonksiyonu ---
function escapeM3UValue(value) {
    return typeof value === 'string' ? value.replace(/"/g, '\\"') : '';
}

// --- M3U Oluşturma ---
async function generateM3uContent(baseUrl, username, password, contentType, epgEnabled, catchupEnabled, daysToInclude, epgTimeshift, lang, selectedCategories = null) {
    try {
        const authUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
        const { data: authResponse, error: authError } = await curlRequest(authUrl, lang);

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
                return { m3u: null, error: `Invalid base URL: ${baseUrl}` };
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

        // API istekleri
        if (contentType === 'all' || contentType === 'live') {
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_live_categories`, lang).then(res => ({ type: 'live_cats', ...res })));
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_live_streams`, lang).then(res => ({ type: 'live_streams', ...res })));
        }
        if (contentType === 'all' || contentType === 'vod') {
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_vod_categories`, lang).then(res => ({ type: 'vod_cats', ...res })));
            fetchPromises.push(curlRequest(`${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_vod_streams`, lang).then(res => ({ type: 'vod_streams', ...res })));
        }

        const results = await Promise.all(fetchPromises);

        // Sonuçları işle
        results.forEach(result => {
            if (result.error) {
                errors.push(result.error);
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

        // Kategori filtresi ve sıralaması için yardımcı fonksiyon
        const isSelectedCategory = (catId, type) => {
            if (!selectedCategories || !selectedCategories.length) return true;
            return selectedCategories.some(sc => sc.id === catId && sc.type === type);
        };

        const getCategoryOrder = (catId, type) => {
            if (!selectedCategories || !selectedCategories.length) return 0;
            const index = selectedCategories.findIndex(sc => sc.id === catId && sc.type === type);
            return index >= 0 ? index : 999999;
        };

        // Canlı yayınları oluştur
        if (contentType === 'all' || contentType === 'live') {
            // Kategorilere göre stream'leri grupla
            const streamsByCategory = {};
            streamsData.live.forEach(stream => {
                const catId = String(stream.category_id);
                if (categoryData.live[catId] && isSelectedCategory(catId, 'live')) {
                    if (!streamsByCategory[catId]) {
                        streamsByCategory[catId] = [];
                    }
                    streamsByCategory[catId].push(stream);
                }
            });

            // Kategorileri sırala
            const sortedCategoryIds = Object.keys(streamsByCategory).sort((a, b) => {
                return getCategoryOrder(a, 'live') - getCategoryOrder(b, 'live');
            });

            // Sıralanmış kategorilere göre stream'leri ekle
            sortedCategoryIds.forEach(catId => {
                streamsByCategory[catId].forEach(stream => {
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
                });
            });
        }

        // VOD (Film) içerikleri oluştur
        if (contentType === 'all' || contentType === 'vod') {
            // Kategorilere göre VOD'ları grupla
            const vodsByCategory = {};
            streamsData.vod.forEach(vod => {
                const catId = String(vod.category_id);
                if (categoryData.vod[catId] && isSelectedCategory(catId, 'vod')) {
                    if (!vodsByCategory[catId]) {
                        vodsByCategory[catId] = [];
                    }
                    vodsByCategory[catId].push(vod);
                }
            });

            // Kategorileri sırala
            const sortedCategoryIds = Object.keys(vodsByCategory).sort((a, b) => {
                return getCategoryOrder(a, 'vod') - getCategoryOrder(b, 'vod');
            });

            // Sıralanmış kategorilere göre VOD'ları ekle
            sortedCategoryIds.forEach(catId => {
                vodsByCategory[catId].forEach(vod => {
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
                });
            });
        }

        if (liveCount === 0 && vodCount === 0) {
            const errorMsg = errors.length > 0 ? errors.join('\n') : lang.no_streams_found;
            return { m3u: null, error: errorMsg };
        }

        if (errors.length > 0) {
            console.warn("API Errors:", errors.join('\n'));
        }

        return { m3u: m3uContentList.join('\n') + '\n', error: null };

    } catch (error) {
        console.error("generateM3uContent Error:", error);
        return { m3u: null, error: `${lang.error_generating_m3u} ${error.message}` };
    }
}


// --- API Endpoint: Kategorileri Getir ---
app.post('/api/categories', async (req, res) => {
    const lang = languages[req.currentLang];
    const { url, username, password, content_type } = req.body;

    if (!url || !username || !password) {
        return res.status(400).json({
            success: false,
            error: lang.error_missing_field
        });
    }

    let baseUrl = url;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'http://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, '');

    try {
        // Kimlik doğrulama
        const authUrl = `${baseUrl}/player_api.php?username=${username}&password=${password}`;
        const { data: authResponse, error: authError } = await curlRequest(authUrl, lang);

        if (authError) {
            return res.status(400).json({ success: false, error: authError });
        }

        if (!authResponse || !authResponse.user_info || !authResponse.user_info.auth) {
            return res.status(401).json({
                success: false,
                error: lang.error_invalid_credentials
            });
        }

        const userInfo = authResponse.user_info;
        const apiUsername = userInfo.username || username;
        const apiPassword = userInfo.password || password;

        const categories = { live: [], vod: [] };
        const errors = [];

        // Kategorileri çek
        if (content_type === 'all' || content_type === 'live') {
            const liveCatsUrl = `${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_live_categories`;
            const { data: liveCats, error: liveError } = await curlRequest(liveCatsUrl, lang);

            if (liveError) {
                errors.push(liveError);
            } else if (Array.isArray(liveCats)) {
                categories.live = liveCats
                    .filter(cat => cat && cat.category_id && cat.category_name)
                    .map(cat => ({
                        id: String(cat.category_id),
                        name: cat.category_name,
                        type: 'live'
                    }));
            }
        }

        if (content_type === 'all' || content_type === 'vod') {
            const vodCatsUrl = `${baseUrl}/player_api.php?username=${apiUsername}&password=${apiPassword}&action=get_vod_categories`;
            const { data: vodCats, error: vodError } = await curlRequest(vodCatsUrl, lang);

            if (vodError) {
                errors.push(vodError);
            } else if (Array.isArray(vodCats)) {
                categories.vod = vodCats
                    .filter(cat => cat && cat.category_id && cat.category_name)
                    .map(cat => ({
                        id: String(cat.category_id),
                        name: cat.category_name,
                        type: 'vod'
                    }));
            }
        }

        if (categories.live.length === 0 && categories.vod.length === 0 && errors.length > 0) {
            return res.status(500).json({
                success: false,
                error: errors.join('\n')
            });
        }

        res.json({
            success: true,
            categories,
            serverInfo: authResponse.server_info
        });

    } catch (error) {
        console.error('Categories API Error:', error);
        res.status(500).json({
            success: false,
            error: `${lang.error_generating_m3u} ${error.message}`
        });
    }
});

// --- Express Routes ---
app.get('/', (req, res) => {
    const lang = languages[req.currentLang];
    res.render('index', {
        lang,
        languages: languageOptions,
        currentLang: req.currentLang,
        error: null,
        formData: null
    });
});

app.post('/', async (req, res) => {
    const lang = languages[req.currentLang];
    const { url, username, password, content_type, days_to_include, epg_timeshift } = req.body;
    const epg_enabled = req.body.epg_enabled === 'on';
    const catchup_enabled = req.body.catchup_enabled === 'on';

    const formData = req.body;

    // Sadece dil değişikliği ise sayfayı yeniden göster
    if (req.body.language && !req.body.url) {
        return res.render('index', {
            lang,
            languages: languageOptions,
            currentLang: req.currentLang,
            error: null,
            formData: null
        });
    }

    if (!url || !username || !password) {
        return res.render('index', {
            lang,
            languages: languageOptions,
            currentLang: req.currentLang,
            error: lang.error_missing_field,
            formData
        });
    }

    let baseUrl = url;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'http://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, '');

    const days = parseInt(days_to_include, 10) || 7;
    const shift = parseInt(epg_timeshift, 10) || 0;

    // Seçili kategorileri parse et (JSON string olarak gelir)
    let selectedCategories = null;
    if (req.body.selected_categories) {
        try {
            selectedCategories = JSON.parse(req.body.selected_categories);
        } catch (e) {
            console.error('Selected categories parse error:', e);
        }
    }

    const { m3u, error } = await generateM3uContent(
        baseUrl,
        username,
        password,
        content_type || 'all',
        epg_enabled,
        catchup_enabled,
        days,
        shift,
        lang,
        selectedCategories
    );

    if (error) {
        return res.render('index', {
            lang,
            languages: languageOptions,
            currentLang: req.currentLang,
            error,
            formData
        });
    } else {
        // Dosya adını oluştur (kullanıcı adı ile)
        const filename = `playlist_${username}.m3u`;

        // Header'ları doğru şekilde ayarla
        res.set({
            'Content-Type': 'audio/x-mpegurl; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.send(m3u);
    }
});

app.listen(port, () => {
    console.log(`Xtream Codes M3U Converter running at http://localhost:${port}`);
});
