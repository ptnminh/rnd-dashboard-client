import cn from "classnames";
import Card from "../../components/Card";
import styles from "./RequestVideoScreen.module.sass";
import Table from "./Table";
import { useState } from "react";

const RequestVideoScreenPage = () => {
  const [query, setQuery] = useState({
    status: [2],
    statusValue: "Undone",
  });

  return (
    <Card
      className={styles.card}
      title="VIDEO"
      classTitle={cn("title-purple", styles.title)}
      classCardHead={cn(styles.head)}
    >
      <Table query={query} setQuery={setQuery} />
    </Card>
  );
};

export default RequestVideoScreenPage;
