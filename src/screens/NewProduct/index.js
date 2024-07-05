import React, { useEffect, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import cn from "classnames";
import Card from "../../components/Card";
import {
  BRIEF_TYPES,
  GROUP_WORKS,
  LAYOUT_TYPES,
  MEMBERS,
} from "../../constant";
import Checkbox from "../../components/Checkbox";
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
} from "@mantine/core";
import { showNotification } from "../../utils/index";

import Dropdown from "../../components/Dropdown";
import CustomTable from "../../components/Table";
import { posts } from "../../mocks/posts";
import {
  compact,
  concat,
  difference,
  differenceBy,
  filter,
  find,
  flatMap,
  includes,
  intersection,
  intersectionBy,
  isEmpty,
  map,
  sortBy,
  toLower,
  uniq,
  uniqBy,
} from "lodash";
import { rndServices } from "../../services";

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
          SKU.sameLayouts
        );
        return {
          ...collection,
          validProductLines: intersectionProductLines,
        };
      } else if (type === LAYOUT_TYPES[1]) {
        const diffLayouts = differenceBy(
          collectionProductLines,
          SKU.sameLayouts
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

const generateScaleProductLinesTable = (
  selectedProductLines,
  SKU,
  collections
) => {
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
          ? `${foundProductLine.skuPrefix}-NM001`
          : `XX-NM001`;
        return {
          No: index + 1,
          "Product Line": foundProductLine?.name,
          SKU: name,
        };
      }
    )
  );
};

const NewCampaigns = () => {
  const [workGroup, setWorkGroup] = useState(GROUP_WORKS[0]);
  const [rndMember, setRndMember] = useState(MEMBERS[0]);
  const [briefType, setBriefType] = useState(BRIEF_TYPES[0]);
  const [layout, setLayout] = useState(LAYOUT_TYPES[0]);
  const [search, setSearch] = useState("");
  const [SKU, setSKU] = useState();
  const [productLines, setProductLines] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingSearchSKU, setLoadingSearchSKU] = useState(false);
  const [loadingProductLines, setLoadingProductLines] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [validCollections, setValidCollections] = useState([]);

  const handleSearchSKU = async () => {
    console.log(search);
    if (isEmpty(search)) {
      showNotification("Thất bại", "Vui lòng nhập SKU", "red");
      return;
    }
    setLoadingSearchSKU(true);
    setLoadingProductLines(true);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data) => {};
  const fetchCollections = async () => {
    const { data } = await rndServices.getCollections({});
    setCollections(data);
  };
  useEffect(() => {
    fetchCollections();
  }, []);
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

  useEffect(() => {
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
    setSelectedCollection([]);
    setSelectedProductLines([]);
  }, [layout]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: "relative" }}>
        <LoadingOverlay
          visible={false}
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
            />
          </div>
          <div className={styles.col}>
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
                        h={350}
                        style={{
                          color: "#000",
                          borderRadius: "10px",
                          boxShadow:
                            "0px 1px 1px 0px rgba(0,0,0,0.12),0px 2px 2px 0px rgba(0,0,0,0.12),0px 4px 4px 0px rgba(0,0,0,0.12),0px 8px 8px 0px rgba(0,0,0,0.12),0px 16px 16px 0px rgba(0,0,0,0.12)",
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        }}
                      >
                        <div className={styles.list}>
                          {!isEmpty(validCollections) ? (
                            map(validCollections, (x, index) => (
                              <Checkbox
                                className={styles.checkbox}
                                content={`Collection - ${x.name} (${x.validProductLines.length})`}
                                value={selectedCollection.includes(x.name)}
                                onChange={() => handleChangeCollection(x.name)}
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
                        h={350}
                        style={{
                          color: "#000",
                          borderRadius: "10px",
                          boxShadow:
                            "0px 1px 1px 0px rgba(0,0,0,0.12),0px 2px 2px 0px rgba(0,0,0,0.12),0px 4px 4px 0px rgba(0,0,0,0.12),0px 8px 8px 0px rgba(0,0,0,0.12),0px 16px 16px 0px rgba(0,0,0,0.12)",
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        }}
                      >
                        <div className={styles.list}>
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
                                  x.image || "/images/content/not_found_2.jpg",
                              }}
                            />
                          ))}
                        </div>
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
          </div>
        </div>
      </form>
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
              PREVIEW BRIEF
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
                {layout}
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
          <Grid.Col span={5}>
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
          <Grid.Col span={1}></Grid.Col>
          <Grid.Col span={6}>
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
            <ScrollArea h={300} scrollbars="y">
              <CustomTable
                items={generateScaleProductLinesTable(
                  selectedProductLines,
                  SKU,
                  validCollections
                )}
                headers={["No", "Product Line", "SKU"]}
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
                type="submit"
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
