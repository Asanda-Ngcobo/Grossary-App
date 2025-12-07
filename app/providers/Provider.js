'use client';

import { createContext, useContext, useState, useEffect } from "react";

const MenuContext = createContext();

export function FormProvider({ children }) {
  const [formOpen, setFormOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleForm = () => setFormOpen(prev => !prev);
  const toggleActive = () => setActive(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

   // Unified scroll lock effect
  useEffect(() => {
    const anyOpen = formOpen || menuOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [formOpen, menuOpen]);

  return (
    <MenuContext.Provider value={{ formOpen, 
    setFormOpen, toggleForm, 

    active, setActive, toggleActive,
    
    menuOpen, setMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useForm() {
  return useContext(MenuContext);
}
