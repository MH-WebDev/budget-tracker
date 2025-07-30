import React from 'react'
import DateRangeButtons from './DateRangeButtons'

function FilterComponent({daysFilter, setDaysFilter, selectOptions, selectedCategories, setSelectedCategories}) {
  const allCategoryValues = selectOptions.filter(opt => opt.value !== "All").map(opt => opt.value);

  const handleCheckboxChange = (value, checked) => {
    if (value === "All") {
      if (checked) {
        setSelectedCategories(allCategoryValues);
      } else {
        setSelectedCategories([]);
      }
    } else {
      if (checked) {
        setSelectedCategories([...selectedCategories, value]);
      } else {
        setSelectedCategories(selectedCategories.filter(cat => cat !== value));
      }
    }
  };

  return (
    <div className="flex flex-row justify-between items-end p-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Filter by category:</h3>
        <div className="flex flex-row gap-2">
            <label key="All" className="flex flex-row items-center gap-2">
                <input type="checkbox" value="All" checked={selectedCategories.length === allCategoryValues.length} onChange={e => handleCheckboxChange("All", e.target.checked)} />
                All
            </label>
            {selectOptions.map(opt => (
            <label key={opt.value} className="flex flex-row items-center gap-2">
                <input
                type="checkbox"
                value={opt.value}
                checked={
                    opt.value === "All"
                    ? selectedCategories.length === allCategoryValues.length
                    : selectedCategories.includes(opt.value)
                }
                onChange={e => handleCheckboxChange(opt.value, e.target.checked)}
                />
                {opt.label}
            </label>
            ))}
        </div>
      </div>
      <DateRangeButtons daysFilter={daysFilter} setDaysFilter={setDaysFilter}/>
    </div>
  );
}

export default FilterComponent