"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useDatabase } from "@/context/DatabaseContext";
import Loading from "@/app/_components/Loading";
import IncomeCard from "./_components/IncomeCard";
import CreateIncome from "./_components/CreateIncome";
import IncomesInfo from "./_components/IncomesInfo";
import FilterComponent from "../_components/FilterComponent";

export default function page() {
  const { user } = useUser(); // Gets logged in data from clerk
  const { fetchIncomeData, userData, addIncome, deleteIncome, updateIncome } = useDatabase();
  const [incomeData, setIncomeData] = useState([]); // Default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysFilter, setDaysFilter] = useState(0); // Default time filter to last 30 days

  const selectOptions = [
    { value: "Other", label: "Other" },
    { value: "Salary", label: "Salary" },
    { value: "Loan", label: "Loan" },
    { value: "Sale", label: "Sale" }
  ] // Category options for filtering incomes. Needs to be updated if categories are modified in CreateIncome.jsx
  // All category values excluding "All" for filtering purposes

  const allCategoryValues = selectOptions.filter(opt => opt.value !== "All").map(opt => opt.value);
  const [selectedCategories, setSelectedCategories] = useState(allCategoryValues);

  // Fetch data when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]);

  const userCurrencySymbol = userData?.preferred_currency_symbol || " ";
  // BEGIN DATA FETCHING FUNCTION
  // Fetches income data from the database via DatabaseContext and updates the state
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchIncomeData();
      if (data) {
        setIncomeData(data);
      } else {
        setError("Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occured while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
  // END DATA FETCHING FUNCTION
  // ----------------------------------
  // BEGIN DATA FILTERING LOGIC
  // Filter incomes based on selected categories and by the selected time period
  const now = new Date();

  const filteredIncomes = incomeData.filter(inc => {
    if (selectedCategories.length === 0) return false;
    // Category filter
    const categoryMatch = selectedCategories.includes(inc.category);

    // Date filter
    if (daysFilter === 0) {
      return categoryMatch; // No date filter applied
    } else {
      // Use updated_at or fallback to created_at
      const incDate = new Date(inc.updated_at || inc.income_created_timestamp || inc.date);
      const daysDifference = (now - incDate) / (1000 * 60 * 60 * 24);
      return categoryMatch && daysDifference <= daysFilter;
    }
  });

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold">Income</h2>
      <div className="grid grid-cols-8 gap-5 py-5 items-center">
        <IncomesInfo userData={userData} incomeData={filteredIncomes} userCurrencySymbol={userCurrencySymbol} />
        <CreateIncome addIncome={addIncome} onIncomeCreated={fetchAllData} />
      </div>
      <FilterComponent 
          daysFilter={daysFilter}
          setDaysFilter={setDaysFilter}
          selectOptions={selectOptions}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}/>
      <div>
        {filteredIncomes.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            <p>No data available for the selected filters.</p>
          </div>
        ) : (
          <IncomeCard
          userData={userData}
          incomeData={filteredIncomes}
          userCurrencySymbol={userCurrencySymbol}
          updateIncome={updateIncome}
          deleteIncome={deleteIncome}
          refreshData={fetchAllData}
          />
        )}
      </div>
    </div>
  );
}


