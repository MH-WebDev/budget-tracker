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
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState();

  // FUNCTION FOR CREATING NEW EXPENSES & PUSHING TO DB
  const createExpense = async () => {
    const currentDateAndTime = new Date().toISOString();

    const result = await db
      .insert(expenses)
      .values({
        amount: amount,
        createdBy: user?.id,
        category: category,
        description: description,
        userFirstName: user?.firstName,
        userLastName: user?.lastName,
        budgetId: budgetId,
        createdAt: currentDateAndTime,
        createdBy: user?.id,
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
      <Dialog className="p-5">
        {/* POPUP DIALOG FOR CREATING EXPENSES */}
        <DialogTrigger asChild>
          <div className="flex flex-col justify-center items-center border rounded-md text-center px-5 py-1 shadow-sm hover:bg-gray-50 hover:shadow-md">
            <p className="text-xl">+</p>
            <h2 className="text-md">Add Expense</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <div className="py-6">
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Category:</h2>
                <select className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                onChange={(e) => setCategory(e.target.value)}>
                  <option value="Other" defaultValue>Other</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Finance">Finance</option>
                  <option value="Food">Food</option>
                  <option value="Housing">Housing</option>
                  <option value="Pets">Pets</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
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
                disabled={!(amount)}
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
