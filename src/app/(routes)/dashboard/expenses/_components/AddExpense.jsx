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
import { expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../../utils/dbConfig";
import { toast } from "sonner";

function AddExpense({refreshData}) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();
  const [comment, setComment] = useState();

  
  const { user } = useUser();
  // FUNCTION FOR CREATING NEW EXPENSES & PUSHING TO DB
  const onCreateExpense = async () => {
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
        createdAt: currentDateAndTime,
        description: description,
        comment: comment,
      })
      .returning({ insertedId: expenses.id });

    if (result) {
      refreshData();
      toast("Expense Added Successfully!");
    }
  };

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
                <select className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                onChange={(e) => setCategory(e.target.value)}>
                  <option value="other">Other</option>
                  <option value="purchase">Purchases</option>
                  <option value="housing">Housing</option>
                  <option value="utilities">Utilities</option>
                  <option value="food">Food</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Description:</h2>
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
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Comment:</h2>
                <textarea onChange={(e) => setComment(e.target.value)}
                  className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                  placeholder="e.g 'From shared acc.'"
                ></textarea>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                className="bg-gray-700"
                onClick={() => onCreateExpense()}
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
