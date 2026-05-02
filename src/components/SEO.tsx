import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

const SITE_URL = 'https://gudjonkristjansson.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const SEO: React.FC<SEOProps> = ({ title, description, path = '/', image }) => {
  const { t, i18n } = useTranslation();
  const siteTitle = t('siteTitle');
  const fullTitle = title ? `${title} · ${siteTitle}` : `${siteTitle} — ${t('siteTagline')}`;
  const desc = description ?? t('metaDescription');
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? DEFAULT_IMAGE;
  const lang = i18n.language || 'en';

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={lang === 'is' ? 'is_IS' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
