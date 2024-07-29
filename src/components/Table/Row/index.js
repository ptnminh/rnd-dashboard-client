import React from "react";
import styles from "./Row.module.sass";
import { filter, map } from "lodash";
import { Flex, Grid, Image, ScrollArea } from "@mantine/core";
import cn from "classnames";

const Row = ({ item, headers, onRemove, headerRemove }) => {
  return (
    <>
      <div
        className={cn({
          [styles.row]: true,
          [styles.active]: item && item?.SKU?.startsWith("XX"),
        })}
      >
        {map(
          filter(headers, (header) => header !== "uid"),
          (header, index) => (
            <div className={styles.col} key={index}>
              {header === "Hình" ||
              header === "Design" ||
              header === "Clipart" ||
              header === "Hình Product Base" ||
              header === "Ref" ? (
                <ScrollArea offsetScrollbars="x" w={200}>
                  {Array.isArray(item[header]) ? (
                    <Grid>
                      {map(item[header], (image, index) => (
                        <Grid.Col span={3}>
                          <Image
                            src={image || "/images/content/not_found_2.jpg"}
                            style={{ width: "50px" }}
                          />
                        </Grid.Col>
                      ))}
                    </Grid>
                  ) : (
                    <Image
                      src={item[header] || "/images/content/not_found_2.jpg"}
                      style={{ width: "50px" }}
                    />
                  )}
                </ScrollArea>
              ) : (
                <div
                  style={{
                    cursor: header === "Remove" ? "pointer" : "default",
                  }}
                  onClick={
                    header === "Remove"
                      ? () => onRemove(item[headerRemove] || item?.uid || "")
                      : undefined
                  }
                >
                  {item[header]}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Row;
