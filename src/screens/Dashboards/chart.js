import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import Card from "../../components/Card";
import styles from "./Dashboard.module.sass";
import cn from "classnames";
import { Grid, Select } from "@mantine/core";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MonthlyChart = ({ data }) => {
  // Aggregate data by month
  const months = [...new Set(data.map((item) => item.Month))];

  const aggregateDataByMonth = (status) => {
    return months.map((month) => {
      const filtered = data.filter(
        (item) => item.Month === month && item.Status === status
      );
      return filtered.length;
    });
  };

  const aggregateTimeToDoneByMonth = () => {
    return months.map((month) => {
      const filtered = data.filter(
        (item) => item.Month === month && item.Status === "Done"
      );
      const times = filtered.map((item) => item.TimeToDone);
      return times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
    });
  };

  const chartData = {
    labels: months,
    datasets: [
      {
        type: "bar",
        label: "Done",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: aggregateDataByMonth("Done"),
      },
      {
        type: "bar",
        label: "Undone",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        data: aggregateDataByMonth("Undone"),
      },
      {
        type: "line",
        label: "Average Time to Done (in days)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
        data: aggregateTimeToDoneByMonth(),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
const CardDistributionByType = ({ data }) => {
  // Aggregate data by card type
  const types = [...new Set(data.map((item) => item.Type))];
  const cardCountsByType = types.map((type) => {
    return data.filter((item) => item.Type === type).length;
  });

  const chartData = {
    labels: types,
    datasets: [
      {
        label: "Card Distribution by Type",
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
        data: cardCountsByType,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} cards`;
          },
        },
      },
    },
  };

  return (
    <Pie
      data={chartData}
      options={options}
      style={{
        height: "350px",
      }}
    />
  );
};

const CardDistributionByGroup = ({ data }) => {
  // Aggregate data by group
  const groups = [...new Set(data.map((item) => item.Group))];
  const cardCountsByGroup = groups.map((group) => {
    return data.filter((item) => item.Group === group).length;
  });

  const chartData = {
    labels: groups,
    datasets: [
      {
        label: "Card Distribution by Group",
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
        data: cardCountsByGroup,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} cards`;
          },
        },
      },
    },
  };

  return (
    <Pie
      data={chartData}
      options={options}
      style={{
        height: "350px",
        width: "100%",
      }}
    />
  );
};

const AverageTimeToCompleteCards = ({ data }) => {
  // Filter only 'Done' cards and calculate average time to done for each group
  const groups = [...new Set(data.map((item) => item.Group))];

  const averageTimeToDoneByGroup = groups.map((group) => {
    const doneCards = data.filter(
      (item) => item.Group === group && item.Status === "Done"
    );
    const times = doneCards.map((card) => card.TimeToDone);
    return times.length > 0
      ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
      : 0;
  });

  const chartData = {
    labels: groups,
    datasets: [
      {
        label: "Average Time to Complete Cards (in days)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: averageTimeToDoneByGroup,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} days`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Time (days)",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};
const CardCompletionTrendsByMonth = ({ data }) => {
  // Get unique months from the dataset
  const months = [...new Set(data.map((item) => item.Month))];

  // Aggregate the number of completed (Done) cards for each month
  const completedCardsByMonth = months.map((month) => {
    return data.filter((item) => item.Month === month && item.Status === "Done")
      .length;
  });

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Completed Cards",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointRadius: 5,
        fill: true,
        data: completedCardsByMonth,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} cards completed`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Completed Cards",
        },
      },
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};
const MemberTaskVisualization = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  // Get unique members from the dataset
  const members = [...new Set(data.map((item) => item.Member))];

  // Aggregate the number of Done and Undone tasks for each member
  const doneTasksByMember = members.map((member) => {
    return data.filter(
      (item) => item.Member === member && item.Status === "Done"
    ).length;
  });

  const undoneTasksByMember = members.map((member) => {
    return data.filter(
      (item) => item.Member === member && item.Status === "Undone"
    ).length;
  });

  // Calculate the average time to complete tasks for each member
  const avgTimeToDoneByMember = members.map((member) => {
    const doneTasks = data.filter(
      (item) => item.Member === member && item.Status === "Done"
    );
    const times = doneTasks.map((card) => card.TimeToDone);
    return times.length > 0
      ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
      : 0;
  });

  // Data for task completion bar chart
  const taskChartData = {
    labels: members,
    datasets: [
      {
        label: "Done",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: doneTasksByMember,
      },
      {
        label: "Undone",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        data: undoneTasksByMember,
      },
    ],
  };

  // Data for average time line chart
  const avgTimeChartData = {
    labels: members,
    datasets: [
      {
        label: "Average Time to Complete (Days)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointRadius: 5,
        fill: true,
        data: avgTimeToDoneByMember,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} tasks`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tasks",
        },
      },
      x: {
        title: {
          display: true,
          text: "Members",
        },
      },
    },
  };

  const avgTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} days`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Average Time (days)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Members",
        },
      },
    },
  };

  return (
    <div>
      <Bar data={taskChartData} options={options} />
      <Line data={avgTimeChartData} options={avgTimeOptions} />
    </div>
  );
};
const MemberTaskVisualization2 = ({ data, member }) => {
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Get unique months
  const months = [...new Set(data.map((item) => item.Month))];

  // Event handler for selecting a month
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };

  // Filter data based on the selected month and member
  const filteredData = selectedMonth
    ? data.filter(
        (item) => item.Month === selectedMonth && item.Member === member
      )
    : [];

  // Aggregate Done and Undone tasks
  const doneTasks = filteredData.filter(
    (item) => item.Status === "Done"
  ).length;
  const undoneTasks = filteredData.filter(
    (item) => item.Status === "Undone"
  ).length;

  // Data for the bar chart
  const chartData = {
    labels: ["Done", "Undone"],
    datasets: [
      {
        label: `${member}'s Tasks for ${selectedMonth || "Selected Month"}`,
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
        data: [doneTasks, undoneTasks],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h6
        style={{
          marginBottom: "1rem",
        }}
      >
        {member}'s Task Visualization
      </h6>
      <div>
        <Select
          data={months.map((month) => ({ value: month, label: month }))}
          placeholder="Select a month"
          onChange={(value) => handleMonthClick(value)}
          allowDeselect={false}
        />
      </div>

      {/* Show the bar chart only if a month is selected */}
      {selectedMonth && <Bar data={chartData} options={options} />}
    </div>
  );
};

