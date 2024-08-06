import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Checkbox from "../../../../components/Checkbox";

const Row = ({ item, value, onChange, handleClick, selectedCollection }) => {
  return (
    <>
      <div
        className={cn(
          styles.row,
          { [styles.selected]: selectedCollection?.name === item.name },
          { [styles.active]: selectedCollection?.name === item.name }
        )}
      >
        <div className={styles.col}>
          <Checkbox
            className={styles.checkbox}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className={styles.col} onClick={() => handleClick(item.name)}>
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item.name}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Row;
