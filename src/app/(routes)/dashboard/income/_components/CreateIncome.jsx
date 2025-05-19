import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreateIncome({ onIncomeCreated, addIncome }) {
  const [emojiIcon, setEmojiIcon] = useState("🏡");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [category, setCategory] = useState("Other");
  const [amount, setAmount] = useState();
  const [comment, setComment] = useState();

  const handleCreateIncome = async () => {
    const newIncome = {
      category,
      amount: parseFloat(amount),
      icon: emojiIcon,
      comment,
    };
    try {
      const result = await addIncome(newIncome);
      if (result) {
        onIncomeCreated();
        toast("New Income Created Successfully!");
      }
    } catch (error) {
      console.error("Error creating income:", error);
      toast(
        "An error occurred, please try again later or contact support if the problem persists"
      );
    }
  };

  return (
    <Dialog>
      {" "}
      {/* POPUP DIALOG FOR CREATING INCOMES */}
      <DialogTrigger asChild>
        <div className="w-full border rounded-md text-center p-5 flex flex-col justify-center items-center h-[200px] shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
          <h2 className="text-2xl font-bold">+</h2>
          <h2 className="text-md">Create New Income</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Income</DialogTitle>
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
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Other" defaultValue>
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
              type="number"
              className="col-span-4"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <h2 className="col-span-2 text-right">Comment:</h2>
            <textarea
              onChange={(e) => setComment(e.target.value)}
              className="col-span-4 border h-9 w-full border-gray-300 p-1 rounded-md bg-transparent px-3 py-1 shadow-xs transition-[color, box-shadow] outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:text-foreground"
              placeholder="e.g 'Car Payment'"
              >
            </textarea>
          </div>
        </div>
        <DialogClose asChild>
          <Button
            disabled={!amount}
            className="bg-gray-700"
            onClick={handleCreateIncome}
          >
            Create Budget
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
