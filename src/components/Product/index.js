import React, { useState } from "react";
import cn from "classnames";
import styles from "./Product.module.sass";
import Control from "./Control";
import Icon from "../Icon";
import Checkbox from "../Checkbox";

const Product = ({
  className,
  item,
  value,
  onChange,
  released,
  withoutСheckbox,
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    onChange();
    setVisible(!visible);
  };

  return (
    <div
      className={cn(styles.product, className, { [styles.active]: visible })}
    >
      <div className={styles.preview}>
        {!withoutСheckbox && (
          <Checkbox
            className={styles.checkbox}
            classCheckboxTick={styles.checkboxTick}
            value={value}
            onChange={() => handleClick()}
          />
        )}
        <Control className={styles.control} />
        <img srcSet={`${item.image2x} 2x`} src={item.image} alt="Product" />
      </div>
      <div className={styles.line}>
        <div className={styles.title}>{item.product}</div>
        <div className={styles.price}>{item.skus}</div>
      </div>
    </div>
  );
};

export default Product;
