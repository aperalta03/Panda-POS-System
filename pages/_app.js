import "../app/globals.css";
import styles from "./_app.module.css";
import Navbar from "../app/components/navbar/navbar";
import AiAgent from "@/app/components/agent/ai-agent";
import { RoleProvider } from "../app/context/roleProvider";
import { UserProvider } from "../app/context/userProvider";
import { TranslationProvider } from "@/app/context/translateContext";
import { useRouter } from "next/router";
import { GlobalStateProvider } from "../app/context/GlobalStateContext";

/**
 * @description
 * The root component for the application, wrapping all pages with global providers and layout components.
 * 
 * @author Everyone
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.Component} props.Component - The current page component being rendered.
 * @param {object} props.pageProps - Props passed to the current page component.
 * 
 * @returns {React.ReactElement} The MyApp component, rendering the specified page and layout.
 *
 * @example
 * <MyApp Component={HomePage} pageProps={{ title: "Home" }} />
 *
 */
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

/**
 * Layout Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * A wrapper for all pages, dynamically displaying a `Navbar` or `AiAgent` based on the current route.
 *
 * @features
 * - Displays `Navbar` for management and operational views.
 * - Displays `AiAgent` for kiosk-related views.
 * - Provides a flexible layout for rendering page content.
 *
 * @props
 * - `children`: The content of the current page.
 *
 * @hooks
 * - `useRouter`: Determines the current route to conditionally display `Navbar` or `AiAgent`.
 *
 * @example
 * <Layout>
 *   <HomePage />
 * </Layout>
 */


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
