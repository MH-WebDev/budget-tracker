"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDatabase } from "@/context/DatabaseContext";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import Loading from "@/app/_components/Loading";

export default function SettingsModal({ isNavbarExpanded }) {
  const currencies = [
    { id: "1", currencyName: "United States Dollar", currencySymbol: "$" },
    { id: "2", currencyName: "Euro", currencySymbol: "€" },
    { id: "3", currencyName: "Japanese Yen", currencySymbol: "¥" },
    { id: "4", currencyName: "British Pound Sterling", currencySymbol: "£" },
    { id: "5", currencyName: "Australian Dollar", currencySymbol: "$" },
    { id: "6", currencyName: "Canadian Dollar", currencySymbol: "$" },
    { id: "7", currencyName: "Swiss Franc", currencySymbol: "CHF " },
    { id: "8", currencyName: "Chinese Yuan Renminbi", currencySymbol: "¥" },
    { id: "9", currencyName: "Swedish Krona", currencySymbol: "kr " },
    { id: "10", currencyName: "New Zealand Dollar", currencySymbol: "$" },
  ];

  const { userData, updateUserSettings } = useDatabase(); // Access user data and update function from DatabaseProvider
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedDateFormat, setSelectedDateFormat] = useState("MM/dd/yyyy");
  const [selectedSymbol, setSelectedSymbol] = useState("$");

  const [isOpen, setIsOpen] = useState(false);

  const getCurrencySymbol = (currencyName) => {
    const currency = currencies.find((c) => c.currencyName === currencyName);
    return currency ? currency.currencySymbol : null;
  };

  useEffect(() => {
    if ( userData && userData.length > 0) {
      const userSettings = userData;
      setSelectedCurrency(userSettings.preferred_currency || "USD");
      setSelectedDateFormat(userSettings.selected_date_format || "yyyy/dd/MM");
      setSelectedSymbol(userSettings.preferred_currency_symbol || "$");
      console.log("User settings loaded:", userSettings);
    }
  }, [userData]);
  // Function to handle setting of user settings on dialog open.
  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open && userData) {
      setSelectedCurrency(userData.preferred_currency || "USD");
      setSelectedDateFormat(userData.selected_date_format || "MM/dd/yyyy");
      setSelectedSymbol(userData.preferred_currency_symbol || "$");
    }
  };
  const updateSettings = async () => {
    if (!selectedCurrency) {
      alert("Please select a currency.");
      return;
    }

    try {
      await updateUserSettings(userData?.user_id, {
        preferred_currency: selectedCurrency,
        preferred_currency_symbol: selectedSymbol,
        selected_date_format: selectedDateFormat,
      });
      toast("Settings updated successfully!");
    } catch (error) {
      //console.error('Error updating settings:', error);
      alert("An error occurred while updating settings. Please try again.");
    }
  };
  return (
    <div className={`pt-1`}>
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <p
            className={`flex ${
              isNavbarExpanded ? "justify-center lg:justify-start" : ""
            } gap-5 cursor-pointer hover:text-purple-500`}
          >
            <Settings />{" "}
            <span className={`${isNavbarExpanded ? "hidden" : ""} lg:inline`}>
              Settings
            </span>
          </p>
        </DialogTrigger>
          <DialogContent className="h-64">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <div className="py-6">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-6 gap-8 items-center">
                    <label htmlFor="currency" className="col-span-2">
                      Currency:
                    </label>
                    <select
                      className="col-span-4 border border-gray-300 rounded-md px-4 py-1"
                      id="currency"
                      value={selectedCurrency}
                      onChange={(e) => {
                        const newCurrency = e.target.value;
                        setSelectedCurrency(newCurrency); // Update selectedCurrency
                        setSelectedSymbol(getCurrencySymbol(newCurrency)); // Update selectedSymbol based on the new currency
                      }}
                    >
                      {currencies.map(({ id, currencyName, currencySymbol }) => (
                        <option key={id} value={currencyName} id={currencyName}>
                          {currencyName} ({currencySymbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-6 gap-8 items-center">
                    <label htmlFor="date-format" className="col-span-2">
                      Date Format:
                    </label>
                    <select
                      className="col-span-4 border border-gray-300 rounded-md px-4 py-1"
                      id="date-format"
                      value={selectedDateFormat}
                      onChange={(e) => setSelectedDateFormat(e.target.value)}
                    >
                      <option value="yyyy/MM/dd">YYYY/MM/DD</option>
                      <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter className="fixed bottom-0 w-3/4 mx-auto pb-5 left-0 right-0">
                <DialogClose asChild>
                  <Button className="bg-gray-700 w-full" onClick={updateSettings}>
                    Apply
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}


