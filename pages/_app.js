import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar/navbar';
import { RoleProvider } from '../app/context/roleProvider';
import { UserProvider } from '../app/context/currentUser';
import { OrdersProvider } from '../app/context/ordersContext';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <UserProvider>
        <OrdersProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </OrdersProvider>
      </UserProvider>
    </RoleProvider>
  );
}

const Layout = ({ children }) => {
  const router = useRouter();
  const isKiosk = router.pathname === '/kiosk';

  return (
    <div className={styles.layoutContainer}>
      {!isKiosk && (
        <div className={styles.navbarContainer}>
          <Navbar />
        </div>
      )}
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

export default MyApp;