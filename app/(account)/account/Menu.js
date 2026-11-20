'use client';

import { useEffect } from "react";
import { X } from "@deemlol/next-icons";
import { useForm } from "../../providers/Provider";
import SignOutButton from "../../(authentication)/signOutButton";
import Profile from "../_ui/Profile";

// Each entry holds a component, not pre-rendered JSX, so adding items is simple.
// Add more like: { id: 3, Component: Privacy }
const menuItems = [
  { id: "profile", Component: Profile },
  { id: "sign-out", Component: SignOutButton },
];

function Menu() {
  const { menuOpen, toggleMenu } = useForm();

  // Close on Escape + lock page scroll while the menu is open
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") toggleMenu();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, toggleMenu]);

  return (
    <div
      // Tapping the dark backdrop closes the menu
      onClick={toggleMenu}
      aria-hidden={!menuOpen}
      className={`
        fixed inset-0 z-40
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-300
        ${menuOpen
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"}
      `}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        // Stop clicks inside the panel from closing it
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-[80%] max-w-sm lg:w-[30%] min-h-[20vh]
          rounded-xl bg-[#e7eeea] px-4 pb-4 pt-12 shadow-xl
          transition-transform duration-300
          ${menuOpen ? "scale-100" : "scale-95"}
        `}
      >
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Close menu"
          className="
            absolute right-2 top-2
            flex h-9 w-9 items-center justify-center
            rounded-full text-gray-600
            transition hover:bg-black/5 active:bg-black/10
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0B2E1E]
          "
        >
          <X size={20} />
        </button>

        <ul className="flex flex-col gap-1">
          {menuItems.map(({ id, Component }) => (
            <li
              key={id}
              className="flex cursor-pointer items-center justify-between rounded-md p-2
                transition hover:bg-black/5 active:font-bold"
            >
              <span className="flex gap-2.5">
                <Component />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Menu;