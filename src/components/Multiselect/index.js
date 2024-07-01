import React, { useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Dropdown.module.sass";
import Tooltip from "../Tooltip";

const MultiSelect = ({
  className,
  classDropdownHead,
  classDropdownLabel,
  values,
  setValues,
  options,
  label,
  tooltip,
  small,
  upBody,
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (value) => {
    if (values.includes(value)) {
      setValues(values.filter((v) => v !== value));
    } else {
      setValues([...values, value]);
    }
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div style={{ width: "100%" }}>
        {label && (
          <div className={cn(styles.label, classDropdownLabel)}>
            {label}{" "}
            {tooltip && (
              <Tooltip
                className={styles.tooltip}
                title={tooltip}
                icon="info"
                place="right"
              />
            )}
          </div>
        )}
        <div
          className={cn(
            styles.dropdown,
            className,
            { [styles.small]: small },
            {
              [styles.active]: visible,
            }
          )}
        >
          <div
            className={cn(styles.head, classDropdownHead)}
            onClick={() => setVisible(!visible)}
          >
            <div className={styles.selection}>
              {values.length > 0 ? values.join(", ") : "Select options"}
            </div>
          </div>
          <div className={cn(styles.body, { [styles.bodyUp]: upBody })}>
            {options.map((x, index) => (
              <div
                className={cn(styles.option, {
                  [styles.selectioned]: values.includes(x),
                })}
                onClick={() => handleClick(x)}
                key={index}
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default MultiSelect;
