import moment from "moment-timezone";

const formatDate = (value) => {
  if (!value) return;

  return moment(value).format("YYYY-MM-DD");
};

export default formatDate;
