import { auth } from "@/app/_lib/auth";

import { getUserById } from "@/app/_lib/data-services";

import { Lexend_Deca } from "next/font/google";
 import SubscriptionDropdown from "../account/profile/Unsubscribe";
import SubscribeButton from "../account/profile/SubscribeButton";


const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

export default async function GrossaryPlusButton() {
  const session = await auth();
  const user = await getUserById(session?.user?.id);
  const subscriber = user?.is_plus;

  return (
    <div>
      {subscriber === false ? (
      <SubscribeButton/>
      ) : (
       <SubscriptionDropdown/>
      )}
    </div>
  );
}
