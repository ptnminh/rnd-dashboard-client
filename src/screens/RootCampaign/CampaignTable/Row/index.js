import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Icon from "../../../../components/Icon";

const Row = ({
  item,
  handleClick,
  selectedCollection,
  openModalConfirmDeleteCollection,
}) => {
  return (
    <>
      <div
        className={cn(
          styles.row,
          {
            [styles.selected]:
              selectedCollection?.accountId === item?.accountId,
          },
          {
            [styles.active]: selectedCollection?.accountId === item?.accountId,
          }
        )}
      >
        <div
          className={styles.col}
          onClick={() => handleClick(item?.accountId)}
        >
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item?.accountInfo?.name}</div>
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
          >
            <span
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <span
                onClick={() => {
                  openModalConfirmDeleteCollection(item.uid);
                }}
              >
                <Icon name="trash" size={24} fill="#646A73" />
              </span>
            </span>
          </span>
        </div>
      </div>
    </>
  );
};

export default Row;
