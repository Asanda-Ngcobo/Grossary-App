'use client'
function TestimonialBunner({usertestimonial}) {
    return (
        <div className="text-white h-[100vh]
         lg:h-[30vh] lg:w-[50%] lg:mx-auto">
            <blockquote className="border-l-4
             border-[#A2B06D] pl-4 italic
              text-gray-700 text-lg">“{usertestimonial.testimonial}“</blockquote>
            <h1 className="mt-2 text-sm text-gray-600">-{usertestimonial.name}, {usertestimonial.age}, {usertestimonial.occupation}. </h1>
            
            
        </div>
    )
}

export default TestimonialBunner
