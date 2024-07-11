import React, { useEffect, useRef, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import cn from "classnames";
import Card from "../../components/Card";
import {
  BRIEF_TYPES,
  BRIEF_VALUES,
  DESIGNER_MEMBERS,
  GROUP_WORKS,
  LAYOUT_TYPES,
  MEMBERS,
  RND_SIZES,
} from "../../constant";
import Checkbox from "../../components/Checkbox";
import Editor from "../../components/Editor";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  LoadingOverlay,
  ScrollArea,
  Modal,
  Image,
  Grid,
  Skeleton,
  Badge,
  Flex,
  Button,
  TextInput as MantineTextInput,
  Card as MantineCard,
  Text,
  Pagination,
  MultiSelect,
  Tooltip,
} from "@mantine/core";
import { showNotification } from "../../utils/index";

import Dropdown from "../../components/Dropdown";
import CustomTable from "../../components/Table";
import {
  compact,
  concat,
  differenceBy,
  filter,
  find,
  flatMap,
  forOwn,
  includes,
  intersection,
  intersectionBy,
  isEmpty,
  keys,
  map,
  merge,
  orderBy,
  random,
  sortBy,
  toLower,
  uniq,
  uniqBy,
} from "lodash";
import { rndServices } from "../../services";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import {
  CONVERT_STATUS_TO_NUMBER,
  delayTime,
  getEditorStateAsString,
} from "../../utils";
import {
  IconSearch,
  IconFilterOff,
  IconCheck,
  IconDeselect,
  IconSelector,
} from "@tabler/icons-react";
import LazyLoad from "react-lazyload";
import { useLocation, useNavigate } from "react-router";
const HoverInfo = ({ image }) => (
  <div className={styles.hoverInfo}>
    <Image radius="md" src={image} />
  </div>
);

const filterValidCollections = (collections, type, SKU) => {
  let validCollections = [];
  if (!SKU) {
    return [];
  }
  const { productLine: rootProductLine } = SKU;

  if (type === LAYOUT_TYPES[0]) {
    validCollections = filter(collections, (collection) =>
      includes(map(collection.productLines, "name"), rootProductLine)
    );
  } else if (type === LAYOUT_TYPES[1]) {
    validCollections = filter(
      collections,
      (collection) =>
        !includes(map(collection.productLines, "name"), rootProductLine)
    );
  }
  return filter(
    map(validCollections, (collection) => {
      const { productLines: collectionProductLines } = collection;
      if (type === LAYOUT_TYPES[0]) {
        const intersectionProductLines = intersectionBy(
          collectionProductLines,
          SKU.sameLayouts,
          "uid"
        );
        return {
          ...collection,
          validProductLines: intersectionProductLines,
        };
      } else if (type === LAYOUT_TYPES[1]) {
        const diffLayouts = differenceBy(
          collectionProductLines,
          SKU.sameLayouts,
          "uid"
        );
        return {
          ...collection,
          validProductLines: diffLayouts,
        };
      }
    }),
    (x) => !isEmpty(x.validProductLines)
  );
};

const generateScaleProductLinesTable = ({
  selectedProductLines,
  SKU,
  collections,
  rndSortName,
}) => {
  const allProductLines = compact(
    concat(
      SKU?.sameLayouts,
      SKU?.diffLayouts,
      flatMap(collections, "validProductLines")
    )
  );
  return compact(
    map(
      sortBy(selectedProductLines, (productLine) => toLower(productLine)),
      (x, index) => {
        const foundProductLine = find(allProductLines, { name: x });
        if (!foundProductLine) return null;
        const name = foundProductLine?.skuPrefix
          ? `${foundProductLine.skuPrefix}-${rndSortName}${String(
              random(1, 1000)
            ).padStart(4, "0")}`
          : `XX-${rndSortName}${String(random(1, 1000)).padStart(4, "0")}`;
        return {
          No: index + 1,
          "Product Line": foundProductLine?.name,
          Hình: foundProductLine?.image,
          SKU: name,
          Remove: "x",
        };
      }
    )
  );
};

