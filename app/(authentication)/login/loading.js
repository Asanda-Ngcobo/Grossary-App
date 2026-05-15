
import Spinner from "@/app/(website)/_components/Spinner"
import Logo from "@/app/icon.png"
import Image from "next/image"
function Loading() {
    return (
       <section className="flex flex-col z-10 bg-white justify-center
        items-center w-screen
              h-[90vh]">
           <Image src={Logo} width={100} alt="Grossary Logo"/>        
      <Spinner/>
      </section>
    )
}

export default Loading
