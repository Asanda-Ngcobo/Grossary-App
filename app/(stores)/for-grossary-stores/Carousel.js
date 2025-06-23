'use client'

import { ChevronLeft, ChevronRight } from "@deemlol/next-icons";
import Display from "./Display";

import Planning from '@/public/planning.jpg'
import Ranking from '@/public/ranking.jpg'


const contents = [
    {image: Planning,
        description: `Our users plan their grocery lists in advance, 
        giving us valuable insights into their intended purchases and budget.`,
        id: 1
    },
    
    {image: Ranking,
        description: `By joining Grossary’s Retail Network, your store specials can be recommended to shoppers based on their lists, budgets, and location. Helping you drive more foot traffic and increase sales.`,
        id: 4
    }
]
   

function Carousel() {
    
    return (
        <>
          <div className="w-[90%] ml-[5%] sm:w-[80%] sm:ml-[10%] ">
            {contents.map(function(content){
                return <Display content={content} 
                key={content.id}/>
            })}
      
        </div>
       
       
        </>
      
    )
}


export default Carousel
