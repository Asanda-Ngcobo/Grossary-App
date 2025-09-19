"use client";
import { Lexend_Deca } from "next/font/google";
import { useState } from "react";

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
});

const durationOptions = [
  { id: 1, value: 30, label: "Last 30 Days" },
  { id: 2, value: 60, label: "Last 60 Days" },
  { id: 3, value: 90, label: "Last 90 Days" },
  { id: 4, value: 180, label: "Last 180 Days" },
  { id: 5, value: 365, label: "Last 365 Days" },
  { id: 6, value: "all", label: "All Time" },
];

function ReportDuration({ onChange }) {
  const [active, setActive] = useState(30); // ✅ default to 30 days

  const handleClick = (value) => {
    setActive(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="overflow-x-auto no-scrollbar m-2">
      <div className="flex gap-2 w-max">
        {durationOptions.map((time) => (
          <button
            key={time.id}
            onClick={() => handleClick(time.value)}
            className={`${ButtonFont.className} 
              w-[120px] flex justify-center items-center py-3 rounded-[20px] shrink-0
              ${active === time.value ? "bg-[#EDE734] text-black font-semibold" : "bg-amber-50 text-black"}
            `}
          >
            {time.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ReportDuration;
