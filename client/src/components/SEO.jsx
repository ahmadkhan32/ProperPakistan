import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url, type = 'website' }) => {
    const defaultTitle = 'ProperPakistan.com - Your Source for Quality Content';
    const defaultDescription = 'Discover insightful articles on technology, education, freelancing, and study abroad opportunities for Pakistan.';
    const defaultImage = '/og-image.jpg';
    const siteUrl = 'https://properpakistan.com';

    const seoTitle = title ? `${title} | ProperPakistan.com` : defaultTitle;
    const seoDescription = description || defaultDescription;
    const seoImage = image || defaultImage;
    const seoUrl = url || siteUrl;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="title" content={seoTitle} />
            <meta name="description" content={seoDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={seoUrl} />
            <meta property="twitter:title" content={seoTitle} />
            <meta property="twitter:description" content={seoDescription} />
            <meta property="twitter:image" content={seoImage} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <link rel="canonical" href={seoUrl} />
        </Helmet>
    );
};

export default SEO;
