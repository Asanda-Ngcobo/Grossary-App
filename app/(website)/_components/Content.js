import { Lexend_Deca, Quicksand } from "next/font/google";
import Image from "next/image"
import Link from "next/link"

const ButtonFont = Lexend_Deca({
  subsets: ["latin"],
  display: 'swap',
});

const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});
function Content({ content}) {
 
  const isOdd = content.id === 1 || content.id === 3; // target the second object

  return (
    <div className={`p-4 sm:flex sm:gap-30 lg:gap-40 xl:gap-30
     items-center ${isOdd ? 'sm:flex-row-reverse' : ''}`}>
      {/* Image section */}
      <div className="sm:w-1/2">
        <Image src={content.image} alt="shopping list" className="
        w-[250px]
        sm:w-[500px]
         h-auto object-cover rounded-3xl" />
       <span className={` -mt-[40%] 
         md:-mt-[25%] lg:-mt-[23%]
          xl:-mt-[18%] absolute ${isOdd ? ' md:-ml-[10%] ml-[35%] absolute':
           ' sm:ml-[20%] ml-[35%] absolute'}`}> {content.bunner} </span>
      </div>

      {/* Text section */}
      <div className="sm:w-1/2">
        <h2 className={`font-semibold text-[30px] py-2 ${HeaderFont.className}`}>
          {content.heading}</h2>
        <p className="mb-2 w-[full] md:w-[50%]">{content.description}</p>
        {/* <Link href={content.link} className="text-[#A2B06D] flex items-center ">
        <button className={`${ButtonFont.className} border border-[#041527] p-2 cursor-pointer hover:bg-gray-300`}>
Learn More 
        </button>
          
        </Link> */}
        
      </div>
    </div>
  );
}

export default Content;

