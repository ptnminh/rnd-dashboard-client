import {
  Button,
  Card,
  Checkbox,
  Fieldset,
  Flex,
  Grid,
  Group,
  Pagination,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import cn from "classnames";
import { useEffect, useState } from "react";
import styles from "./Captions.module.sass";
import { IconFilterOff, IconSearch } from "@tabler/icons-react";
import { drop, find, map } from "lodash";

const ListCaptions = ({
  captions,
  setQueryCaption,
  selectedValue,
  setSelectedValue,
}) => {
  const [data, setData] = useState(captions);
  const [searchCaption, setSearchCaption] = useState("");
  useEffect(() => {
    setData(captions);
  }, [captions]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 5px",
          flexWrap: "wrap-reverse",
          backgroundColor: "#EFF0F1",
          borderRadius: "10px",
          marginBottom: "10px",
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
            placeholder="Keyword ..."
            size="sm"
            leftSection={
              <span
                onClick={() => {
                  setQueryCaption({
                    keyword: searchCaption,
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
            value={searchCaption}
            onChange={(e) => setSearchCaption(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setQueryCaption({
                  keyword: searchCaption,
                });
              }
            }}
          />
          <Button
            onClick={() => {
              setSearchCaption("");
              setQueryCaption({
                keyword: "",
              });
            }}
          >
            <IconFilterOff />
          </Button>
        </Flex>
      </div>
      <Checkbox.Group
        value={selectedValue}
        onChange={(value) => {
          const newValue = value.length > 1 ? drop(value) : value;
          setSelectedValue(newValue);
        }}
      >
        <Stack pt="md" gap="xs">
          <Grid>
            {map(data, (caption) => (
              <Grid.Col span={4} key={caption.id}>
                <Checkbox.Card
                  radius="md"
                  value={caption.uid}
                  key={caption.uid}
                  style={{
                    padding: "10px",
                  }}
                >
                  <Checkbox.Indicator />
                  <Grid
                    style={{
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    <Grid.Col span={12}>
                      <Flex direction="column" gap="md">
                        <TextInput
                          label="Tên Caption"
                          placeholder="Tên Caption"
                          value={caption.name}
                          readOnly
                          styles={{
                            label: {
                              marginBottom: "5px",
                            },
                          }}
                        />
                        <Textarea
                          label="Nội dung"
                          styles={{
                            label: {
                              marginBottom: "5px",
                            },
                            input: {
                              height: "116px",
                            },
                          }}
                          autosize
                          placeholder="Content"
                          value={caption.content}
                          readOnly
                          minRows={10}
                          maxRows={10}
                        />
                        <TagsInput
                          label="Tags"
                          data={caption.tags}
                          value={caption.tags}
                          placeholder="Tags"
                          splitChars={[",", " ", "|", "\r\n", "\n"]}
                          clearable
                          withScrollArea={true}
                          styles={{
                            label: {
                              marginBottom: "5px",
                            },
                          }}
                          maxDropdownHeight="100px"
                        />
                      </Flex>
                    </Grid.Col>
                  </Grid>
                </Checkbox.Card>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Checkbox.Group>
    </>
  );
};

const Captions = ({
  captions,
  setQueryCaption,
  loadingProductBase,
  handlePageChangeCaption,
  captionsPagination,
  selectedValue,
  setSelectedValue,
  handleChooseCaption,
  closeModalChooseCaption,
}) => {
  return (
    <Card
      className={cn(styles.card, styles.clipArtCard)}
      title="Danh sách Caption"
      classTitle="title-green"
      classCardHead={styles.classCardHead}
      classSpanTitle={styles.classScaleSpanTitle}
    >
      <ListCaptions
        captions={captions}
        setQueryCaption={setQueryCaption}
        fetchProductLinesLoading={loadingProductBase}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
      <Group justify="space-between">
        <Button
          variant="filled"
          onClick={() => {
            const caption = find(captions, { uid: selectedValue[0] });
            handleChooseCaption(caption);
            closeModalChooseCaption();
          }}
        >
          Tiếp tục
        </Button>
        <Pagination
          total={captionsPagination.totalPages}
          page={captionsPagination.currentPage}
          onChange={handlePageChangeCaption}
          color="pink"
          size="md"
          style={{ marginTop: "20px", marginLeft: "auto" }}
        />
      </Group>
    </Card>
  );
};

export default Captions;
