import React from "react";
import styles from "./Row.module.sass";
import { filter, map } from "lodash";
import { Image } from "@mantine/core";

const Row = ({ item, headers, onRemove, headerRemove }) => {
  return (
    <>
      <div className={styles.row}>
        {map(
          filter(headers, (header) => header !== "uid"),
          (header, index) => (
            <div
              className={styles.col}
              key={index}
              style={{
                cursor: header === "Remove" ? "pointer" : "default",
              }}
              onClick={() => {
                onRemove(item[headerRemove] || item?.uid || "");
              }}
            >
              {header === "Hình" ? (
                <Image
                  src={item[header] || "/images/content/not_found_2.jpg"}
                  style={{ width: "50px" }}
                />
              ) : (
                <div>{item[header]}</div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Row;
