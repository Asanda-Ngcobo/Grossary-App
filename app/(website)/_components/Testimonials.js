'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import TestimonialBunner from "./TestimonialBunner";
const testimonials = [
    {testimonial: `Meal prep used to be chaos. 
        Now i stay on top of my list and budget every week`,
        name: 'Lerato',
        age: 25,
        occupation: 'Digital Marketer',
        id:1
    },
    {testimonial: `I love how simple it is, 
        it keeps me within budget, even during tight month`,
        name: 'Sibusiso',
        age: 27,
        occupation: 'Electrical Engineer',
        id:2
    },
    {testimonial: `Between school lunches, weekend meals and snacks, my grocery list is always long.
         Grossary makes it easy to keep track of everything when evry cent counts`,
        name: 'Thandi',
        age: 36,
        occupation: 'Mother of 2, Project Manager',
        id:3
    },
    {testimonial: `As a university student on a tight NSFAS budget, Grossary has become my weekly lifesaver.
          I just input my list, and it tells me where to shop without going over budget.
          It’s like having a personal shopper that actually understands my financial situation.`,
       name: 'Zanele M',
       age: 21,
       occupation: 'Third year Student, UKZN',
       id:3
   },
]
function Testimonials() {
    return (
        <div className="w-full bg-[#041527]">
            <h1 className="text-[20px] font-bold mb-8 text-center text-[#A2B06D]">What Are Our users Saying?</h1>
              <Carousel showThumbs={false}
              autoPlay
              infiniteLoop
              interval={10000}
              showArrows={false}
              showStatus={false}>
                {testimonials.map(function(testimonial){
                    return <TestimonialBunner usertestimonial={testimonial} key={testimonial.id}/>
                })}
               
            </Carousel>
        </div>
    )
}

export default Testimonials
