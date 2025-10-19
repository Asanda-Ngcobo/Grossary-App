import Image from 'next/image'
import Logo1 from '@/public/logo.png'

function Loading() {
  return (
    <div className="flex flex-col justify-center items-center absolute inset-0 z-10 bg-[#041527]  w-full h-full">
      <Image src={Logo1} width={150} alt="Grossary logo" className="mb-6" />
      <h1 className={` text-[24px] font-semibold ml-3.5 text-center text-white`}>Plan, Shop, Save.</h1>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#EDE734]"></div>
    </div>
  )
}

export default Loading
