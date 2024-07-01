import React, { useState } from "react";
import cn from "classnames";
import styles from "./Discussion.module.sass";
import Card from "../../../components/Card";
import Editor from "../../../components/Editor";

const Discussion = ({ className }) => {
  const [content, setContent] = useState();

  return (
    <Card
      className={cn(styles.card, className)}
      title="Kết quả"
      classTitle="title-red"
    >
      <Editor
        state={content}
        onChange={setContent}
        classEditor={styles.editor}
        label="Chi tiết kết quả"
        tooltip="Description Message to reviewer"
      />
    </Card>
  );
};

export default Discussion;
