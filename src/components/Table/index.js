import React, { useState } from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Checkbox from "../Checkbox";
import Loader from "../Loader";
import Row from "./Row";

const Table = ({ items, title }) => {
  const [chooseAll, setСhooseAll] = useState(false);

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
          <div className={styles.col}>
            <Checkbox
              className={styles.checkbox}
              value={chooseAll}
              onChange={() => setСhooseAll(!chooseAll)}
            />
          </div>
          <div className={styles.col}>Name</div>
          <div className={styles.col}>SKUs</div>
          <div className={styles.col}>KW/ASIN</div>
          <div className={styles.col}>Budget</div>
          <div className={styles.col}>Default Bid</div>
          <div className={styles.col}>Bid</div>
        </div>
        {items.map((x, index) => (
          <Row
            item={x}
            key={index}
            index={index}
            value={selectedFilters.includes(x.id)}
            onChange={() => handleChange(x.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
