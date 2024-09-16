import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    group: "BD1",
    done: 3,
    undone: 1,
    avgTimeDone: 50,
    sizeSmall: 50,
    sizeMedium: 30,
    sizeBig: 20,
  },
  {
    group: "BD2",
    done: 2,
    undone: 2,
    avgTimeDone: 85,
    sizeSmall: 20,
    sizeMedium: 50,
    sizeBig: 30,
  },
  {
    group: "BD3",
    done: 4,
    undone: 0,
    avgTimeDone: 30,
    sizeSmall: 30,
    sizeMedium: 20,
    sizeBig: 50,
  },
];

const CombinedChartDesigner = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* Bar for Done Cards */}
        <Bar dataKey="done" barSize={20} fill="#413ea0" />
        {/* Bar for Undone Cards */}
        <Bar dataKey="undone" barSize={20} fill="#ff7300" />
        {/* Line for Average Time Done */}
        <Line type="monotone" dataKey="avgTimeDone" stroke="#ff7300" />
        {/* Bar for Size % */}
        <Bar dataKey="sizeSmall" stackId="a" fill="#82ca9d" />
        <Bar dataKey="sizeMedium" stackId="a" fill="#8884d8" />
        <Bar dataKey="sizeBig" stackId="a" fill="#ffc658" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CombinedChartDesigner;
