import React from "react";

function DateRangeButtons({ daysFilter, setDaysFilter }) {
  return (
    <div className="flex flex-row gap-5 items-center">
      <div>
        <h2 className="font-semibold ">View last:</h2>
      </div>
      <div className="flex flex-row gap-2">
        <button onClick={() => setDaysFilter(7)} className={`${daysFilter === 7 ? "font-semibold underline bg-gray-100" : ""} border px-2 py-0.5 rounded-md bg-gray-50`}>
          7 Days
        </button>
        <button onClick={() => setDaysFilter(14)} className={`${ daysFilter === 14 ? "font-semibold underline bg-gray-100" : "" } border px-2 py-0.5 rounded-md bg-gray-50`}>
          14 Days
        </button>
        <button onClick={() => setDaysFilter(30)} className={`${ daysFilter === 30 ? "font-semibold underline bg-gray-100" : "" } border px-2 py-0.5 rounded-md bg-gray-50`}>
          30 Days
        </button>
        <button onClick={() => setDaysFilter(0)} className={`${ daysFilter === 0 ? "font-semibold underline bg-gray-100" : "" } border px-2 py-0.5 rounded-md bg-gray-50`}>
          All
        </button>
      </div>
    </div>
  );
}

export default DateRangeButtons;
