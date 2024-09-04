import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (type: string, action: string, params: object) => void;
  }
}

export const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      window.gtag('config', 'G-K9GLWHQEGZ', {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams]);

  const event = (action: string, params: object) => {
    window.gtag('event', action, params);
  };

  return { event };
};
