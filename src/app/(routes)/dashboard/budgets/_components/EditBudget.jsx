"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { budgets, expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../../../utils/dbConfig";
import { toast } from "sonner";
import { eq } from "drizzle-orm";
import Alert from "@/app/_components/Alert";

function EditBudget({ budget, refreshData }) {
  const [name, setName] = useState(budget.budgetName);
  const [amount, setAmount] = useState(budget.amount);
  const { user } = useUser();

  // FUNCTION TO UPDATE BUDGET
  const onUpdateBudget = async () => {
    const result = await db
      .update(budgets)
      .set({
        budgetName: name,
        amount: amount,
      })
      .where(eq(budgets.id, budget.id)) // Use `eq` for the condition
      .returning();

    if (result) {
      refreshData();
      toast("Budget Updated Successfully!");
    }
  };

  // FUNCTION TO DELETE BUDGET AND RELATED EXPENSES
  const onDeleteBudget = async () => {
    try {
      // Delete all expenses related to the budget
      await db
        .delete(expenses) // Assuming `expenses` is the table schema for expenses
        .where(eq(expenses.budgetId, budget.id)); // Delete where `budgetId` matches the budget's ID

      // Delete the budget itself
      const result = await db
        .delete(budgets)
        .where(eq(budgets.id, budget.id)) // Delete the budget
        .returning();

      if (result) {
        refreshData(); // Refresh the budget list
        toast("Budget and related expenses deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting budget and related expenses:", error);
      toast.error("Failed to delete budget. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-700 w-full">Edit Budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Modify the budget details or delete it.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="grid grid-cols-6 gap-5 items-center py-2">
            <h2 className="col-span-2 text-right">Budget Name:</h2>
            <Input
              value={name}
              placeholder="e.g 'Home Renovations'"
              className="col-span-4"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 gap-5 items-center py-2">
            <h2 className="col-span-2 text-right">Amount:</h2>
            <Input
              value={amount}
              placeholder="e.g '1250.00'"
              type="number"
              className="col-span-4"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between">
        <Alert
            title="Are you absolutely sure?"
            description="Deleting a budget will remove all associated expenses and CANNOT be undone."
            onConfirm={onDeleteBudget}
            onCancel={() => toast("Delete action canceled.")} // Optional cancel action
            triggerText={
                "Delete Budget"
            }
          />
          <DialogClose asChild>
            <Button
              disabled={!(name && amount)}
              className="bg-gray-700"
              onClick={onUpdateBudget}
            >
              Save Changes
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditBudget;
