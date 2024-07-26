import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Icon from "../../../../components/Icon";
import { Image, TagsInput, Text } from "@mantine/core";

const Row = ({
  item,
  handleClick,
  selectedCollection,
  openModalDeleteCampaign,
}) => {
  return (
    <>
      <div className={cn(styles.row)}>
        <div className={styles.col}>
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item.campaignName}</div>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <Text>{item?.attribute?.targeting?.ageMax}</Text>
        </div>
        <div className={styles.col}>
          <Text>{item?.attribute?.targeting?.ageMin}</Text>
        </div>
        <div className={styles.col}>
          <TagsInput
            data={item?.attribute?.targeting?.geoLocations?.countries}
            value={item?.attribute?.targeting?.geoLocations?.countries}
            readOnly
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
              openModalDeleteCampaign(item.campaignId);
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
