# Proje: Xtream Codes API to M3U Dönüştürücü

## 1. Proje Amacı

Bu projenin amacı, kullanıcının sağladığı Xtream Codes API bilgilerini (URL, kullanıcı adı, şifre) kullanarak kişiselleştirilmiş bir M3U playlist dosyası oluşturmaktır. Oluşturulan M3U dosyası, kullanıcının tercihine göre canlı yayınları, filmleri veya her ikisini de içerebilir. Ayrıca EPG (Elektronik Program Rehberi) ve Catch-up (Geriye Dönük İzleme) gibi ek özellikleri de destekleyecektir.

## 2. Kurallar ve Kısıtlamalar

*   Sadece yasal ve kullanıcının sahip olduğu IPTV abonelikleri için kullanılmalıdır.
*   Uygulama herhangi bir IPTV içeriği sağlamaz, yalnızca mevcut API'yi kullanarak playlist oluşturur.
*   Dizi içerikleri, API kısıtlamaları ve olası sunucu/IP yasaklanma riskleri nedeniyle desteklenmemektedir.
*   API istekleri optimize edilerek sunucuya aşırı yük bindirilmemesi hedeflenir.

## 3. Geliştirme Aşamaları ve Durum

*   [x] Proje Kurulumu ve `PRD.md` Oluşturma
*   [x] `php/apitom3u.php` Kod İncelemesi
*   [x] `php/languages.php` Dil Dosyası İncelemesi
*   [x] `php/README.md` ve `php/Steps.md` İncelemesi
*   [x] Kodun Genel Değerlendirmesi ve Geri Bildirim
*   [ ] Olası İyileştirmeler ve Hata Düzeltmeleri
*   [ ] `PRD.md` Güncellemesi

## 4. Mevcut Durum

*   Proje dosyaları (`php/apitom3u.php`, `php/languages.php`, `php/README.md`, `php/Steps.md`) incelendi.
*   `PRD.md` dosyası oluşturuldu ve ilk yapılandırılması yapıldı.
*   Kodun genel değerlendirmesi yapıldı.

## 5. Özellikler (Mevcut ve Planlanan)

*   **Mevcut:**
    *   Xtream Codes API ile kullanıcı doğrulama.
    *   Canlı yayınları ve VOD (Film) içeriklerini M3U formatına dönüştürme.
    *   İçerik türüne göre filtreleme (Tümü, Canlı, Film).
    *   EPG URL'sini M3U dosyasına ekleme.
    *   Catch-up desteğini M3U etiketleriyle belirtme (`catchup`, `catchup-days`, `catchup-source`).
    *   EPG zaman kaydırma (timeshift) ayarı.
    *   Çoklu dil desteği (TR, EN, DE, FR) - `languages.php` aracılığıyla.
    *   Bootstrap 5 ile modern ve duyarlı kullanıcı arayüzü.
    *   Başarılı işlem sonrası M3U dosyasını indirme.
    *   Hata yönetimi (geçersiz bilgiler, cURL hataları).
*   **Planlanan (Steps.md'ye göre):**
    *   Daha gelişmiş hata yakalama ve loglama.
    *   Önbellekleme mekanizması (API isteklerini azaltmak için).
    *   API istek sınırlama (rate limiting).
    *   Güvenlik iyileştirmeleri.
    *   Performans optimizasyonları.

## 6. Bilinen Sorunlar ve Çözümler

*   **Sorun:** Dizi içerikleri desteklenmiyor.
    *   **Çözüm/Neden:** Xtream Codes API'sinin yapısı (her bölüm için ayrı istek gerektirmesi), potansiyel sunucu yükü ve IP/hesap yasaklanma riski nedeniyle bilinçli olarak eklenmemiştir (`README.md` ve `Steps.md` içinde belirtilmiş).
*   **Sorun:** Yoğun kullanımda API sunucusundan yanıt alınamaması veya yavaşlaması.
    *   **Çözüm Önerisi:** Önbellekleme ve rate limiting mekanizmaları eklenebilir.

## 7. Yapılandırma Bilgileri

*   **PHP Sürümü:** >= 7.4 (README.md'ye göre)
*   **Gerekli PHP Eklentileri:** `curl`, `json` (genellikle standart PHP kurulumlarında bulunur)
*   **Harici Kütüphaneler:** Bootstrap 5 (CSS/JS, CDN üzerinden çekiliyor)
*   **Dil Dosyası:** `php/languages.php`
*   **Ana Script:** `php/apitom3u.php` 