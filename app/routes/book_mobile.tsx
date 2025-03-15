import { useEffect } from 'react';
import ProductComponentWrapper_mobile from './ProductComponentWrapper_mobile';

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

const ShopifyScriptComponent = ({ productId }: { productId: string }) => {
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

      const productElement = document.querySelector(`.shopify-product[data-product-id="${productId}"]`);
      if (productElement) {
        // Eski bileşeni kaldır
        while (productElement.firstChild) {
          productElement.removeChild(productElement.firstChild);
        }

        window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
          ui.createComponent('product', {
            id: productId,
            node: productElement,
            moneyFormat: '%7B%7Bamount%7D%7DTL',
            options: {
              product: {
                styles: {
                  product: {
                    '@media (min-width: 601px)': {
                      'max-width': 'calc(16.67% - 10px)',
                      'margin-left': '2.5px',
                      'margin-right': '2.5px',
                      'margin-bottom': '112.5px',
                    },
                  },
                  button: {
                    'font-size': '6px',
                    'padding-top': '2.5px',
                    'padding-bottom': '2.5px',
                    'border-radius': '6.5px',
                  },
                  quantityInput: {
                    'font-size': '8px',
                    'padding-top': '8px',
                    'padding-bottom': '8px',
                  },
                },
                text: {
                  button: 'Sepete Ekle',
                },
                contents: {
                  description: productElement.hasAttribute('data-description'),
                },
                templates: {
                  title: '',
                  img:
                    '<a class="shopify-buy__product__title" href="{{data.onlineStoreUrl}}" target="_blank">{{#data.currentImage.srcLarge}}<div class="{{data.classes.product.imgWrapper}}" data-element="product.imgWrapper" style="max-width: 25%; margin: 0 auto; display: block;"><img alt="{{data.currentImage.altText}}" data-element="product.img" class="{{data.classes.product.img}}" src="{{data.currentImage.srcLarge}}" /></div>{{/data.currentImage.srcLarge}}</a>',
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
                      'max-width': '50%',
                      'margin-left': '25px',
                      'margin-bottom': '25px',
                    },
                  },
                  button: {
                    'font-size': '63px',
                    'padding-top': '63px',
                    'padding-bottom': '63px',
                    'border-radius': '61.5px',
                  },
                  quantityInput: {
                    'font-size': '6px',
                    'padding-top': '6px',
                    'padding-bottom': '6px',
                  },
                },
                text: {
                  button: 'Add to cart',
                },
              },
              cart: {
                styles: {
                  button: {
                    'font-size': '6px',
                    'padding-top': '6px',
                    'padding-bottom': '6px',
                    'border-radius': '4px',
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
                    'font-size': '8px',
                  },
                },
              },
            },
          });
        });
      }
    }
  }, [productId]);

  return (
    <div className={`shopify-product`} data-product-id={productId}>
      <ProductComponentWrapper_mobile />
    </div>
  );
};

export default ShopifyScriptComponent;
