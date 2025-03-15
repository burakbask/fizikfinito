//kitaplarimiz.tsx
import React, { useEffect } from 'react';


declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

const Kitaplarimiz = () => {
  const products = [
    { id: "9845539701041", url: "https://fizikfinito.zeduva.com/products/fizikfinito-paraf-z-takimi-tyt-fizik-video-ders-anlatim-kitabi-prf-yayinlari-9786257423892", title: "Fizikfinito - TYT Fizik VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9873531863345", url: "https://fizikfinito.zeduva.com/products/biosem-tyt-biyoloji-seti%CC%87-video-ders-kitabi-ve-soru-bankasi-seti-paraf-z-takimi", title: "Biosem - TYT Biyoloji SETİ - Video Ders Kitabı ve Soru Bankası Seti - Paraf Z takımı" },
    { id: "9849553518897", url: "https://fizikfinito.zeduva.com/products/fizikfinito-tyt-fizik-video-ders-kitabi-ve-soru-bankasi-seti-paraf-z-takimi", title: "Fizikfinito - 2025 TYT Fizik Kamp Kitapları - Video Konu Anlatımı ve Soru bankası" },
    { id: "9840127050033", url: "https://fizikfinito.zeduva.com/products/paraf-yayinlari-z-takimi-28-saatte-ayt-bi%CC%87yoloji%CC%87-soru-bankasi", title: "Biosem - AYT Biyoloji SORU BANKASI - Paraf Z Takımı" },
    { id: "9840110862641", url: "https://fizikfinito.zeduva.com/products/biosem-z-takimi-tyt-biyoloji-video-soru-bankasi", title: "Biosem - TYT Biyoloji SORU BANKASI - Paraf Z Takımı" },
    { id: "9845540684081", url: "https://fizikfinito.zeduva.com/products/biosem-paraf-z-takimi-tyt-biyoloji-video-ders-anlatim-kitabi-prf-yayinlari", title: "Biosem - TYT Biyoloji VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9849083003185", url: "https://fizikfinito.zeduva.com/products/10-gunde-matematik-temel-atma-garanti-biyiklimatematik-paraf-z-takimi", title: "BıyıklıMatematik - TYT Temel Atma Garantili Matematik SORU BANKASI/VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9840130916657", url: "https://fizikfinito.zeduva.com/products/paraf-z-takim-ayt-cografya-vi%CC%87deo-soru-bankasi", title: "Coğrafyanın Kodları - AYT Coğrafya Soru Bankası - Paraf Z Takımı" },
    { id: "9865880830257", url: "https://fizikfinito.zeduva.com/products/cografyanin-kodlari-tyt-ayt-soru-bankasi-seti%CC%87-paraf-z-takimi", title: "Coğrafyanın Kodları - TYT AYT Soru Bankası SETİ - Paraf Z takımı" },
    { id: "9839677997361", url: "https://fizikfinito.zeduva.com/products/cografyanin-kodlari-tyt-garanti%CC%87-konular-soru-bankasi-z-takimi", title: "Coğrafyanın Kodları - TYT Coğrafya Garanti Konular SORU BANKASI/VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9845521613105", url: "https://fizikfinito.zeduva.com/products/cografyanin-kodlari-paraf-z-takimi-tyt-cografya-soru-bankasi-paraf-yayinlari-9786257423915", title: "Coğrafyanın Kodları - TYT Coğrafya Soru Bankası - Paraf Z Takımı" },
    { id: "9840102703409", url: "https://fizikfinito.zeduva.com/products/fizikfinito-tyt-fi%CC%87zi%CC%87k-soru-bankasi-24-saatte-z-takimi", title: "Fizikfinito - TYT Fizik Soru Bankası - Paraf Z Takımı" },
    { id: "9840132587825", url: "https://fizikfinito.zeduva.com/products/paraf-yayinlari-z-takimi-32-saatte-ayt-fi%CC%87zi%CC%87k-soru-bankasi", title: "Fizikfinito - AYT Fizik SORU BANKASI - Paraf Z Takımı" },
    { id: "9864254193969", url: "https://fizikfinito.zeduva.com/products/paraf-z-takim-tyt-fen-bilimleri-garanti-konular-soru-bankasi-fkb", title: "FKB - TYT FEN Bilimleri Garanti Konular SORU BANKASI/VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9840100933937", url: "https://fizikfinito.zeduva.com/products/z-takimi-merkeze-teget-tyt-ayt-geometri-soru-bankasi-48-saatte-geometri", title: "Merkeze Teğet - TYT AYT Geometri SORU BANKASI - Paraf Z Takımı" },
    { id: "9845535408433", url: "https://fizikfinito.zeduva.com/products/paraf-z-takim-tyt-ayt-geometri-video-ders-anlatim-kitabi", title: "Merkeze Teğet - TYT-AYT Geometri VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9873514660145", url: "https://fizikfinito.zeduva.com/products/merkezeteget-geometri-tyt-ayt-video-ders-kitabi-ve-soru-bankasi-seti-paraf-z-takimi", title: "MerkezeTeğet Geometri TYT-AYT - Video Ders Kitabı ve Soru Bankası Seti - Paraf Z takımı" },
    { id: "9840131178801", url: "https://fizikfinito.zeduva.com/products/paraf-z-takim-ayt-ki%CC%87mya-vi%CC%87deo-soru-bankasi", title: "Meschemykimya - AYT Kimya SORU BANKASI - Paraf Z Takımı" },
    { id: "9840101196081", url: "https://fizikfinito.zeduva.com/products/meschemykimya-tyt-kimya-soru-bankasi-22-saatte-z-takimi", title: "Meschemykimya - TYT Kimya SORU BANKASI - Paraf Z Takımı" },
    { id: "9840132653361", url: "https://fizikfinito.zeduva.com/products/meschemy-kimya-paraf-z-takimi-tyt-kimya-video-ders-anlatim-kitabi-prf-yayinlari", title: "Meschemykimya - TYT Kimya VİDEO DERS Kitabı - Paraf Z Takımı" },
    { id: "9873540251953", url: "https://fizikfinito.zeduva.com/products/meschemykimya-tyt-kimya-video-ders-kitabi-ve-soru-bankasi-seti-paraf-z-takimi", title: "Meschemy Kimya- TYT Kimya - Video Ders Kitabı ve Soru Bankası Seti - Paraf Z takımı" },
    { id: "9874168054065", url: "https://fizikfinito.zeduva.com/products/fizik-kimya-biyoloji-tyt-konu-anlatim-seti", title: "Fizik Kimya Biyoloji TYT Konu Anlatım Seti - Paraf Z takımı" },
    { id: "9874176246065", url: "https://fizikfinito.zeduva.com/products/fizik-kimya-biyoloji-tyt-soru-bankasi-seti", title: "Fizik Kimya Biyoloji TYT Soru Bankası Seti" },
    { id: "9874199347505", url: "https://fizikfinito.zeduva.com/products/fizikfinito-biosem-meschemy-fen-bilimleri-tyt-full-set-3-video-ders-3soru-bankasi", title: "Fizikfinito-Biosem-Meschemy - Fen Bilimleri TYT Full Set - 3 Video Ders+3Soru Bankası" },
    { id: "9865866871089", url: "https://fizikfinito.zeduva.com/products/hari%CC%87ta-defterleri%CC%87-garanti%CC%87-konular-seti%CC%87", title: "Coğrafyanın Kodları Kısa Kamp Seti" },
    { id: "9865872638257", url: "https://fizikfinito.zeduva.com/products/konu-anlatimi-soru-bankasi-hari%CC%87talar-seti%CC%87", title: "Coğrafyanın Kodları Uzun Kamp Seti" },
    { id: "9865874211121", url: "https://fizikfinito.zeduva.com/products/kr-akademi-yayinlari-cografyanin-kodlari-dunya-haritalari-soru-bankasi-ve-turkiye-haritalari-calisma-defteri-seti", title: "KR Akademi Yayınları Coğrafyanın Kodları Dünya Haritaları Soru Bankası Ve Türkiye Haritaları Çalışma Defteri Seti" },
  ];

  useEffect(() => {
    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    if (!window.ShopifyBuy || !window.ShopifyBuy.UI) {
      loadScript().then(() => ShopifyBuyInit());
    } else {
      ShopifyBuyInit();
    }

    function loadScript() {
      return new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${scriptURL}"]`)) {
          resolve(); // Script zaten yüklü ise devam et
          return;
        }
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    function ShopifyBuyInit() {
      const client = window.ShopifyBuy.buildClient({
        domain: 'fizikfinito.zeduva.com',
        storefrontAccessToken: '4884ce168030867a5687db354cd9aae2',
      });

      products.forEach((product) => {
        const productElement = document.querySelector(`.shopify-product[data-product-id="${product.id}"]`);
        if (productElement) {
          // Eski bileşeni kaldır
          while (productElement.firstChild) {
            productElement.removeChild(productElement.firstChild);
          }

          window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
            ui.createComponent('product', {
              id: product.id,
              node: productElement,
              moneyFormat: '%7B%7Bamount%7D%7DTL',
              options: {
                product: {
                  styles: {
                    product: {
                      '@media (min-width: 601px)': {
                        'max-width': 'calc(33.33% - 20px)',
                        'margin-left': 'auto',
                        'margin-right': 'auto',
                        'margin-bottom': '30px',
                      },
                      '@media (max-width: 600px)': {
                        'max-width': '100%',
                        'margin-left': 'auto',
                        'margin-right': 'auto',
                        'margin-bottom': '20px',
                      },
                    },
                    button: {
                      'font-size': '16px', 'padding-top': '10px', 'padding-bottom': '10px',
                      'border-radius': '13px',
                    },
                    quantityInput: {
                      'font-size': '16px',
                      'padding-top': '16px',
                      'padding-bottom': '16px',
                    },
                  },
                  text: {
                    button: 'Sepete Ekle',
                  },
                  contents: {
                    description: productElement.hasAttribute('data-description'),
                  },
                  templates: {
                    title: `<div style="margin-bottom: 10px; font-weight: bold; font-size: 20px; color: #2c3e50; text-align: center;">${product.title}</div>`,
                    img: `<a class="shopify-buy__product__title" href="${product.url}" target="_blank" rel="noopener">{{#data.currentImage.srcLarge}}<div class="{{data.classes.product.imgWrapper}}" data-element="product.imgWrapper"><img alt="{{data.currentImage.altText}}" data-element="product.img" class="{{data.classes.product.img}}" src="{{data.currentImage.srcLarge}}" /></div>{{/data.currentImage.srcLarge}}</a>`
                  },
                },
                modalProduct: {
                  contents: {
                    img: false,
                    imgWithCarousel: true,
                    button: false,
                    buttonWithQuantity: true,
                  },
                  styles: {
                    product: {
                      '@media (min-width: 601px)': {
                        'max-width': '100%',
                        'margin-left': '50px',
                        'margin-bottom': '50px',
                      },
                    },
                    button: {
                      'font-size': '126px',
                      'padding-top': '126px',
                      'padding-bottom': '126px',
                      'border-radius': '123px',
                    },
                    quantityInput: {
                      'font-size': '12px',
                      'padding-top': '12px',
                      'padding-bottom': '12px',
                    },
                  },
                  text: {
                    button: 'Add to cart',
                  },
                },
                cart: {
                  styles: {
                    button: {
                      'font-size': '12px',
                      'padding-top': '12px',
                      'padding-bottom': '12px',
                      'border-radius': '8px',
                    },
                  },
                  text: {
                    title: 'Sepetim',
                    total: 'Toplam fiyat',
                    empty: 'Sepetiniz boş',
                    notice: 'Kargo ve indirim kodları ödeme sırasında eklenir.',
                    button: 'Ödeme',
                  },
                  popup: false,
                },
                toggle: {
                  styles: {
                    count: {
                      'font-size': '16px',
                    },
                  },
                },
              },
            });
          });
        }
      });
    }
  }, []);

  return (
    <div className="kitaplarimiz">
      <h1 style={{ fontSize: '32px', color: '#2c3e50', textAlign: 'center', marginBottom: '40px' }}>Tüm Kitaplarımız</h1>
      <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} className="shopify-product" data-product-id={product.id} style={{ flex: '1 1 100%', boxSizing: 'border-box', textAlign: 'center', marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', '@media (min-width: 601px)': { flex: '1 1 calc(33.33% - 20px)' } }}>
            <a href={product.url} target="_blank" rel="noopener">
              <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '20px', color: '#2c3e50', textAlign: 'center' }}>{product.title}</div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitaplarimiz;

// SEO Metadata
export const meta = () => [
  {
    title: 'Tüm Kitaplarımız - En Uygun Fiyatlı Kitaplar | Fizikfinito',
    description: "Fizikfinito'dan tüm kitaplarımızı keşfedin. En uygun fiyatlarla kaliteli eğitim materyalleri ve kitap seçenekleri.",
    keywords: 'kitaplar, fizikfinito, eğitim kitapları, uygun fiyatlı kitaplar, video ders kitapları'
  }
];
