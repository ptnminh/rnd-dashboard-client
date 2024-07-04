import React, { forwardRef } from "react";
import { HoverCard, Group } from "@mantine/core";
import cn from "classnames";
import styles from "./Checkbox.module.sass";

const CustomCheckbox = forwardRef(
  (
    {
      className,
      classCheckboxTick,
      content,
      value,
      onChange,
      reverse,
      HoverComponent,
      showHover,
      hoverProps,
    },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(styles.checkbox, className, {
          [styles.reverse]: reverse,
        })}
      >
        <input
          className={styles.input}
          type="checkbox"
          onChange={onChange}
          checked={value}
        />
        <span className={styles.inner}>
          <span className={cn(styles.tick, classCheckboxTick)}></span>
          {content &&
            (showHover ? (
              <HoverCard width={280} shadow="md" withArrow openDelay={500}>
                <HoverCard.Target>
                  <span
                    className={styles.text}
                    dangerouslySetInnerHTML={{ __html: content }}
                  ></span>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <HoverComponent {...hoverProps} />
                </HoverCard.Dropdown>
              </HoverCard>
            ) : (
              <span
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: content }}
              ></span>
            ))}
        </span>
      </label>
    );
  }
);

export default CustomCheckbox;
