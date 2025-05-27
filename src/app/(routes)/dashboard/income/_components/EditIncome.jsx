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
import { toast } from "sonner";
import Alert from "@/app/_components/Alert";
import EmojiPicker from "emoji-picker-react";

function EditIncome({
  income,
  userData,
  userCurrencySymbol,
  updateIncome,
  deleteIncome,
  refreshData
 }) {
    const [category, setCategory] = useState(income.category);
    const [amount, setAmount] = useState(income.amount);
    const [comment, setComment] = useState(income.comment);
    const [emojiIcon, setEmojiIcon] = useState(income.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

 // FUNCTION TO UPDATE INCOME
  const onSaveChanges = async () => {
    try {
      await updateIncome(income.id, {
        icon: emojiIcon,
        category,
        amount: parseFloat(amount), // Ensure amount is a number
        comment,
      });
      toast.success("Income updated successfully!");
      refreshData(); // Refresh the data after updating
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income.");
    }
  };

  // DELETE INCOME AND RELATED EXPENSES
  const handleDelete = async (incomeId) => {
    const success = await deleteIncome(incomeId);
    if (success) {
      refreshData();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-700 w-full">Edit Income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>
        <div className="pb-6">
                  <div className="grid grid-cols-6 gap-5 items-center py-2">
                    <h2 className="col-span-2">Select an icon:</h2>
                    <div className="col-span-4">
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
                    </div>
                    <h2 className="col-span-2 text-right">Category:</h2>
                    <select
                      className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                      value={income.category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Other">
                        Other
                      </option>
                      <option value="Salary">Salary</option>
                      <option value="Loan">Loan</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-6 gap-5 items-center py-2">
                    <h2 className="col-span-2 text-right">Amount:</h2>
                    <Input
                      placeholder="e.g '1250.00'"
                      value={income.amount}
                      type="number"
                      className="col-span-4"
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-5 items-center py-2">
                    <h2 className="col-span-2 text-right">Comment:</h2>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      value={income.comment}
                      className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                      placeholder="e.g 'Car Payment'"
                      >
                    </textarea>
                  </div>
                </div>
        <div className="flex justify-between">
          <Alert
            title="Are you absolutely sure?"
            description="Deleting an income CANNOT be undone."
            onConfirm={() => handleDelete(income.id)}
            onCancel={() => toast("Delete action canceled.")} // Optional cancel action
            triggerText={"Delete Income"}
            variant={"destructive"}
          />
          <DialogClose asChild>
            <Button
              disabled={!amount}
              className="bg-gray-700"
              onClick={onSaveChanges}
            >
              Save Changes
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditIncome