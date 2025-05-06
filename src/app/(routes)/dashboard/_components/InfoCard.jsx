import React from 'react'

function InfoCard({budgetList}) {
  return (
    <div>
        <div>
            <div>
                <h2>Total Budgets:</h2>
            </div>
            <div className="flex flex-row justify-between items-center gap-5">
                <div className="flex flex-col border border-gray-300 rounded-lg w-full">
                    {budgetList.map((budget, index) => (
                        <div key={budget.id} className="h-52 bg-blue-300">
                            <div>
                                <h2>{budget.budgetName}</h2>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col border border-gray-300 rounded-lg w-full">
                    Recent Expenses
                </div>
            </div>
            <p>
                Other things
            </p>
            <div className="flex flex-row justify-center items-center border border-gray-300 rounded-lg w-min mx-auto">
                <div className="w-40 py-2 rounded-lg text-center cursor-pointer">Expenses</div>
                <div className="w-40 py-2 rounded-lg text-center bg-purple-700 text-white">Income</div>
            </div>
        </div>
    </div>
  )
}

export default InfoCard