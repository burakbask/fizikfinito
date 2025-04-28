// app/components/CookieConsent.tsx
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Daha önce onay verildi mi diye kontrol et
    const hasConsent = document.cookie
      .split("; ")
      .some((c) => c.startsWith("cookieConsent="));
    if (!hasConsent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    document.cookie =
      "cookieConsent=accepted; max-age=31536000; domain=fizikfinito.com; path=/";
    setVisible(false);
  };

  const declineAll = () => {
    document.cookie =
      "cookieConsent=declined; max-age=31536000; domain=fizikfinito.com; path=/";
    setVisible(false);
  };

  if (!visible) return null;

  return (
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
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10000,
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      {/* Soldaki açıklama metni */}
      <div style={{ flex: 1, paddingRight: "16px" }}>
        Çerezler, içeriği ve reklamları kişiselleştirmek, sosyal medya özellikleri sağlamak
        ve trafiğimizi analiz etmek için kullanılmaktadır. “Kabul Et” seçeneği ile tüm
        çerezleri kabul edebilir veya “Çerez Ayarları” seçeneği ile ayarları düzenleyebilirsiniz.{" "}
        <a
          href="/cookie-politikalari"
          style={{ color: "#fff", textDecoration: "underline" }}
        >
          Çerez Politikası
        </a>
      </div>

      {/* Sağdaki butonlar */}
      <div style={{ display: "flex", gap: "8px" }}>
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
          Tümüne İzin Ver
        </button>
      </div>

      {/* Eğer İzinleri Yönet’e tıklanırsa gösterilecek detay paneli */}
      {showSettings && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            background: "#222",
            color: "#fff",
            padding: "16px",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {/* Buraya daha önce eklediğiniz çerez detayları tablonuzu koyabilirsiniz */}
          {/* Örneğin: <CookieDetailsTable /> */}
          <button
            onClick={() => setShowSettings(false)}
            style={{
              marginTop: "8px",
              background: "#FF7A00",
              border: "none",
              padding: "8px 16px",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
}
