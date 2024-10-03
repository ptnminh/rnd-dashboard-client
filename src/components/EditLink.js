import { TextInput } from "@mantine/core";
import { useEffect, useRef } from "react";
import { showNotification } from "../utils/index";

const EditLink = ({
  value,
  onChange,
  onBlurError,
  onBlurSuccess,
  readOnly,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (!inputRef) return;
    inputRef.current.focus();
  }, []);

  return (
    <TextInput
      ref={inputRef}
      value={value}
      onChange={(e) => {
        const value = e.target.value;
        onChange?.(value);
      }}
      onBlur={(e) => {
        const value = e.target.value;
        const urlPattern =
          /^(https?:\/\/)((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[\w-]*)?$/i;

        if (!value) return;

        if (!urlPattern.test(value)) {
          showNotification("Thất bại", "Link Design không hợp lệ", "red");
          onBlurError?.();
        } else {
          onBlurSuccess?.(value);
        }
      }}
      readOnly={readOnly}
    />
  );
};

export default EditLink;
