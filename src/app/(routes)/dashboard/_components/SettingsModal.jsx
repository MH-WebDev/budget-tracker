'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Settings } from 'lucide-react'





function SettingsModal() {

  const currencies = [ //LIST OF  MOST POPULAR CURRENCIES GENERATED FOR SETTINGS
    { id: "1", currencyName: "United States Dollar", currencySymbol: "$" },
    { id: "2", currencyName: "Euro", currencySymbol: "€" },
    { id: "3", currencyName: "Japanese Yen", currencySymbol: "¥" },
    { id: "4", currencyName: "British Pound Sterling", currencySymbol: "£" },
    { id: "5", currencyName: "Australian Dollar", currencySymbol: "$" },
    { id: "6", currencyName: "Canadian Dollar", currencySymbol: "$" },
    { id: "7", currencyName: "Swiss Franc", currencySymbol: "CHF" },
    { id: "8", currencyName: "Chinese Yuan Renminbi", currencySymbol: "¥" },
    { id: "9", currencyName: "Swedish Krona", currencySymbol: "kr" },
    { id: "10", currencyName: "New Zealand Dollar", currencySymbol: "$" }
  ]

    const { user } = useUser();
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [selectedDateFormat, setSelectedDateFormat] = useState(''); 

    // Fetch the preferred currency from Clerk metadata on component mount
    useEffect(() => {
      if (user?.publicMetadata?.preferredCurrency) {
        setSelectedCurrency(user.publicMetadata.preferredCurrency);
      }
      if (user?.publicMetadata?.selectedDateFormat) {
        setSelectedDateFormat(user.publicMetadata.selectedDateFormat);
      }
    }, [user]);

    const getCurrencySymbol = (currencyName) => { // Converts the selected currency name to the appropriate symbol
      const currency = currencies.find((c) => c.currencyName === currencyName);
      return currency ? currency.currencySymbol : null;
    };

    const selectedSymbol = getCurrencySymbol(selectedCurrency); // Retrieve the currency symbol for the selected currency

    const updateSettings = async () => {
        if (!selectedCurrency) {
          alert('Please select a currency.');
          return;
        }

        try {
          const response = await fetch('/api/update-metadata', { // API endpoint for updating metadata. Sends user id, preferred currency, relevant symbol and chosen date format to clerk
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id, 
              preferredCurrency: selectedCurrency,
              currencySymbol: selectedSymbol,
              selectedDateFormat: selectedDateFormat,
            }),
          });

          const data = await response.json();

          if (data.success) {
            alert('Settings updated successfully!');
          } else {
            alert('Failed to update settings. Please try again.');
          }
        } catch (error) {
          alert('An error occurred. Please try again.');
        }
      };

  return (
    <div className="pt-1">
             <Dialog> {/* POPUP DIALOG FOR SETTINGS */}
                <DialogTrigger asChild>
                    <button className="flex gap-5 cursor-pointer hover:text-purple-500">
                        <Settings /> Settings
                    </button>
                </DialogTrigger>
                <DialogContent className=" h-64">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <div className="py-6">
                            <div className="flex flex-col gap-5">
                              <div className="grid grid-cols-6 gap-8 items-center">
                                <label htmlFor="currency" className="col-span-2">Currency:</label>
                                  <select
                                      className="col-span-4 border border-gray-300 rounded-md px-4 py-1"
                                      id="currency"
                                      value={selectedCurrency}
                                      onChange={(e) => setSelectedCurrency(e.target.value)}
                                  >
                                          {currencies.map(({ id, currencyName, currencySymbol }) => (
                                          <option key={id} value={currencyName} id={currencyName}>{currencyName} ({currencySymbol})</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="grid grid-cols-6 gap-8 items-center">
                                <label htmlFor="date-format" className="col-span-2">Date Format:</label>
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
                              <Button className="bg-gray-700 w-full" onClick={updateSettings}>Apply</Button>
                          </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
  )
}

export default SettingsModal