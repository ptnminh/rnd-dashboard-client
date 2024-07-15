import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Icon from "../../../../components/Icon";
import { TextInput } from "@mantine/core";

const Row = ({
  item,
  handleClick,
  selectedCollection,
  editCollection,
  setEditCollection,
  editCollectionName,
  setEditCollectionName,
  handleSaveNewCollectionName,
  openModalConfirmDeleteCollection,
  openModalConfirmDeleteProductLine,
}) => {
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
              {editCollection && selectedCollection.name === item.name ? (
                <TextInput
                  value={editCollectionName}
                  onChange={(event) =>
                    setEditCollectionName(event.target.value)
                  }
                />
              ) : (
                <div className={styles.user}>{item.name}</div>
              )}
            </div>
          </div>
        </div>
        <div
          className={styles.col}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              handleClick(item.name);
            }}
          >
            {editCollection && selectedCollection.name === item.name ? (
              <span
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span onClick={handleSaveNewCollectionName}>
                  <Icon name="check" size={24} fill="#646A73" />
                </span>
                <span
                  onClick={() => {
                    setEditCollection(!editCollection);
                  }}
                >
                  <Icon name="close" size={24} fill="#646A73" />
                </span>
              </span>
            ) : (
              <span
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span
                  onClick={() => {
                    setEditCollectionName(item.name);
                    setEditCollection(!editCollection);
                  }}
                >
                  <Icon name="edit" size={24} fill="#646A73" />
                </span>
                <span
                  onClick={() => {
                    openModalConfirmDeleteCollection(item.uid);
                  }}
                >
                  <Icon name="trash" size={24} fill="#646A73" />
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default Row;
