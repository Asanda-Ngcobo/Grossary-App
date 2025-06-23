import { ChevronDown, ChevronUp } from "@deemlol/next-icons";
import { Nunito_Sans } from "next/font/google";



const MainFont = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
function NavigationButtons({ children }) {
    return (
        <button
            className={`group ${MainFont.className} bg-white min-w-[130px] flex flex-row justify-center items-center
            gap-2 h-[40px] rounded-[20px] text-black font-semibold cursor-pointer
            hover:bg-[#f1f0f0]`}
        >
            {children}
            <span className="hidden md:flex group-hover:hidden  ">
                <ChevronDown size={16} />
            </span>
            <span className="hidden group-hover:flex ">
                <ChevronUp size={16} />
            </span>
        </button>
    );
}


export default NavigationButtons