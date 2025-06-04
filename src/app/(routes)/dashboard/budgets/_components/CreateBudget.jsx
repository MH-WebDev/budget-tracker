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
import { useDatabase } from "@/context/DatabaseContext";
import EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function CreateBudget({ onBudgetCreated }) {
  const { addBudget } = useDatabase();
  const [emojiIcon, setEmojiIcon] = useState("🏡");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const handleCreateBudget = async () => {
    const newBudget = {
      name,
      amount: parseFloat(amount),
      icon: emojiIcon,
    };
    try {
      const result = await addBudget(newBudget);
      if (result) {
        onBudgetCreated();
        toast("New Budget Created Successfully!");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast("An error occurred, please try again later or contact support if the problem persists");
    }
  };

  return (
    <Dialog>
      {" "}
      {/* POPUP DIALOG FOR CREATING BUDGETS */}
      <DialogTrigger asChild>
        <div className="order-first md:order-last border rounded-md text-center p-5 flex flex-col justify-center items-center h-[200px] shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
          <h2 className="text-2xl font-bold">+</h2>
          <h2 className="text-md">Create New Budget</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Budget</DialogTitle>
        </DialogHeader>
        <div className="py-5">
          <div className="grid grid-cols-6 gap-5 items-center py-5">
            <h2 className="col-span-2 text-right">Select an Icon:</h2>
            <div className="col-span-4">
              <Button
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </Button>
               <div className="absolute z-50"> {/*Emoji picker container */}
                <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
            </div>
            <h2 className="col-span-2 text-right">Budget Name:</h2>
            <Input
              placeholder="e.g 'Home Renovations'"
              className="col-span-4"
              onChange={(e) => setName(e.target.value)}
            />
            <h2 className="col-span-2 text-right">Amount:</h2>
            <Input
              placeholder="e.g '1250.00'"
              type="number"
              className="col-span-4"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogClose asChild>
          <Button
            disabled={!(name && amount)}
            className="bg-gray-700"
            onClick={handleCreateBudget}
          >
            Create Budget
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}


