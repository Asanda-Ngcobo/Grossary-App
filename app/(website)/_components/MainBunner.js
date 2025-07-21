
import { Nunito_Sans } from "next/font/google";


const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

function MainBunner({children}) {
    return (
        <div className={`${MainFont.className} sm:w-[60%]`}>
          {children}
            
        </div>
    )
}

export default MainBunner
