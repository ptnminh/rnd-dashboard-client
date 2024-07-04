import React, { useEffect, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import cn from "classnames";
import Card from "../../components/Card";
import {
  BRIEF_TYPES,
  COLLECTIONS,
  GROUP_WORKS,
  LAYOUT_TYPES,
  MEMBERS,
  SAMPLE_SKU,
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
} from "@mantine/core";
import { showNotification } from "../../utils/index";

import Dropdown from "../../components/Dropdown";
import CustomTable from "../../components/Table";
import { posts } from "../../mocks/posts";
import {
  compact,
  difference,
  filter,
  find,
  includes,
  intersection,
  isEmpty,
  map,
  uniq,
} from "lodash";

const HoverInfo = ({ image }) => (
  <div className={styles.hoverInfo}>
    <Image radius="md" src={image} />
  </div>
);

const filterValidCollections = (collections, type, rootProductLine) => {
  let validCollections = [];
  if (type === LAYOUT_TYPES[0]) {
    validCollections = filter(collections, (collection) =>
      includes(collection.productLines, rootProductLine)
    );
  } else if (type === LAYOUT_TYPES[1]) {
    validCollections = filter(
      collections,
      (collection) => !includes(collection.productLines, rootProductLine)
    );
  }
  return filter(
    map(validCollections, (collection) => {
      const { productLines: collectionProductLines } = collection;
      if (type === LAYOUT_TYPES[0]) {
        const productLines = SAMPLE_SKU.sameProductLine.map((x) => x.name);
        const intersectionProductLines = intersection(
          collectionProductLines,
          productLines
        );
        return {
          ...collection,
          validProductLines: intersectionProductLines,
        };
      } else if (type === LAYOUT_TYPES[1]) {
        const productLines = SAMPLE_SKU.sameProductLine.map((x) => x.name);
        const diffProductLines = difference(
          collectionProductLines,
          productLines
        );
        return {
          ...collection,
          validProductLines: diffProductLines,
        };
      }
    }),
    (x) => !isEmpty(x.validProductLines)
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
    setLoadingSearchSKU(true);
    setLoadingProductLines(true);
    setSKU(SAMPLE_SKU);
    setProductLines(SAMPLE_SKU.sameProductLine);

    // filter collections
    const validCollections = compact(
      filterValidCollections(
        collections,
        LAYOUT_TYPES[0],
        SAMPLE_SKU.productLine
      )
    );
    setValidCollections(validCollections);

    // TEST
    setTimeout(() => {
      setLoadingProductLines(false);
      setLoadingSearchSKU(false);
    }, 2000);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data) => {};
  const fetchCollections = async () => {
    setCollections(COLLECTIONS);
  };
  useEffect(() => {
    fetchCollections();
  }, []);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedProductLines, setSelectedProductLines] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const handleChange = (name) => {
    if (selectedProductLines.includes(name)) {
      setSelectedProductLines(selectedProductLines.filter((x) => x !== name));
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
        selectedProductLines.filter((x) => !productLineCollection.includes(x))
      );
    } else {
      setSelectedCollection((selectedCollection) => [
        ...selectedCollection,
        name,
      ]);
      setSelectedProductLines((selectedProductLines) =>
        uniq([...selectedProductLines, ...productLineCollection])
      );
    }
  };

  useEffect(() => {
    if (layout === LAYOUT_TYPES[0]) {
      setProductLines(SAMPLE_SKU.sameProductLine);
    } else {
      setProductLines(SAMPLE_SKU.diffProductLine);
    }
    setValidCollections(
      filterValidCollections(collections, layout, SAMPLE_SKU.productLine)
    );
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
                {!loadingProductLines &&
                  !isEmpty(validCollections) &&
                  !isEmpty(productLines) &&
                  SKU && (
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
                            {map(validCollections, (x, index) => (
                              <Checkbox
                                className={styles.checkbox}
                                content={`Collection - ${x.name} (${x.validProductLines.length})`}
                                value={selectedCollection.includes(x.name)}
                                onChange={() => handleChangeCollection(x.name)}
                                key={index}
                              />
                            ))}
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
                                hoverProps={{ image: x.image }}
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
              Scale Product Line chung Layout - từ MG-Q045
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
              BD1 - Thảo Thảo
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
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
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
              MG-Q045
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
                items={posts}
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
