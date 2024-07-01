import React, { useState } from "react";
import cn from "classnames";
import styles from "./Preview.module.sass";
import Card from "../../../components/Card";
import Icon from "../../../components/Icon";
import Table from "../CampaignInfo/Table";

const Preview = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn(styles.preview, { [styles.visible]: visible })}>
      <Table
        className={styles.table}
        activeTable={visible}
        setActiveTable={setVisible}
      />
    </div>
  );
};

export default Preview;
