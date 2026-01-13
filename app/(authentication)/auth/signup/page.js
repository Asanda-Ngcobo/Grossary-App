
import SocialAuth from "../../SocialAuth";
import SignUpForm from "./SignUpform";


export const metadata = {
  title: "Sign Up | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
     
        <SocialAuth/>

      </div>
  
      
   
  );
}
