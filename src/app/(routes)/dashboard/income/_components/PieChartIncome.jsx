import { PieChart } from "@/app/_components/PieChart";

export const PieChartIncome = ({
  width = 400,
  height = 160,
  pieData,
  userData,
}) => (
  <PieChart data={pieData} width={width} height={height} userData={userData} />
);
