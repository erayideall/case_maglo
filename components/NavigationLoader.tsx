"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function NavigationLoader() {
  const [loading, setLoading] = useState(true); // İlk yüklemede true
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Her sayfa geçişinde loading göster
    setLoading(true);

    // Sayfa yüklendikten sonra gizle
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return <LoadingSpinner />;
}
