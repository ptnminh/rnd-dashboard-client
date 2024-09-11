import {
  Button,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Text,
  TextInput,
  Card as MantineCard,
  MultiSelect,
  Select,
  Tooltip,
  Modal,
} from "@mantine/core";
import {
  compact,
  concat,
  filter,
  flatMap,
  includes,
  intersectionBy,
  isEmpty,
  map,
  uniqBy,
} from "lodash";
import LazyLoad from "react-lazyload";
import {
  IconCheck,
  IconSearch,
  IconFilterOff,
  IconRotateClockwise,
  IconSelector,
} from "@tabler/icons-react";
import cn from "classnames";
import styles from "./ProductBase.module.sass";
import { useState } from "react";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";
import { BRIEF_TYPES, LAYOUT_TYPES } from "../../../constant";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "../../../utils/index";

const ProductBase = ({
  productLines,
  selectedProductLines,
  setSelectedProductLines,
  fetchProductLinesLoading,
  setQueryProductLines,
  pagination,
  handlePageChange,
  handleSyncProductBases,
  loaderIcon,
  title,
  collections,
  layout,
  setLayout,
  validCollections,
  setValidCollections,
  briefType,
  SKU,
  setUsingProductBaseData,
  setProductBasePagination,
}) => {
  const [searchProductLine, setSearchProductLine] = useState("");

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Card
        className={styles.card}
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
        title={title || "2. Chọn Product Base"}
        classTitle={cn("title-green", styles.title)}
        head={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 5px",
              gap: "10px",
              flexWrap: "wrap",
              borderRadius: "10px",
            }}
          >
            <Flex>
              <Button
                onClick={handleSyncProductBases}
                leftSection={
                  loaderIcon ? <Loader white={true} /> : <IconRotateClockwise />
                }
              >
                Sync Product Base
              </Button>
            </Flex>
          </div>
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 5px",
            flexWrap: "wrap",
            backgroundColor: "#EFF0F1",
            borderRadius: "10px",
          }}
        >
          <Flex
            style={{
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#EFF0F1",
              flexWrap: "wrap",
            }}
          >
            {briefType === BRIEF_TYPES[0] && (
              <>
                <Select
                  placeholder="Chọn Layout"
                  data={LAYOUT_TYPES}
                  styles={{
                    input: {
                      width: "300px",
                    },
                  }}
                  clearable
                  value={layout}
                  onChange={(value) => {
                    if (!SKU) {
                      showNotification("Thất bại", "Vui lòng chọn SKU", "red");
                      return;
                    }
                    setLayout(value);
                    setUsingProductBaseData(true);
                  }}
                  onClear={() => {
                    setSelectedProductLines([]);
                    setValidCollections([]);
                    setUsingProductBaseData(false);
                  }}
                />
                <MultiSelect
                  placeholder="Chọn Collections"
                  data={map(collections, "name")}
                  styles={{
                    input: {
                      width: "300px",
                    },
                  }}
                  value={validCollections}
                  onChange={(value) => {
                    if (!layout) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng chọn Layout",
                        "red"
                      );
                      return;
                    }
                    const allProductLines = flatMap(
                      compact(
                        map(
                          filter(collections, (x) => includes(value, x.name)),
                          "productLines"
                        )
                      )
                    );
                    let newSelectedProductLines = [];
                    if (layout && !isEmpty(value)) {
                      if (layout === LAYOUT_TYPES[0]) {
                        newSelectedProductLines = filter(allProductLines, (x) =>
                          includes(map(SKU.sameLayouts, "uid"), x.uid)
                        );
                      } else {
                        newSelectedProductLines = filter(
                          allProductLines,
                          (x) => !includes(map(SKU.sameLayouts, "uid"), x.uid)
                        );
                      }
                      setSelectedProductLines(
                        uniqBy(
                          concat(selectedProductLines, newSelectedProductLines),
                          "uid"
                        )
                      );
                    }
                    setValidCollections(value);
                  }}
                  onRemove={(value) => {
                    if (!layout) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng chọn Layout",
                        "red"
                      );
                      return;
                    }
                    const allProductLines = flatMap(
                      compact(
                        map(
                          filter(collections, (x) => value === x.name),
                          "productLines"
                        )
                      )
                    );
                    let newSelectedProductLines = [];
                    const sameLayouts = intersectionBy(
                      allProductLines,
                      SKU.sameLayouts,
                      "uid"
                    );
                    if (layout) {
                      if (layout === LAYOUT_TYPES[0]) {
                        // remove all same layout of this collection
                        newSelectedProductLines = filter(
                          selectedProductLines,
                          (x) => !includes(map(sameLayouts, "uid"), x.uid)
                        );
                      } else {
                        // remove all diff layout of this collection
                        newSelectedProductLines = filter(
                          selectedProductLines,
                          (x) => includes(map(sameLayouts, "uid"), x.uid)
                        );
                      }
                      setSelectedProductLines(newSelectedProductLines);
                    }
                  }}
                  clearable
                  onClear={() => {
                    const allProductLines = flatMap(
                      compact(map(collections, "productLines"))
                    );
                    const sameLayouts = intersectionBy(
                      allProductLines,
                      SKU.sameLayouts,
                      "uid"
                    );
                    let newSelectedProductLines = [];
                    if (layout) {
                      if (layout === LAYOUT_TYPES[0]) {
                        newSelectedProductLines = filter(
                          selectedProductLines,
                          (x) => !includes(map(sameLayouts, "uid"), x.uid)
                        );
                      } else {
                        newSelectedProductLines = filter(
                          selectedProductLines,
                          (x) => includes(map(sameLayouts, "uid"), x.uid)
                        );
                      }
                      setSelectedProductLines(newSelectedProductLines);
                    }
                  }}
                />
              </>
            )}

            <TextInput
              placeholder="Product Base ..."
              size="sm"
              leftSection={
                <span
                  onClick={() => {
                    setQueryProductLines({
                      keyword: searchProductLine,
                    });
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <IconSearch size={16} />
                </span>
              }
              styles={{
                input: {
                  width: "300px",
                },
              }}
              value={searchProductLine}
              onChange={(e) => setSearchProductLine(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQueryProductLines({
                    keyword: searchProductLine,
                  });
                }
              }}
            />
            <Button
              onClick={() => {
                if (setProductBasePagination) {
                  setProductBasePagination({
                    currentPage: 1,
                  });
                }
                if (setUsingProductBaseData) {
                  setUsingProductBaseData(false);
                }
                setSearchProductLine("");
                setQueryProductLines({
                  keyword: "",
                });
                if (setLayout) {
                  setLayout(null);
                }
                if (setValidCollections) {
                  setValidCollections([]);
                }
                setSelectedProductLines([]);
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
          {briefType === BRIEF_TYPES[0] && (
            <Text
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {!isEmpty(selectedProductLines) ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {!isEmpty(selectedProductLines) && (
                    <span>
                      {selectedProductLines.length} Product Base đã chọn
                    </span>
                  )}
                </div>
              ) : null}
              <span
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  open();
                }}
              >
                <Tooltip label="Preview Product Base">
                  <IconSelector size={24} />
                </Tooltip>
              </span>
            </Text>
          )}
        </div>

        <ScrollArea
          h={550}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <LoadingOverlay
            visible={fetchProductLinesLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Grid
            style={{
              marginTop: "10px",
            }}
            columns={12}
          >
            {map(productLines, (productLine, index) => (
              <Grid.Col
                span={{ sm: 4, md: 3, lg: 2 }}
                key={index}
                style={{
                  position: "relative",
                }}
                onClick={() => {
                  if (briefType !== BRIEF_TYPES[0]) {
                    if (
                      includes(
                        map(selectedProductLines, "uid"),
                        productLine.uid
                      )
                    ) {
                      setSelectedProductLines(
                        selectedProductLines.filter(
                          (x) => x.uid !== productLine.uid
                        )
                      );
                    } else {
                      setSelectedProductLines([productLine]);
                    }
                  } else {
                    if (
                      includes(
                        map(selectedProductLines, "name"),
                        productLine.name
                      )
                    ) {
                      setSelectedProductLines(
                        selectedProductLines.filter(
                          (x) => x.name !== productLine.name
                        )
                      );
                    } else {
                      setSelectedProductLines([
                        ...selectedProductLines,
                        productLine,
                      ]);
                    }
                  }
                }}
              >
                <MantineCard
                  shadow="sm"
                  padding="sm"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <MantineCard.Section>
                    <LazyLoad height={200} once={true}>
                      <Image
                        src={
                          productLine.imageSrc ||
                          productLine?.image ||
                          "/images/content/not_found_2.jpg"
                        }
                        h={200}
                        alt="No way!"
                        fit="contain"
                      />
                    </LazyLoad>
                  </MantineCard.Section>
                  <Text
                    fw={500}
                    size="sm"
                    mt="md"
                    style={{
                      display: "inline-block",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textDecoration: "none",
                      verticalAlign: "middle",
                    }}
                  >
                    {productLine.name}
                  </Text>
                </MantineCard>
                {includes(
                  map(selectedProductLines, "name"),
                  productLine.name
                ) && (
                  <>
                    <div
                      style={{
                        padding: "5px",
                        position: "absolute",
                        top: "15px",
                        right: "13px",
                        borderRadius: "50%",
                        backgroundColor: "#64CD73",
                        zIndex: 2,
                      }}
                    >
                      <IconCheck color="#ffffff" />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "9px",
                        right: "0",
                        height: "94%",
                        width: "99%",
                        cursor: "pointer",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(244, 252, 243,0.5)",
                        zIndex: 1,
                      }}
                    ></div>
                  </>
                )}
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
        <Pagination
          total={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="pink"
          size="md"
          style={{ marginTop: "20px", marginLeft: "auto" }}
        />
      </Card>
      <Modal
        opened={opened}
        size="70%"
        onClose={close}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        <ScrollArea
          h={550}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <Grid
            style={{
              marginTop: "10px",
            }}
            columns={12}
          >
            {map(uniqBy(selectedProductLines, "uid"), (productLine, index) => (
              <Grid.Col
                span={{ sm: 5, md: 4, lg: 3 }}
                key={index}
                style={{
                  position: "relative",
                }}
                onClick={() => {
                  if (briefType !== BRIEF_TYPES[0]) {
                    if (
                      includes(
                        map(selectedProductLines, "uid"),
                        productLine.uid
                      )
                    ) {
                      setSelectedProductLines(
                        selectedProductLines.filter(
                          (x) => x.uid !== productLine.uid
                        )
                      );
                    } else {
                      setSelectedProductLines([productLine]);
                    }
                  } else {
                    if (
                      includes(
                        map(selectedProductLines, "name"),
                        productLine.name
                      )
                    ) {
                      setSelectedProductLines(
                        selectedProductLines.filter(
                          (x) => x.name !== productLine.name
                        )
                      );
                    } else {
                      setSelectedProductLines([
                        ...selectedProductLines,
                        productLine,
                      ]);
                    }
                  }
                }}
              >
                <MantineCard
                  shadow="sm"
                  padding="sm"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <MantineCard.Section>
                    <LazyLoad height={200} once={true}>
                      <Image
                        src={
                          productLine.imageSrc ||
                          productLine?.image ||
                          "/images/content/not_found_2.jpg"
                        }
                        h={200}
                        alt="No way!"
                        fit="contain"
                      />
                    </LazyLoad>
                  </MantineCard.Section>
                  <Text
                    fw={500}
                    size="sm"
                    mt="md"
                    style={{
                      display: "inline-block",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textDecoration: "none",
                      verticalAlign: "middle",
                    }}
                  >
                    {productLine.name}
                  </Text>
                </MantineCard>
                {includes(
                  map(selectedProductLines, "name"),
                  productLine.name
                ) && (
                  <>
                    <div
                      style={{
                        padding: "5px",
                        position: "absolute",
                        top: "15px",
                        right: "13px",
                        borderRadius: "50%",
                        backgroundColor: "#64CD73",
                        zIndex: 2,
                      }}
                    >
                      <IconCheck color="#ffffff" />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "9px",
                        right: "0",
                        height: "94%",
                        width: "99%",
                        cursor: "pointer",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(244, 252, 243,0.5)",
                        zIndex: 1,
                      }}
                    ></div>
                  </>
                )}
              </Grid.Col>
            ))}
          </Grid>
        </ScrollArea>
      </Modal>
    </>
  );
};

export default ProductBase;
