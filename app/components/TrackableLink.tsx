// src/components/TrackableLink.tsx
import { ReactNode } from "react";

interface Props {
  to: string;
  linkId: string;
  children: ReactNode;
}

export function TrackableLink({ to, linkId, children }: Props) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();  // navigasyonu durdur

    try {
      // POST isteğini bekle, cookie’leri de gönder
      await fetch("/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ link: linkId }),
      });
    } catch (err) {
      console.error("Click tracking failed", err);
    }

    // POST tamamlandıktan sonra yönlendir
    window.location.href = to;
  };

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
