"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarClock,
  ChevronRight,
  HandCoins,
  LayoutGrid,
  LogOut,
  PiggyBank,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import SettingsModal from "./SettingsModal";

export default function SideNav() {
  const userButtonRef = useRef(null);
  const menuLinks = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budgets",
      icon: Banknote,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Income",
      icon: BanknoteArrowUp,
      path: "/dashboard/income",
    },
    {
      id: 4,
      name: "Expenses",
      icon: BanknoteArrowDown,
      path: "/dashboard/expenses",
    },
    {
      id: 5,
      name: "Debts",
      icon: HandCoins,
      path: "/dashboard/debts",
    },
    {
      id: 6,
      name: "Upcoming",
      icon: CalendarClock,
      path: "/dashboard/upcoming",
    },
    {
      id: 7,
      name: "Goals",
      icon: PiggyBank,
      path: "/dashboard/goals",
    },
  ];
  const currentLinkHighlight = usePathname();

  useEffect(() => {
  }, [currentLinkHighlight]); // This effect runs when the current link is changed

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  return (
    <div className="lg:w-48 w-fit md:block h-full">
      <div className="h-full p-5 border-r shadow-md bg-gray-100 font-semibold">
        <div className="lg:hidden">
          <button onClick={toggleNavbar} className={`scale-125 hover:scale-150 transition-all duration-300 ${isNavbarExpanded ? "rotate-0" : "rotate-180"}`}><ChevronRight /></button>
        </div>
        <div className="pt-10 flex flex-col gap-1">
          {menuLinks.map((menu, index) => (
            <Link key={index} href={menu.path} className="">
              <h2
                className={`flex flex-row ${isNavbarExpanded ? "justify-center lg:justify-start" : ""}  gap-5
                            items-center py-2 cursor-pointer hover:text-purple-500 ${currentLinkHighlight === menu.path && "text-purple-700"}`}
              >
                <menu.icon />
                <span
                  className={`${
                    isNavbarExpanded ? "hidden" : "inline"
                  } lg:inline`}
                >
                  {menu.name}
                </span>
              </h2>
            </Link>
          ))}
          <SettingsModal isNavbarExpanded={isNavbarExpanded} />
        </div>
      </div>
    </div>
  );
}


