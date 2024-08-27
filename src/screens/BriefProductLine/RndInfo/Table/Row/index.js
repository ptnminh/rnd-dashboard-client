import React from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import { Tooltip } from "react-tooltip";
import Icon from "../../../../../components/Icon";
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
          { [styles.selected]: activeId === item.campaignName },
          { [styles.active]: activeTable }
        )}
      >
        <div className={styles.col}>
          <div className={styles.user}>{item.campaignName}</div>
        </div>

        <div className={styles.col}>
          <div className={cn("status-green-dark", styles.purchase)}>
            {item.skus}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.lifetime}>
            <a
              data-tooltip-id="my-tooltip"
              data-tooltip-html={item.asins || item.keywords}
              data-tooltip-place="top"
            >
              <Icon name="info" size={12} />
            </a>
            <Tooltip id="my-tooltip" />
            <div className={styles.price}>{item.asins || item.keywords}</div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.lifetime}>{item.store}</div>
        </div>
      </div>
    </>
  );
};

export default Row;
