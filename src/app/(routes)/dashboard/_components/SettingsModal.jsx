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

    // Fetch the preferred currency from Clerk metadata on component mount
    useEffect(() => {
      if (user?.publicMetadata?.preferredCurrency) {
        setSelectedCurrency(user.publicMetadata.preferredCurrency);
      }
    }, [user]);

    const getCurrencySymbol = (currencyName) => {
      const currency = currencies.find((c) => c.currencyName === currencyName);
      return currency ? currency.currencySymbol : null;
    };
    
    // Retrieve the symbol for the selected currency
    const selectedSymbol = getCurrencySymbol(selectedCurrency);

    const updateCurrency = async () => {
        if (!selectedCurrency) {
          alert('Please select a currency.');
          return;
        }

        try {
          const response = await fetch('/api/update-metadata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id, // Pass the user's ID
              preferredCurrency: selectedCurrency,
              currencySymbol: selectedSymbol,
            }),
          });

          const data = await response.json();

          if (data.success) {
            alert('Currency updated successfully!');
          } else {
            alert('Failed to update currency. Please try again.');
          }
        } catch (error) {
          console.error('Error updating currency:', error);
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
                            <div className="flex flex-row gap-8 items-center">
                                <label htmlFor="currency">Currency:</label>
                                <select
                                    id="currency"
                                    value={selectedCurrency}
                                    onChange={(e) => setSelectedCurrency(e.target.value)}
                                >
                                        {currencies.map(({ id, currencyName, currencySymbol }) => (
                                        <option key={id} value={currencyName} id={currencyName}>{currencyName} ({currencySymbol})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter className="fixed bottom-0 w-3/4 mx-auto pb-5 left-0 right-0">
                          <DialogClose asChild>
                              <Button className="bg-gray-700 w-full" onClick={updateCurrency}>Apply</Button>
                          </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
  )
}

export default SettingsModal