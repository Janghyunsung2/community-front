import Head from 'next/head';

export default function SEOHead() {
  return (
    <Head>
      <meta name="description" content="온더잇 커뮤니티 사이트" />
      <meta name="keywords" content="커뮤니티, 채팅, 개발" />
      <meta name="author" content="장현성" />

      <meta property="og:title" content="온더잇" />
      <meta property="og:description" content="커뮤니티 사이트" />
      <meta property="og:image" content="https://ontheit.site/thumbnail.jpg" />
      <meta property="og:url" content="https://ontheit.site" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="온더잇" />
      <meta name="twitter:description" content="커뮤니티 사이트" />
      <meta name="twitter:image" content="https://ontheit.site/thumbnail.jpg" />
    </Head>
  );
}
