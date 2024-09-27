import React, { useState } from "react";
import styles from "./Table.module.sass";
import Row from "./Row";
import { filter, map } from "lodash";

const Table = ({
  items,
  headers,
  isShowCheckbox = false,
  onRemove,
  headerRemove,
  editSKUs,
  setEditSKUs,
  setProductBases,
  productBases,
  SKU,
  setSKU,
  selectedProductBases,
  setSelectedProductBases,
  rndInfo,
  setTriggerCreateSKUPayload
}) => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChange = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((x) => x !== id));
    } else {
      setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.row}>
          {map(
            filter(headers, (header) => header !== "uid"),
            (x, index) => (
              <div className={styles.col} key={index}>
                {x}
              </div>
            )
          )}
        </div>
        {items.map((x, index) => (
          <Row
            item={x}
            key={index}
            index={index}
            value={selectedFilters.includes(x.id)}
            onChange={() => handleChange(x.id)}
            headers={headers}
            isShowCheckbox={isShowCheckbox}
            onRemove={onRemove}
            headerRemove={headerRemove}
            editSKUs={editSKUs}
            setEditSKUs={setEditSKUs}
            setProductBases={setProductBases}
            productBases={productBases}
            SKU={SKU}
            setSKU={setSKU}
            selectedProductBases={selectedProductBases}
            setSelectedProductBases={setSelectedProductBases}
            rndInfo={rndInfo}
            setTriggerCreateSKUPayload={setTriggerCreateSKUPayload}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
