import { Lexend_Deca } from "next/font/google";
import Link from "next/link";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export default function SubscriptionDropdown() {
  return (
    <div className="inline-block">
      <select
        className={`${ButtonFont.className} bg-[#04284B] min-w-[100px] h-[35px] px-2 rounded-[20px] text-white font-light cursor-pointer`}
        defaultValue="subscribed"
      >
        <option value="subscribed">Subscribed</option>
        <option value="unsubscribe"><Link>Unsubscribe</Link></option>
      </select>
    </div>
  );
}
