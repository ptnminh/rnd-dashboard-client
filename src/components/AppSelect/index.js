import { useEffect, useState } from "react";
import {
  Input,
  InputBase,
  Combobox,
  useCombobox,
  ScrollArea,
} from "@mantine/core";

const AppSelect = ({ options = [], onChange, defaultValue }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (options && options.length > 0) {
      const selectedItem = options.find((it) => it.value === defaultValue);
      setValue(selectedItem);
    }
  }, [options, defaultValue]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
        onChange?.(val);
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          style={{ overflow: "hidden" }}
        >
          {(value && value.label) || (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {options?.map((option) => (
              <Combobox.Option value={option} key={option.value}>
                {option.label}
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default AppSelect;
