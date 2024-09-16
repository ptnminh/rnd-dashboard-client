import React from "react";
import { Box, Grid } from "@mantine/core";

import ProductivityBDTable from "./BD";
import ProductivityOPTable from "./OP";
import { filter } from "lodash";

const MonthlyProductivityTable = ({
  opData,
  bdData,
  opQuery,
  bdQuery,
  setOpQuery,
  setBDQuery,
  oploading,
  bdloading,
  setOPTrigger,
  setBDTrigger,
  sorting,
  setSorting,
  weeks,
  currentWeek,
}) => {
  return (
    <Box>
      <Grid>
        <Grid.Col span={12}>
          <ProductivityBDTable
            tableData={bdData}
            query={bdQuery}
            loading={bdloading}
            setTrigger={setBDTrigger}
            sorting={sorting}
            setSorting={setSorting}
            setQuery={setBDQuery}
            weeks={weeks}
            currentWeek={currentWeek}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <ProductivityOPTable
            tableData={opData}
            query={opQuery}
            loading={oploading}
            setTrigger={setOPTrigger}
            sorting={sorting}
            setSorting={setSorting}
            setQuery={setOpQuery}
            weeks={weeks}
            currentWeek={currentWeek}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default MonthlyProductivityTable;
