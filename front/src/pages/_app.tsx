import 'bootstrap/dist/css/bootstrap.min.css';
import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/src/context/AuthContext";
import { useRouter } from 'next/router';
import { NavbarSelector } from '../components/NavBar/NavBarSelector';

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const semNavbar = ["/"];

  const mostrarNavbar = !semNavbar.includes(router.pathname);
  
  return (
    <AuthProvider>
      {mostrarNavbar && <NavbarSelector />}
      <Component {...pageProps} />
    </AuthProvider>
  )
}
