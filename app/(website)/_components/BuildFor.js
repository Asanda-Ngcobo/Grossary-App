import Image from "next/image";
import Organizing from "@/public/Organizing.jpg";
import SaveTime from "@/public/Save time.jpg";
import Smart from "@/public/Smart budgeting.jpg";
import { Quicksand } from "next/font/google";


const contents = [
  {
    id: 1,
    image: Smart,
    heading: "Smart Budgeting",
    description: "Avoid end-of-month and till surprises.",
  },
  {
    id: 3,
    image: Organizing,
    heading: "Effortless Organization",
    description: "Keep your list clear, neat, and always accessible",
  },
  {
    id: 2,
    image: SaveTime,
    heading: "Save Time",
    description: "No more wandering store aisles or second guessing yourself.",
  },
];

const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
function BuildFor() {
  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className={`text-[20px] font-bold mb-8 text-center ${HeaderFont.className}`}>
        Built for Busy Professionals, Parents & Students
      </h1>

      <div className="grid gap-10 lg:grid-cols-3">
        {contents.map((content) => (
          <div
            key={content.id}
            className="flex flex-row lg:flex-col items-center gap-4"
          >
            <div className="w-full lg:h-[200px] lg:w-[200px]">
              <Image
                src={content.image}
                alt={content.heading}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="w-full ">
              <h2 className={`text-[16px] font-bold mb-1 ${HeaderFont.className}`}>{content.heading}</h2>
              <p className="text-[14px] text-gray-700">{content.description}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default BuildFor;
