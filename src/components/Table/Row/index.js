import React from "react";
import styles from "./Row.module.sass";
import { map } from "lodash";

const Row = ({ item, headers, onRemove }) => {
  return (
    <>
      <div className={styles.row}>
        {map(headers, (header, index) => (
          <div
            className={styles.col}
            key={index}
            style={{
              cursor: header === "Remove" ? "pointer" : "default",
            }}
            onClick={() => {
              onRemove(item["Product Line"]);
            }}
          >
            <div>{item[header]}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Row;
