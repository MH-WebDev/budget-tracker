'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Settings } from 'lucide-react'





function SettingsModal() {

    const { user } = useUser();
    const [selectedCurrency, setSelectedCurrency] = useState('');

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
        console.log('Payload:', {
            userId: user.id,
            preferredCurrency: selectedCurrency,
          });
      };

    const currencies = [ //LIST OF  MOST POPULAR CURRENCIES GENERATED FOR SETTINGS
        {
          "id": "1",
          "currencyName": "United States Dollar",
          "currencySymbol": "$"
        },
        {
          "id": "2",
          "currencyName": "Euro",
          "currencySymbol": "€"
        },
        {
          "id": "3",
          "currencyName": "Japanese Yen",
          "currencySymbol": "¥"
        },
        {
          "id": "4",
          "currencyName": "British Pound Sterling",
          "currencySymbol": "£"
        },
        {
          "id": "5",
          "currencyName": "Australian Dollar",
          "currencySymbol": "$"
        },
        {
          "id": "6",
          "currencyName": "Canadian Dollar",
          "currencySymbol": "$"
        },
        {
          "id": "7",
          "currencyName": "Swiss Franc",
          "currencySymbol": "CHF"
        },
        {
          "id": "8",
          "currencyName": "Chinese Yuan Renminbi",
          "currencySymbol": "¥"
        },
        {
          "id": "9",
          "currencyName": "Swedish Krona",
          "currencySymbol": "kr"
        },
        {
          "id": "10",
          "currencyName": "New Zealand Dollar",
          "currencySymbol": "$"
        }
      ]

  return (
    <div className="pt-1">
             <Dialog> {/* POPUP DIALOG FOR SETTINGS */}
                <DialogTrigger asChild>
                    <button className="flex gap-5 cursor-pointer hover:text-purple-500">
                        <Settings /> Settings
                    </button>
                </DialogTrigger>
                <DialogContent>
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
                                        {currencies.map(({id, currencyName, currencySymbol, index}) => (
                                        <option key={index} value={currencyName} id={currencyName}>{currencyName} ({currencySymbol})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogClose asChild>
                            <Button className="bg-gray-700" onClick={updateCurrency}>Apply</Button>
                        </DialogClose>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
  )
}

export default SettingsModal