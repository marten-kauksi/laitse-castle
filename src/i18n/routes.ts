// Maps Estonian slugs to English slugs and back
export const routeMap: Record<string, Record<string, string>> = {
  et: {
    '/': '/',
    '/ajalugu': '/ajalugu',
    '/peod-ja-seminarid': '/peod-ja-seminarid',
    '/seminarid': '/seminarid',
    '/lisateenused': '/lisateenused',
    '/galerii': '/galerii',
  },
  en: {
    '/': '/en/',
    '/ajalugu': '/en/history',
    '/peod-ja-seminarid': '/en/events-and-seminars',
    '/seminarid': '/en/seminars',
    '/lisateenused': '/en/additional-services',
    '/galerii': '/en/gallery',
  },
};

// Reverse map: from any path to its canonical Estonian path
export const reverseRouteMap: Record<string, string> = {
  '/': '/',
  '/ajalugu': '/ajalugu',
  '/peod-ja-seminarid': '/peod-ja-seminarid',
  '/seminarid': '/seminarid',
  '/lisateenused': '/lisateenused',
  '/galerii': '/galerii',
  '/en/': '/',
  '/en/history': '/ajalugu',
  '/en/events-and-seminars': '/peod-ja-seminarid',
  '/en/seminars': '/seminarid',
  '/en/additional-services': '/lisateenused',
  '/en/gallery': '/galerii',
};
