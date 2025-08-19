

import BuildFor from "@/app/(website)/_components/BuildFor";

import HomeGrossaryPlus from "@/app/(website)/_components/HomeGrossaryPlus";
import HomeImage from "@/app/(website)/_components/HomeImage";

import PlanningAhead from "@/app/(website)/_components/PlanningAhead";
import ShoppingReimagined from "@/app/(website)/_components/ShoppingReimagined";
import Testimonials from "@/app/(website)/_components/Testimonials";

export const metadata = {
  title: "Plan, Shop, Save more | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};

export default function Home() {
  return (
    <main className="pt-35">
           <HomeImage/>
   <PlanningAhead/>
   {/* <HomeGrossaryPlus/> */}
   <BuildFor/>
   <Testimonials/>
   <ShoppingReimagined/>

    </main>

   
     
 
    
   

     
    
  );
}


 
