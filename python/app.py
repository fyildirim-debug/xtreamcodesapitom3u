import requests
import json
from urllib.parse import urlparse
import traceback
from flask import Flask, request, render_template, Response

# --- Dil Verileri --- (languages.php içeriğini buraya taşıyabilir veya ayrı bir modülden import edebiliriz)
languages = {
    'tr': {
        'title': 'Xtream Codes M3U Dönüştürücü',
        'info': 'IPTV bilgilerinizi girerek M3U playlist oluşturabilirsiniz.',
        'url_label': 'IPTV URL',
        'url_placeholder': 'http://example.com:8080',
        'url_help': 'Sunucu adresini port ile birlikte giriniz (örn: http://example.com:8080)',
        'username_label': 'Kullanıcı Adı',
        'password_label': 'Şifre',
        'content_type_label': 'İçerik Türü',
        'content_all': 'Tümü (Canlı + Film)',
        'content_live': 'Sadece Canlı Yayınlar',
        'content_movies': 'Sadece Filmler',
        'submit_button': 'M3U Oluştur',
        'error_invalid_credentials': 'Geçersiz kullanıcı bilgileri veya sunucu yanıtı.',
        'error_connection': 'Sunucuya bağlanırken hata: ',
        'error_fetching_data': 'Veri alınırken hata: ',
        'error_generating_m3u': 'M3U oluşturulurken hata: ',
        'error_missing_field': 'Lütfen tüm zorunlu alanları doldurun.',
        'generating_m3u': 'M3U dosyası oluşturuluyor...', # Bu doğrudan kullanılmayacak ama kalsın
        'm3u_generated': 'playlist.m3u dosyası başarıyla oluşturuldu.', # Bu da doğrudan kullanılmayacak
        'live_category_prefix': '',
        'vod_category_prefix': 'Film: ',
        'epg_support' : 'EPG & Catch-up', # Yeni eklenenler
        'epg_enabled' : 'Program Rehberi (EPG) Ekle',
        'catchup_enabled' : 'Geriye Dönük İzleme (Catch-up) Ekle',
        'days_to_include' : 'Catch-up Gün Sayısı',
        'epg_timeshift' : 'EPG Zaman Kaydırma (Saat)'
    }
    # Diğer dilleri de buraya ekleyebiliriz
}

# Varsayılan dil
lang_code = 'tr'
lang = languages[lang_code]

app = Flask(__name__)

# --- API İstek Fonksiyonu --- (Hata mesajlarını döndürecek şekilde güncellendi)
def curl_request(url):
    try:
        response = requests.get(url, timeout=15) # Timeout biraz artırıldı
        response.raise_for_status() # HTTP hataları için exception fırlat
        return response.json(), None # Veri ve hata mesajı (hata yoksa None)
    except requests.exceptions.Timeout:
        return None, f"{lang['error_connection']} Zaman aşımı ({url})"
    except requests.exceptions.ConnectionError:
        return None, f"{lang['error_connection']} Bağlantı hatası ({url})"
    except requests.exceptions.HTTPError as e:
        return None, f"{lang['error_fetching_data']} Sunucu hatası: {e.response.status_code} ({url})"
    except requests.exceptions.RequestException as e:
        return None, f"{lang['error_connection']} {e}"
    except json.JSONDecodeError:
        return None, f"{lang['error_fetching_data']} Geçersiz JSON yanıtı ({url})"
    except Exception as e:
        return None, f"Bilinmeyen istek hatası: {e} ({url})"


