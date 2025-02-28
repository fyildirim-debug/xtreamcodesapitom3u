# Xtream Codes API to M3U Playlist Converter

![Screenshot](screenshots/main.png)

🇹🇷 [Türkçe](#türkçe) | 🇬🇧 [English](#english) | 🇩🇪 [Deutsch](#deutsch) | 🇫🇷 [Français](#français)

## Türkçe

### 📱 Program Hakkında
Bu araç, Xtream Codes/Xtream UI IPTV sistemlerinden M3U playlist oluşturmanızı sağlar. Canlı yayınlar ve film içeriklerini destekler.

### ✨ Özellikler
- Canlı TV ve Film desteği
- EPG (Elektronik Program Rehberi) desteği
- Catch-up/Geriye Dönük İzleme desteği
- Çoklu dil desteği (TR, EN, DE, FR)
- İçerik filtreleme
- Zaman dilimi ayarı
- Modern ve responsive arayüz

### 🚀 Kurulum
1. PHP 7.4 veya üzeri sürüm gereklidir.
2. Dosyaları web sunucunuza yükleyin
3. `chmod 755 *.php` komutu ile dosya izinlerini ayarlayın
4. Tarayıcınızdan `index.php` dosyasına erişin

### 📖 Kullanım
1. IPTV sunucu adresinizi girin (örn: http://example.com:8080)
2. Kullanıcı adı ve şifrenizi girin
3. İstediğiniz içerik türünü seçin (Tümü, Canlı, Film)
4. EPG ve Catch-up özelliklerini isteğe bağlı olarak aktifleştirin
5. "M3U Oluştur" butonuna tıklayın

### 📝 Teknik Detaylar
Dizi içerikleri aşağıdaki teknik nedenlerden dolayı desteklenmemektedir:
1. Her bölüm için ayrı API çağrısı gerekir
2. Çok sayıda istek sunucu tarafından engellenebilir
3. IP ve hesap yasaklanma riski vardır
4. Sunucu kaynakları gereksiz tüketilir

### ⚠️ Hata Kodları
- 400: Geçersiz istek veya eksik parametre
- 401: Geçersiz kullanıcı bilgileri
- 403: Erişim engellendi
- 404: Sunucu bulunamadı
- 500: Sunucu hatası

### 🔧 API Kullanımı
```php
// Kullanıcı doğrulama
GET /player_api.php?username=user&password=pass

// Canlı yayın listesi
GET /player_api.php?username=user&password=pass&action=get_live_streams

// Film listesi
GET /player_api.php?username=user&password=pass&action=get_vod_streams

// EPG bilgisi
GET /xmltv.php?username=user&password=pass
```

## English

### 📱 About
This tool allows you to create M3U playlists from Xtream Codes/Xtream UI IPTV systems. It supports live streams and movies.

### ✨ Features
- Live TV and Movie support
- EPG (Electronic Program Guide) support
- Catch-up/Time-shift support
- Multi-language support (TR, EN, DE, FR)
- Content filtering
- Timezone adjustment
- Modern and responsive interface

### 🚀 Installation
1. PHP 7.4 or higher required
2. Upload files to your web server
3. Set permissions with `chmod 755 *.php`
4. Access `index.php` from browser

### 📖 Usage
1. Enter IPTV server address (e.g., http://example.com:8080)
2. Enter username and password
3. Select content type (All, Live, Movies)
4. Optionally enable EPG and Catch-up
5. Click "Generate M3U"

## Deutsch

### 📱 Über
Dieses Tool ermöglicht das Erstellen von M3U-Playlisten aus Xtream Codes/Xtream UI IPTV-Systemen. Unterstützt Live-Streams und Filme.

### ✨ Funktionen
- Live-TV und Film-Unterstützung
- EPG-Unterstützung
- Catch-up/Zeitversetztes Fernsehen
- Mehrsprachenunterstützung (TR, EN, DE, FR)
- Inhaltsfilterung
- Zeitzonenanpassung
- Moderne und responsive Oberfläche

### 🚀 Installation
1. PHP 7.4 oder höher erforderlich
2. Dateien auf Webserver hochladen
3. Berechtigungen mit `chmod 755 *.php` setzen
4. Auf `index.php` über Browser zugreifen

### 📖 Verwendung
1. IPTV-Serveradresse eingeben (z.B. http://example.com:8080)
2. Benutzername und Passwort eingeben
3. Inhaltstyp auswählen (Alle, Live, Filme)
4. Optional EPG und Catch-up aktivieren
5. "M3U Generieren" klicken

## Français

### 📱 À propos
Cet outil permet de créer des playlists M3U à partir des systèmes IPTV Xtream Codes/Xtream UI. Prend en charge les flux en direct et les films.

### ✨ Fonctionnalités
- Support TV en direct et films
- Support EPG
- Support Catch-up
- Support multilingue (TR, EN, DE, FR)
- Filtrage de contenu
- Ajustement du fuseau horaire
- Interface moderne et responsive

### 🚀 Installation
1. PHP 7.4 ou supérieur requis
2. Télécharger les fichiers sur le serveur web
3. Définir les permissions avec `chmod 755 *.php`
4. Accéder à `index.php` depuis le navigateur

### 📖 Utilisation
1. Saisir l'adresse du serveur IPTV (ex: http://example.com:8080)
2. Saisir nom d'utilisateur et mot de passe
3. Sélectionner type de contenu (Tout, Direct, Films)
4. Activer EPG et Catch-up si souhaité
5. Cliquer sur "Générer M3U"

### 📜 License
MIT License

### 👥 Contributors
- Fork and send PR to contribute

---

## ⚠️ Yasal Uyarı / Legal Notice / Rechtlicher Hinweis / Avis Légal

🇹🇷 Bu yazılım, sadece yasal ve ödenmiş IPTV abonelikleriniz için M3U kanal listesi oluşturmanıza yardımcı olan bir araçtır. Herhangi bir IPTV hizmeti, içerik veya abonelik sağlamamaktadır.

🇬🇧 This software is a tool that helps you create M3U channel lists for your legal and paid IPTV subscriptions only. It does not provide any IPTV service, content, or subscription.

🇩🇪 Diese Software ist nur ein Hilfsmittel zum Erstellen von M3U-Kanallisten für Ihre legalen und bezahlten IPTV-Abonnements. Sie bietet keine IPTV-Dienste, Inhalte oder Abonnements.

🇫🇷 Ce logiciel est uniquement un outil pour créer des listes de chaînes M3U pour vos abonnements IPTV légaux et payés. Il ne fournit aucun service IPTV, contenu ou abonnement.
