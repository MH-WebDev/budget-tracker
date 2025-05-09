import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDatabase } from '@/context/DatabaseContext';
import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react'

function CreateBudget({ onBudgetCreated }) {
  const { addBudget, fetchUserBudgets } = useDatabase();
  const [emojiIcon, setEmojiIcon] = useState('🏡');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const handleCreateBudget = async () => {
    const newBudget = {
      name,
      amount,
      icon: emojiIcon
    };
    const result = await addBudget(newBudget); // Calls addBudget from DatabaseContext
    if (result) {
      console.log('Budget created:', result);
      onBudgetCreated(); // Triggers fetch of updated budget list after new budget creation
    }
  };

  return (
    <Dialog> {/* POPUP DIALOG FOR CREATING BUDGETS */}
      <DialogTrigger asChild>
          <div className="border rounded-md text-center p-5 flex flex-col justify-center items-center h-[200px] shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
              <h2 className="text-2xl font-bold">+</h2>
              <h2 className="text-md">Create New Budget</h2>
          </div>
      </DialogTrigger>
      <DialogContent>
          <DialogHeader>
              <DialogTitle>New Budget</DialogTitle>
          </DialogHeader>
              <div className="pb-6">
                  <Button variant="outline" size="lg" className="text-lg" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                      {emojiIcon}
                  </Button>
                  <div className="absolute z-50">
                      <EmojiPicker open={openEmojiPicker} onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji)
                          setOpenEmojiPicker(false)
                      }}/>
                  </div>

                  <div className="grid grid-cols-6 gap-5 items-center py-2">
                      <h2 className="col-span-2 text-right">Budget Name:</h2>
                      <Input placeholder="e.g 'Home Renovations'" className="col-span-4" onChange={(e) => setName(e.target.value)}/>
                  </div>
                  <div className="grid grid-cols-6 gap-5 items-center py-2">
                      <h2 className="col-span-2 text-right">Amount:</h2>
                      <Input placeholder="e.g '1250.00'" type="number" className="col-span-4" onChange={(e) => setAmount(e.target.value)}/>
                  </div>
              </div>
              <DialogClose asChild>
                  <Button disabled={!(name&&amount)} className="bg-gray-700" onClick={handleCreateBudget}>Create Budget</Button>
              </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CreateBudget