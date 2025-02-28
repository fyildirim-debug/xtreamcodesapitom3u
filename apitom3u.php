<?php
session_start();
require_once 'languages.php';

// Dil seçimini kontrol et
if (isset($_POST['language'])) {
    $_SESSION['language'] = $_POST['language'];
} elseif (!isset($_SESSION['language'])) {
    $_SESSION['language'] = 'tr'; // Varsayılan dil
}

$lang = $languages[$_SESSION['language']];

if (isset($_POST['islemyap'])) {
    function curlRequest($url) {
        $c = curl_init();
        curl_setopt($c, CURLOPT_URL, $url);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($c, CURLOPT_TIMEOUT, 10);
        $data = curl_exec($c);
        if (curl_errno($c)) {
            throw new Exception(curl_error($c));
        }
        curl_close($c);
        return $data;
    }

    try {
        $base_url = $_POST['url'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $content_type = $_POST['content_type'] ?? 'all';
        $epg_enabled = isset($_POST['epg_enabled']);
        $catchup_enabled = isset($_POST['catchup_enabled']);
        $days_to_include = intval($_POST['days_to_include'] ?? 7);
        $epg_timeshift = intval($_POST['epg_timeshift'] ?? 0);
        $items_per_page = intval($_POST['items_per_page'] ?? 0);

        // Tüm API verilerini tek seferde alalım
        $auth_data = curlRequest($base_url.'/player_api.php?username='.$username.'&password='.$password);
        $auth_response = json_decode($auth_data, true);

        if (!$auth_response || !isset($auth_response['user_info'])) {
            throw new Exception($lang['error_invalid_credentials']);
        }

        $username = $auth_response['user_info']['username'];
        $password = $auth_response['user_info']['password'];
        $url = 'http://' . $auth_response['server_info']['url'] . ':' . $auth_response['server_info']['port'];

        // EPG URL'sini hazırla
        if ($epg_enabled) {
            $epg_url = $base_url . '/xmltv.php?username=' . $username . '&password=' . $password;
        }

        // Tüm stream ve kategori verilerini tek istekte alalım
        $all_data = [];
        
        if ($content_type == 'all' || $content_type == 'live') {
            $all_data['live_categories'] = curlRequest($base_url.'/player_api.php?username='.$username.'&password='.$password.'&action=get_live_categories');
            $all_data['live_streams'] = curlRequest($base_url.'/player_api.php?username='.$username.'&password='.$password.'&action=get_live_streams');
        }
        
        if ($content_type == 'all' || $content_type == 'vod') {
            $all_data['vod_categories'] = curlRequest($base_url.'/player_api.php?username='.$username.'&password='.$password.'&action=get_vod_categories');
            $all_data['vod_streams'] = curlRequest($base_url.'/player_api.php?username='.$username.'&password='.$password.'&action=get_vod_streams');
        }

        // Kategori verilerini işle
        $categoryData = [];
        
        if ($content_type == 'all' || $content_type == 'live') {
            $liveCats = json_decode($all_data['live_categories'], true);
            foreach ($liveCats as $cat) {
                $categoryData['live'][$cat['category_id']] = $cat['category_name'];
            }
        }

        if ($content_type == 'all' || $content_type == 'vod') {
            $vodCats = json_decode($all_data['vod_categories'], true);
            foreach ($vodCats as $cat) {
                $categoryData['vod'][$cat['category_id']] = $cat['category_name'];
            }
        }

        // M3U çıktısını oluştur
        header("Content-Type: audio/x-mpegurl");
        header("Content-Disposition: attachment; filename=\"playlist.m3u\"");
        echo "#EXTM3U\n";

        // EPG bilgisini ekle
        if ($epg_enabled) {
            echo "#EXTM3U url-tvg=\"" . $epg_url . "\" tvg-shift=" . $epg_timeshift . "\n";
        }

        // Canlı yayınları ekle
        if ($content_type == 'all' || $content_type == 'live') {
            $streams = json_decode($all_data['live_streams'], true);
            
            // Sayfalama için stream sayısını sınırla
            if ($items_per_page > 0) {
                $streams = array_slice($streams, 0, $items_per_page);
            }
            
            foreach ($streams as $stream) {
                if (isset($categoryData['live'][$stream['category_id']])) {
                    $tvg_id = $stream['epg_channel_id'] ?? $stream['stream_id'];
                    $catchup = '';
                    
                    if ($catchup_enabled && isset($stream['tv_archive']) && $stream['tv_archive'] == 1) {
                        $catchup = ' catchup="append" catchup-days="'.$days_to_include.'" catchup-source="?utc={utc}&lutc={lutc}"';
                    }
                    
                    $timeshift = $epg_timeshift ? ' tvg-shift="'.$epg_timeshift.'"' : '';
                    
                    echo '#EXTINF:-1 tvg-id="'.$tvg_id.'" tvg-name="'.$stream['name'].'"'.$timeshift.' group-title="'.$categoryData['live'][$stream['category_id']].'"'.$catchup.','.$stream['name']."\n";
                    
                    if ($catchup_enabled && isset($stream['tv_archive']) && $stream['tv_archive'] == 1) {
                        echo '#EXTSIZE: small'."\n";
                        echo '#EXTBG: '.$stream['stream_icon']."\n";
                    }
                    
                    echo $url.'/live/'.$username.'/'.$password.'/'.$stream['stream_id']."\n";
                }
            }
        }

        // VOD (Film) içeriklerini ekle
        if ($content_type == 'all' || $content_type == 'vod') {
            $vods = json_decode($all_data['vod_streams'], true);
            
            // Sayfalama için VOD sayısını sınırla
            if ($items_per_page > 0) {
                $remaining_items = $items_per_page - (isset($streams) ? count($streams) : 0);
                if ($remaining_items > 0) {
                    $vods = array_slice($vods, 0, $remaining_items);
                } else {
                    $vods = [];
                }
            }
            
            foreach ($vods as $vod) {
                if (isset($categoryData['vod'][$vod['category_id']])) {
                    echo '#EXTINF:-1 tvg-id="'.$vod['stream_id'].'" tvg-name="'.$vod['name'].'" group-title="Film: '.$categoryData['vod'][$vod['category_id']].'",'.$vod['name']."\n";
                    echo $url.'/movie/'.$username.'/'.$password.'/'.$vod['stream_id'].'.'.$vod['container_extension']."\n";
                }
            }
        }

    } catch (Exception $e) {
        header('HTTP/1.1 400 Bad Request');
        die(json_encode(['error' => $e->getMessage()]));
    }

} else {
?>
<!DOCTYPE html>
<html lang="<?php echo $_SESSION['language']; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $lang['title']; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            padding-top: 50px;
        }
        .converter-form {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .loading {
            display: none;
        }
        .language-select {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="converter-form">
            <form method="post" class="language-select">
                <select name="language" class="form-select form-select-sm" onchange="this.form.submit()">
                    <option value="tr" <?php echo $_SESSION['language'] == 'tr' ? 'selected' : ''; ?>>🇹🇷 Türkçe</option>
                    <option value="en" <?php echo $_SESSION['language'] == 'en' ? 'selected' : ''; ?>>🇬🇧 English</option>
                    <option value="de" <?php echo $_SESSION['language'] == 'de' ? 'selected' : ''; ?>>🇩🇪 Deutsch</option>
                    <option value="fr" <?php echo $_SESSION['language'] == 'fr' ? 'selected' : ''; ?>>🇫🇷 Français</option>
                </select>
            </form>
            <h2 class="text-center mb-4"><?php echo $lang['title']; ?></h2>
            <div class="alert alert-info" role="alert">
                <?php echo $lang['info']; ?>
            </div>
            <form action="#" method="post" id="converterForm">
                <div class="mb-3">
                    <label for="url" class="form-label"><?php echo $lang['url_label']; ?></label>
                    <input type="text" class="form-control" name="url" id="url" required 
                           placeholder="<?php echo $lang['url_placeholder']; ?>">
                    <div class="form-text"><?php echo $lang['url_help']; ?></div>
                </div>

                <div class="mb-3">
                    <label for="username" class="form-label"><?php echo $lang['username_label']; ?></label>
                    <input type="text" class="form-control" name="username" id="username" required>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label"><?php echo $lang['password_label']; ?></label>
                    <input type="password" class="form-control" name="password" id="password" required>
                </div>

                <div class="mb-3">
                    <label for="content_type" class="form-label"><?php echo $lang['content_type_label']; ?></label>
                    <select class="form-select" name="content_type" id="content_type">
                        <option value="all"><?php echo $lang['content_all']; ?></option>
                        <option value="live"><?php echo $lang['content_live']; ?></option>
                        <option value="vod"><?php echo $lang['content_movies']; ?></option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label"><?php echo $lang['epg_support']; ?></label>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" name="epg_enabled" id="epg_enabled">
                        <label class="form-check-label" for="epg_enabled"><?php echo $lang['epg_enabled']; ?></label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" name="catchup_enabled" id="catchup_enabled">
                        <label class="form-check-label" for="catchup_enabled"><?php echo $lang['catchup_enabled']; ?></label>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="days_to_include" class="form-label"><?php echo $lang['days_to_include']; ?></label>
                    <input type="number" class="form-control" name="days_to_include" id="days_to_include" value="7" min="1" max="14">
                </div>

                <div class="mb-3">
                    <label for="epg_timeshift" class="form-label"><?php echo $lang['epg_timeshift']; ?></label>
                    <input type="number" class="form-control" name="epg_timeshift" id="epg_timeshift" value="0" min="-12" max="12">
                </div>

                <div class="mb-3">
                    <label for="items_per_page" class="form-label"><?php echo $lang['items_per_page']; ?></label>
                    <select class="form-select" name="items_per_page" id="items_per_page">
                        <option value="0"><?php echo $lang['items_all']; ?></option>
                        <option value="100"><?php echo $lang['items_100']; ?></option>
                        <option value="250"><?php echo $lang['items_250']; ?></option>
                        <option value="500"><?php echo $lang['items_500']; ?></option>
                        <option value="1000"><?php echo $lang['items_1000']; ?></option>
                    </select>
                </div>

            <input type="hidden" name="islemyap" value="1">
                
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary" id="submitBtn">
                        <span class="spinner-border spinner-border-sm loading" role="status" aria-hidden="true"></span>
                        <?php echo $lang['submit_button']; ?>
                    </button>
                </div>
        </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('converterForm').addEventListener('submit', function(e) {
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.querySelector('.loading');
            
            // Form normal şekilde submit edildiğinde
            if (e.submitter && e.submitter.getAttribute('type') === 'submit') {
                loading.style.display = 'inline-block';
                submitBtn.disabled = true;
            }
            
            // M3U indirme işlemi başladığında
            setTimeout(function() {
                loading.style.display = 'none';
                submitBtn.disabled = false;
            }, 2000);
        });
    </script>
</body>
</html>
<?php
}
?>
