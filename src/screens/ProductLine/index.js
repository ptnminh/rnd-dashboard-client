import {
  Button,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  Pagination,
  ScrollArea,
  Tabs,
  TextInput,
  Card as MantineCard,
  Image,
  Text,
  Stepper,
  Group,
} from "@mantine/core";
import {
  IconLayout,
  IconList,
  IconPlus,
  IconCheck,
  IconSearch,
  IconFilterOff,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import styles from "./ProductLine.module.sass";
import cn from "classnames";
import CollectionTable from "./CollectionTable";
import LayoutTable from "./LayoutTable";
import ProductLineTable from "./ProductLineTable";
import { filter, find, includes, isEmpty, map } from "lodash";
import LazyLoad from "react-lazyload";
import { useDisclosure } from "@mantine/hooks";
import { rndServices } from "../../services";
import { showNotification } from "../../utils/index";
import { modals } from "@mantine/modals";

const Collection = ({
  collections,
  selectedFilters,
  setSelectedFilters,
  handleSelectCollection,
  selectedCollection,
  collectionName,
  setCollectionName,
  setVisible,
  visible,
  setCollections,
  openModal,
  setIsCreateNewCollection,
  openModalProductBase,
  setSelectedProductLines,
  editCollection,
  setEditCollection,
  editCollectionName,
  setEditCollectionName,
  handleSaveNewCollectionName,
  openModalConfirmDeleteCollection,
  openModalConfirmDeleteProductLine,
  handleSearchCollections,
}) => {
  const [searchCollections, setSearchCollections] = useState("");
  const [searchProductBase, setSearchProductBase] = useState("");
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
                onClick={() => {
                  setSelectedProductLines([]);
                  setIsCreateNewCollection(true);
                  openModal();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput
                placeholder="Search collection"
                value={searchCollections}
                onChange={(event) => {
                  setSearchCollections(event.target.value);
                  handleSearchCollections(event.target.value);
                }}
              />
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
            handleSelectCollection={handleSelectCollection}
            selectedCollection={selectedCollection}
            collectionName={collectionName}
            setCollectionName={setCollectionName}
            editCollection={editCollection}
            setEditCollection={setEditCollection}
            editCollectionName={editCollectionName}
            setEditCollectionName={setEditCollectionName}
            handleSaveNewCollectionName={handleSaveNewCollectionName}
            openModalConfirmDeleteCollection={openModalConfirmDeleteCollection}
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
                  setSelectedProductLines(
                    selectedCollection?.productLines || []
                  );
                  openModalProductBase();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput
                placeholder="Search Product Base"
                value={searchProductBase}
                onChange={(event) => {
                  setSearchProductBase(event.target.value);
                }}
              />
            </div>
          }
        >
          <ScrollArea h={600} scrollbars="y" scrollbarSize={2}>
            <ProductLineTable
              className={styles.table}
              activeTable={visible}
              setActiveTable={setVisible}
              setCollections={setCollections}
              productLines={
                !searchProductBase
                  ? selectedCollection?.productLines
                  : filter(selectedCollection?.productLines, (productLine) =>
                      productLine.name
                        .toLowerCase()
                        .includes(searchProductBase.toLowerCase())
                    )
              }
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              selectedCollection={selectedCollection}
              collectionName={collectionName}
              setCollectionName={setCollectionName}
              openModalConfirmDeleteProductLine={
                openModalConfirmDeleteProductLine
              }
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
const Layout = ({
  layouts,
  selectedFilters,
  setSelectedFilters,
  handleSelectLayout,
  layoutName,
  selectedLayout,
  setLayoutName,
  setVisible,
  visible,
  setLayouts,
  openModal,
  openModalProductBase,
  setSelectedProductLines,
  editLayout,
  setEditLayout,
  editLayoutName,
  setEditLayoutName,
  handleSaveNewLayoutName,
  openModalConfirmDeleteLayout,
  openModalConfirmDeleteProductLineLayout,
  handleSearchLayouts,
}) => {
  const [searchCollections, setSearchCollections] = useState("");
  const [searchProductBase, setSearchProductBase] = useState("");
  return (
    <Grid columns={12}>
      <Grid.Col span={4}>
        <Card
          className={styles.card}
          classCardHead={styles.cardHead}
          title="Layout"
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
                onClick={() => {
                  setSelectedProductLines([]);
                  openModal();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput
                placeholder="Search Layout"
                value={searchCollections}
                onChange={(event) => {
                  setSearchCollections(event.target.value);
                  handleSearchLayouts(event.target.value);
                }}
              />
            </div>
          }
        >
          <LayoutTable
            className={styles.table}
            activeTable={visible}
            setActiveTable={setVisible}
            setCollections={setLayouts}
            collections={layouts}
            setSelectedFilters={setSelectedFilters}
            handleSelectCollection={handleSelectLayout}
            selectedCollection={selectedLayout}
            collectionName={layoutName}
            setCollectionName={setLayoutName}
            editCollection={editLayout}
            setEditCollection={setEditLayout}
            editCollectionName={editLayoutName}
            setEditCollectionName={setEditLayoutName}
            handleSaveNewCollectionName={handleSaveNewLayoutName}
            openModalConfirmDeleteCollection={openModalConfirmDeleteLayout}
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
                  setSelectedProductLines(selectedLayout?.productLines || []);
                  openModalProductBase();
                }}
              >
                <IconPlus color="#4E83FD" />
              </div>
              <TextInput
                placeholder="Search Product Base"
                value={searchProductBase}
                onChange={(event) => {
                  setSearchProductBase(event.target.value);
                }}
              />
            </div>
          }
        >
          <ScrollArea h={600} scrollbars="y" scrollbarSize={2}>
            <ProductLineTable
              className={styles.table}
              activeTable={visible}
              setActiveTable={setVisible}
              setCollections={setLayouts}
              productLines={
                !searchProductBase
                  ? selectedLayout?.productLines
                  : filter(selectedLayout?.productLines, (productLine) =>
                      productLine.name
                        .toLowerCase()
                        .includes(searchProductBase.toLowerCase())
                    )
              }
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              selectedCollection={selectedLayout}
              collectionName={layoutName}
              setCollectionName={setLayoutName}
              openModalConfirmDeleteProductLine={
                openModalConfirmDeleteProductLineLayout
              }
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export const ProductLine = () => {
  const [activeTab, setActiveTab] = useState("collection");
  const [productLines, setProductLines] = useState([]);
  const [editCollection, setEditCollection] = useState(false);
  const [editLayout, setEditLayout] = useState(false);
  const [isCreateNewCollection, setIsCreateNewCollection] = useState(true);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editLayoutName, setEditLayoutName] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [activeTable, setActiveTable] = useState(false);
  const [selectedProductLines, setSelectedProductLines] = useState([]);
  const [collections, setCollections] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({});
  const [selectedLayout, setSelectedLayout] = useState({});
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedLayouts, setSelectedLayouts] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [opendModalLayout, { open: openModalLayout, close: closeModalLayout }] =
    useDisclosure(false);
  const [
    openedSelectProductBase,
    { open: openModalProductBase, close: closeModalProductBase },
  ] = useDisclosure(false);
  const [queryProductLines, setQueryProductLines] = useState({});
  const [searchProductLine, setSearchProductLine] = useState("");
  const [fetchProductLinesLoading, setProductLinesLoading] = useState(false);
  const [createCollectionsLoading, setCreateCollectionsLoading] =
    useState(false);
  const [createLayoutLoading, setCreateLayoutLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeChooseProductStep, setActiveChooseProductBaseStep] = useState(0);
  const nextStepChooseProductBase = () => {
    setActiveChooseProductBaseStep((current) =>
      current < 3 ? current + 1 : current
    );
  };
  const prevStepChooseProductBase = () => {
    setActiveChooseProductBaseStep((current) =>
      current > 0 ? current - 1 : current
    );
  };
  const [collectionName, setCollectionName] = useState("");
  const [layoutName, setLayoutName] = useState("");
  const nextStep = () => {
    if (activeStep === 0) {
      if (activeTab === "collection") {
        if (!collectionName || isEmpty(selectedProductLines)) {
          showNotification(
            "Thất bại",
            "Vui lòng chọn tên collection và chọn Product Line",
            "red"
          );
          return;
        }
      } else {
        if (!layoutName || isEmpty(selectedProductLines)) {
          showNotification(
            "Thất bại",
            "Vui lòng chọn tên layout và chọn Product Line",
            "red"
          );
          return;
        }
      }
    }
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));
  const handleSelectCollection = (name) => {
    setSelectedCollection(find(collections, { name }));
  };
  const handleSelectLayout = (name) => {
    setSelectedLayout(find(layouts, { name }));
  };
  const handleSelectAllCollections = () => {};
  const handleChangeCollection = () => {};

  const fetchCollections = async () => {
    const { data } = await rndServices.getCollections({
      limit: -1,
    });
    setCollections(data || []);
    setSelectedCollection(!isEmpty(data) ? data[0] : {});
  };
  const fetchLayouts = async () => {
    const { data } = await rndServices.getLayouts({
      limit: -1,
    });
    setLayouts(data || []);
    setSelectedLayout(!isEmpty(data) ? data[0] : {});
  };
  const fetchProductLines = async (page) => {
    setProductLinesLoading(true);
    const { data, metadata } = await rndServices.fetchProductLines({
      limit: 8,
      page,
      query: queryProductLines,
    });
    if (isEmpty(data)) {
      setProductLinesLoading(false);
      setProductLines([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setProductLinesLoading(false);
    setProductLines(data || []);
    setPagination(metadata);
    return;
  };
  const handleCreateCollection = async () => {
    setCreateCollectionsLoading(true);
    const { data } = await rndServices.createCollection({
      name: collectionName,
      productLineIds: map(selectedProductLines, "uid"),
    });
    if (data) {
      await fetchCollections();
    } else {
      showNotification("Thất bại", "Tạo collection thất bại", "red");
    }
    setCreateCollectionsLoading(false);
    setSelectedProductLines([]);
    setQueryProductLines({});
    setCollectionName("");
    setActiveStep(0);
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    close();
  };
  const handleCreateLayout = async () => {
    setCreateLayoutLoading(true);
    const { data } = await rndServices.createLayout({
      name: layoutName,
      productLineIds: map(selectedProductLines, "uid"),
    });
    if (data) {
      await fetchLayouts();
    } else {
      showNotification("Thất bại", "Tạo layout thất bại", "red");
    }
    setCreateLayoutLoading(false);
    setQueryProductLines({});
    setSelectedProductLines([]);
    setLayoutName("");
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    setActiveStep(0);
    closeModalLayout();
  };
  const handleAddProductBase = async () => {
    setCreateCollectionsLoading(true);
    const { data } = await rndServices.updateCollection({
      productLineIds: map(selectedProductLines, "uid"),
      name: selectedCollection.name,
      id: selectedCollection.uid,
    });
    if (data) {
      await fetchCollections();
    } else {
      showNotification("Thất bại", "Tạo collection thất bại", "red");
    }
    setCreateCollectionsLoading(false);
    setSelectedProductLines([]);
    setActiveChooseProductBaseStep(0);
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    closeModalProductBase();
  };
  const handleAddProductBaseLayout = async () => {
    setCreateLayoutLoading(true);
    const { data } = await rndServices.updateLayout({
      productLineIds: map(selectedProductLines, "uid"),
      name: selectedLayout.name,
      id: selectedLayout.uid,
    });
    if (data) {
      await fetchLayouts();
    }
    setCreateLayoutLoading(false);
    setSelectedProductLines([]);
    setActiveChooseProductBaseStep(0);
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    closeModalProductBase();
  };
  const handleSaveNewCollectionName = async () => {
    if (!editCollectionName) {
      showNotification("Thất bại", "Vui lòng nhập tên collection", "red");
      return;
    }
    const { data } = await rndServices.updateCollection({
      name: editCollectionName,
      id: selectedCollection.uid,
      productLineIds: map(selectedCollection.productLines, "uid"),
    });
    if (data) {
      await fetchCollections();
    }
    setEditCollectionName("");
    setEditCollection(false);
  };
  const handleSaveNewLayoutName = async () => {
    if (!editLayoutName) {
      showNotification("Thất bại", "Vui lòng nhập tên layout", "red");
      return;
    }
    const { data } = await rndServices.updateLayout({
      name: editLayoutName,
      id: selectedLayout.uid,
      productLineIds: map(selectedLayout.productLines, "uid"),
    });
    if (data) {
      await fetchLayouts();
    }
    setEditLayoutName("");
    setEditLayout(false);
  };
  const handleSearchCollections = (value) => {
    if (!value) {
      fetchCollections();
    }
    const filteredCollections = filter(collections, (x) =>
      x.name.toLowerCase().includes(value.toLowerCase())
    );
    setCollections(filteredCollections);
  };
  const handleSearchLayouts = (value) => {
    if (!value) {
      fetchLayouts();
    }
    const filteredLayouts = filter(layouts, (x) =>
      x.name.toLowerCase().includes(value.toLowerCase())
    );
    setLayouts(filteredLayouts);
  };

  const handleDeleteCollection = async (uid) => {
    const response = await rndServices.deleteCollection(uid);
    if (response) {
      await fetchCollections();
    }
  };
  const handleDeleteLayout = async (uid) => {
    const response = await rndServices.deleteLayout(uid);
    if (response) {
      await fetchLayouts();
    }
  };
  const handleDeleteProductLine = async (uid) => {
    const response = await rndServices.updateCollection({
      id: selectedCollection.uid,
      productLineIds: map(selectedCollection.productLines, "uid").filter(
        (x) => x !== uid
      ),
      name: selectedCollection.name,
    });
    if (response) {
      const newSelectedCollection = {
        ...selectedCollection,
        productLines: filter(
          selectedCollection?.productLines,
          (x) => x.uid !== uid
        ),
      };
      setSelectedCollection(newSelectedCollection);
    }
  };
  const handleDeleteLayoutProductLine = async (uid) => {
    const response = await rndServices.updateLayout({
      id: selectedLayout.uid,
      productLineIds: map(selectedLayout.productLines, "uid").filter(
        (x) => x !== uid
      ),
      name: selectedLayout.name,
    });
    if (response) {
      const newSelectedLayout = {
        ...selectedLayout,
        productLines: filter(
          selectedLayout?.productLines,
          (x) => x.uid !== uid
        ),
      };
      setSelectedLayout(newSelectedLayout);
    }
  };

  useEffect(() => {
    fetchProductLines(pagination.currentPage);
  }, [pagination.currentPage, queryProductLines]);
  useEffect(() => {
    fetchCollections();
    fetchLayouts();
  }, []);
  useEffect(() => {
    setSelectedProductLines([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    if (activeTab === "collection") {
      setEditLayout(false);
    } else {
      setEditCollection(false);
    }
  }, [activeTab]);
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };
  const openModalConfirmDeleteCollection = (uid) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteCollection(uid),
    });
  const openModalConfirmDeleteLayout = (uid) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteLayout(uid),
    });
  };
  const openModalConfirmDeleteProductLine = (uid) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteProductLine(uid),
    });
  const openModalConfirmDeleteProductLineLayout = (uid) => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteLayoutProductLine(uid),
    });
  };
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
            openModalProductBase={openModalProductBase}
            setSelectedProductLines={setSelectedProductLines}
            editCollection={editCollection}
            setEditCollection={setEditCollection}
            editCollectionName={editCollectionName}
            setEditCollectionName={setEditCollectionName}
            handleSaveNewCollectionName={handleSaveNewCollectionName}
            openModalConfirmDeleteCollection={openModalConfirmDeleteCollection}
            openModalConfirmDeleteProductLine={
              openModalConfirmDeleteProductLine
            }
            handleSearchCollections={handleSearchCollections}
          />
        </Tabs.Panel>
        <Tabs.Panel value="layout" mt={8}>
          <Layout
            layouts={layouts}
            setLayouts={setLayouts}
            handleSelectLayout={handleSelectLayout}
            visible={activeTable}
            setVisible={setActiveTable}
            selectedFilters={selectedCollections}
            setSelectedFilters={setSelectedCollections}
            selectedLayout={selectedLayout}
            layoutName={layoutName}
            setLayoutName={setLayoutName}
            openModal={openModalLayout}
            openModalProductBase={openModalProductBase}
            setSelectedProductLines={setSelectedProductLines}
            editLayout={editLayout}
            setEditLayout={setEditLayout}
            editLayoutName={editLayoutName}
            setEditLayoutName={setEditLayoutName}
            handleSaveNewLayoutName={handleSaveNewLayoutName}
            openModalConfirmDeleteLayout={openModalConfirmDeleteLayout}
            openModalConfirmDeleteProductLineLayout={
              openModalConfirmDeleteProductLineLayout
            }
            handleSearchLayouts={handleSearchLayouts}
          />
        </Tabs.Panel>
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
        <LoadingOverlay
          visible={createCollectionsLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step label="First step" description="Collection Input">
            {isCreateNewCollection && (
              <Card
                className={styles.card}
                classCardHead={styles.cardHead}
                title="New Collection"
                classTitle={cn("title-purple", styles.title)}
              >
                <TextInput
                  placeholder="Collection Name ..."
                  size="sm"
                  styles={{
                    input: {
                      width: "300px",
                    },
                  }}
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
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
                        setPagination({
                          currentPage: 1,
                          totalPages: 1,
                        });
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
                      span={{ sm: 5, md: 4, lg: 3 }}
                      key={index}
                      style={{
                        position: "relative",
                      }}
                      onClick={() => {
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
                          setSelectedProductLines((selectedProductLines) => [
                            ...selectedProductLines,
                            productLine,
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
            </Card>{" "}
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Preview">
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
                {map(selectedProductLines, (productLine, index) => (
                  <Grid.Col
                    span={{ sm: 5, md: 4, lg: 3 }}
                    key={index}
                    style={{
                      position: "relative",
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
                  </Grid.Col>
                ))}
              </Grid>
            </ScrollArea>
          </Stepper.Step>
        </Stepper>
        {activeStep !== 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        )}
        {activeStep === 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={handleCreateCollection}>Finish</Button>
          </Group>
        )}
      </Modal>
      <Modal
        opened={opendModalLayout}
        size="70%"
        onClose={closeModalLayout}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        <LoadingOverlay
          visible={createLayoutLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          <Stepper.Step label="First step" description="Collection Input">
            <Card
              className={styles.card}
              classCardHead={styles.cardHead}
              title="New Layout"
              classTitle={cn("title-purple", styles.title)}
            >
              <TextInput
                placeholder="Layout Name ..."
                size="sm"
                styles={{
                  input: {
                    width: "300px",
                  },
                }}
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
              />
            </Card>
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
                        setPagination({
                          currentPage: 1,
                          totalPages: 1,
                        });
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
                      span={{ sm: 5, md: 4, lg: 3 }}
                      key={index}
                      style={{
                        position: "relative",
                      }}
                      onClick={() => {
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
                          setSelectedProductLines((selectedProductLines) => [
                            ...selectedProductLines,
                            productLine,
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
                                productLine.imageSrc ||
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
            </Card>{" "}
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Preview">
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
                {map(selectedProductLines, (productLine, index) => (
                  <Grid.Col
                    span={{ sm: 5, md: 4, lg: 3 }}
                    key={index}
                    style={{
                      position: "relative",
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
                              productLine.image ||
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
                  </Grid.Col>
                ))}
              </Grid>
            </ScrollArea>
          </Stepper.Step>
        </Stepper>
        {activeStep !== 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Next step</Button>
          </Group>
        )}
        {activeStep === 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={handleCreateLayout}>Finish</Button>
          </Group>
        )}
      </Modal>
      <Modal
        opened={openedSelectProductBase}
        size="70%"
        onClose={closeModalProductBase}
        style={{
          borderRadius: "10px",
          scrollbarWidth: "thin",
        }}
      >
        <LoadingOverlay
          visible={createCollectionsLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Stepper
          active={activeChooseProductStep}
          onStepClick={setActiveChooseProductBaseStep}
        >
          <Stepper.Step label="First step" description="Choose Product Base">
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
                      span={{ sm: 5, md: 4, lg: 3 }}
                      key={index}
                      style={{
                        position: "relative",
                      }}
                      onClick={() => {
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
                          setSelectedProductLines((selectedProductLines) => [
                            ...selectedProductLines,
                            productLine,
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
            </Card>{" "}
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Preview">
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
                {map(selectedProductLines, (productLine, index) => (
                  <Grid.Col
                    span={{ sm: 5, md: 4, lg: 3 }}
                    key={index}
                    style={{
                      position: "relative",
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
                  </Grid.Col>
                ))}
              </Grid>
            </ScrollArea>
          </Stepper.Step>
        </Stepper>
        {activeChooseProductStep !== 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStepChooseProductBase}>
              Back
            </Button>
            <Button onClick={nextStepChooseProductBase}>Next step</Button>
          </Group>
        )}
        {activeChooseProductStep === 1 && (
          <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStepChooseProductBase}>
              Back
            </Button>
            <Button
              onClick={() => {
                if (activeTab === "collection") handleAddProductBase();
                else handleAddProductBaseLayout();
              }}
            >
              Finish
            </Button>
          </Group>
        )}
      </Modal>
    </>
  );
};
