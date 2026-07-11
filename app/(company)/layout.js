import { Nunito_Sans } from "next/font/google";
import "../globals.css";
import Navigation from "@/app/(website)/_components/Navigation";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

import { FormProvider } from "@/app/providers/Provider";
import Menu from "@/app/(website)/_components/MenuComp";
import Footer from "../(website)/_components/Footer";

const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
              <head>
       
  <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JW5VT5KYJX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JW5VT5KYJX');
          `}
        </Script>
      </head>
      <body
        className={`${MainFont.className} gap-6`}
      >
          <FormProvider>
                <Navigation/>
                 <Menu/>
             <div className=" ">
              
              <div> {children}</div>
              <Footer/>
             </div>
          </FormProvider>
    
       
          
              
      
        <Analytics/>
      </body>

    </html>
  );
}