const generateTextPreview = (type, layout) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return layout;
    case BRIEF_TYPES[1]:
      return "Clip Art";
    default:
      return "";
  }
};

const generateScaleClipArtTable = ({ SKU, selectedClipArts, rndSortName }) => {
  return compact(
    map(
      sortBy(selectedClipArts, (clipArt) => toLower(clipArt.name)),
      (x, index) => {
        const name = `${
          SKU?.skuPrefix ? SKU?.skuPrefix : "XX"
        }-${rndSortName}${String(random(1, 1000)).padStart(4, "0")}`;
        return {
          No: index + 1,
          "Clip Art": x.name,
          Hình: x.imageSrc,
          SKU: name,
          Remove: "x",
          uid: x.uid,
        };
      }
    )
  );
};

const generateScaleProductBaseOnBriefType = ({
  type,
  selectedProductLines,
  SKU,
  collections,
  rndSortName,
  selectedClipArts,
}) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return generateScaleProductLinesTable({
        selectedProductLines,
        SKU,
        collections,
        rndSortName,
      });
    case BRIEF_TYPES[1]:
      return generateScaleClipArtTable({
        SKU,
        selectedClipArts,
        rndSortName,
      });
    default:
      return [];
  }
};

const generateHeaderTable = (type) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return {
        headers: ["No", "Product Line", "Hình", "SKU", "Remove"],
        removeHeader: "Product Line",
      };
    case BRIEF_TYPES[1]:
      return {
        headers: ["No", "Clip Art", "Hình", "SKU", "Remove"],
        removeHeader: "Clip Art",
      };
    default:
      return [];
  }
};

