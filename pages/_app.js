import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

const Layout = ({ children }) => {

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

export default MyApp;