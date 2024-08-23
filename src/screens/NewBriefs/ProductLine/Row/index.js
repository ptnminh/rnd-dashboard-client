import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";

const Row = ({
  item,
  value,
  onChange,
  activeTable,
  setActiveTable,
  activeId,
  setActiveId,
}) => {
  return (
    <>
      <div
        className={cn(
          styles.row,
          { [styles.selected]: activeId === item.portfolioId },
          { [styles.active]: activeTable }
        )}
      >
        <div className={styles.col}>
          <div className={styles.user}>{item.portfolio}</div>
        </div>

        <div className={styles.col}>
          <div className={cn("status-green-dark", styles.purchase)}>
            {item.productLine}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.lifetime}>
            <div className={styles.price}>{item.portfolioId}</div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.user}>{item.store}</div>
        </div>
      </div>
    </>
  );
};

export default Row;
