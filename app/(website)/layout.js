import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import Navigation from "@/app/(website)/_components/Navigation";
import Footer from "@/app/(website)/_components/Footer";
import { Toaster } from "react-hot-toast";

const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={`${MainFont.className}`}
      >
        <Navigation/>
        {children}
               
        <Footer/>
      </body>

    </html>
  );
}
