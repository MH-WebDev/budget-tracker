"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { budgets, expenses } from "@/db/schema";
import { db } from "../../../../../../utils/dbConfig";
import { toast } from "sonner";

function AddExpense({refreshData, budgetId, user }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();

  // FUNCTION FOR CREATING NEW EXPENSES & PUSHING TO DB
  const createExpense = async () => {
    const currentDateAndTime = new Date().toISOString();

    const result = await db
      .insert(expenses)
      .values({
        expenseName: name,
        amount: amount,
        createdBy: user?.id,
        category: category,
        userFirstName: user?.firstName,
        userLastName: user?.lastName,
        budgetId: budgetId,
        createdAt: currentDateAndTime,
        description: description,
      })
      .returning({ insertedId: budgets.id });
      console.log("Added expense:", result)
    if (result) {
      refreshData();
      toast("Expense Added Successfully!");
    }
  };
  const preferredCurrency = user?.publicMetadata?.currencySymbol;
  return (
    <>
      <Dialog>
        {/* POPUP DIALOG FOR CREATING EXPENSES */}
        <DialogTrigger asChild>
          <div className="border rounded-md text-center px-5 py-1 shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
            <h2 className="text-md">+ Add Expense</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <div className="py-6">
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Expense Name:</h2>
                <Input
                  placeholder="e.g 'Home Renovations'"
                  className="col-span-4 border-gray-300"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Category:</h2>
                <select className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                onChange={(e) => setCategory(e.target.value)}>
                  <option value="other">Other</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="finance">Finance</option>
                  <option value="food">Food</option>
                  <option value="housing">Housing</option>
                  <option value="purchase">Purchases</option>
                  <option value="travel">Travel</option>
                  <option value="utilities">Utilities</option>
                </select>
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right"><span className="text-xs align-super">(optional)</span> Description:</h2>
                <textarea onChange={(e) => setDescription(e.target.value)}
                  className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                  placeholder="e.g 'Car Payment'"
                ></textarea>
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Amount:</h2>
                <Input
                  type="number"
                  className="col-span-4"
                  placeholder={`e.g ${preferredCurrency}99.99`}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                className="bg-gray-700"
                onClick={() => createExpense()}
              >
                Add Expense
              </Button>
            </DialogClose>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddExpense;
