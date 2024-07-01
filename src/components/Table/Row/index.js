import React, { useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Checkbox from "../../Checkbox";
import ModalProduct from "../../ModalProduct";
import Icon from "../../Icon";
import Actions from "../../Actions";
import Modal from "../../Modal";
import Schedule from "../../Schedule";
import Control from "./Control";
import { Tooltip } from "react-tooltip";

const Row = ({ item, value, onChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  const [visibleModalProduct, setVisibleModalProduct] = useState(false);
  const [visibleModalSchedule, setVisibleModalSchedule] = useState(false);

  const actions = [
    {
      title: "Schedule product",
      icon: "calendar",
      action: () => setVisibleModalSchedule(true),
    },
    {
      title: "Edit title & description",
      icon: "edit",
      action: () => console.log("Edit title & description"),
    },
    {
      title: "Delete forever",
      icon: "trash",
      action: () => console.log("Delete forever"),
    },
  ];

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
          <div>{item.campaignName}</div>
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
          <div
            className={styles.item}
            onClick={() => setVisibleModalProduct(true)}
          ></div>
          <Actions
            className={styles.actions}
            classActionsHead={styles.actionsHead}
            items={actions}
          />
        </div>
      </div>
      <Modal visible={true} onClose={() => setVisibleModalSchedule(false)}>
        <Schedule
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
        />
      </Modal>
    </>
  );
};

export default Row;