const CombinedChart = () => {
  const data = [
    {
      Month: "January",
      Group: "BD1",
      Size: "Small",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 50,
      HealthStatus: "Good",
    },
    {
      Month: "January",
      Group: "BD1",
      Size: "Big",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 63,
      HealthStatus: "Warning",
    },
    {
      Month: "January",
      Group: "BD1",
      Size: "Medium",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Month: "February",
      Group: "BD2",
      Size: "Small",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 120,
      HealthStatus: "Good",
    },
    {
      Month: "February",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 95,
      HealthStatus: "Good",
    },
    {
      Month: "February",
      Group: "BD2",
      Size: "Big",
      Type: "Scale - Niche",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "March",
      Group: "BD3",
      Size: "Big",
      Type: "New - Phủ Market",
      Status: "Done",
      TimeToDone: 180,
      HealthStatus: "Overload",
    },
    {
      Month: "March",
      Group: "BD3",
      Size: "Small",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 40,
      HealthStatus: "Good",
    },
    {
      Month: "March",
      Group: "BD3",
      Size: "Medium",
      Type: "Scale - Clipart",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "April",
      Group: "BD1",
      Size: "Big",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 130,
      HealthStatus: "Good",
    },
    {
      Month: "April",
      Group: "BD1",
      Size: "Small",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "April",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 75,
      HealthStatus: "Good",
    },
    {
      Month: "April",
      Group: "BD2",
      Size: "Big",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 60,
      HealthStatus: "Overload",
    },
    {
      Month: "May",
      Group: "BD3",
      Size: "Small",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 90,
      HealthStatus: "Good",
    },
    {
      Month: "May",
      Group: "BD3",
      Size: "Medium",
      Type: "New - Phủ Market",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "May",
      Group: "BD1",
      Size: "Big",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 150,
      HealthStatus: "Good",
    },
    {
      Month: "June",
      Group: "BD2",
      Size: "Small",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 110,
      HealthStatus: "Good",
    },
    {
      Month: "June",
      Group: "BD2",
      Size: "Medium",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Month: "June",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 200,
      HealthStatus: "Warning",
    },
    {
      Month: "July",
      Group: "BD1",
      Size: "Small",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 55,
      HealthStatus: "Good",
    },
    {
      Month: "July",
      Group: "BD1",
      Size: "Big",
      Type: "New - Phủ Market",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Month: "July",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 100,
      HealthStatus: "Good",
    },
    {
      Month: "August",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 160,
      HealthStatus: "Warning",
    },
    {
      Month: "August",
      Group: "BD3",
      Size: "Small",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 45,
      HealthStatus: "Good",
    },
    {
      Month: "August",
      Group: "BD3",
      Size: "Medium",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Month: "September",
      Group: "BD1",
      Size: "Big",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 140,
      HealthStatus: "Good",
    },
    {
      Month: "September",
      Group: "BD1",
      Size: "Small",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 85,
      HealthStatus: "Good",
    },
    {
      Month: "September",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Niche",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "October",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 120,
      HealthStatus: "Overload",
    },
    {
      Month: "October",
      Group: "BD3",
      Size: "Small",
      Type: "New - Phủ Market",
      Status: "Done",
      TimeToDone: 95,
      HealthStatus: "Good",
    },
    {
      Month: "October",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Clipart",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Month: "November",
      Group: "BD1",
      Size: "Big",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 135,
      HealthStatus: "Good",
    },
    {
      Month: "November",
      Group: "BD1",
      Size: "Medium",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 80,
      HealthStatus: "Warning",
    },
    {
      Month: "November",
      Group: "BD1",
      Size: "Small",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Month: "December",
      Group: "BD2",
      Size: "Small",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 110,
      HealthStatus: "Good",
    },
    {
      Month: "December",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 100,
      HealthStatus: "Warning",
    },
    {
      Month: "December",
      Group: "BD3",
      Size: "Big",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
  ];
  const memeberData = [
    {
      Member: "Alice",
      Month: "January",
      Group: "BD1",
      Size: "Small",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 89,
      HealthStatus: "Good",
    },
    {
      Member: "Alice",
      Month: "January",
      Group: "BD2",
      Size: "Small",
      Type: "Scale - Niche",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Member: "Alice",
      Month: "January",
      Group: "BD1",
      Size: "Small",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 147,
      HealthStatus: "Warning",
    },
    {
      Member: "Alice",
      Month: "January",
      Group: "BD3",
      Size: "Small",
      Type: "New - Phủ Market",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Member: "Alice",
      Month: "January",
      Group: "BD1",
      Size: "Medium",
      Type: "New - Mix Match",
      Status: "Done",
      TimeToDone: 164,
      HealthStatus: "Overload",
    },
    {
      Member: "Bob",
      Month: "February",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Design",
      Status: "Done",
      TimeToDone: 124,
      HealthStatus: "Good",
    },
    {
      Member: "Bob",
      Month: "February",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 93,
      HealthStatus: "Warning",
    },
    {
      Member: "Bob",
      Month: "February",
      Group: "BD1",
      Size: "Small",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Member: "Charlie",
      Month: "March",
      Group: "BD2",
      Size: "Small",
      Type: "New - Phủ Market",
      Status: "Done",
      TimeToDone: 112,
      HealthStatus: "Good",
    },
    {
      Member: "Charlie",
      Month: "March",
      Group: "BD1",
      Size: "Medium",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 150,
      HealthStatus: "Good",
    },
    {
      Member: "Charlie",
      Month: "March",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Product Line",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Member: "Diana",
      Month: "April",
      Group: "BD3",
      Size: "Big",
      Type: "New - Phủ Market",
      Status: "Done",
      TimeToDone: 85,
      HealthStatus: "Warning",
    },
    {
      Member: "Diana",
      Month: "April",
      Group: "BD2",
      Size: "Medium",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 99,
      HealthStatus: "Good",
    },
    {
      Member: "Diana",
      Month: "April",
      Group: "BD1",
      Size: "Small",
      Type: "New - Mix Match",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Member: "Eve",
      Month: "May",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Product Line",
      Status: "Done",
      TimeToDone: 134,
      HealthStatus: "Good",
    },
    {
      Member: "Eve",
      Month: "May",
      Group: "BD1",
      Size: "Medium",
      Type: "Scale - Clipart",
      Status: "Done",
      TimeToDone: 160,
      HealthStatus: "Overload",
    },
    {
      Member: "Eve",
      Month: "May",
      Group: "BD3",
      Size: "Small",
      Type: "Scale - Niche",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Warning",
    },
    {
      Member: "Alice",
      Month: "June",
      Group: "BD2",
      Size: "Small",
      Type: "New - Phủ Market",
      Status: "Done",
      TimeToDone: 119,
      HealthStatus: "Good",
    },
    {
      Member: "Alice",
      Month: "June",
      Group: "BD1",
      Size: "Medium",
      Type: "Scale - Product Line",
      Status: "Undone",
      TimeToDone: null,
      HealthStatus: "Overload",
    },
    {
      Member: "Bob",
      Month: "June",
      Group: "BD3",
      Size: "Big",
      Type: "Scale - Niche",
      Status: "Done",
      TimeToDone: 105,
      HealthStatus: "Good",
    },
    {
      Member: "Bob",
      Month: "June",
      Group: "BD2",
      Size: "Medium",
      Type: "New - Mix Match",
      Status: "Done",
      TimeToDone: 140,
      HealthStatus: "Warning",
    },
  ];

  const [showBigSizeChart, setShowBigSizeChart] = useState(false);
  // Data for the "Big Size" specific chart
  const bigSizeData = {
    labels: ["Brief 1", "Brief 2", "Brief 3", "Brief 4"],
    datasets: [
      {
        label: "Time to Done",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: [120, 150, 200, 180], // Example time to done for "Big" size cards
      },
    ],
  };
  const combinedData = {
    labels: ["BD1", "BD2", "BD3"], // Group names
    datasets: [
      {
        type: "bar",
        label: "Done",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        data: [3, 2, 4], // Done cards per group
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Undone",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [1, 2, 0], // Undone cards per group
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Average Time to Done",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
        data: [50, 85, 30], // Avg time to done for each group
      },
      {
        type: "bar",
        label: "Small Size %",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        data: [50, 20, 30], // % of small cards per group
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Medium Size %",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        data: [30, 50, 20], // % of medium cards per group
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Big Size %",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        data: [20, 30, 50], // % of big cards per group
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Scale - Product Line %",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        data: [20, 15, 25], // % for 'Scale - Product Line' by group
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Scale - Clipart %",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        data: [10, 30, 20], // % for 'Scale - Clipart' by group
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Scale - Niche %",
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        data: [25, 20, 15], // % for 'Scale - Niche' by group
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "New - Phủ Market %",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        data: [15, 10, 25], // % for 'New - Phủ Market' by group
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "Scale - Design %",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        data: [30, 20, 10], // % for 'Scale - Design' by group
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        type: "bar",
        label: "New - Mix Match %",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [10, 5, 15], // % for 'New - Mix Match' by group
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Designer",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            // Customize the tooltip label here
            const label = tooltipItem.dataset.label;
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const label = combinedData.datasets[datasetIndex].label;

        // Detect if "Big Size %" label is clicked
        if (label === "Big Size %") {
          setShowBigSizeChart(true); // Show the Big Size chart
        }
      }
    },
    hover: {
      mode: "nearest",
      intersect: true,
      onHover: (event, elements) => {
        if (elements.length > 0) {
          event.native.target.style.cursor = "pointer"; // Change the cursor when hovering over data points
        } else {
          event.native.target.style.cursor = "default";
        }
      },
    },
  };
  const bigSizeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Big Size Cards - Time to Done",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: () => {
      // Clicking anywhere on the Big Size chart switches back to the combined chart
      setShowBigSizeChart(false);
    },
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Design"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            {!showBigSizeChart ? (
              <Bar data={combinedData} options={options} />
            ) : (
              <Bar data={bigSizeData} options={bigSizeOptions} />
            )}
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Monthly Chart"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            <MonthlyChart data={data} />
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Average Time"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            <AverageTimeToCompleteCards data={data} />
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Completion Trends by Month"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            <CardCompletionTrendsByMonth data={data} />
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Member Task Visualization"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            <MemberTaskVisualization data={memeberData} />
          </div>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card
          className={cn(styles.card)}
          title="Member Task Visualization"
          classTitle={cn("title-purple", styles.title)}
          classCardHead={styles.head}
        >
          <div className={styles.chartjs}>
            <MemberTaskVisualization2 data={memeberData} member="Alice" />
          </div>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default CombinedChart;
