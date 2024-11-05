import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar/navbar';
import { RoleProvider } from '../app/context/roleProvider';
import { UserProvider } from '../app/context/currentUser';

function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </UserProvider>
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