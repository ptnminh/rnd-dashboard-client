import cn from "classnames";
import { useState } from "react";
import Card from "../../components/Card";
import styles from "./RequestVideo.module.sass";
import Table from "./Table";

const SamplePage = () => {
  const [query, setQuery] = useState({
    status: [1],
    statusValue: "Undone",
  });

  return (
    <Card
      className={styles.card}
      title="REQUEST VIDEO SAMPLE"
      classTitle={cn("title-purple", styles.title)}
      classCardHead={cn(styles.head)}
    >
      <Table query={query} setQuery={setQuery} />
    </Card>
  );
};

export default SamplePage;
