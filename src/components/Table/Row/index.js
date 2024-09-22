import React from "react";
import styles from "./Row.module.sass";
import { filter, map, split } from "lodash";
import { ActionIcon, Grid, Group, Image, ScrollArea, Text, TextInput, Tooltip } from "@mantine/core";
import cn from "classnames";
import { IconCheck } from "@tabler/icons-react";
import { modals } from '@mantine/modals';
import { rndServices } from "../../../services";

const Row = ({ item, headers, onRemove, headerRemove, editSKUs, setEditSKUs }) => {
  const openUpdateModal = ({
    skuPrefix,
    productLineId
  }) =>
    modals.openConfirmModal({
      title: 'Update Product Line',
      centered: true,
      children: (
        <Text size="sm">
          Bạn đang thực hiện thay đổi SKU Prefix từ <b>XX</b> sang <b>{skuPrefix}</b>
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: "Cancel" },
      confirmProps: { color: 'green' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleUpdateProductLine({ productLineId, skuPrefix }),
    });
  const handleUpdateProductLine = async ({ productLineId, skuPrefix }) => {
    console.log(productLineId, skuPrefix);
    const updateProductLineResponse = await rndServices.updateProductLine(productLineId, { skuPrefix });
    if (updateProductLineResponse) {
      setEditSKUs((prev) => {
        return prev.map((x) => {
          const prefix = split(x.SKU, "-")[0];
          const batch = split(x.SKU, "-")[1];
          if (x.productLineId === productLineId && prefix === "XX") {
            return { ...x, newSku: `${skuPrefix}-${batch}` };
          }
          return x;
        });
      })
    }

  }
  return (
    <>
      <div
        className={cn({
          [styles.row]: true,
          [styles.active]: item && item?.SKU?.startsWith("XX"),
        })}
      >
        {map(
          filter(headers, (header) => header !== "uid" && header !== "uniqueId" && header !== "newSku" && header !== "productLineId"),
          (header, index) => (
            <div className={styles.col} key={index}>
              {header === "Hình" ||
                header === "Design" ||
                header === "Clipart" ||
                header === "Hình Product Base" ||
                header === "Ref" || header === "Hình Clipart" ? (
                <ScrollArea offsetScrollbars="x" w={200}>
                  {Array.isArray(item[header]) ? (
                    <Grid>
                      {map(item[header], (image) => (
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
                  {
                    header === "SKU" && item?.SKU?.startsWith("XX") ? (
                      <Group style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "150px",
                      }}>
                        {item.productLineId && (
                          <Tooltip label="Update SKU Prefix">
                            <ActionIcon
                              size="sm"
                              onClick={() => {
                                const skuPrefix = split(item.newSku, "-")[0];
                                openUpdateModal({ skuPrefix, productLineId: item.productLineId });
                              }}
                            >
                              <IconCheck />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        <TextInput
                          value={item.newSku || item[header]}
                          style={{ width: "100px" }}
                          onChange={(event) => {
                            setEditSKUs((prev) =>
                              prev.map((x) => {
                                if (x.uniqueId === item["uniqueId"]) {
                                  return { ...x, newSku: event.target.value };
                                }
                                return x;
                              })
                            );
                          }}
                        />

                      </Group>
                    ) : item[header]
                  }
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
