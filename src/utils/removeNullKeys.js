const removeNullKeys = (object) => {
  const cloneObj = {
    ...object,
  };

  Object.entries(cloneObj).forEach(([key, value]) => {
    if (value === null) {
      delete cloneObj[key];
    }
  });

  return cloneObj;
};

export default removeNullKeys;
