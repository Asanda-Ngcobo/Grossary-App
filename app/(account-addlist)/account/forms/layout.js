import { Nunito_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";





const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function FormsLayout({ children }) {

  return (
    <html>
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
        className={`${MainFont.className} bg-[#041527] text-white h-screen 
        gap-12`}
      >
         <Toaster position="top-center" 
         reverseOrder={false}
            toastOptions={{
            style: {
              zIndex: 9999, // Ensure it's on top
            },
          }} />
        <div>{children}</div>
        
         
        
        
        
      </body>

    </html>

  
     

   
  );
}
