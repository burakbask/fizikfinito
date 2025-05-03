// app/components/CookieConsent.tsx
import React, { useEffect, useState } from "react";

type Preferences = {
  necessary: boolean;
  personalization: boolean;
  marketing: boolean;
  analytics: boolean;
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({
    necessary: true,
    personalization: false,
    marketing: false,
    analytics: false,
  });

  // Sayfa yüklendiğinde önceden ayar var mı diye bak
  useEffect(() => {
    const consentCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("cookieConsent="));
    if (!consentCookie) {
      // Daha önce onay/ret yoksa göster
      setVisible(true);
    } else {
      // Varsa parse edip prefs'e alabiliriz (isteğe bağlı)
      try {
        const value = decodeURIComponent(consentCookie.split("=")[1]);
        const parsed = JSON.parse(value) as Partial<Preferences>;
        setPrefs((p) => ({ ...p, ...parsed }));
      } catch {
        // JSON değilse (eski versiyon) görünmez yap
      }
    }
  }, []);

  const savePreferences = () => {
    const value = encodeURIComponent(JSON.stringify(prefs));
    document.cookie = `cookieConsent=${value}; max-age=31536000; domain=fizikfinito.com; path=/`;
    setShowSettings(false);
    setVisible(false);
  };

  const acceptAll = () => {
    const allPrefs: Preferences = {
      necessary: true,
      personalization: true,
      marketing: true,
      analytics: true,
    };
    const value = encodeURIComponent(JSON.stringify(allPrefs));
    document.cookie = `cookieConsent=${value}; max-age=31536000; domain=fizikfinito.com; path=/`;
    setPrefs(allPrefs);
    setShowSettings(false);
    setVisible(false);
  };

  const declineAll = () => {
    const noPrefs: Preferences = {
      necessary: true,
      personalization: false,
      marketing: false,
      analytics: false,
    };
    const value = encodeURIComponent(JSON.stringify(noPrefs));
    document.cookie = `cookieConsent=${value}; max-age=31536000; domain=fizikfinito.com; path=/`;
    setPrefs(noPrefs);
    setShowSettings(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div>
      {/* Ana banner */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#333",
          color: "#fff",
          padding: "16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10000,
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            flex: "1 1 0%",
            minWidth: 0,
            paddingRight: "16px",
            marginBottom: "8px",
          }}
        >
          Çerezler, içeriği ve reklamları kişiselleştirmek, sosyal medya özellikleri sağlamak
          ve trafiğimizi analiz etmek için kullanılmaktadır. “Kabul Et” seçeneği ile tüm
          çerezleri kabul edebilir veya “İzinleri Yönet” seçeneği ile ayarları düzenleyebilirsiniz.{" "}
          <a
            href="/cookie-politikalari"
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            Çerez Politikası
          </a>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: "#FF7A00",
              border: "none",
              padding: "8px 16px",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            İzinleri Yönet
          </button>
          <button
            onClick={declineAll}
            style={{
              background: "#FF7A00",
              border: "none",
              padding: "8px 16px",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hepsini Reddet
          </button>
          <button
            onClick={acceptAll}
            style={{
              background: "#FF7A00",
              border: "none",
              padding: "8px 16px",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Hepsini Kabul Et
          </button>
        </div>
      </div>

      {/* Ayarlar paneli */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#222",
            color: "#fff",
            padding: "24px",
            maxHeight: "60vh",
            overflowY: "auto",
            zIndex: 10001,
            fontSize: "14px",
            lineHeight: 1.4,
          }}
        >
          {/* Başlık ve üst butonlar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: 0 }}>Çerez Tercihleri</h2>
            <button
              onClick={() => {
                setShowSettings(false);
                setVisible(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <div style={{ marginBottom: "16px", fontWeight: "bold" }}>
            Verileriniz sizin kontrolünüzde
          </div>
          <div style={{ marginBottom: "24px" }}>
            Kullandığımız çerezler hakkında daha fazla bilgi edinin ve hangi
            çerezlere izin vereceğinizi seçin.
          </div>

          {/* Üst eylem butonları */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button
              onClick={acceptAll}
              style={{
                background: "#FF7A00",
                border: "none",
                padding: "8px 12px",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hepsini Kabul Et
            </button>
            <button
              onClick={declineAll}
              style={{
                background: "#FF7A00",
                border: "none",
                padding: "8px 12px",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Tümünü Reddet
            </button>
            <button
              onClick={savePreferences}
              style={{
                background: "#FF7A00",
                border: "none",
                padding: "8px 12px",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Seçimlerimi Kaydet
            </button>
          </div>

          {/* Çerez detayları */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Gerekli */}
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="checkbox"
                checked
                disabled
                style={{ width: "18px", height: "18px", marginTop: "3px" }}
              />
              <div>
                <strong>Gerekli</strong>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  Bu çerezler, giriş yapma ve sepetinize ürün ekleme gibi özellikler
                  de dahil olmak üzere sitenin düzgün çalışması için gereklidir.
                </div>
              </div>
            </div>
            {/* Kişiselleştirme */}
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="checkbox"
                checked={prefs.personalization}
                onChange={() =>
                  setPrefs((p) => ({
                    ...p,
                    personalization: !p.personalization,
                  }))
                }
                style={{ width: "18px", height: "18px", marginTop: "3px" }}
              />
              <div>
                <strong>Kişiselleştirme</strong>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  Bu çerezler, web sitesine yapacağınız bir sonraki ziyaretinizi
                  kişiselleştirmek için eylemlerinize ilişkin ayrıntıları saklar.
                </div>
              </div>
            </div>
            {/* Pazarlama */}
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={() =>
                  setPrefs((p) => ({ ...p, marketing: !p.marketing }))
                }
                style={{ width: "18px", height: "18px", marginTop: "3px" }}
              />
              <div>
                <strong>Pazarlama</strong>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  Bu çerezler pazarlama iletişimlerini optimize etmek ve size diğer
                  sitelerde reklam göstermek için kullanılır.
                </div>
              </div>
            </div>
            {/* Analitik */}
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={() =>
                  setPrefs((p) => ({ ...p, analytics: !p.analytics }))
                }
                style={{ width: "18px", height: "18px", marginTop: "3px" }}
              />
              <div>
                <strong>Analitik</strong>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  Bu çerezler, site ile nasıl etkileşimde bulunduğunuzu anlamamıza
                  yardımcı olur. Bu verileri iyileştirilecek alanları belirlemek için
                  kullanmaktayız.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
