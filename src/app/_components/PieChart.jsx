import React from "react";
import { Chart } from "react-google-charts";

export default function PieChart({
  chartData,
  userCurrency,
  chartWidth,
  chartHeight,
}) {
  const options = {
    pieHole: 0.2,
    backgroundColor: "transparent",
    chartArea: {
      left: 0,
      top: 7,
      bottom: 7,
      width: "100%",
      height: "100%",
    },
    legend: {
      position: "middle",
      alignment: "center",
      textStyle: {
        fontSize: 14,
      },
    },
    pieSliceText: "label",
    colors: ["#8200db", "#ad46ff", "#dab2ff", "#59168b", "#030712"],
    //colors: ["#AFCBFF", "#C2E0C6", "#D8A7B1", "#FFC107", "#D3D3D3"],
  };
  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={options}
      width={chartWidth}
      height={chartHeight}
    />
  );
}
