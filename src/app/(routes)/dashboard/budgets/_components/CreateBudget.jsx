'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { budgets } from '@/db/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../../../utils/dbConfig'
import { toast } from 'sonner'

function CreateBudget({refreshData}) {

    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const {user} = useUser()
    // FUNCTION FOR CREATING NEW BUDGETS
    const onCreateBudget = async () => {

        const result = await db.insert(budgets).values({
            budgetName:name,
            amount:amount,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            userFirstName: user?.firstName,
            userLastName: user?.lastName,
            userID: user?.id
        }).returning({insertedId:budgets.id})

        if(result) {
            refreshData()
            toast('New Budget Created Successfully!')
        }
    }
  return (
    <div className="p-5">
         <Dialog> {/* POPUP DIALOG FOR CREATING BUDGETS */}
            <DialogTrigger asChild> 
                <div className="border rounded-md text-center p-5 flex flex-col justify-center items-center shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105">
                    <h2 className="text-2xl font-bold">+</h2>
                    <h2 className="text-md">Create New Budget</h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Budget</DialogTitle>
                    <div className="py-6">
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
                        <Button disabled={!(name&&amount)} className="bg-gray-700" onClick={()=>onCreateBudget()}>Create Budget</Button>
                    </DialogClose>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreateBudget