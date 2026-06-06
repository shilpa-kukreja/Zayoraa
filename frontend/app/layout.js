import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./frontend/context/AppContext";
import WishlistPopup from "./frontend/components/WishlistPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Zayoraa",
  description: "Crafting Confidence Through Better Oral Care",
  icons: {
    icon: "/logo/logo2.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ToastContainer />
        <AppContextProvider>
        {children}
        <WishlistPopup/>
        </AppContextProvider>
        {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
        <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}