# --- M3U Oluşturma Mantığı --- (Hata mesajı döndürecek şekilde güncellendi)
def generate_m3u_content(base_url, username, password, content_type='all', epg_enabled=False, catchup_enabled=False, days_to_include=7, epg_timeshift=0):
    try:
        # 1. Authentication and Server Info
        auth_url = f"{base_url}/player_api.php?username={username}&password={password}"
        auth_response, error = curl_request(auth_url)
        if error:
            return None, error
        if not auth_response or 'user_info' not in auth_response or not auth_response.get('user_info', {}).get('auth'):
             return None, lang['error_invalid_credentials']

        user_info = auth_response['user_info']
        server_info = auth_response.get('server_info', {})
        api_username = user_info.get('username', username)
        api_password = user_info.get('password', password)

        if server_info.get('url') and server_info.get('port'):
             scheme = 'https://' if str(server_info.get('https_port')) == str(server_info.get('port')) else 'http://'
             stream_base_url = f"{scheme}{server_info['url']}:{server_info['port']}"
        else:
             parsed_url = urlparse(base_url)
             stream_base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

        m3u_content_list = ["#EXTM3U"]

        # 2. EPG URL
        if epg_enabled:
            epg_url = f"{base_url}/xmltv.php?username={api_username}&password={api_password}"
            m3u_content_list.append(f'#EXTM3U url-tvg="{epg_url}" tvg-shift="{epg_timeshift}"')

        category_data = {'live': {}, 'vod': {}}
        streams_data = {'live': [], 'vod': []}
        errors = [] # API hatalarını biriktir

        # 3. Fetch Categories and Streams based on content_type
        if content_type in ['all', 'live']:
            live_cats_url = f"{base_url}/player_api.php?username={api_username}&password={api_password}&action=get_live_categories"
            live_streams_url = f"{base_url}/player_api.php?username={api_username}&password={api_password}&action=get_live_streams"
            live_cats, err = curl_request(live_cats_url)
            if err: errors.append(f"Canlı kategori alınamadı: {err}")
            live_streams, err = curl_request(live_streams_url)
            if err: errors.append(f"Canlı yayın alınamadı: {err}")

            if isinstance(live_cats, list):
                for cat in live_cats:
                    if isinstance(cat, dict) and 'category_id' in cat and 'category_name' in cat:
                         category_data['live'][str(cat['category_id'])] = cat['category_name']
            if isinstance(live_streams, list):
                streams_data['live'] = live_streams

        if content_type in ['all', 'vod']:
            vod_cats_url = f"{base_url}/player_api.php?username={api_username}&password={api_password}&action=get_vod_categories"
            vod_streams_url = f"{base_url}/player_api.php?username={api_username}&password={api_password}&action=get_vod_streams"
            vod_cats, err = curl_request(vod_cats_url)
            if err: errors.append(f"Film kategori alınamadı: {err}")
            vod_streams, err = curl_request(vod_streams_url)
            if err: errors.append(f"Film alınamadı: {err}")

            if isinstance(vod_cats, list):
                 for cat in vod_cats:
                     if isinstance(cat, dict) and 'category_id' in cat and 'category_name' in cat:
                          category_data['vod'][str(cat['category_id'])] = cat['category_name']
            if isinstance(vod_streams, list):
                streams_data['vod'] = vod_streams

        # Toplanan hata varsa ve hiç stream yoksa, işlemi durdur
        if errors and not streams_data['live'] and not streams_data['vod']:
            return None, "\n".join(errors)

        # 4. Build M3U entries
        # Live Streams
        live_count = 0
        if content_type in ['all', 'live']:
             for stream in streams_data.get('live', []):
                 if not isinstance(stream, dict): continue
                 cat_id = str(stream.get('category_id'))
                 if cat_id in category_data.get('live', {}):
                     tvg_id = stream.get('epg_channel_id') or stream.get('stream_id', '')
                     tvg_name = stream.get('name', '')
                     group_title = category_data['live'][cat_id]
                     stream_id = stream.get('stream_id', '')
                     logo = stream.get('stream_icon', '')

                     tvg_name_escaped = tvg_name.replace('"', '\\"')
                     group_title_escaped = group_title.replace('"', '\\"')

                     extinf_line = f'#EXTINF:-1 tvg-id="{tvg_id}" tvg-name="{tvg_name_escaped}"'
                     if logo: extinf_line += f' tvg-logo="{logo}"'
                     if epg_timeshift: extinf_line += f' tvg-shift="{epg_timeshift}"'
                     extinf_line += f' group-title="{lang["live_category_prefix"]}{group_title_escaped}"'

                     catchup_tags = ''
                     if catchup_enabled and stream.get('tv_archive') == 1:
                         catchup_days_actual = stream.get('tv_archive_duration') or days_to_include
                         catchup_tags = f' catchup="append" catchup-days="{catchup_days_actual}" catchup-source="?utc={{utc}}&lutc={{lutc}}"'
                     extinf_line += catchup_tags
                     extinf_line += f',{tvg_name_escaped}'

                     m3u_content_list.append(extinf_line)
                     stream_url = f"{stream_base_url}/live/{api_username}/{api_password}/{stream_id}.ts"
                     m3u_content_list.append(stream_url)
                     live_count += 1

        # VOD Streams
        vod_count = 0
        if content_type in ['all', 'vod']:
            for vod in streams_data.get('vod', []):
                 if not isinstance(vod, dict): continue
                 cat_id = str(vod.get('category_id'))
                 if cat_id in category_data.get('vod', {}):
                     tvg_id = vod.get('stream_id', '')
                     tvg_name = vod.get('name', '')
                     group_title = category_data['vod'][cat_id]
                     stream_id = vod.get('stream_id', '')
                     extension = vod.get('container_extension', 'mp4')
                     logo = vod.get('stream_icon', '')

                     tvg_name_escaped = tvg_name.replace('"', '\\"')
                     group_title_escaped = group_title.replace('"', '\\"')

                     extinf_line = f'#EXTINF:-1 tvg-id="{tvg_id}" tvg-name="{tvg_name_escaped}"'
                     if logo: extinf_line += f' tvg-logo="{logo}"'
                     extinf_line += f' group-title="{lang["vod_category_prefix"]}{group_title_escaped}"'
                     extinf_line += f',{tvg_name_escaped}'

                     m3u_content_list.append(extinf_line)
                     movie_url = f"{stream_base_url}/movie/{api_username}/{api_password}/{stream_id}.{extension}"
                     m3u_content_list.append(movie_url)
                     vod_count += 1

        if live_count == 0 and vod_count == 0:
             # API hataları varsa onları göster, yoksa genel bir hata ver
             error_msg = "\n".join(errors) if errors else "Belirtilen kriterlere uygun yayın veya film bulunamadı."
             return None, error_msg

        # Hatalar varsa bile M3U oluşturulduysa, hataları da içeren bir not ekle (isteğe bağlı)
        final_m3u_content = "\n".join(m3u_content_list) + "\n"
        if errors:
            print("API Hataları:", "\n".join(errors)) # Loglama için
            # İsteğe bağlı: final_m3u_content += "\n# M3U oluşturulurken bazı hatalar oluştu.\n"

        return final_m3u_content, None # Başarılı: M3U içeriği ve hata yok (None)

    except Exception as e:
        traceback.print_exc() # Konsola detaylı hata yazdır
        return None, f"{lang['error_generating_m3u']} {e}"

