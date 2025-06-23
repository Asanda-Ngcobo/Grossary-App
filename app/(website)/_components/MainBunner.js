
import { Nunito_Sans } from "next/font/google";


const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

function MainBunner({children}) {
    return (
        <div className={`${MainFont.className} bg-[#04284B] w-[90%] h-[350px] ml-[5%] mt-[230px] absolute rounded-2xl sm:w-[80%]
         sm:h-[320px] sm:mt-[300px] md:mt-[600px] md:w-[80%] md:h-[300px] md:ml-[5%]
         lg:mt-[290px] lg:w-[40%] lg:h-[240px] xl:mt-[500px] 2xl:mt-[400px] xl:w-[30%] xl:h-[280px]
         grid grid-cols-1 grid-rows-3 items-center justify-center 
         p-5  gap-y-15`}>
          {children}
            
        </div>
    )
}

export default MainBunner
