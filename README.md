# Xtream Codes API to M3U Playlist Converter (Multi-Language)

![Screenshot](screenshots/main.png) <!-- Resim yolunu ana dizine göre ayarladık -->

🇹🇷 [Türkçe](#türkçe) | 🇬🇧 [English](#english) | 🇩🇪 [Deutsch](#deutsch) | 🇫🇷 [Français](#français)

---

## Türkçe

### 📱 Program Hakkında
Bu proje, Xtream Codes veya Xtream UI tabanlı IPTV sistemlerinden M3U playlist dosyaları oluşturmak için çeşitli dillerde (PHP, Python, Node.js) **web tabanlı** araçlar sunar.

### ✨ Özellikler (Tüm Versiyonlar İçin Geçerli)
- Canlı TV ve Film (VOD) desteği
- EPG (Elektronik Program Rehberi) URL'sini playlist'e ekleme
- Catch-up/Geriye Dönük İzleme desteği (ilgili M3U etiketleri ile)
- İçerik türüne göre filtreleme (Tümü, Sadece Canlı, Sadece Film)
- EPG Zaman Dilimi Kaydırma (Timeshift) ayarı
- Kullanıcı dostu web arayüzü (Tüm versiyonlar)
- Çoklu dil desteği (Şu anda arayüzlerde ağırlıklı olarak Türkçe, genişletilebilir)

### 🚀 Kurulum ve Kullanım

**1. PHP Versiyonu (`/php` klasörü)**
   - **Gereksinimler:** PHP >= 7.4, `curl` ve `json` eklentileri.
   - **Kurulum:**
     1. `php` klasöründeki dosyaları web sunucunuzun (Apache, Nginx vb.) erişebileceği bir dizine yükleyin.
     2. Web sunucunuzu yapılandırın ve tarayıcınızdan `apitom3u.php` dosyasına gidin.
   - **Kullanım:** Web arayüzündeki formu doldurun ve "M3U Oluştur" butonuna tıklayın.

**2. Python Versiyonu (`/python` klasörü - Flask)**
   - **Gereksinimler:** Python 3.x
   - **Kurulum:**
     1. Terminalde `python` klasörüne gidin: `cd python`
     2. Gerekli kütüphaneleri kurun: `pip install -r requirements.txt`
   - **Çalıştırma:**
     ```bash
     python app.py
     ```
   - **Kullanım:** Tarayıcınızı açın ve `http://localhost:5000` (veya terminalde belirtilen adres) adresine gidin. Formu doldurun.

**3. Node.js Versiyonu (`/nodejs` klasörü - Express)**
   - **Gereksinimler:** Node.js (npm dahil)
   - **Kurulum:**
     1. Terminalde `nodejs` klasörüne gidin: `cd nodejs`
     2. Gerekli paketleri kurun: `npm install`
   - **Çalıştırma:**
     ```bash
     npm start
     # veya
     node app.js
     ```
   - **Kullanım:** Tarayıcınızı açın ve `http://localhost:3000` (veya terminalde belirtilen adres) adresine gidin. Formu doldurun.

### 📝 Teknik Notlar
- **Dizi (Series) Desteği:** Xtream Codes API'sinin yapısı (her bölüm için ayrı istek gerektirmesi), potansiyel sunucu yükü ve IP/hesap yasaklanma riski nedeniyle dizi içerikleri bilinçli olarak **desteklenmemektedir**.

---

## English

### 📱 About
This project provides **web-based** tools in various languages (PHP, Python, Node.js) to generate M3U playlist files from Xtream Codes or Xtream UI based IPTV systems.

### ✨ Features (Common to All Versions)
- Live TV and Movie (VOD) support
- Adding EPG (Electronic Program Guide) URL to the playlist
- Catch-up support (with relevant M3U tags)
- Content filtering (All, Live Only, Movies Only)
- EPG Timeshift adjustment
- User-friendly web interface (All versions)
- Multi-language support (Currently primarily Turkish in interfaces, expandable)

### 🚀 Installation and Usage

**1. PHP Version (`/php` directory)**
   - **Requirements:** PHP >= 7.4, `curl` and `json` extensions.
   - **Installation:**
     1. Upload the files from the `php` directory to a directory accessible by your web server (Apache, Nginx, etc.).
     2. Configure your web server and access the `apitom3u.php` file from your browser.
   - **Usage:** Fill out the form in the web interface and click the "Generate M3U" button.

**2. Python Version (`/python` directory - Flask)**
   - **Requirements:** Python 3.x
   - **Installation:**
     1. Navigate to the `python` directory in your terminal: `cd python`
     2. Install the required libraries: `pip install -r requirements.txt`
   - **Running:**
     ```bash
     python app.py
     ```
   - **Usage:** Open your browser and go to `http://localhost:5000` (or the address shown in the terminal). Fill out the form.

**3. Node.js Version (`/nodejs` directory - Express)**
   - **Requirements:** Node.js (with npm)
   - **Installation:**
     1. Navigate to the `nodejs` directory in your terminal: `cd nodejs`
     2. Install the required packages: `npm install`
   - **Running:**
     ```bash
     npm start
     # or
     node app.js
     ```
   - **Usage:** Open your browser and go to `http://localhost:3000` (or the address shown in the terminal). Fill out the form.

### 📝 Technical Notes
- **Series Support:** Due to the structure of the Xtream Codes API (requiring separate requests for each episode), potential server load, and the risk of IP/account bans, series content is intentionally **not supported**.

---

## Deutsch

### 📱 Über
Dieses Projekt bietet **webbasierte** Tools in verschiedenen Sprachen (PHP, Python, Node.js) zum Erstellen von M3U-Wiedergabelistendateien aus Xtream Codes oder Xtream UI-basierten IPTV-Systemen.

### ✨ Funktionen (Gemeinsam für alle Versionen)
- Unterstützung für Live-TV und Filme (VOD)
- Hinzufügen der EPG (Elektronischer Programmführer) URL zur Wiedergabeliste
- Catch-up-Unterstützung (mit relevanten M3U-Tags)
- Inhaltsfilterung (Alle, Nur Live, Nur Filme)
- EPG-Zeitzonenverschiebung (Timeshift) Anpassung
- Benutzerfreundliche Weboberfläche (Alle Versionen)
- Mehrsprachigkeitsunterstützung (Derzeit hauptsächlich Türkisch in den Oberflächen, erweiterbar)

### 🚀 Installation und Verwendung

**1. PHP-Version (`/php`-Verzeichnis)**
   - **Anforderungen:** PHP >= 7.4, `curl`- und `json`-Erweiterungen.
   - **Installation:**
     1. Laden Sie die Dateien aus dem `php`-Verzeichnis in ein Verzeichnis hoch, auf das Ihr Webserver (Apache, Nginx usw.) zugreifen kann.
     2. Konfigurieren Sie Ihren Webserver und greifen Sie über Ihren Browser auf die Datei `apitom3u.php` zu.
   - **Verwendung:** Füllen Sie das Formular in der Weboberfläche aus und klicken Sie auf die Schaltfläche "M3U Generieren".

**2. Python-Version (`/python`-Verzeichnis - Flask)**
   - **Anforderungen:** Python 3.x
   - **Installation:**
     1. Navigieren Sie im Terminal zum `python`-Verzeichnis: `cd python`
     2. Installieren Sie die erforderlichen Bibliotheken: `pip install -r requirements.txt`
   - **Ausführen:**
     ```bash
     python app.py
     ```
   - **Verwendung:** Öffnen Sie Ihren Browser und gehen Sie zu `http://localhost:5000` (oder die im Terminal angezeigte Adresse). Füllen Sie das Formular aus.

**3. Node.js-Version (`/nodejs`-Verzeichnis - Express)**
   - **Anforderungen:** Node.js (mit npm)
   - **Installation:**
     1. Navigieren Sie im Terminal zum `nodejs`-Verzeichnis: `cd nodejs`
     2. Installieren Sie die erforderlichen Pakete: `npm install`
   - **Ausführen:**
     ```bash
     npm start
     # oder
     node app.js
     ```
   - **Verwendung:** Öffnen Sie Ihren Browser und gehen Sie zu `http://localhost:3000` (oder die im Terminal angezeigte Adresse). Füllen Sie das Formular aus.

### 📝 Technische Hinweise
- **Serienunterstützung:** Aufgrund der Struktur der Xtream Codes API (erfordert separate Anfragen für jede Episode), potenzieller Serverlast und dem Risiko von IP-/Kontosperrungen wird Serieninhalt bewusst **nicht unterstützt**.

---

## Français

### 📱 À propos
Ce projet fournit des outils **basés sur le Web** dans différentes langues (PHP, Python, Node.js) pour générer des fichiers de playlist M3U à partir de systèmes IPTV basés sur Xtream Codes ou Xtream UI.

### ✨ Fonctionnalités (Communes à toutes les versions)
- Prise en charge de la télévision en direct et des films (VOD)
- Ajout de l'URL EPG (Guide électronique des programmes) à la playlist
- Prise en charge du Catch-up (avec les balises M3U pertinentes)
- Filtrage de contenu (Tout, Direct uniquement, Films uniquement)
- Ajustement du décalage horaire EPG (Timeshift)
- Interface Web conviviale (Toutes les versions)
- Prise en charge multilingue (Actuellement principalement en turc dans les interfaces, extensible)

### 🚀 Installation et Utilisation

**1. Version PHP (Répertoire `/php`)**
   - **Prérequis :** PHP >= 7.4, extensions `curl` et `json`.
   - **Installation :**
     1. Téléchargez les fichiers du répertoire `php` dans un répertoire accessible par votre serveur Web (Apache, Nginx, etc.).
     2. Configurez votre serveur Web et accédez au fichier `apitom3u.php` depuis votre navigateur.
   - **Utilisation :** Remplissez le formulaire dans l'interface Web et cliquez sur le bouton "Générer M3U".

**2. Version Python (Répertoire `/python` - Flask)**
   - **Prérequis :** Python 3.x
   - **Installation :**
     1. Accédez au répertoire `python` dans votre terminal : `cd python`
     2. Installez les bibliothèques requises : `pip install -r requirements.txt`
   - **Exécution :**
     ```bash
     python app.py
     ```
   - **Utilisation :** Ouvrez votre navigateur et allez à `http://localhost:5000` (ou l'adresse indiquée dans le terminal). Remplissez le formulaire.

**3. Version Node.js (Répertoire `/nodejs` - Express)**
   - **Prérequis :** Node.js (avec npm)
   - **Installation :**
     1. Accédez au répertoire `nodejs` dans votre terminal : `cd nodejs`
     2. Installez les packages requis : `npm install`
   - **Exécution :**
     ```bash
     npm start
     # ou
     node app.js
     ```
   - **Utilisation :** Ouvrez votre navigateur et allez à `http://localhost:3000` (ou l'adresse indiquée dans le terminal). Remplissez le formulaire.

### 📝 Notes Techniques
- **Support des Séries :** En raison de la structure de l'API Xtream Codes (nécessitant des requêtes distinctes pour chaque épisode), de la charge potentielle du serveur et du risque de bannissement IP/compte, le contenu des séries n'est intentionnellement **pas pris en charge**.

---

## 📜 License / Lizenz / Licence

MIT License

## ⚠️ Yasal Uyarı / Legal Notice / Rechtlicher Hinweis / Avis Légal

🇹🇷 Bu yazılımlar, yalnızca yasal ve ödenmiş IPTV abonelikleriniz için kişisel M3U kanal listesi oluşturmanıza yardımcı olan araçlardır. Herhangi bir IPTV hizmeti, içerik veya abonelik sağlamamaktadır. Yazılımların kötüye kullanımından doğacak sonuçlardan kullanıcılar sorumludur.

🇬🇧 This software is a tool that helps you create M3U channel lists for your legal and paid IPTV subscriptions only. It does not provide any IPTV service, content, or subscription. Misuse of the software is the sole responsibility of the user.

🇩🇪 Diese Software ist nur ein Hilfsmittel zum Erstellen von M3U-Kanallisten für Ihre legalen und bezahlten IPTV-Abonnements. Sie bietet keine IPTV-Dienste, Inhalte oder Abonnements. Der Missbrauch der Software liegt in der alleinigen Verantwortung des Benutzers.

🇫🇷 Ce logiciel est uniquement un outil pour créer des listes de chaînes M3U pour vos abonnements IPTV légaux et payés. Il ne fournit aucun service IPTV, contenu ou abonnement. Une mauvaise utilisation du logiciel relève de la seule responsabilité de l'utilisateur. 