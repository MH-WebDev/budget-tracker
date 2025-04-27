import React from 'react'
import BudgetList from './_components/BudgetList'

function page() {
  return (
    <>
        <div>
            <h2 className="text-xl p-5 font-semibold">Budgets</h2>
        </div>
        <BudgetList />
        
    </>
  )
}

export default page