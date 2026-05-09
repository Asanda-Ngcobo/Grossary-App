
import ShoppingList from "@/public/shopping list.jpg"
import Budgeting from "@/public/budgeting.jpg"
import Shopping from "@/public/Student medium.jpg"
import Cards from '@/public/Loyality-programs-in-South-Africa.jpg'

import Content from "./Content";
import TertiaryBunner from "./TertiaryBunner";

import AddListMockUp from "./AddListMockUp";
import FinishedShoppingBunner from "./FinishedShoppingBunner";
import TrackingPrices from "./TrackingPrices";
import LoyaltyCardsClient from "./LoyaltyCardsClient";


const contents = [
    {id: 1,
        image: ShoppingList,
        heading: 'Plan Ahead with Precision',
        description: `Add everything you need as you remember, 
        from staples to treats. No more forgetting items or doubling up.`,
        link: '/features/planning-ahead',
        bunner: <TertiaryBunner>
           <AddListMockUp/>
        </TertiaryBunner>
    },

      {id: 2,
        image: Shopping,
        heading: 'Track Prices as You Shop',
        description: `Input item prices on the go and see your total update in real-time. 
        Know what you’re spend before you hit the till.`,
        link: '/features/staying-under-budget',
        bunner: <TertiaryBunner>
            <TrackingPrices/>
        </TertiaryBunner>
    },
    
    {id: 3,
        image: Budgeting,
        heading: 'Set Your Budget & Stick to it',
        description: `You know your weekly or monthly grocery budget limit. 
        Grossary can help you stay within your budget for every grocery trip`,
        link: '/features/staying-under-budget',
        bunner: <TertiaryBunner>
            <FinishedShoppingBunner/>
        </TertiaryBunner>
    },
       {id: 4,
        image: Cards,
       heading: "All Your Loyalty Cards, Always Within Reach",
description:
  "Never lose out on savings again. Access your loyalty cards instantly in Grossary and make sure every shop counts toward your rewards.",
        link: '/features/loyalty-cards',
        bunner: <TertiaryBunner>
            <LoyaltyCardsClient/>
        </TertiaryBunner>
    },
]
function PlanningAhead() {
    return (
        <>
          <div className="w-[90%] ml-[5%] sm:w-[90%] sm:ml-[5%] ">
            {contents.map(function(content){
                return <Content content={content} 
                key={content.id}/>
            })}
      
        </div>
       
       
        </>
      
    )
}

export default PlanningAhead
