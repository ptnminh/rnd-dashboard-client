import React from "react";
import styles from "./Schedule.module.sass";
import cn from "classnames";
import { STORES } from "../../../constant";
import MultiSelect from "../../../components/Multiselect";
import { isEmpty } from "lodash";

const Schedule = ({
  className,
  stores,
  setStores,
  onConfirm,
  setVisibleModalDuplicate,
}) => {
  return (
    <div className={cn(styles.schedule, className)}>
      <div className={cn("title-red", styles.title)}>Duplicate Campaign</div>
      <div className={styles.note}>Choose a store for duplicate Campaign</div>
      <div className={styles.list}>
        <MultiSelect
          values={stores}
          setValues={setStores}
          options={STORES}
          label="Select Stores"
        />
      </div>
      <div
        className={styles.btns}
        onClick={() => {
          if (isEmpty(stores)) return;
          setVisibleModalDuplicate(false);
          onConfirm();
        }}
      >
        <button className={cn("button", styles.button)}>Duplicate</button>
      </div>
    </div>
  );
};

export default Schedule;
