import React from "react";
import styles from "./Row.module.sass";
import Checkbox from "../../Checkbox";
import { map } from "lodash";

const Row = ({ item, value, onChange, headers, isShowCheckbox }) => {
  return (
    <>
      <div className={styles.row}>
        {map(headers, (header, index) => (
          <div className={styles.col} key={index}>
            <div>{item[header]}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Row;
