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
import { IconCheck, IconSearch, IconFilterOff } from "@tabler/icons-react";
import cn from "classnames";
import styles from "./ScaleDesign.module.sass";
import { useState } from "react";
import Card from "../../../components/Card";

const SKU = ({
  foundSKUs,
  selectedSKUs,
  setSelectedSKUs,
  loadingSKU,
  setQuerySKU,
  pagination,
  handlePageChange,
  title,
  setPagination,
}) => {
  const [searchSKU, setSearchSKU] = useState("");
  const [searchProductName, setSearchProductName] = useState("");

  return (
    <>
      <Card
        className={styles.card}
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
        title={title || "2. Chọn Product Base"}
        classTitle={cn("title-green", styles.title)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 5px",
            gap: "10px",
            flexWrap: "wrap-reverse",
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
            }}
          >
            <TextInput
              placeholder="SKU ..."
              size="sm"
              leftSection={
                <span
                  onClick={() => {
                    setQuerySKU({
                      keyword: searchSKU,
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
                  width: "150px",
                },
              }}
              value={searchSKU}
              onChange={(e) => setSearchSKU(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuerySKU({
                    keyword: searchSKU,
                  });
                }
              }}
            />
            <TextInput
              placeholder="Product Title ..."
              size="sm"
              leftSection={
                <span
                  onClick={() => {}}
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
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setQuerySKU({
                    productName: searchProductName,
                  });
                }
              }}
            />
            <Button
              onClick={() => {
                setQuerySKU({});
                setSearchProductName("");
                setSearchSKU("");
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
        </div>
        <ScrollArea
          h={550}
          scrollbars="y"
          scrollbarSize={4}
          scrollHideDelay={1000}
        >
          <LoadingOverlay
            visible={loadingSKU}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Grid
            style={{
              marginTop: "10px",
            }}
            columns={12}
          >
            {map(foundSKUs, (foundSKU, index) => (
              <Grid.Col
                span={{ sm: 4, md: 3, lg: 2 }}
                key={index}
                style={{
                  position: "relative",
                }}
                onClick={() => {
                  if (includes(map(selectedSKUs, "uid"), foundSKU.uid)) {
                    setSelectedSKUs(
                      selectedSKUs.filter((x) => x.uid !== foundSKU.uid)
                    );
                  } else {
                    setSelectedSKUs([...selectedSKUs, foundSKU]);
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
                          foundSKU?.productInfo?.imageSrc ||
                          foundSKU?.productInfo?.image ||
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
                    {foundSKU.productInfo?.name ||
                      foundSKU?.sku ||
                      "Lorem ipsum dolor sit amet"}
                  </Text>
                </MantineCard>
                {includes(map(selectedSKUs, "uid"), foundSKU.uid) && (
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
    </>
  );
};

export default SKU;
