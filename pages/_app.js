import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar/navbar';
import { RoleProvider } from '../app/context/roleProvider';
import { UserProvider } from '../app/context/currentUser';
import { OrdersProvider } from '../app/context/ordersContext';
import { useRouter } from 'next/router';
import { GlobalStateProvider } from  '../app/context/GlobalStateContext';
function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <UserProvider>
        <OrdersProvider>
          <GlobalStateProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GlobalStateProvider>
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