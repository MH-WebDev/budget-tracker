"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useDatabase } from "@/context/DatabaseContext";
import Loading from "@/app/_components/Loading";
import IncomeCard from "./_components/IncomeCard";
import CreateIncome from "./_components/CreateIncome";

function page() {
  const { user } = useUser(); // Gets logged in data from clerk
  const { fetchIncomeData, userData, addIncome, editIncome, deleteIncome, updateIncome } = useDatabase();
  const [incomeData, setIncomeData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [userData, user]);

  const userCurrencySymbol =
    userData?.[0]?.preferred_currency_symbol || " ";

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
  return (
    <div className="p-5">
      <div>
        <div></div>
        <CreateIncome addIncome={addIncome} onIncomeCreated={fetchAllData} />
      </div>
      <div>
        <IncomeCard
          userData={userData}
          incomeData={incomeData}
          userCurrencySymbol={userCurrencySymbol}
          updateIncome={updateIncome}
          deleteIncome={deleteIncome}
          refreshData={fetchAllData}
        />
      </div>
    </div>
  );
}

export default page;
