import React from "react";
import cn from "classnames";
import styles from "./TextInput.module.sass";
import Icon from "../Icon";
import Tooltip from "../Tooltip";

const TextInput = ({
  className,
  classLabel,
  classInput,
  label,
  icon,
  copy,
  currency,
  tooltip,
  place,
  register,
  error, // Destructure the error prop
  isTextArea = false,
  ...props
}) => {
  // Hàm tạo thông báo lỗi
  const getErrorMessage = (error) => {
    if (!error) return "";
    switch (error.type) {
      case "required":
        return "Trường này là bắt buộc";
      case "maxLength":
        return `Độ dài tối đa là ${error.ref.maxLength} ký tự`;
      case "minLength":
        return `Độ dài tối thiểu là ${error.ref.minLength} ký tự`;
      case "pattern":
        return "Định dạng không hợp lệ";
      default:
        return "Giá trị không hợp lệ";
    }
  };
  return (
    <div
      className={cn(
        styles.field,
        { [styles.fieldIcon]: icon },
        { [styles.fieldCopy]: copy },
        { [styles.fieldCurrency]: currency },
        className
      )}
    >
      {label && (
        <div className={cn(classLabel, styles.label)}>
          {label}{" "}
          {tooltip && (
            <Tooltip
              className={styles.tooltip}
              title={tooltip}
              icon="info"
              place={place ? place : "right"}
            />
          )}
        </div>
      )}
      <div className={styles.wrap}>
        {isTextArea ? (
          <textarea
            className={cn(classInput, styles.input)}
            {...register} // Use the register function here
            {...props}
            rows={100}
            style={{ height: "200px", padding: "10px" }}
          />
        ) : (
          <input
            className={cn(classInput, styles.input)}
            {...register} // Use the register function here
            {...props}
          />
        )}

        {icon && (
          <div className={styles.icon}>
            <Icon name={icon} size="24" />{" "}
          </div>
        )}
        {copy && (
          <button className={styles.copy}>
            <Icon name="copy" size="24" />{" "}
          </button>
        )}
        {currency && <div className={styles.currency}>{currency}</div>}
      </div>
      {error && <span className={styles.error}>{getErrorMessage(error)}</span>}{" "}
    </div>
  );
};

export default TextInput;
