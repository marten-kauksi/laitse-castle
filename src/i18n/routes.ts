// Maps Estonian slugs to English slugs and back
export const routeMap: Record<string, Record<string, string>> = {
  et: {
    '/': '/',
    '/ajalugu': '/ajalugu',
    '/peod': '/peod',
    '/seminarid': '/seminarid',
    '/lisateenused': '/lisateenused',
    '/lisateenused/morvamysteerium': '/lisateenused/morvamysteerium',
    '/lisateenused/sokolaadikoolitus': '/lisateenused/sokolaadikoolitus',
    '/galerii': '/galerii',
  },
  en: {
    '/': '/en/',
    '/ajalugu': '/en/history',
    '/peod': '/en/events-and-seminars',
    '/seminarid': '/en/seminars',
    '/lisateenused': '/en/additional-services',
    '/lisateenused/morvamysteerium': '/en/additional-services/murder-mystery',
    '/lisateenused/sokolaadikoolitus': '/en/additional-services/chocolate-workshop',
    '/galerii': '/en/gallery',
  },
};

// Reverse map: from any path to its canonical Estonian path
export const reverseRouteMap: Record<string, string> = {
  '/': '/',
  '/ajalugu': '/ajalugu',
  '/peod': '/peod',
  '/seminarid': '/seminarid',
  '/lisateenused': '/lisateenused',
  '/lisateenused/morvamysteerium': '/lisateenused/morvamysteerium',
  '/lisateenused/sokolaadikoolitus': '/lisateenused/sokolaadikoolitus',
  '/galerii': '/galerii',
  '/en/': '/',
  '/en/history': '/ajalugu',
  '/en/events-and-seminars': '/peod',
  '/en/seminars': '/seminarid',
  '/en/additional-services': '/lisateenused',
  '/en/additional-services/murder-mystery': '/lisateenused/morvamysteerium',
  '/en/additional-services/chocolate-workshop': '/lisateenused/sokolaadikoolitus',
  '/en/gallery': '/galerii',
};
