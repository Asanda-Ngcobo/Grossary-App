import Image from "next/image"
import Link from "next/link"


function Content({ content}) {
 
  const isSecond = content.id === 1; // target the second object

  return (
    <div className={`p-4 sm:flex sm:gap-6 items-center ${isSecond ? 'sm:flex-row-reverse' : ''}`}>
      {/* Image section */}
      <div className="sm:w-1/2">
        <Image src={content.image} alt="shopping list" className="w-full h-auto object-cover rounded-3xl" />
      </div>

      {/* Text section */}
      <div className="sm:w-1/2">
        <h2 className="font-semibold text-[24px] py-2">{content.heading}</h2>
        <p className="mb-2">{content.description}</p>
        {/* <Link href={content.link} className="text-[#A2B06D] underline flex items-center">
          Learn More &rarr;
        </Link> */}
      </div>
    </div>
  );
}

export default Content;

