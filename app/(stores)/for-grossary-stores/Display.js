import Image from "next/image";
import React from "react";

function Display({content}) {
   

    const isSecond = content.id === 1; // target the second object

    return (
      <div className={`p-4 sm:flex sm:gap-6 items-center ${isSecond ? 'sm:flex-row-reverse' : ''}`}>
        {/* Image section */}
        <div className="sm:w-1/2">
          <Image src={content.image} alt="shopping list" className="w-full h-auto object-cover" />
        </div>
  
        {/* Text section */}
        <div className="sm:w-1/2">
        
          <p className="mb-2">{content.description}</p>
          
        </div>
      </div>
    );
}

export default Display;
