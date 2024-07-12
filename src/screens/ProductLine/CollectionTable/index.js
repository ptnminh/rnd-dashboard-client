import React from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Checkbox from "../../../components/Checkbox";
import Row from "./Row";

import { includes, isEmpty, map } from "lodash";

const Table = ({
  className,
  activeTable,
  collections,
  selectedFilters,
  handleSelectAllCollections,
  handleChangeCollection,
  handleSelectCollection,
  selectedCollection,
  collectionName,
  setCollectionName,
}) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={cn(styles.table)}>
        <div className={cn(styles.row, { [styles.active]: activeTable })}>
          <div className={styles.col}>Name</div>
        </div>
        {map(collections, (x, index) => (
          <Row
            item={x}
            key={index}
            value={includes(selectedFilters, x.name)}
            onChange={() => handleChangeCollection(x.name)}
            handleClick={handleSelectCollection}
            selectedCollection={selectedCollection}
            collectionName={collectionName}
            setCollectionName={(value) => setCollectionName(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
