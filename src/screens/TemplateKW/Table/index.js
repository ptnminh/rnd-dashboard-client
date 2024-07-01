import React from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Checkbox from "../../../components/Checkbox";
import Row from "./Row";

import { isEmpty, map } from "lodash";

const Table = ({
  className,
  activeTable,
  templatesKW,
  selectedFilters,
  handleSelectAllKWs,
  handleChangeTemplateKW,
  handleSelectTemplateKW,
  selectedTemplate,
  nameTemplate,
  setNameTemplate,
}) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={cn(styles.table)}>
        <div className={cn(styles.row, { [styles.active]: activeTable })}>
          <div className={styles.col}>
            <Checkbox
              onChange={() => handleSelectAllKWs(templatesKW)}
              value={!isEmpty(selectedFilters)}
            />
          </div>
          <div className={styles.col}>Name</div>
        </div>
        {map(templatesKW, (x, index) => (
          <Row
            item={x}
            key={index}
            value={selectedFilters.includes(x.name)}
            onChange={() => handleChangeTemplateKW(x.name)}
            handleClick={handleSelectTemplateKW}
            selectedTemplate={selectedTemplate}
            nameTemplate={nameTemplate}
            onChangeNameTemplate={(value) => setNameTemplate(value)}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
