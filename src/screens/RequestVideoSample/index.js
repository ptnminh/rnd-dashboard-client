import Card from "../../components/Card";
import Table from "./Table";
import styles from "./RequestVideo.module.sass";
import cn from "classnames";
import { useState } from "react";

const SamplePage = () => {
  const [query, setQuery] = useState({});

  console.log("query", query);

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
