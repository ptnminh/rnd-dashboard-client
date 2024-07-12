import {
  Button,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Pagination,
  ScrollArea,
  Tabs,
  TextInput,
  Card as MantineCard,
  Image,
  Text,
} from "@mantine/core";
import {
  IconLayout,
  IconList,
  IconPlus,
  IconCheck,
  IconSearch,
  IconFilterOff,
} from "@tabler/icons-react";
import { useState } from "react";
import Card from "../../components/Card";
import styles from "./ProductLine.module.sass";
import cn from "classnames";
import CollectionTable from "./CollectionTable";
import ProductLineTable from "./ProductLineTable";
import { includes, map } from "lodash";
import LazyLoad from "react-lazyload";
import { CLIP_ARTS } from "../../mocks/clipart";
import { useDisclosure } from "@mantine/hooks";

const Collection = ({
  collections,
  productLines,
  selectedFilters,
  setSelectedFilters,
  handleSelectAllCollections,
  handleChangeCollection,
  handleSelectCollection,
  selectedCollection,
  collectionName,
  setCollectionName,
  setVisible,
  visible,
  setCollections,
  openModal,
  setIsCreateNewCollection,
}) => {
  return (
    <Grid columns={12}>
      <Grid.Col span={4}>
        <Card
          className={styles.card}
          classCardHead={styles.cardHead}
          title="Collection"
          classTitle={cn("title-purple", styles.title)}
          head={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #4E83FD",
                  cursor: "pointer",
                }}
                onClick={openModal}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput placeholder="Search collection" />
            </div>
          }
        >
          <CollectionTable
            className={styles.table}
            activeTable={visible}
            setActiveTable={setVisible}
            setCollections={setCollections}
            collections={collections}
            setSelectedFilters={setSelectedFilters}
            selectedFilters={selectedFilters}
            handleSelectAllCollections={handleSelectAllCollections}
            handleChangeCollection={handleChangeCollection}
            handleSelectCollection={handleSelectCollection}
            selectedCollection={selectedCollection}
            collectionName={collectionName}
            setCollectionName={setCollectionName}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={8}>
        <Card
          className={styles.card}
          title="Product Base"
          classTitle={cn("title-yellow", styles.title)}
          classCardHead={styles.cardHead}
          head={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #4E83FD",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsCreateNewCollection(false);
                  openModal();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput placeholder="Search Product Base" />
            </div>
          }
        >
          <ScrollArea h={600} scrollbars="y" scrollbarSize={2}>
            <ProductLineTable
              className={styles.table}
              activeTable={visible}
              setActiveTable={setVisible}
              setCollections={setCollections}
              collections={collections}
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              handleSelectAllCollections={handleSelectAllCollections}
              handleChangeCollection={handleChangeCollection}
              handleSelectCollection={handleSelectCollection}
              selectedCollection={selectedCollection}
              collectionName={collectionName}
              setCollectionName={setCollectionName}
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export const ProductLine = () => {
  const [activeTab, setActiveTab] = useState("collection");
  const [clipArts, setClipArts] = useState(CLIP_ARTS);
  const [isCreateNewCollection, setIsCreateNewCollection] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [activeTable, setActiveTable] = useState(false);
  const [selectedClipArts, setSelectedClipArts] = useState([]);
  const [collections, setCollections] = useState([
    {
      name: "Collection 1",
    },
    {
      name: "Collection 2",
    },
  ]);
  const [selectedCollection, setSelectedCollection] = useState();
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSelectCollection = () => {};
  const handleSelectAllCollections = () => {};
  const handleChangeCollection = () => {};
  return (
    <>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        style={{
          fontFamily: "Inter",
        }}
      >
        <Tabs.List>
          <Tabs.Tab
            value="collection"
            leftSection={
              <IconList
                color={activeTab === "collection" ? "#5083FB" : "#000"}
              />
            }
            color="#5083FB"
          >
            <span
              style={{
                color: activeTab === "collection" ? "#5083FB" : "#000",
              }}
            >
              Collection
            </span>
          </Tabs.Tab>
          <Tabs.Tab
            value="layout"
            leftSection={
              <IconLayout color={activeTab === "layout" ? "#5083FB" : "#000"} />
            }
            color="#5083FB"
          >
            <span
              style={{
                color: activeTab === "layout" ? "#5083FB" : "#000",
              }}
            >
              Chung Layout
            </span>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="collection" mt={8}>
          <Collection
            collections={collections}
            setCollections={setCollections}
            handleSelectCollection={handleSelectCollection}
            visible={activeTable}
            setVisible={setActiveTable}
            selectedFilters={selectedCollections}
            setSelectedFilters={setSelectedCollections}
            handleSelectAllCollections={handleSelectAllCollections}
            handleChangeCollection={handleChangeCollection}
            selectedCollection={selectedCollection}
            openModal={open}
            setIsCreateNewCollection={setIsCreateNewCollection}
          />
        </Tabs.Panel>
        <Tabs.Panel value="layout">Messages tab content</Tabs.Panel>
      </Tabs>

      <Modal
        opened={opened}
        size="70%"
        onClose={close}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        {isCreateNewCollection && (
          <Card
            className={styles.card}
            classCardHead={styles.cardHead}
            title="New Collection"
            classTitle={cn("title-purple", styles.title)}
          >
            <TextInput
              placeholder="Product Base ..."
              size="sm"
              leftSection={
                <span
                  onClick={() => {
                    // setSearchClipArt(searchClipArt);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                ></span>
              }
              styles={{
                input: {
                  width: "300px",
                },
              }}
              //   value={}
              //   onChange={(e) => setSearchClipArt(e.target.value)}
              //   onKeyDown={(event) => {
              //     if (event.key === "Enter") {
              //       fetchClipArts(pagination.currentPage);
              //     }
              //   }}
            />
          </Card>
        )}

        <Card
          className={styles.card}
          classCardHead={styles.cardHead}
          title="Choose Product Base"
          classTitle={cn("title-purple", styles.title)}
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
                        // setSearchClipArt(searchClipArt);
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
                  //   value={}
                  //   onChange={(e) => setSearchClipArt(e.target.value)}
                  //   onKeyDown={(event) => {
                  //     if (event.key === "Enter") {
                  //       fetchClipArts(pagination.currentPage);
                  //     }
                  //   }}
                />
              </Flex>
            </div>
          }
        >
          <ScrollArea
            h={600}
            scrollbars="y"
            scrollbarSize={4}
            scrollHideDelay={1000}
          >
            <LoadingOverlay
              visible={false}
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
                  span={{ sm: 5, md: 4, lg: 3 }}
                  key={index}
                  style={{
                    position: "relative",
                  }}
                  onClick={() => {}}
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
            onChange={() => {}}
            color="pink"
            size="md"
            style={{ marginTop: "20px", marginLeft: "auto" }}
          />
        </Card>
      </Modal>
    </>
  );
};
