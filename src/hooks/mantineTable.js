import { useState } from "react";

export function useEdit(props) {
  const { cell, column, table, row } = props;

  const [value, setValue] = useState(() => cell.getValue());

  const { setEditingCell, getState, setEditingRow, setCreatingRow } = table;

  const { editingRow, creatingRow } = getState();
  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;
  const handleOnChange = (newValue) => {
    row._valuesCache[column.id] = newValue;
    if (isCreating) setCreatingRow(row);
    else if (isEditing) setEditingRow(row);
    setValue(newValue);
  };

  const handleBlur = (event) => {
    setEditingCell(null);
  };

  return { value, handleOnChange, handleBlur };
}
