import { Badge } from "@mantine/core";

const VideoLink = ({ href }) => {
  return (
    <a
      style={{
        cursor: "pointer",
      }}
      target="_blank"
      href={href}
      rel="noreferrer"
    >
      {href ? (
        <Badge color="blue" variant="filled">
          <u>Link</u>
        </Badge>
      ) : null}
    </a>
  );
};

export default VideoLink;
