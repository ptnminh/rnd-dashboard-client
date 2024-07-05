import React, { useState } from "react";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./Dropdown.module.sass";
import Tooltip from "../Tooltip";
import { map } from "lodash";

const Dropdown = ({
  className,
  classDropdownHead,
  classDropdownLabel,
  value,
  setValue,
  options,
  label,
  tooltip,
  small,
  upBody,
  classOutSideClick,
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (value) => {
    setValue(value);
    setVisible(false);
  };

  return (
    <div className={cn(styles.outsideClick, classOutSideClick)}>
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
              <div className={styles.selection}>{value}</div>
            </div>
            <div className={cn(styles.body, { [styles.bodyUp]: upBody })}>
              {map(options, (x, index) => (
                <div
                  className={cn(styles.option, {
                    [styles.selectioned]: x === value,
                  })}
                  onClick={() => handleClick(x, index)}
                  key={index}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Dropdown;
