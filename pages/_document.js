import Document, { Html, Head, Main, NextScript } from 'next/document';


/**
 * @description
 * Customizes the HTML structure of the application, including the `<html>` and `<body>` tags.
 * Used to add global settings, fonts, and meta tags across all pages.
 * 
 * @author Alonso Peralta Espinoza
 *
 * @returns {React.ReactElement} A custom Document component for the application.
 *
 * @example
 * // Usage example
 * import Document from './_document';
 *
 * function MyApp({ Component, pageProps }) {
 *   return (
 *     <Document>
 *       <Component {...pageProps} />
 *     </Document>
 *   );
 * }
 *
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