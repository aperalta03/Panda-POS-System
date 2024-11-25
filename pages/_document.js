import Document, { Html, Head, Main, NextScript } from 'next/document';

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