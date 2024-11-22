import "../app/globals.css";
import styles from "./_app.module.css";
import Navbar from "../app/components/navbar/navbar";
import AiAgent from "@/app/components/agent/ai-agent";
import { RoleProvider } from "../app/context/roleProvider";
import { UserProvider } from "../app/context/userProvider";
import { TranslationProvider } from "@/app/context/translateContext";
import { useRouter } from "next/router";
import { GlobalStateProvider } from "../app/context/GlobalStateContext";

function MyApp({ Component, pageProps }) {
  return (
    <RoleProvider>
      <UserProvider>
        <TranslationProvider>
          <GlobalStateProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </GlobalStateProvider>
        </TranslationProvider>
      </UserProvider>
    </RoleProvider>
  );
}

const Layout = ({ children }) => {
  const router = useRouter();
  const showNavbar =
    router.pathname === "/landing" ||
    router.pathname === "/cashier" ||
    router.pathname === "/manager" ||
    router.pathname === "/kitchen" ||
    router.pathname === "/kitchenTV" ||
    router.pathname === "/menu";

  const showAI =
    router.pathname === "/kiosk" ||
    router.pathname === "/kiosk_item" ||
    router.pathname === "/kiosk_bowl" ||
    router.pathname === "/kiosk_plate" ||
    router.pathname === "/kiosk_bigger_plate" ||
    router.pathname === "/kiosk_a_la_carte";

  return (
    <div className={styles.layoutContainer}>
      {showNavbar && (
        <div className={styles.navbarContainer}>
          <Navbar />
        </div>
      )}
      {showAI && (
        <AiAgent />
      )}
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

export default MyApp;
