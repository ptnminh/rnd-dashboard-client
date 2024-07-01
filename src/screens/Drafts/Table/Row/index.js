import React from "react";
import styles from "./Row.module.sass";

import { Tooltip } from "react-tooltip";
import Checkbox from "../../../../components/Checkbox";
import Icon from "../../../../components/Icon";
const Row = ({ item, value, onChange }) => {
  return (
    <>
      <div className={styles.row}>
        <div className={styles.col}>
          <Checkbox
            className={styles.checkbox}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className={styles.col}>
          <div className={styles.control}>{item.campaignName}</div>
        </div>
        <div className={styles.col}>
          <div className={styles.price}>{item.skus}</div>
        </div>
        <div className={styles.col}>
          <a
            data-tooltip-id="my-tooltip"
            data-tooltip-content={item.asins || item.keywords}
            data-tooltip-place="top"
          >
            <Icon name="info" size={12} />
          </a>
          <Tooltip id="my-tooltip" />
          <div className={styles.keywords}>{item.asins || item.keywords}</div>
        </div>
        <div className={styles.col}>
          <div className={styles.control}>{item.dailyBudget}</div>
        </div>
        <div className={styles.col}>
          <div className={styles.control}>{item.defaultBid}</div>
        </div>
        <div className={styles.col}>
          <div className={styles.control}>{item.bid}</div>
        </div>
        <div className={styles.col}>
          <div className={styles.control}>{item.store}</div>
        </div>
      </div>
    </>
  );
};

export default Row;
