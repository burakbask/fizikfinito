import { useEffect, useState } from 'react';
import { MetaFunction } from '@remix-run/node';

// SEO Metadata
export const meta: MetaFunction = () => ([
  {
    title: '2025 TYT - Kaç Gün Kaldı? | TYT Geri Sayım | TYT Tarihi',
    description: '2025 TYT için geri sayım başladı. TYT sınavı ne zaman? Temel Yeterlilik Testi tarih ve detayları öğrenin.',
    keywords: '2025 TYT, TYT Sayaç, TYT Geri Sayım, TYT Ne Zaman, TYT Sınav Tarihi',
    'og:title': '2025 TYT - Kaç Gün Kaldı? | TYT Tarihi ve Detayları',
    'og:description': '2025 TYT için geri sayım başladı. Temel Yeterlilik Testi sınavı detaylarını öğrenin.',
    'og:type': 'website',
    'og:url': 'https://yourwebsite.com/tyt-sayac',
    'og:image': 'https://yourwebsite.com/images/tyt-countdown.jpg',
  }
]);

export default function YKSCountdown() {
  const targetDate = new Date('2025-06-21T10:15:00').getTime();
  const calculateTimeLeft = () => {
    const difference = targetDate - Date.now();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);

      const resizeListener = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', resizeListener);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', resizeListener);
      };
    } else {
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className={`countdown-container ${isMobile ? 'mobile' : ''}`}>
      <h1 className={`gradient-text ${isMobile ? 'mobile' : ''}`}>⚡️ TYT 2025 - KAÇ GÜN KALDI? ⚡️</h1>
      <p className={`intro-text ${isMobile ? 'mobile' : ''}`}>
        Yükseköğretim Kurumları Sınavı 1. Oturum - Temel Yeterlilik Testi için geri sayım başladı! TYT sınav tarihini ve detaylarını öğrenin:
      </p>

      <div className={`countdown ${isMobile ? 'mobile' : ''}`}>
        <div className={`time-box ${isMobile ? 'mobile' : ''}`}>
          <span className={`time-value ${isMobile ? 'mobile' : ''}`}>{timeLeft.days}</span>
          <span className={`time-label ${isMobile ? 'mobile' : ''}`}>Gün</span>
        </div>
        <div className={`time-box ${isMobile ? 'mobile' : ''}`}>
          <span className={`time-value ${isMobile ? 'mobile' : ''}`}>{timeLeft.hours}</span>
          <span className={`time-label ${isMobile ? 'mobile' : ''}`}>Saat</span>
        </div>
        <div className={`time-box ${isMobile ? 'mobile' : ''}`}>
          <span className={`time-value ${isMobile ? 'mobile' : ''}`}>{timeLeft.minutes}</span>
          <span className={`time-label ${isMobile ? 'mobile' : ''}`}>Dakika</span>
        </div>
        <div className={`time-box ${isMobile ? 'mobile' : ''}`}>
          <span className={`time-value ${isMobile ? 'mobile' : ''}`}>{timeLeft.seconds}</span>
          <span className={`time-label ${isMobile ? 'mobile' : ''}`}>Saniye</span>
        </div>
      </div>

      <p className={`details ${isMobile ? 'mobile' : ''}`}>
        <strong>🖍 TYT Tarihi:</strong> 21 Haziran 2025 <br />
        <strong>🖍 Gün:</strong> Cumartesi <br />
        <strong>🖍 Saat:</strong> 10:15 <br />
        <strong>🖍 Sınav Süresi:</strong> 165 dakika <br />
        <strong>🖍 Başvuru Tarihleri:</strong> 06 Şubat - 03 Mart 2025 <br />
        <strong>🖍 Geç Başvuru Günü:</strong> 11 - 13 Mart 2025 <br />
        <strong>🖍 YKS Sonuç Açıklama Tarihi:</strong> 17 Temmuz 2025
      </p>

      <style jsx>{`
        .countdown-container {
          text-align: center;
          margin: 2rem auto;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #ff9a9e, #fad0c4);
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .countdown-container.mobile {
          padding: 1rem;
        }
        .gradient-text {
          font-size: 2.5rem;
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
        .gradient-text.mobile {
          font-size: 1.8rem;
        }
        .intro-text {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #fff;
        }
        .intro-text.mobile {
          font-size: 1rem;
        }
        .countdown {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin: 1rem 0;
        }
        .countdown.mobile {
          flex-direction: column;
          gap: 1rem;
        }
        .time-box {
          background: rgba(255, 255, 255, 0.8);
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .time-box.mobile {
          padding: 1rem;
        }
        .time-value {
          font-size: 3rem;
          font-weight: bold;
          color: #333;
        }
        .time-value.mobile {
          font-size: 2rem;
        }
        .time-label {
          display: block;
          font-size: 1.2rem;
          color: #666;
        }
        .time-label.mobile {
          font-size: 1rem;
        }
        .details {
          margin-top: 2rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: #fff;
        }
        .details.mobile {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
