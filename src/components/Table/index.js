import React, { useState } from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Checkbox from "../Checkbox";
import Loader from "../Loader";
import Row from "./Row";
import { map, toUpper } from "lodash";

const Table = ({ items, headers, isShowCheckbox = false, onRemove }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChange = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((x) => x !== id));
    } else {
      setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.row}>
          {map(headers, (x, index) => (
            <div className={styles.col} key={index}>
              {x}
            </div>
          ))}
        </div>
        {items.map((x, index) => (
          <Row
            item={x}
            key={index}
            index={index}
            value={selectedFilters.includes(x.id)}
            onChange={() => handleChange(x.id)}
            headers={headers}
            isShowCheckbox={isShowCheckbox}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
