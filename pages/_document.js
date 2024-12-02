import Document, { Html, Head, Main, NextScript } from 'next/document';


/**
 * Custom Next.js Document
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Customizes the HTML structure of the application, including the `<html>` and `<body>` tags.
 * Used to add global settings, fonts, and meta tags across all pages.
 *
 * @features
 * - Sets the `lang` attribute for improved accessibility and SEO.
 * - Includes a favicon for browser tab representation.
 * - Preloads and connects to Google Fonts for optimized performance.
 * - Applies global styles or scripts using the `<Head>` component.
 * - Prevents scrollbars with the `no-scrollbar` class on the `<body>` element.
 *
 * @notes
 * - This file is rendered only on the server side and does not affect client-side rendering.
 * - The `no-scrollbar` class must be defined in your global CSS to remove scrollbars.
 *
 * @returns {React.ReactElement} A custom Document component for the application.
 */

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/webLogo.ico" />
          {/* Add any global styles or scripts here */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap"
            rel="stylesheet"
          />
          <link href="https://fonts.googleapis.com/css2?family=Delius+Swash+Caps&family=Marck+Script&display=swap" rel="stylesheet"/>
        </Head>
        <body className="no-scrollbar">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;