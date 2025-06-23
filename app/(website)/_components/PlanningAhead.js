
import ShoppingList from "@/public/shopping list.jpg"
import Budgeting from "@/public/budgeting.jpg"

import Content from "./Content";


const contents = [
    {id: 1,
        image: ShoppingList,
        heading: 'Plan Ahead with Precision',
        description: `Add everything you need as you remember, 
        from staples to treats. No more forgetting items or doubling up.`,
        link: '/planning-ahead'
    },
    {id: 2,
        image: Budgeting,
        heading: 'Set Your Budget & Stick to it',
        description: `Choose your weekly or monthly grocery limit. 
        Grossary can help you stay within your budget without sacrificing essentials`,
        link: '/staying-under-budget'
    },
    
]
function PlanningAhead() {
    return (
        <>
          <div className="w-[90%] ml-[5%] sm:w-[80%] sm:ml-[10%] ">
            {contents.map(function(content){
                return <Content content={content} 
                key={content.id}/>
            })}
      
        </div>
       
       
        </>
      
    )
}

export default PlanningAhead
