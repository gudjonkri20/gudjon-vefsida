/**
 * The address the site is actually served from.
 *
 * Every absolute URL the site publishes about itself is built from this one
 * value: the canonical link, the share-card image, the sitemap and robots.txt.
 *
 * It is the Netlify address for now because gudjonkristjansson.com does not
 * point at the site yet (it serves a parking page). While it said .com, link
 * previews asked the parked domain for the share image and got an error, and
 * search engines were told the site lived somewhere it does not.
 *
 * When the domain is connected, change this line and redeploy. Nothing else.
 */
export const SITE_URL = 'https://gudjonkristjansson.netlify.app';
