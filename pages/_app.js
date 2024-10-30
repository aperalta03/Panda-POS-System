import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar';
import { RoleProvider } from '../app/context/roleProvider';

function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RoleProvider>
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