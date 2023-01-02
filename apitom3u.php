<?php
if (isset($_POST['islemyap'])) {

    function curlRequest($url) {
        $c = curl_init();
        curl_setopt($c, CURLOPT_URL, $url);
        curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($c);
        curl_close($c);
        return $data;
    }

    $json = curlRequest($_POST['url'].'/player_api.php?username='.$_POST['username'].'&password='.$_POST['password']);
    $mainurlraw = json_decode($json, true);

    $json = curlRequest($_POST['url'].'/player_api.php?username='.$_POST['username'].'&password='.$_POST['password'].'&action=get_live_streams');
    $livechannelraw = json_decode($json, true);

    $json = curlRequest($_POST['url'].'/player_api.php?username='.$_POST['username'].'&password='.$_POST['password'].'&action=get_live_categories');
    $categoryraw = json_decode($json, true);

    $username = ($mainurlraw['user_info']['username']);
    $password = ($mainurlraw['user_info']['password']);
    
    $url = ('http://' . $mainurlraw['server_info']['url'] . ':' . $mainurlraw['server_info']['port']);

    $fullurl = ($url . '/live/' . $username . '/' . $password . '/');

    foreach ($categoryraw as $valuecategory) {
        $categoryname[$valuecategory['category_id']] = $valuecategory['category_name'];
    }
    header("Content-Type: audio/x-scpls");
    header("Content-Disposition: attachment; filename=\"LiveStream.m3u\"");

    echo("#EXTM3U\n");
    foreach ($livechannelraw as $value) {
        if ($value['stream_type'] == 'live') {
            echo('#EXTINF:0 tvg-name="' . $value['name'] . '" group-title=" ' . $categoryname[$value['category_id']] . '",' . $value['name'] . "\n");
            echo($fullurl . $value['stream_id'] . ".ts\n");
        }
    }
}else{
?>


    <center>
        <form action="#" method="post"><br>
            <label for="url" class="form-label">IPTV Url</label>
            <input type="text" class="form-control" name="url" id="url"  required><br><br>
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" name="username" id="username"  required><br><br>
            <label for="password" class="form-label">Password</label>
            <input type="text" class="form-control" name="password" id="password"  required><br><br>
            <input type="hidden" name="islemyap" value="1">
            <button type="submit" >Submit</button>
        </form>
    </center>
<?php
}
?>
