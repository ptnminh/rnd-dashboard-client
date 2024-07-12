import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Checkbox from "../../../../components/Checkbox";
import Icon from "../../../../components/Icon";

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
        <div className={styles.col} onClick={() => handleClick(item.name)}>
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item.name}</div>
            </div>
          </div>
        </div>
        <div
          className={styles.col}
          style={{
            cursor: "pointer",
          }}
        >
          <span>
            <Icon name="trash" size={24} fill="#646A73" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Row;
