'use client'
import { Menu, Plus } from "@deemlol/next-icons";
import { useState } from "react";
import MobileMenu from "./MobileMenu";




function MenuBar() {
    const [showMenu, setShowmenu] = useState(false)
    function displayMenu(){
        setShowmenu(!showMenu)
    }
    return (
      <>
        <button
            className="flex items-center justify-center rounded-full bg-[#D9D9D9] h-[40px] w-[40px]"
            onClick={displayMenu}
        >
            {!showMenu ? <Menu /> : <span className="rotate-45"><Plus/></span>}
        </button>
        <MobileMenu handleDisplayMenu={displayMenu} showMenu={showMenu}/>
        </>
    );
}

export default MenuBar;

