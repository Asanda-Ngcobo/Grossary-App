
import ShoppingList from "@/public/shopping list.jpg"
import Budgeting from "@/public/budgeting.jpg"
import Shopping from "@/public/Student medium.jpg"

import Content from "./Content";
import TertiaryBunner from "./TertiaryBunner";

import AddListMockUp from "./AddListMockUp";
import FinishedShoppingBunner from "./FinishedShoppingBunner";
import TrackingPrices from "./TrackingPrices";


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
        link: '/staying-under-budget',
        bunner: <TertiaryBunner>
            <TrackingPrices/>
        </TertiaryBunner>
    },
    
    {id: 3,
        image: Budgeting,
        heading: 'Set Your Budget & Stick to it',
        description: `Choose your weekly or monthly grocery limit. 
        Grossary can help you stay within your budget without sacrificing essentials`,
        link: '/staying-under-budget',
        bunner: <TertiaryBunner>
            <FinishedShoppingBunner/>
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
