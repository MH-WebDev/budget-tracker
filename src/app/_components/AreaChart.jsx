import React from "react";
import { Chart } from "react-google-charts";



function AreaChart( {chartWidth, chartHeight, chartData, chartTitle, hTitle, columnMin}) {
  
  const options = {
    chart: {
      subtitle: chartTitle,
    },
    chartArea: {
        width: '100%',
        height: '100%',
      },
      isStacked: true,
      backgroundColor: "transparent",
      hAxis: { title: hTitle },
      colors: ["#8200db", "#ad46ff", "#dab2ff", "#59168b", "#030712", "#62748e", "#faf5ff"],
      legend: { position: "left" },
    
  };

  return (
    <Chart
      chartType="Line"
      width={chartWidth}
      height={chartHeight}
      data={chartData}
      options={options}
    />
  );
}

export default AreaChart