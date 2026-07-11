'use client'
import { useForm } from "@/app/providers/Provider";
import MenuContent from "./MenuContent"


function Menu() {
     const {menuOpen, toggleMenu} = useForm();
    return (
   <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all
         duration-300 z-50 ${
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={toggleMenu}
    >
 <div
        className="bg-white h-full w-[90%] ml-[10%] rounded-l-3xl
        overflow-y-scroll  no-scrollbar lg:w-[25%] shadow-xl lg:ml-[75%] p-4"
        onClick={(e) => e.stopPropagation()}
      >
    <MenuContent onToggle={toggleMenu}
  />
            
            </div>
        </div>
        
    )
}

export default Menu