# --- Flask Route'ları ---
@app.route('/', methods=['GET', 'POST'])
def index():
    error = None
    if request.method == 'POST':
        url = request.form.get('url')
        username = request.form.get('username')
        password = request.form.get('password')
        content_type = request.form.get('content_type', 'all')
        epg_enabled = 'epg_enabled' in request.form
        catchup_enabled = 'catchup_enabled' in request.form
        try:
            days_to_include = int(request.form.get('days_to_include', 7))
            epg_timeshift = int(request.form.get('epg_timeshift', 0))
        except ValueError:
            days_to_include = 7
            epg_timeshift = 0

        if not url or not username or not password:
            error = lang['error_missing_field']
        else:
            # URL'nin başında http:// veya https:// yoksa ekle
            if not url.startswith(('http://', 'https://')):
                url = 'http://' + url
            base_url = url.rstrip('/')

            m3u_data, error_msg = generate_m3u_content(
                base_url=base_url,
                username=username,
                password=password,
                content_type=content_type,
                epg_enabled=epg_enabled,
                catchup_enabled=catchup_enabled,
                days_to_include=days_to_include,
                epg_timeshift=epg_timeshift
            )

            if error_msg:
                error = error_msg
            elif m3u_data:
                return Response(
                    m3u_data,
                    mimetype="audio/x-mpegurl",
                    headers={"Content-Disposition": "attachment;filename=playlist.m3u"}
                )
            else:
                 error = "Bilinmeyen bir hata oluştu."

    # GET isteği veya POST'ta hata varsa formu tekrar göster
    return render_template('index.html', lang=lang, error=error, request=request)

if __name__ == '__main__':
    # app.run(debug=True) # Geliştirme için
    app.run(host='0.0.0.0', port=5000) # Ağda erişilebilir yapmak için 