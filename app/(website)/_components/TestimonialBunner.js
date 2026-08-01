"use client";

function TestimonialBunner({ usertestimonial }) {
  return (
    <div className="px-4 md:px-8 py-2 mt-4">
      
      <div className=" hover:shadow-md transition-all duration-300 p-6 md:p-8">
        
        {/* Quote */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed flex flex-col">
          <span>“{usertestimonial.testimonial}”</span>
          <span>{usertestimonial.name}</span>
          <span> {usertestimonial.occupation}</span>
        </p>

        {/* Divider */}
        {/* <div className="mt-6 mb-4 h-px bg-gray-100" /> */}

        {/* User Info */}
        {/* <div className="flex items-center justify-between text-center">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {usertestimonial.name}
            </h3>
            <p className="text-xs text-gray-500">
              {usertestimonial.occupation}
            </p>
          </div>

       
        </div> */}
      </div>
    </div>
  );
}

export default TestimonialBunner;