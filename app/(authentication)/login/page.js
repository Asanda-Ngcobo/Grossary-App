

import LoginAuth from './LoginAuth';

export const metadata = {
  title: "Login | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
export default function SignInForm() {
 

  return (
 
    <div className="w-screen h-screen flex justify-center items-center">
      <LoginAuth/>
    </div>
    
  );
}
