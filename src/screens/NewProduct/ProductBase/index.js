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
} from "@mantine/core";
import { includes, map } from "lodash";
import LazyLoad from "react-lazyload";
import {
  IconCheck,
  IconSearch,
  IconFilterOff,
  IconRotateClockwise,
} from "@tabler/icons-react";
import cn from "classnames";
import styles from "./ProductBase.module.sass";
import { useState } from "react";
import Card from "../../../components/Card";
import Loader from "../../../components/Loader";

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
}) => {
  const [searchProductLine, setSearchProductLine] = useState("");
  return (
    <Card
      className={styles.card}
      classCardHead={styles.classCardHead}
      classSpanTitle={styles.classScaleSpanTitle}
      title="2. Chọn Product Base"
      classTitle={cn("title-green", styles.title)}
      head={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 5px",
            gap: "10px",
            flexWrap: "wrap-reverse",
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
          <Flex
            style={{
              gap: "8px",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#EFF0F1",
            }}
          >
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
                setSearchProductLine("");
                setQueryProductLines({
                  keyword: "",
                });
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
        </div>
      }
    >
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
                if (
                  includes(map(selectedProductLines, "uid"), productLine.uid)
                ) {
                  setSelectedProductLines(
                    selectedProductLines.filter(
                      (x) => x.uid !== productLine.uid
                    )
                  );
                } else {
                  setSelectedProductLines([productLine]);
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
  );
};

export default ProductBase;
