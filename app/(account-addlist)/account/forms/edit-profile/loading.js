
import Spinner from "@/app/(website)/_components/Spinner"

function loading() {
    return (
       <section className="flex flex-col justify-center items-center w-[80%]
              h-[80vh] mx-[10%]">
       
      <Spinner/>
      </section>
    )
}

export default loading
