import React from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Row from "./Row";

import { map } from "lodash";

const Table = ({
  className,
  activeTable,
  collections,
  handleSelectCollection,
  selectedCollection,
  collectionName,
  setCollectionName,
  editCollection,
  setEditCollection,
  editCollectionName,
  setEditCollectionName,
  handleSaveNewCollectionName,
  openModalConfirmDeleteCollection,
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
            handleClick={handleSelectCollection}
            selectedCollection={selectedCollection}
            collectionName={collectionName}
            setCollectionName={(value) => setCollectionName(value)}
            editCollection={editCollection}
            setEditCollection={setEditCollection}
            editCollectionName={editCollectionName}
            setEditCollectionName={setEditCollectionName}
            handleSaveNewCollectionName={handleSaveNewCollectionName}
            openModalConfirmDeleteCollection={openModalConfirmDeleteCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
