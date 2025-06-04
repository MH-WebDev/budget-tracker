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
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Alert from "@/app/_components/Alert";
import EmojiPicker from "emoji-picker-react";

export default function EditBudget({ budget, refreshData, updateBudget, deleteBudget }) {
  const [name, setName] = useState(budget.budget_name);
  const [amount, setAmount] = useState(budget.amount);
  const [emojiIcon, setEmojiIcon] = useState("🏡");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  // FUNCTION TO UPDATE BUDGET
  const onSaveChanges = async () => {
    try {
      await updateBudget(budget.id, {
        icon: emojiIcon,
        budget_name: name,
        amount: parseFloat(amount), // Ensure amount is a number
      });
      toast.success("Budget updated successfully!");
      refreshData(); // Refresh the data after updating
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget.");
    }
  };

  // DELETE BUDGET AND RELATED EXPENSES
  const handleDelete = async (budgetId) => {
    const success = await deleteBudget(budgetId);
    if (success) {
      refreshData();
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
        </DialogHeader>
        <div className="pb-6">
          <Button
            variant="outline"
            size="lg"
            className="text-lg"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </Button>
          <div className="absolute z-50">
            <EmojiPicker
              open={openEmojiPicker}
              onEmojiClick={(e) => {
                setEmojiIcon(e.emoji);
                setOpenEmojiPicker(false);
              }}
            />
          </div>
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
            onConfirm={() => handleDelete(budget.id)}
            onCancel={() => toast("Delete action canceled.")} // Optional cancel action
            triggerText={"Delete Budget"}
            variant={"destructive"}
          />
          <DialogClose asChild>
            <Button
              disabled={!(name && amount)}
              className="bg-gray-700"
              onClick={onSaveChanges}
            >
              Save Changes
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}


