import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import Navigation from "@/app/(website)/_components/Navigation";
import Footer from "@/app/(website)/_components/Footer";
import { Analytics } from "@vercel/analytics/next"
import GoogleAnalytics from "./_components/Google-Analytics";
import CookieBanner from "./_components/CookieBunner";

const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={`${MainFont.className} gap-6`}
      >
        <Navigation/>
        {children}
              <GoogleAnalytics GA_MEASUREMENT_ID='G-N1QRHN4WSK' /> 
               {/* <CookieBanner />  */}
        <Footer/>
        <Analytics/>
      </body>

    </html>
  );
}
