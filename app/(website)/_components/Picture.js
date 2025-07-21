import Image from "next/image"

function Picture({heropicture}) {
    return (
         <Image src={heropicture}  
                 width={250}
                 height={500}
          
          className=" mr-10 hidden md:flex"  alt="List Mock up" />
    )
}

export default Picture
