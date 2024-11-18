import '../app/globals.css';
import styles from './_app.module.css';
import Navbar from '../app/components/navbar/navbar';
import { RoleProvider } from '../app/context/roleProvider';
import { UserProvider } from '../app/context/userProvider';
import { useRouter } from 'next/router';
import { GlobalStateProvider } from  '../app/context/GlobalStateContext';
function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <UserProvider>
        <GlobalStateProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GlobalStateProvider>
      </UserProvider>
    </RoleProvider>
  );
}

const Layout = ({ children }) => {
  const router = useRouter();
  const showNavbar =  router.pathname === '/landing' || 
                      router.pathname === '/cashier' || 
                      router.pathname === '/manager' || 
                      router.pathname === '/kitchen' || 
                      router.pathname === '/kitchenTV' || 
                      router.pathname === '/menu';

  return (
    <div className={styles.layoutContainer}>
      {showNavbar && (
        <div className={styles.navbarContainer}>
          <Navbar />
        </div>
      )}
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

export default MyApp;