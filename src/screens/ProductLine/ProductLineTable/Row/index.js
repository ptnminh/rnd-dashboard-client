import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Icon from "../../../../components/Icon";
import { Image } from "@mantine/core";

const Row = ({
  item,
  handleClick,
  selectedCollection,
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
        <div className={styles.col}>
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item.name}</div>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <Image
            src={
              item.imageSrc || item.image || "/images/content/not_found_2.jpg"
            }
            height={50}
            width={50}
            fit="contain"
          />
        </div>
        <div
          className={styles.col}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              openModalConfirmDeleteProductLine(item.uid);
            }}
          >
            <Icon name="trash" size={24} fill="#646A73" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Row;
