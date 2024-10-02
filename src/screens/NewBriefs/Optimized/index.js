import { includes, isEmpty, keys, map, merge } from "lodash";
import Card from "../../../components/Card";
import { BRIEF_TYPES, KEEP_CLIPARTS } from "../../../constant";
import styles from "./Optimized.module.sass";
import cn from "classnames";
import {
  Button,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  MultiSelect,
  Pagination,
  ScrollArea,
  Text,
  Tooltip,
  Card as MantineCard,
  TextInput as MantineTextInput,
} from "@mantine/core";
import Loader from "../../../components/Loader";
import Dropdown from "../../../components/Dropdown";
import {
  IconCodeMinus,
  IconCodePlus,
  IconEye,
  IconRotateClockwise,
  IconSearch,
  IconCheck,
  IconFilterOff,
} from "@tabler/icons-react";
import LazyLoad from "react-lazyload";
import { useState } from "react";

const Optimized = ({
  briefType,
  topScrollClipArtRef,
  myClipartHeaderRef,
  selectedClipArts,
  handleSeparateClipart,
  handleMergeClipart,
  grouppedCliparts,
  handleSyncCliparts,
  loaderIcon,
  openModalPreviewGroupClipart,
  searchClipArt,
  setSearchClipArt,
  filtersClipArt,
  query,
  setQuery,
  clipArts,
  fetchClipArtsLoading,
  fetchClipArts,
  pagination,
  handlePageChange,
  setSelectedClipArts,
}) => {
  const [isKeepClipArt, setKeepClipArt] = useState(KEEP_CLIPARTS[0]);
  return (
    <div className={styles.row} ref={topScrollClipArtRef}>
      <Card
        className={cn(styles.card, styles.clipArtCard)}
        title={"3. Giữ / Đổi Clipart"}
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
        head={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
            ref={myClipartHeaderRef}
          >
            {!isEmpty(selectedClipArts) && (
              <Tooltip label="1 clipart/brief">
                <Text>
                  <Button
                    leftSection={<IconCodeMinus />}
                    onClick={handleSeparateClipart}
                  >
                    Separate
                  </Button>
                </Text>
              </Tooltip>
            )}
            {!isEmpty(selectedClipArts) && (
              <Tooltip label="n clipart/brief">
                <Text>
                  <Button
                    leftSection={<IconCodePlus />}
                    onClick={handleMergeClipart}
                  >
                    Group
                  </Button>
                </Text>
              </Tooltip>
            )}

            <Flex gap={10}>
              {!isEmpty(grouppedCliparts) && (
                <Button
                  leftSection={<IconEye />}
                  onClick={openModalPreviewGroupClipart}
                >
                  Preview
                </Button>
              )}

              <Button
                onClick={handleSyncCliparts}
                leftSection={
                  loaderIcon ? <Loader white={true} /> : <IconRotateClockwise />
                }
              >
                Sync Clipart
              </Button>
            </Flex>
          </div>
        }
      >
        <div>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={isKeepClipArt}
            setValue={setKeepClipArt}
            options={KEEP_CLIPARTS}
            classOutSideClick={styles.keepClipArtLayout}
          />
        </div>
        {isKeepClipArt === KEEP_CLIPARTS[1] && (
          <>
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
                  flexWrap: "wrap",
                }}
              >
                <MantineTextInput
                  placeholder="Clipart Name / Niche / Note / ..."
                  size="sm"
                  leftSection={
                    <span
                      onClick={() => {
                        setSearchClipArt(searchClipArt);
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
                  value={searchClipArt}
                  onChange={(e) => setSearchClipArt(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      fetchClipArts(pagination.currentPage);
                    }
                  }}
                />
              </Flex>
              <Flex
                style={{
                  gap: "8px",
                  padding: "10px",
                  borderRadius: "10px",
                  flexWrap: "wrap",
                }}
              >
                {map(filtersClipArt, (filter, index) => (
                  <MultiSelect
                    key={index}
                    placeholder={filter.name}
                    data={filter.value}
                    styles={{
                      input: {
                        width: "150px",
                      },
                    }}
                    value={query[filter.name]}
                    onChange={(value) =>
                      setQuery({ ...query, [filter.name]: value })
                    }
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        [filter.key]: null,
                      });
                    }}
                  />
                ))}
                <Button
                  onClick={() => {
                    const queryKeys = keys(query);
                    const transformedQuery = map(queryKeys, (key) => ({
                      [key]: [],
                    }));
                    setQuery(merge({}, ...transformedQuery));
                    setSearchClipArt("");
                  }}
                >
                  <IconFilterOff />
                </Button>
              </Flex>
            </div>

            <ScrollArea
              h={800}
              scrollbars="y"
              scrollbarSize={4}
              scrollHideDelay={1000}
            >
              <LoadingOverlay
                visible={fetchClipArtsLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
              />
              <Grid
                style={{
                  marginTop: "10px",
                }}
                columns={12}
              >
                {map(clipArts, (clipArt, index) => (
                  <Grid.Col
                    span={{ sm: 4, md: 3, lg: 2 }}
                    key={index}
                    style={{
                      position: "relative",
                    }}
                    onClick={() => {
                      if (
                        includes(map(selectedClipArts, "name"), clipArt.name)
                      ) {
                        setSelectedClipArts(
                          selectedClipArts.filter(
                            (x) => x.name !== clipArt.name
                          )
                        );
                      } else {
                        setSelectedClipArts((selectedClipArts) => [
                          ...selectedClipArts,
                          clipArt,
                        ]);
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
                              clipArt.imageSrc ||
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
                        {clipArt.name}
                      </Text>
                    </MantineCard>
                    {includes(map(selectedClipArts, "name"), clipArt.name) && (
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
          </>
        )}
      </Card>
    </div>
  );
};

export default Optimized;
