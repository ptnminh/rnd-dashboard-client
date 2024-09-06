import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LabelList,
  ComposedChart,
} from "recharts";
import styles from "./Dashboard.module.sass";
import cn from "classnames";
import Card from "../../components/Card";
import { Grid } from "@mantine/core";
import CombinedChartDesigner from "./Designer";
const dataPieChart = [
  {
    name: "BD1",
    "Scale - Product Line": 1,
    "Scale - Clipart": 2,
    "Scale - Niche": 8,
    "New - Phủ Market": 1,
    "Scale - Design": 4,
    "New - Mix Match": 5,
    total: 21,
  },
  {
    name: "BD2",
    "Scale - Product Line": 1,
    "Scale - Clipart": 1,
    "Scale - Niche": 1,
    "New - Phủ Market": 1,
    "Scale - Design": 2,
    "New - Mix Match": 3,
    total: 9,
  },
  {
    name: "BD3",
    "Scale - Product Line": 1,
    "Scale - Clipart": 2,
    "Scale - Niche": 3,
    "New - Phủ Market": 4,
    "Scale - Design": 5,
    "New - Mix Match": 6,
    total: 21,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <p className={styles.label}>{`${data.name}`}</p>
        <p
          className={styles.desc}
        >{`Scale - Product Line: ${data["Scale - Product Line"]}`}</p>
        <p
          className={styles.desc}
        >{`Scale - Clipart: ${data["Scale - Clipart"]}`}</p>
        <p
          className={styles.desc}
        >{`Scale - Niche: ${data["Scale - Niche"]}`}</p>
        <p
          className={styles.desc}
        >{`New - Phủ Market: ${data["New - Phủ Market"]}`}</p>
        <p
          className={styles.desc}
        >{`Scale - Design: ${data["Scale - Design"]}`}</p>
        <p
          className={styles.desc}
        >{`New - Mix Match: ${data["New - Mix Match"]}`}</p>
        <p className={styles.desc}>{`Total: ${data.total}`}</p>
      </div>
    );
  }

  return null;
};
const combinedData = [
  {
    group: "BD1",
    done: 30,
    undone: 10,
    avgTime: 20,
    productLine: 1,
    clipart: 2,
    niche: 3,
    phuMarket: 4,
    design: 5,
    mixMatch: 6,
  },
  {
    group: "BD2",
    done: 40,
    undone: 5,
    avgTime: 15,
    productLine: 1,
    clipart: 2,
    niche: 3,
    phuMarket: 4,
    design: 5,
    mixMatch: 6,
  },
  {
    group: "BD3",
    done: 20,
    undone: 15,
    avgTime: 25,
    productLine: 1,
    clipart: 2,
    niche: 3,
    phuMarket: 4,
    design: 5,
    mixMatch: 6,
  },
];
const COLORS2 = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF6384",
  "#36A2EB",
];

// Function to calculate and render the custom label
const renderCustomLabel = ({ name, value, percent }) => {
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

function CombinedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={combinedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="group" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* Bar Chart: Card Status */}
        <Bar dataKey="done" barSize={20} fill="#8884d8" name="Done Cards" />
        <Bar dataKey="undone" barSize={20} fill="#82ca9d" name="Undone Cards" />

        {/* Line Chart: Average Time to Complete */}
        <Line
          type="monotone"
          dataKey="avgTime"
          stroke="#FF8042"
          name="Average Time"
        />

        {/* Pie Chart inside Tooltip for Loại đề Breakdown */}
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              const totalTasks =
                data.productLine +
                data.clipart +
                data.niche +
                data.phuMarket +
                data.design +
                data.mixMatch;

              const pieData = [
                { name: "Product Line", value: data.productLine },
                { name: "Clipart", value: data.clipart },
                { name: "Niche", value: data.niche },
                { name: "Phủ Market", value: data.phuMarket },
                { name: "Design", value: data.design },
                { name: "Mix Match", value: data.mixMatch },
              ].map((item) => ({ ...item, percent: item.value / totalTasks }));

              return (
                <div>
                  <p>{`Group: ${data.group}`}</p>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={pieData}
                      cx={100}
                      cy={100}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomLabel}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS2[index % COLORS2.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              );
            }
            return null;
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const Dashboards = () => {
  const dataBarChart = [
    { name: "BD1", Design: 6, EPM: 3, Post: 5, Total: 14 },
    { name: "BD2", Design: 4, EPM: 2, Post: 4, Total: 10 },
    { name: "BD3", Design: 2, EPM: 2, Post: 3, Total: 7 },
  ];

  return (
    <Grid
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="RnD"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dataBarChart}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="Design" stackId="a" fill="#8884d8" />
                <Bar dataKey="EPM" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Post" stackId="a" fill="#ffc658">
                  <LabelList dataKey="Total" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="RnD"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={730} height={250}>
                <Pie
                  data={dataPieChart}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                  dataKey="total" // Display total hours for each group
                >
                  {dataPieChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Design"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chart}>
            <CombinedChart />
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Design"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chart}>
            <CombinedChartDesigner />
          </div>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default Dashboards;
