import React from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Row from "./Row";

import { includes, map } from "lodash";

const Table = ({
  className,
  activeTable,
  productLines,
  selectedFilters,
  handleChangeCollection,
  handleSelectCollection,
  selectedCollection,
  collectionName,
  setCollectionName,
  openModalConfirmDeleteProductLine,
}) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={cn(styles.table)}>
        <div className={cn(styles.row, { [styles.active]: activeTable })}>
          <div className={styles.col}>Product Base</div>
        </div>
        {map(productLines, (x, index) => (
          <Row
            item={x}
            key={index}
            handleClick={handleSelectCollection}
            selectedCollection={selectedCollection}
            collectionName={collectionName}
            setCollectionName={(value) => setCollectionName(value)}
            openModalConfirmDeleteProductLine={
              openModalConfirmDeleteProductLine
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
