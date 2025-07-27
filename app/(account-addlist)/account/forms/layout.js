import { Nunito_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";





const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function FormsLayout({ children }) {

  return (
    <html>
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
