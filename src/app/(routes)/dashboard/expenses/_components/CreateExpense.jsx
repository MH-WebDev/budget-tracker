import { useDatabase } from "@/context/DatabaseContext";
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
import EmojiPicker from "emoji-picker-react";
import { selectExpenseOptions } from "@/app/_components/Categories";

export default function CreateExpense({ onExpenseCreated, userData, budgetId }) {
  const { addExpense } = useDatabase();
  const [emojiIcon, setEmojiIcon] = useState("💸");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState();
  const userCurrencySymbol = userData?.preferred_currency_symbol || " ";
  const handleCreateExpense = async () => {
    const newExpense = {
      category,
      amount: parseFloat(amount),
      icon: emojiIcon,
      description,
      budget_id: budgetId,
    };
    try {
      const result = await addExpense(newExpense);
      if (result) {
        onExpenseCreated();
        toast("New Expense Created Successfully!");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast(
        "An error occurred, please try again later or contact support if the problem persists"
      );
    }
  };

  return (
    <>
      <Dialog className="p-5">
        {/* POPUP DIALOG FOR CREATING EXPENSES */}
        <DialogTrigger asChild>
          <div className="flex flex-col justify-center items-center border rounded-md text-center px-5 py-1 shadow-sm hover:bg-gray-50 hover:shadow-md">
            <p className="text-xl">+</p>
            <h2 className="text-md">Add New Expense</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <div className="py-5">
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Select an icon:</h2>
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
                <select className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                value={category} onChange={(e) => setCategory(e.target.value)} >
                  {selectExpenseOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">
                  <span className="text-xs align-super">(optional)</span>{" "}
                  Description:
                </h2>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
                  placeholder="e.g 'Car Payment'"
                ></textarea>
              </div>
              <div className="grid grid-cols-6 gap-5 items-center py-2">
                <h2 className="col-span-2 text-right">Amount:</h2>
                <Input
                  type="number"
                  className="col-span-4"
                  placeholder={`e.g ${
                    userCurrencySymbol
                  }99.99`}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogClose asChild>
              <Button
                disabled={!amount}
                className="bg-gray-700"
                onClick={() => handleCreateExpense()}
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
