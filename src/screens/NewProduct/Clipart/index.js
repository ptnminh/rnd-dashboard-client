import {
  Button,
  Flex,
  Grid,
  Image,
  LoadingOverlay,
  TextInput as MantineTextInput,
  MultiSelect,
  Pagination,
  ScrollArea,
  Text,
  Card as MantineCard,
} from "@mantine/core";
import { IconSearch, IconFilterOff, IconCheck } from "@tabler/icons-react";
import { includes, keys, map, merge } from "lodash";
import LazyLoad from "react-lazyload";

const Clipart = ({
  clipArts,
  fetchClipArts,
  fetchClipArtsLoading,
  pagination,
  searchClipArt,
  setSearchClipArt,
  filtersClipArt,
  query,
  setQuery,
  selectedClipArts,
  setSelectedClipArts,
  briefType,
  BRIEF_TYPES,
  handlePageChange,
  handleSelectClipart,
}) => {
  return (
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
              onChange={(value) => setQuery({ ...query, [filter.name]: value })}
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
                if (briefType === BRIEF_TYPES[1]) {
                  if (includes(map(selectedClipArts, "name"), clipArt.name)) {
                    setSelectedClipArts(
                      selectedClipArts.filter((x) => x.name !== clipArt.name)
                    );
                  } else {
                    setSelectedClipArts((selectedClipArts) => [
                      ...selectedClipArts,
                      clipArt,
                    ]);
                  }
                } else if (briefType === BRIEF_TYPES[2]) {
                  setSelectedClipArts([clipArt]);
                } else if (briefType === BRIEF_TYPES[3]) {
                  setSelectedClipArts([clipArt]);
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
                        clipArt.imageSrc || "/images/content/not_found_2.jpg"
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
        }}
        onClick={handleSelectClipart}
      >
        <Button>Finish</Button>
      </div>
    </>
  );
};

export default Clipart;
