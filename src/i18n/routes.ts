// Maps Estonian slugs to English slugs and back
export const routeMap: Record<string, Record<string, string>> = {
  et: {
    '/': '/',
    '/ajalugu': '/ajalugu',
    '/peod-ja-seminarid': '/peod-ja-seminarid',
  },
  en: {
    '/': '/en/',
    '/ajalugu': '/en/history',
    '/peod-ja-seminarid': '/en/events-and-seminars',
  },
};

// Reverse map: from any path to its canonical Estonian path
export const reverseRouteMap: Record<string, string> = {
  '/': '/',
  '/ajalugu': '/ajalugu',
  '/peod-ja-seminarid': '/peod-ja-seminarid',
  '/en/': '/',
  '/en/history': '/ajalugu',
  '/en/events-and-seminars': '/peod-ja-seminarid',
};
