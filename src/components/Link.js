import { Badge } from "@mantine/core";

const Link = ({ href }) => {
  if (!href) {
    return "(Empty)";
  }

  return (
    <a
      style={{
        cursor: "pointer",
      }}
      target="_blank"
      href={href}
      rel="noreferrer"
    >
      <Badge color="blue" variant="filled">
        <u>Link</u>
      </Badge>
    </a>
  );
};

export default Link;
