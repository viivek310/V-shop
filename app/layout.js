import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWrapper from "./components/SessionWrapper";
import { CartWrapper } from "./context/context"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "V-shop",
  description: "a shopping website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <SessionWrapper>
          <CartWrapper> 
            <Navbar />
            {children}
            <Footer />
          </CartWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
