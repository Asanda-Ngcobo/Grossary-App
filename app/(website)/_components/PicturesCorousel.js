'use client'

import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

import ListImage1 from "@/public/List_MockUp.png";
import ListImage2 from "@/public/Old_lists.png";
import ListImage3 from "@/public/Active_Lists.png";
import ListImage4 from "@/public/Old_lists.png";


const pictures = [
  { id: 1, image: ListImage1, alt: "Picture1" },
  { id: 2, image: ListImage2, alt: "Picture2" },
  { id: 3, image: ListImage3, alt: "Picture3" },
  
];

function PicturesCarousel() {
  return (
    <div className="w-full max-w-sm mx-auto mt-10">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={5000}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        swipeable={false}
        stopOnHover={false}
      >
        {pictures.map((picture) => (
          <div key={picture.id} className="flex justify-center">
            <Image
              src={picture.image}
              alt={picture.alt}
              width={380}
              height={450}
              className="rounded-lg object-contain"
              priority
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default PicturesCarousel;
