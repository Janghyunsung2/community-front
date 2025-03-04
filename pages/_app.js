import "@/styles/globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout"; // default export 확인
import SEOHead from "@/components/SEOHead";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // const noLayoutPages = ["/login", "/register"];

  // if (noLayoutPages.includes(router.pathname)) {
  //   return (
  //     <AuthProvider>
  //       <Component {...pageProps} />
  //     </AuthProvider>
  //   );
  // }

  return (
  

    <AuthProvider>
      <Layout>
        <head>
          <title>온더잇</title>
        </head>
        <SEOHead />
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}
