
import Spinner from "@/app/(website)/_components/Spinner"
import Logo from "@/app/icon.png"
import Image from "next/image"
function loading() {
    return (
       <section className="flex flex-col justify-center items-center w-[80%]
              h-[80vh] mx-[10%]">
           <Image src={Logo} width={100} alt="Grossary Logo"/>        
      <Spinner/>
      </section>
    )
}

export default loading
