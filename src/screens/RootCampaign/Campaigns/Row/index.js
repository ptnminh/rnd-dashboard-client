import React, { useEffect, useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Icon from "../../../../components/Icon";
import { IconEye, IconCircleCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  Accordion,
  List,
  Modal,
  rem,
  ScrollArea,
  TagsInput,
  ThemeIcon,
} from "@mantine/core";
import { compact, isEmpty, keys, map, snakeCase } from "lodash";
import { toCamelCase, toPascalCase } from "../../../../utils";
const Row = ({
  item,
  handleClick,
  selectedCollection,
  openModalDeleteCampaign,
}) => {
  const targetingKeys = keys(item?.attribute?.formattedTargeting);
  const targeting = compact(
    map(targetingKeys, (key) => {
      const { label, value } = item?.attribute?.formattedTargeting[key];
      if (isEmpty(value)) {
        return null;
      }
      if (Array.isArray(value)) {
        return {
          value: label,
          description: value,
          components: "TagsInput",
        };
      } else {
        return {
          value: label,
          description: value,
          components: "List",
        };
      }
    })
  );
  console.log(targeting);

  const [opened, { open, close }] = useDisclosure(false);
  const items = map(targeting, (item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>
        {item.components === "TagsInput" ? (
          <TagsInput
            data={item.description}
            value={item.description}
            readOnly
          />
        ) : (
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
          >
            {map(keys(item.description), (key, index) => {
              const value = item.description[key];
              const refactoredKey = snakeCase(key);
              if (value === null || (Array.isArray(value) && isEmpty(value)))
                return null;
              return (
                <List.Item key={index} style={{ display: "flex" }}>
                  {Array.isArray(value) ? (
                    <TagsInput
                      data={value}
                      value={value}
                      readOnly
                      label={refactoredKey}
                      styles={{
                        label: {
                          marginBottom: "10px",
                        },
                      }}
                    />
                  ) : (
                    `${refactoredKey}: ${value}`
                  )}
                </List.Item>
              );
            })}
          </List>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  const [accordionValue, setAccordionValue] = useState(map(targeting, "value"));
  useEffect(() => {
    setAccordionValue(map(targeting, "value"));
  }, [item]);
  return (
    <>
      <div className={cn(styles.row)}>
        <div className={styles.col}>
          <div className={styles.item}>
            <div className={styles.details}>
              <div className={styles.user}>{item.campaignName}</div>
            </div>
          </div>
        </div>
        <div
          className={styles.col}
          style={{
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              height: "100%",
            }}
          >
            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                open();
              }}
            >
              <IconEye />
            </span>
            <span
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                openModalDeleteCampaign(item.campaignId);
              }}
            >
              <Icon name="trash" size={24} fill="#646A73" />
            </span>
          </div>
        </div>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="lg"
      >
        <ScrollArea
          h={550}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <Accordion
            maw={400}
            multiple={true}
            defaultValue={accordionValue}
            styles={{
              root: {
                minWidth: "100%",
              },
            }}
          >
            {items}
          </Accordion>
        </ScrollArea>
      </Modal>
    </>
  );
};

export default Row;
