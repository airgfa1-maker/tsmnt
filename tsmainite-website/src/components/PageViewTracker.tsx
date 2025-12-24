'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 不追踪 admin-mnt 路由
    if (pathname.includes('/admin-mnt')) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/stats/page-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (error) {
        // 静默失败，不影响用户体验
        console.debug('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
