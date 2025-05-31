import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/input-search";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    "Settings",
    "About Podbay",
    "What's New",
    "Podcaster FAQ",
    "Privacy",
    "Terms",
    "Contact & Feedback",
    "Clear Data...",
  ];

  return (
    <header className="h-16 bg-card  flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-card-foreground hidden md:block"
        >
          <ChevronLeft size={20} className="text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-card-foreground hidden md:block"
        >
          <ChevronRight size={20} className="text-white" />
        </Button>
        <Image
          src="/podbay-logo.png"
          width={40}
          height={40}
          alt="Podbay Logo"
          className="block md:hidden mr-1"
        />
      </div>
      <div className="flex-1">
        <div className="relative">
          <InputSearch
            className="w-full bg-background text-white border-transparent focus:bg-background focus:border-[#7C3AED] hover:border-[#7B7BF0] transition-colors"
            style={{ minHeight: 30 }}
          />
        </div>
      </div>
      <div className="flex items-center space-x-3 ml-2 ">
        <Button
          variant="default"
          className="bg-[#456C91] hover:bg-[#456C91]/90 text-white  hidden md:block text-center "
        >
          Log In
        </Button>
        <Button
          variant="default"
          className="bg-[#456C91] hover:bg-[#456C91]/90 text-white hidden md:block text-center"
        >
          Sign Up
        </Button>
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="icon"
            size="icon"
            className="text-muted-foreground"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical size={20} className="text-white" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg z-50 gradient-dropdown">
              <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#7B5FC7]"></div>
              <div className="p-1">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black/10 transition-colors h-10 cursor-pointer p-2"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Handle menu item click here
                        console.log(`Clicked: ${item}`);
                      }}
                    >
                      {item}
                    </button>
                    {(item === "Settings" || item === "Terms") && (
                      <div className="mx-4 my-1">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
