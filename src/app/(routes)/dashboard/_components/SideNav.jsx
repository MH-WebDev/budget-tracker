"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarClock,
  HandCoins,
  LayoutGrid,
  LogOut,
  PiggyBank,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import SettingsModal from "./SettingsModal";

export default function SideNav() {
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
    //console.log(currentLinkHighlight)
  }, [currentLinkHighlight]);

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarExpanded(!isNavbarExpanded);
  };

  return (
    <div className="md:w-48 w-fit md:block">
      <div className="h-screen p-5 border-r shadow-md bg-gray-100 font-semibold">
        <div>
          <Button
            variant="ghost"
            className="text-center w-10 md:hidden"
            onClick={toggleNavbar}
          >
            Nav
          </Button>
        </div>
        <div className="pt-10 flex flex-col gap-1">
          {menuLinks.map((menu, index) => (
            <Link key={index} href={menu.path} className="">
              <h2
                className={`flex flex-row ${
                  isNavbarExpanded ? "justify-center md:justify-start" : ""
                }  gap-5
                            items-center py-2 cursor-pointer hover:text-purple-500
                            ${
                              currentLinkHighlight === menu.path &&
                              "text-purple-700"
                            }
                            `}
              >
                <menu.icon />
                <span
                  className={`${
                    isNavbarExpanded ? "hidden" : "inline"
                  } md:inline`}
                >
                  {menu.name}
                </span>
              </h2>
            </Link>
          ))}
          <SettingsModal isNavbarExpanded={isNavbarExpanded} />
        </div>
        <div
          className={`fixed bottom-0 flex flex-row ${
            isNavbarExpanded ? "justify-center md:justify-start" : ""
          } gap-5 items-center py-5 cursor-pointer hover:text-purple-500`}
        >
          <UserButton />
          <span className="hidden md:inline">Profile</span>
        </div>
      </div>
    </div>
  );
}