const NewCampaigns = () => {
  const navigate = useNavigate();

  const [designerNote, setDesignerNote] = useState("");
  const [epmNote, setEPMNote] = useState("");
  const [mktNote, setMKTNote] = useState("");
  const [batch, setBatch] = useState("");
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [workGroup, setWorkGroup] = useState(GROUP_WORKS[0]);
  const [rndSize, setRndSize] = useState(RND_SIZES[0]);
  const [designerMember, setDesignerMember] = useState(DESIGNER_MEMBERS[0]);
  const [selectedClipArts, setSelectedClipArts] = useState([]);
  const [briefValue, setBriefValue] = useState(BRIEF_VALUES[0]);
  const [rndMember, setRndMember] = useState(MEMBERS[0]);
  const [epmMember, setEpmMember] = useState(MEMBERS[0]);
  const [briefType, setBriefType] = useState();
  const [layout, setLayout] = useState(LAYOUT_TYPES[0]);
  const [search, setSearch] = useState("");
  const [SKU, setSKU] = useState();
  const [productLines, setProductLines] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingSearchSKU, setLoadingSearchSKU] = useState(false);
  const [loadingProductLines, setLoadingProductLines] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [validCollections, setValidCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchCollection, setSearchCollection] = useState("");
  const [searchProductLine, setSearchProductLine] = useState("");
  const [createBriefLoading, setCreateBriefLoading] = useState(false);
  const [fetchClipArtsLoading, setFetchClipArtsLoading] = useState(false);
  const [filtersClipArt, setFiltersClipArt] = useState([]);
  const [clipArts, setClipArts] = useState([]);
  const [searchClipArt, setSearchClipArt] = useState("");
  const [query, setQuery] = useState({});
  const topScrollClipArtRef = useRef(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const topRef = useRef(null);
  const handleSearchSKU = async () => {
    console.log(search);
    if (isEmpty(search)) {
      showNotification("Thất bại", "Vui lòng nhập SKU", "red");
      return;
    }
    setSelectedCollection([]);
    setSelectedProductLines([]);
    setLoadingSearchSKU(true);
    setLoadingProductLines(true);
    await delayTime(2000);
    const product = await rndServices.searchProducts(search);
    if (product) {
      showNotification("Thành công", "Tìm thấy SKU", "green");
      setSKU(product);

      // filter collections
      const validCollections = compact(
        filterValidCollections(collections, layout, product)
      );
      setValidCollections(validCollections);
      const newProductLines = sortBy(
        compact(
          uniqBy(
            concat(
              product?.diffLayouts,
              flatMap(map(validCollections, "validProductLines"))
            ),
            "uid"
          )
        ),
        (productLines) => toLower(productLines.name)
      );
      setProductLines(
        layout === LAYOUT_TYPES[0] ? product.sameLayouts : newProductLines
      );
    }
    setLoadingProductLines(false);
    setLoadingSearchSKU(false);
  };
  const handleSyncUser = async () => {
    await rndServices.syncUser();
    await fetchUsers();
  };
  const handleRemoveRow = (name) => {
    if (selectedProductLines.length === 1 && selectedClipArts.length === 1) {
      showNotification("Thất bại", "Không thể xóa hết Product Line", "red");
      return;
    }
    switch (briefType) {
      case BRIEF_TYPES[0]:
        setSelectedProductLines(
          filter(selectedProductLines, (x) => x !== name)
        );
        break;
      case BRIEF_TYPES[1]:
        setSelectedClipArts(filter(selectedClipArts, (x) => x.name !== name));
        break;
      default:
        break;
    }
  };
  const handleFilterCollection = (event) => {
    const value = event.target.value;
    setSearchCollection(value);
    if (!value) {
      handleChangeLayout();
      return;
    }
    const filterValidCollections = filter(validCollections, (collection) => {
      return includes(toLower(collection.name), toLower(value));
    });
    if (isEmpty(filterValidCollections)) {
      return;
    }
    setValidCollections(filterValidCollections);
  };
  const handleFilterProductLines = (event) => {
    const value = event.target.value;
    setSearchProductLine(value);
    if (!value) {
      setProductLines(
        layout === LAYOUT_TYPES[0] ? SKU?.sameLayouts : SKU?.diffLayouts
      );
      return;
    }
    const filterProductLines = filter(productLines, (productLine) => {
      return includes(toLower(productLine.name), toLower(value));
    });
    if (isEmpty(filterProductLines)) {
      return;
    }
    setProductLines(filterProductLines);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const handleMouseLeave = () => {
    const sortedProductLines = orderBy(
      productLines,
      [
        (product) => (includes(selectedProductLines, product.name) ? 0 : 1),
        "name",
      ],
      ["asc", "asc"]
    );
    setProductLines(sortedProductLines);
  };
  const scrollToTheTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const onSubmit = async (data) => {};
  const fetchUsers = async () => {
    const { data } = await rndServices.getUsers({
      limit: -1,
    });
    const designers = filter(data, { role: "designer" });
    const rnds = filter(data, { role: "rnd" });
    const epms = filter(data, { role: "epm" });
    setRndMember(map(rnds, "name")[0]);
    setDesignerMember(map(designers, "name")[0]);
    setWorkGroup(uniq(map(data, "team"))[0]);
    setEpmMember(map(epms, "name")[0]);
    setUsers(data);
    setTeams(uniq(map(data, "team")));
  };
  const fetchFilters = async () => {
    const { data } = await rndServices.fetchFilters();
    setFiltersClipArt(data);
  };
  const fetchCollections = async () => {
    const { data } = await rndServices.getCollections({});
    setCollections(data);
  };
  const fetchAllProducts = async () => {
    const data = await rndServices.getAllProducts({ isTakeAll: true });
    setProducts(
      map(data, (x) => ({
        SKU: x.sku,
        image: x.imageSrc,
      }))
    );
  };
  useEffect(() => {
    switch (briefType) {
      case BRIEF_TYPES[0]:
        setSelectedProductLines([]);
        break;
      case BRIEF_TYPES[1]:
        setSelectedProductLines([]);
        break;
      default:
        break;
    }
  }, [briefType]);
  useEffect(() => {
    fetchCollections();
    fetchAllProducts();
    fetchUsers();
    fetchFilters();
  }, []);
  useEffect(() => {
    // Update the URL when search or page changes
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (pagination.currentPage !== 1)
      params.set("page", pagination.currentPage);
    navigate(`?${params.toString()}`, { replace: true });
  }, [search, pagination.currentPage, navigate]);

  const fetchClipArts = async (page) => {
    setFetchClipArtsLoading(true);
    const { data, metadata } = await rndServices.fetchClipArts({
      page,
      limit: 18,
      query,
      keyword: searchClipArt,
    });
    if (isEmpty(data)) {
      setFetchClipArtsLoading(false);
      setClipArts([]);
      setPagination({ currentPage: 1, totalPages: 1 });
      showNotification("Thất bại", "Không tìm thấy Clipart", "red");
      return;
    }
    setClipArts(data);
    setPagination(metadata);
    setFetchClipArtsLoading(false);
  };

  useEffect(() => {
    const batch = find(users, { name: rndMember, role: "rnd" })?.nextBatch;
    setBatch(batch || "");
  }, [rndMember]);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProductLines, setSelectedProductLines] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const handleChange = (name) => {
    if (selectedProductLines.includes(name)) {
      const newProductLines = selectedProductLines.filter((x) => x !== name);
      setSelectedProductLines(newProductLines);
      for (const collection of validCollections) {
        const { validProductLines, name } = collection;
        if (
          isEmpty(intersection(map(validProductLines, "name"), newProductLines))
        ) {
          setSelectedCollection(selectedCollection.filter((x) => x !== name));
        }
      }
    } else {
      setSelectedProductLines((selectedProductLines) => [
        ...selectedProductLines,
        name,
      ]);
    }
  };
  const handleChangeCollection = (name) => {
    const productLineCollection = find(validCollections, {
      name,
    }).validProductLines;

    if (selectedCollection.includes(name)) {
      setSelectedCollection(selectedCollection.filter((x) => x !== name));
      setSelectedProductLines(
        selectedProductLines.filter(
          (x) => !includes(map(productLineCollection, "name"), x)
        )
      );
    } else {
      setSelectedCollection((selectedCollection) => [
        ...selectedCollection,
        name,
      ]);
      setSelectedProductLines((selectedProductLines) =>
        uniq([...selectedProductLines, ...map(productLineCollection, "name")])
      );
    }
  };

  const handleChangeLayout = () => {
    const validCollections = filterValidCollections(collections, layout, SKU);
    if (layout === LAYOUT_TYPES[0]) {
      setProductLines(SKU?.sameLayouts || []);
    } else {
      const newProductLines = sortBy(
        compact(
          uniqBy(
            concat(
              SKU?.diffLayouts,
              flatMap(map(validCollections, "validProductLines"))
            ),
            "uid"
          )
        ),
        (productLines) => toLower(productLines.name)
      );
      setProductLines(newProductLines || []);
    }
    setValidCollections(validCollections || []);
  };

  useEffect(() => {
    handleChangeLayout();
    setSelectedCollection([]);
    setSelectedProductLines([]);
  }, [layout]);

  const prepareSubmitData = () => {
    const rndSortName = find(users, { name: rndMember })?.shortName;
    const data = generateScaleProductBaseOnBriefType({
      type: briefType,
      selectedProductLines,
      SKU,
      collections: validCollections,
      rndSortName,
      selectedClipArts,
    });
    return data;
  };

  const handleSubmitBrief = async () => {
    setCreateBriefLoading(true);
    const generatedSKUs = prepareSubmitData();
    if (isEmpty(generatedSKUs)) {
      showNotification("Thất bại", "Vui lòng chọn Product Line", "red");
      setCreateBriefLoading(false);
      return;
    }
    const data = map(generatedSKUs, (x) => {
      const { SKU: sku } = x;
      return {
        skuRef: SKU.sku,
        linkProductRef: SKU.productLink,
        imageRef: SKU.image,
        sku,
        batch,
        briefType,
        rndTeam: workGroup,
        size: {
          rnd: CONVERT_STATUS_TO_NUMBER[rndSize],
        },
        value: {
          rnd: CONVERT_STATUS_TO_NUMBER[briefValue],
        },
        rnd: find(users, { name: rndMember })?.uid,
        epm: find(users, { name: epmMember })?.uid,
        designer: find(users, { name: designerMember })?.uid,
        ...(epmNote || designerNote || mktNote
          ? {
              note: {
                ...(epmNote && { epm: getEditorStateAsString(epmNote) }),
                ...(designerNote && {
                  designer: getEditorStateAsString(designerNote),
                }),
                ...(mktNote && { mkt: getEditorStateAsString(mktNote) }),
              },
            }
          : {}),
        status: 1,
        ...(briefType === BRIEF_TYPES[0] && {
          productLine: find(productLines, { name: x["Product Line"] })?.uid,
        }),
        ...(briefType === BRIEF_TYPES[1] && {
          clipart: find(clipArts, { uid: x.uid })?.uid,
        }),
        designLinkRef: SKU?.designLink || "",
      };
    });
    console.log(data);
    await rndServices.createBriefs({ payloads: data });
    close();
    setCreateBriefLoading(false);
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    if (topScrollClipArtRef.current) {
      topScrollClipArtRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchClipArts(pagination.currentPage);
  }, [pagination.currentPage, query]);
  return (
    <>
      <div style={{ position: "relative" }}>
        <LoadingOverlay
          visible={createBriefLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <CampaignInfo
              className={styles.card}
              workGroup={workGroup}
              setWorkGroup={setWorkGroup}
              handleSubmit={handleSubmit}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              setReviewData={setReviewData}
              previewData={reviewData}
              setFormValue={setValue}
              openPreviewModal={open}
              rndMember={rndMember}
              setRndMember={setRndMember}
              briefType={briefType}
              setBriefType={setBriefType}
              search={search}
              setSearch={setSearch}
              handleSearchSKU={handleSearchSKU}
              loadingSearchSKU={loadingSearchSKU}
              SKU={SKU}
              selectedProductLines={selectedProductLines}
              products={products}
              designerMember={designerMember}
              setDesignerMember={setDesignerMember}
              epmMember={epmMember}
              setEpmMember={setEpmMember}
              briefValue={briefValue}
              setBriefValue={setBriefValue}
              rndSize={rndSize}
              setRndSize={setRndSize}
              users={users}
              teams={teams}
              handleSyncUser={handleSyncUser}
            />
          </div>
          <div className={styles.col}>
            {briefType === BRIEF_TYPES[0] && (
              <Box pos="relative">
                <LoadingOverlay
                  visible={false}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ color: "pink", type: "bars" }}
                />
                <Card
                  className={cn(styles.card)}
                  title="3. Product cần Scale"
                  classTitle="title-green"
                  classCardHead={styles.classCardHead}
                  classSpanTitle={styles.classScaleSpanTitle}
                  head={
                    <Dropdown
                      className={styles.dropdown}
                      classDropdownHead={styles.dropdownHead}
                      value={layout}
                      setValue={setLayout}
                      options={LAYOUT_TYPES}
                      classOutSideClick={styles.memberDropdown}
                    />
                  }
                >
                  {!loadingProductLines && !isEmpty(productLines) && SKU && (
                    <Grid>
                      <Grid.Col span={6}>
                        <ScrollArea
                          h={500}
                          style={{
                            color: "#000",
                            borderRadius: "10px",
                            boxShadow:
                              "0px 1px 1px 0px rgba(0,0,0,0.12),0px 2px 2px 0px rgba(0,0,0,0.12),0px 4px 4px 0px rgba(0,0,0,0.12),0px 8px 8px 0px rgba(0,0,0,0.12),0px 16px 16px 0px rgba(0,0,0,0.12)",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          }}
                        >
                          <div className={styles.list}>
                            <TextInput
                              placeholder="Search Collection"
                              type="text"
                              name="search"
                              value={searchCollection}
                              onChange={(e) => handleFilterCollection(e)}
                              className={styles.searchCollection}
                            />
                            {!isEmpty(validCollections) ? (
                              map(validCollections, (x, index) => (
                                <Checkbox
                                  className={styles.checkbox}
                                  content={`Collection - ${x.name} (${x.validProductLines.length})`}
                                  value={selectedCollection.includes(x.name)}
                                  onChange={() =>
                                    handleChangeCollection(x.name)
                                  }
                                  key={index}
                                />
                              ))
                            ) : (
                              <p
                                style={{
                                  textAlign: "center",
                                  color: "#FF6A55",
                                  marginTop: "10px",
                                }}
                              >
                                Không có collection nào phù hợp
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <ScrollArea
                          h={500}
                          style={{
                            color: "#000",
                            borderRadius: "10px",
                            boxShadow:
                              "0px 1px 1px 0px rgba(0,0,0,0.12),0px 2px 2px 0px rgba(0,0,0,0.12),0px 4px 4px 0px rgba(0,0,0,0.12),0px 8px 8px 0px rgba(0,0,0,0.12),0px 16px 16px 0px rgba(0,0,0,0.12)",
                            backgroundColor: "rgba(255, 255, 255, 1)",
                          }}
                        >
                          <div ref={topRef}></div>
                          <div
                            className={styles.list}
                            onMouseLeave={handleMouseLeave}
                            style={{ position: "relative" }}
                          >
                            <TextInput
                              placeholder="Search Product Lines"
                              type="text"
                              name="search"
                              value={searchProductLine}
                              onChange={(e) => handleFilterProductLines(e)}
                              className={styles.searchCollection}
                            />
                            {map(productLines, (x, index) => (
                              <Checkbox
                                key={index}
                                className={styles.checkbox}
                                content={x.name}
                                value={selectedProductLines.includes(x.name)}
                                onChange={() => handleChange(x.name)}
                                showHover={true}
                                HoverComponent={HoverInfo}
                                hoverProps={{
                                  image:
                                    x.image ||
                                    "/images/content/not_found_2.jpg",
                                }}
                              />
                            ))}
                          </div>
                          <span
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                              cursor: "pointer",
                              padding: "10px",
                              borderRadius: "10px",
                            }}
                            onClick={scrollToTheTop}
                          >
                            <Icon name="arrow-top" size={24} fill="#83BF6E" />
                          </span>
                        </ScrollArea>
                      </Grid.Col>
                    </Grid>
                  )}
                  {loadingProductLines && (
                    <Grid>
                      <Grid.Col span={6}>
                        <Skeleton height={350} radius="md" />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Skeleton height={350} radius="md" />
                      </Grid.Col>
                    </Grid>
                  )}
                </Card>
              </Box>
            )}
          </div>
        </div>
        {briefType === BRIEF_TYPES[1] && (
          <div className={styles.row} ref={topScrollClipArtRef}>
            <Card
              className={cn(styles.card, styles.clipArtCard)}
              title="3. Clipart cần Scale"
              classTitle="title-green"
              classCardHead={styles.classCardHead}
              classSpanTitle={styles.classScaleSpanTitle}
              head={
                <Text>
                  {!isEmpty(selectedClipArts) ? (
                    <span>
                      {selectedClipArts.length} Clipart đã chọn
                      <span
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => setClipArts(selectedClipArts)}
                      >
                        <Tooltip label="Show Selected Clipart">
                          <IconSelector />
                        </Tooltip>
                      </span>
                      <span
                        style={{
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedClipArts([])}
                      >
                        <Tooltip label="Deselect">
                          <IconDeselect />
                        </Tooltip>
                      </span>
                    </span>
                  ) : null}
                </Text>
              }
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
                      {includes(
                        map(selectedClipArts, "name"),
                        clipArt.name
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
          </div>
        )}
        <div className={styles.row}>
          <Card
            className={cn(styles.cardNote)}
            title="4. Note"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            <Grid>
              <Grid.Col span={4}>
                <Editor
                  state={designerNote}
                  onChange={setDesignerNote}
                  classEditor={styles.editor}
                  label="Designer Note"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Editor
                  state={epmNote}
                  onChange={setEPMNote}
                  classEditor={styles.editor}
                  label="EPM Note"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Editor
                  state={mktNote}
                  onChange={setMKTNote}
                  classEditor={styles.editor}
                  label="MKT Note"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <div
                  className={cn(
                    "button-stroke-blue button-small",
                    styles.createButton
                  )}
                  onClick={() => {
                    if (!SKU) {
                      showNotification("Thất bại", "Vui lòng chọn SKU", "red");
                      return;
                    }
                    if (
                      isEmpty(selectedProductLines) &&
                      isEmpty(selectedClipArts)
                    ) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng chọn Product Line hoặc Clipart",
                        "red"
                      );
                      return;
                    }
                    open();
                  }}
                  style={{
                    marginTop: "24px",
                    marginBottom: "12px",
                    marginRight: "auto",
                    width: "150px",
                    borderRadius: "20px",
                    borderColor: "#62D256",
                    borderWidth: "2px",
                    backgroundColor: "#D9F5D6",
                    border: "1px solid #62D256",
                    color: "#000000",
                    cursor: "pointer",
                  }}
                >
                  <span>Preview Brief</span>
                </div>
              </Grid.Col>
            </Grid>
          </Card>
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
        size="1000px"
      >
        <Grid>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: "#D9F5D6",
                border: "1px solid #62D256",
                color: "#000000",
                borderColor: "#62D256",
                fontSize: "18px",
                borderRadius: "12px",
              }}
            >
              PREVIEW BRIEF - {batch}
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
                fontSize: "18px",
              }}
            >
              Scale{" "}
              <Badge
                size="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
                style={{ margin: "0 5px" }}
              >
                {generateTextPreview(briefType, layout)}
              </Badge>{" "}
              từ{" "}
              <Badge size="md" color="pink" style={{ marginLeft: "5px" }}>
                {SKU?.sku}
              </Badge>{" "}
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {workGroup} - {rndMember}
            </div>
          </Grid.Col>
          <Grid.Col span={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                fontSize: "18px",
                alignItems: "center",
              }}
            >
              REF
            </div>
            <Image
              radius="md"
              src={SKU?.image || "/images/content/not_found_2.jpg"}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                fontSize: "18px",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              {SKU?.sku}
            </div>
          </Grid.Col>
          <Grid.Col span={8}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
                fontSize: "18px",
              }}
            >
              Scale
            </div>
            <ScrollArea h={300} scrollbars="y" scrollbarSize={2}>
              <CustomTable
                items={generateScaleProductBaseOnBriefType({
                  type: briefType,
                  selectedProductLines,
                  SKU,
                  collections: validCollections,
                  rndSortName: find(users, { name: rndMember })?.shortName,
                  selectedClipArts,
                })}
                headers={generateHeaderTable(briefType)?.headers}
                onRemove={handleRemoveRow}
                headerRemove={generateHeaderTable(briefType)?.removeHeader}
              />
            </ScrollArea>
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button
                className={cn(
                  "button-stroke-blue button-small",
                  styles.createButton
                )}
                onClick={handleSubmitBrief}
                style={{
                  marginTop: "24px",
                  marginBottom: "12px",
                  width: "150px",
                  borderRadius: "20px",
                  borderWidth: "2px",
                  backgroundColor: "#3FA433",
                  color: "#ffffff",
                }}
              >
                <span>Tạo Brief</span>
              </button>
            </div>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};

export default NewCampaigns;
