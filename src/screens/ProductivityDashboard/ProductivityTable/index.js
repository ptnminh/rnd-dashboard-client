import React from "react";
import { Box, Grid } from "@mantine/core";

import ProductivityBDTable from "./BD";
import ProductivityOPTable from "./OP";
import { filter, set } from "lodash";

const ProductivityTable = ({
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
            tableData={filter(bdData, { department: "bd" })}
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
            tableData={filter(opData, { department: "op" })}
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

export default ProductivityTable;
