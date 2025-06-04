import React, { useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN_X = 10;
const MARGIN_Y = 15;
const INFLEXION_PADDING = 15;


const colors = [
  "#e0ac2b",
  "#e85252",
  "#6689c6",
  "#9a6fb0",
  "#a53253",
  "#69b3a2",
];

export function PieChart({ width, height, data, userData }) {
  const ref = useRef(null);

  const radius = Math.min(width - 2 * MARGIN_X, height - 3 * MARGIN_Y) / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3.pie().value((d) => d.value);
    return pieGenerator(data);
  }, [data]);

  const arcGenerator = d3.arc();

  const shapes = pie.map((grp, i) => {
    const sliceInfo = {
      innerRadius: 0,
      outerRadius: radius,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const centroid = arcGenerator.centroid(sliceInfo);
    const slicePath = arcGenerator(sliceInfo);

    const inflexionInfo = {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: grp.startAngle,
      endAngle: grp.endAngle,
    };
    const inflexionPoint = arcGenerator.centroid(inflexionInfo);
    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 5 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";
    const userCurrencySymbol = userData?.preferred_currency_symbol || "$";
    const label = grp.data.name + " - " + userCurrencySymbol + grp.value;

    return (
      <g
        key={i}
        onMouseEnter={() => {
          if (ref.current) {
            ref.current.classList.add("hasHighlight");
          }
        }}
        onMouseLeave={() => {
          if (ref.current) {
            ref.current.classList.remove("hasHighlight");
          }
        }}
      >
        <path d={slicePath} fill={colors[i % colors.length]} />
        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
        <line
          x1={centroid[0]}
          y1={centroid[1]}
          x2={inflexionPoint[0]}
          y2={inflexionPoint[1]}
          stroke="black"
          fill="black"
        />
        <line
          x1={inflexionPoint[0]}
          y1={inflexionPoint[1]}
          x2={labelPosX}
          y2={inflexionPoint[1]}
          stroke="black"
          fill="black"
        />
        <text
          x={labelPosX + (isRightLabel ? 2 : -2)}
          y={inflexionPoint[1]}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={14}
        >
          {label}
        </text>
      </g>
    );
  });

  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        className="piechart-container"
        ref={ref}
      >
        {shapes}
      </g>
    </svg>
  );
}