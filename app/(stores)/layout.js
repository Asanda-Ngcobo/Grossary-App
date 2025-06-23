

import { Nunito_Sans } from "next/font/google";
import "../globals.css";


const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function ForStoresLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={`${MainFont.className}`}
      >
        {children}
       
      </body>

    </html>
  );
}
