import React from "react";
import styles from "./Table.module.sass";
import Row from "./Row";
import Checkbox from "../../../components/Checkbox";
import { isEmpty } from "lodash";

const Table = ({
  items,
  handleChangeCampaignName,
  selectedFilters,
  visibleModalDuplicate,
  setVisibleModalDuplicate,
  handleSelectAllCampaigns,
  stores,
  setStores,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.col}>
            <Checkbox
              onChange={() => handleSelectAllCampaigns(items)}
              value={!isEmpty(selectedFilters)}
            />
          </div>
          <div className={styles.col}>Name</div>
          <div className={styles.col}>SKUs</div>
          <div className={styles.col}>KW/ASIN</div>
          <div className={styles.col}>Budget</div>
          <div className={styles.col}>Default Bid</div>
          <div className={styles.col}>Bid</div>
          <div className={styles.col}>Store</div>
        </div>
        {items.map((x, index) => (
          <Row
            item={x}
            key={index}
            index={index}
            value={selectedFilters.includes(x.campaignName)}
            onChange={() => handleChangeCampaignName(x.campaignName)}
            visibleModalDuplicate={visibleModalDuplicate}
            setVisibleModalDuplicate={setVisibleModalDuplicate}
            stores={stores}
            setStores={setStores}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
