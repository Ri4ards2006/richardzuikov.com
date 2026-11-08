import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.richardzuikov.com';

export function useDocumentTitle(title) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    // index.html ships one static canonical; keep it pointing at the current route.
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${SITE_URL}${pathname}`);
  }, [title, pathname]);
}
