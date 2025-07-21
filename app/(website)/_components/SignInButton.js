import { Lexend_Deca } from "next/font/google";



const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});
function SignInButton() {
    return (
        <button className={`${ButtonFont.className} bg-white w-[100px]
         h-[40px] rounded-[20px]
         text-[14px]
         font-semibold
         cursor-pointer
         border
         border-gray-300
         hover
         hover:border-gray-400`}>
            Account
        </button>
    )
}

export default SignInButton
