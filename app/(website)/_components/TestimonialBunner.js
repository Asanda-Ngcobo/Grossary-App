"use client";

function TestimonialBunner({ usertestimonial }) {
  return (
    <div className="px-4 md:px-8 py-6">
      
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8">
        
        {/* Quote */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          “{usertestimonial.testimonial}”
        </p>

        {/* Divider */}
        <div className="mt-6 mb-4 h-px bg-gray-100" />

        {/* User Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {usertestimonial.name}
            </h3>
            <p className="text-xs text-gray-500">
              {usertestimonial.occupation}
            </p>
          </div>

          {/* subtle fintech badge */}
          <span className="text-xs px-3 py-1 rounded-full bg-[#ACF532]/10 text-[#6B8E23] font-medium">
            Verified user
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialBunner;