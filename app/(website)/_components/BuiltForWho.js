'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import UserOne from '@/public/Cool Student.png';
import Thabo from '@/public/Thabo.png';
import Ayanda from '@/public/Ayanda.png';
import Nomsa from '@/public/Nomsa.png';
import The_Dlaminis from '@/public/The Dlaminis.png';
import Vusi from '@/public/Vusi.png';
import BuildFor from "./BuildFor";

const potentials = [
  {
    image: UserOne,
    name: 'Lerato',
    age: 25,
    occupation: 'Digital Marketer',
    budget: 2000,
    id: 1,
    goals: [
      'Never forget essentials when shopping',
      'Stay under budget',
      'Keep track of monthly spending'
    ],
    frustrations: [
      'Often forgets essentials like toothpaste or snacks',
      'Shops without tracking totals until checkout',
      'Has no clear idea of how much she spends monthly on groceries'
    ],
    grossaryProvides: [
      'Smart lists that help her remember essentials',
      'Real-time budget tracking to avoid overspending',
      'A monthly overview of grocery and personal care expenses'
    ]
  },
  { 
    image: Thabo,
    name: 'Thabo',
    age: 21,
    occupation: 'University Student',
    budget: 1200,
    id: 2,
    goals: [
      'Stretch NSFAS funds to last the month',
      'Compare prices between stores',
      'Buy healthy but affordable groceries'
    ],
    frustrations: [
      'Runs out of grocery money before month-end',
      'Finds it hard to track spending while shopping',
      'Buys unnecessary snacks without realizing it'
    ],
    grossaryProvides: [
      'Price tracking and budgeting tools that help him stay on top of spending',
      'Smart list suggestions based on essentials',
      'A clear overview of how much each shopping trip costs in real time'
    ]
  },
  {
     image: Ayanda,
    name: 'Ayanda & Sipho',
    age: 28,
    occupation: 'Young Couple with 1 Child',
    budget: 4000,
    id: 3,
    goals: [
      'Plan groceries and baby supplies efficiently',
      'Avoid midweek store runs for forgotten items',
      'Keep household expenses balanced'
    ],
    frustrations: [
      'Often overspend on baby products and snacks',
      'Forget small but important items like nappies or wipes',
      'Struggle to split grocery costs fairly between them'
    ],
    grossaryProvides: [
      'Shared grocery lists to plan together',
      'Reminders for recurring essentials',
      'Detailed spending breakdown for transparency and budgeting'
    ]
  },
  {
     image: Nomsa,
    name: 'Nomsa',
    age: 34,
    occupation: 'Single Mom & Teacher',
    budget: 3500,
    id: 4,
    goals: [
      'Feed her kids healthy meals within a tight budget',
      'Shop efficiently without wasting time',
      'Track how much she spends on groceries monthly'
    ],
    frustrations: [
      'Struggles to stay within her grocery budget',
      'Feels stressed when prices go up unexpectedly',
      'Often forgets what’s already in the pantry'
    ],
    grossaryProvides: [
      'Price comparison insights to help her shop smarter',
      'Smart lists to keep her organized and avoid duplicates',
      'A clear monthly report of grocery spending'
    ]
  },
  {
     image: The_Dlaminis,
    name: 'The Mokoena Family',
    age: 42,
    occupation: 'Working Parents of 4',
    budget: 7000,
    id: 5,
    goals: [
      'Buy in bulk to save money',
      'Keep track of shared grocery needs',
      'Avoid wasting food and overspending'
    ],
    frustrations: [
      'Kids add random things to the cart',
      'Struggles to track what’s already in the pantry',
      'Grocery bills fluctuate every week'
    ],
    grossaryProvides: [
      'Bulk shopping and pantry tracking features',
      'Shared family lists that sync across users',
      'Real-time family budgeting to stay on target'
    ]
  },
  {
     image: Vusi,
    name: 'Vusi',
    age: 30,
    occupation: 'Fitness Enthusiast & Gym-goer',
    budget: 2500,
    id: 6,
    goals: [
      'Stick to a grocery budget',
      'Buy consistent, healthy groceries weekly',
      'Track how much his diet actually costs'
    ],
    frustrations: [
      'Buys too many snacks instead of healthy foods',
      'Forgets essentials like eggs or oats',
      'Overspends without realizing it'
    ],
    grossaryProvides: [
      'Weekly grocery list tracking',
      'Category sorting for fitness-based groceries',
      'Budget insights for optimizing grocery costs'
    ]
  }
];




export default function BuiltForWho() {
  return (
    <div className="w-full h-[100vh]">
     
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={10000}
        showArrows={true}
        showStatus={false}
      >
          {potentials.map(function(potential){
                    return <BuildFor userinfo={potential} key={potential.id}/>
                })}
      </Carousel>
    </div>
  );
}
