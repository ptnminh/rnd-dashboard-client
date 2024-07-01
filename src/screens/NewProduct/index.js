import React, { useEffect, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import DefaultValue from "./Price";
import cn from "classnames";
import Card from "../../components/Card";
import {
  CAMP_TYPES,
  CHANNELS,
  EXPRESSION_TYPES,
  MATCH_TYPES,
  PRODUCT_LINES_OPTIONS,
  STRATEGIES,
  DEFAULT_VALUES_NAVIGATIONS,
  CREATE_KW_CAMP_METHOD,
  STORE_PREFIX_BRAND,
  MAPPED_STRATEGY,
  CAMPAIGN_TYPES_OPTIONS,
} from "../../constant";
import Checkbox from "../../components/Checkbox";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm } from "react-hook-form";
import {
  chunk,
  compact,
  filter,
  find,
  first,
  flatMap,
  includes,
  isEmpty,
  join,
  map,
  split,
  trim,
  uniq,
} from "lodash";
import moment from "moment-timezone";
import Table from "./CampaignInfo/Table";
import CryptoJS from "crypto-js";
import { useDisclosure } from "@mantine/hooks";
import { Autocomplete, Box, LoadingOverlay } from "@mantine/core";
import { showNotification } from "../../utils/index";
import ProductLine from "./ProductLine";
import {
  campaignServices,
  keywordServices,
  portfolioServices,
} from "../../services";
import { Tooltip } from "react-tooltip";

const generateRandomBytes = (length) => {
  return CryptoJS.lib.WordArray.random(length).toString();
};
const NewCampaigns = () => {
  const [
    visibleSyncLoadingProductLine,
    { open: openLoadingProductLine, close: closeLoadingProductLine },
  ] = useDisclosure(false);
  const [
    visibleLoadingCreateCamp,
    { open: openLoadingCreateCamp, close: closeLoadingCreateCamp },
  ] = useDisclosure(false);
  const [activeProductLineTab, setActiveProductLineTab] = useState(
    PRODUCT_LINES_OPTIONS[0]
  );
  const [selectedCreateCampMethodForSKU, setSelectedCreateCampMethodForSKU] =
    useState(1);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [campType, setCampType] = useState(CAMP_TYPES[0]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedCreateCampMethodForKW, setSelectedCreateCampMethodForKW] =
    useState(1);
  const [visibleCreateCampResult, setVisibleCreateCampResult] = useState(false);

  const [campTypePlaceHolder, setCampTypePlaceHolder] = useState(
    `father gifts\ngifts\nmother gifts`
  );
  const handleChangeForKW = (id) => {
    setSelectedCreateCampMethodForKW(id);
    if (id !== 3) {
      setValue("maximumKwPerCampaign", null);
    }
  };

  const handleChangeForSKU = (id) => {
    setSelectedCreateCampMethodForSKU(id);
    if (id !== 3) {
      setValue("maximumSKUPerCampaign", null);
    }
  };

  const [activeDefaultValueTab, setActiveDefaultValueTab] = useState(
    DEFAULT_VALUES_NAVIGATIONS[0]
  );
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [matchType, setMatchType] = useState(MATCH_TYPES[0]);
  const [expressionType, setExpressionType] = useState(EXPRESSION_TYPES[0]);
  const [visiblePreviewData, setVisiblePreviewData] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioId, setPortfolioId] = useState();
  const [keywordCount, setKeywordCount] = useState(0);
  const [createCampaignResult, setCreateCampaignResult] = useState("");
  const [loadingAvailableStores, setLoadingAvailableStores] = useState(false);
  const [listRunAds, setListRunAds] = useState([]);
  const [selectAvailableStore, setSelectAvailableStore] = useState([]);
  const [campTypeTitle, setCampTypeTitle] = useState(
    CAMPAIGN_TYPES_OPTIONS[0].title
  );
  const [availableStores, setAvailableStores] = useState([]);
  const [productLine, setProductLine] = useState("");
  const [visiblePreviewProductLine, setVisiblePreviewProductLine] =
    useState(false);
  const handleKeywordBlur = () => {
    const keywords = getValues("keywords");
    if (campType === "KEYWORD") {
      const pattern = /^(?![Bb]0)[a-zA-Z0-9\s'-]*$/;
      const invalidKeywords = keywords
        .split("\n")
        .filter((keyword) => !pattern.test(keyword));
      if (invalidKeywords.length > 0) {
        setError("keywords", {
          type: "manual",
          message: "You must enter at least one keyword.",
        });
      } else {
        clearErrors("keywords");
      }
    } else if (campType === "ASIN") {
      const asinPattern = /^[bB]0.*/;
      const invalidAsins = keywords
        .split("\n")
        .filter((keyword) => !asinPattern.test(keyword));
      if (invalidAsins.length > 0) {
        setError("keywords", {
          type: "manual",
          message: "You must enter at least one ASIN.",
        });
      } else {
        clearErrors("keywords");
      }
    }

    const count = keywords?.split("\n").filter(Boolean).length;
    setKeywordCount(count || 0);
  };
  const handleSKUsBlur = async () => {
    setLoadingAvailableStores(true);
    const SKUs = getValues("SKUs");
    const listSKUs = uniq(
      compact(map(split(trim(SKUs), "\n"), (SKU) => trim(SKU)))
    );
    if (isEmpty(listSKUs)) {
      setLoadingAvailableStores(false);
      return;
    }
    const listRunAdsReponse = await campaignServices.getAvailableStores(
      listSKUs
    );
    setListRunAds(listRunAdsReponse);
    const stores = uniq(flatMap(map(listRunAdsReponse, "store")));
    setAvailableStores(stores);
    setLoadingAvailableStores(false);
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

  const handleSyncProductLine = async () => {
    openLoadingProductLine();
    const SKUs = getValues("SKUs");
    if (isEmpty(SKUs)) {
      showNotification("Thất bại", "Giá trị SKU không tồn tại", "red");
      closeLoadingProductLine();
      return;
    }
    if (isEmpty(availableStores)) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập SKU để tìm store trước khi tìm sync",
        "red"
      );
      closeLoadingProductLine();
      return;
    }
    const firstSKU = first(compact(SKUs.split("\n")));
    const prefix = split(firstSKU, "-")[0];
    const portfolios = await portfolioServices.syncPortfolio({
      prefix,
      stores: availableStores,
    });
    if (portfolios) {
      showNotification("Thành công", "Đồng bộ thành công", "green");
      setPortfolios(portfolios);
      const firstPortfolio = first(portfolios);
      setPortfolioId(firstPortfolio.portfolioId);
      setVisiblePreviewProductLine(true);
    } else {
      showNotification("Thất bại", "Đồng bộ thất bại", "red");
      setPortfolioId();
      setPortfolios([]);
    }
    setProductLine("");
    closeLoadingProductLine();
    return;
  };
  const handleFindProductLine = async () => {
    openLoadingProductLine();
    if (isEmpty(productLine)) {
      showNotification("Thất bại", "Giá trị Product Line không tồn tại", "red");
      closeLoadingProductLine();
      return;
    }
    if (isEmpty(availableStores)) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập SKU để tìm store trước khi tìm Product Line",
        "red"
      );
      closeLoadingProductLine();
      return;
    }
    const portfolios = await portfolioServices.findProductLine({
      productLine,
      stores: availableStores,
    });
    if (portfolios) {
      showNotification("Thành công", "Tìm thấy giá trị Product Line", "green");
      setPortfolios(portfolios);
      const firstPortfolio = first(portfolios);
      setPortfolioId(firstPortfolio.portfolioId);
      setVisiblePreviewProductLine(true);
    } else {
      showNotification(
        "Thất bại",
        "Không tìm thấy giá trị Product Line",
        "red"
      );
      setPortfolioId();
      setPortfolios([]);
    }
    closeLoadingProductLine();
    return;
  };

  const transformedData = (data) => {
    const {
      maximumKwPerCampaign,
      keywords,
      SKUs,
      maximumSKUPerCampaign,
      extendPrefix,
      defaultBid,
      budget,
      bid,
      topOfSearch,
    } = data;
    const allSKUs = uniq(
      compact(map(split(trim(SKUs), "\n"), (SKU) => trim(SKU)))
    );
    const listKeywords = uniq(
      compact(map(split(trim(keywords), "\n"), (keyword) => trim(keyword)))
    );
    if (campType === "ASIN") {
      const asinPattern = /^[bB]0.*/;
      const invalidAsins = listKeywords.filter(
        (keyword) => !asinPattern.test(keyword)
      );
      if (invalidAsins.length > 0) {
        showNotification("Thất bại", "ASIN không hợp lệ", "red");
        return;
      }
    } else if (campType === "KEYWORD") {
      const pattern = /^(?![Bb]0)[a-zA-Z0-9\s'-]*$/;
      const invalidKeywords = listKeywords.filter(
        (keyword) => !pattern.test(keyword)
      );
      if (invalidKeywords.length > 0) {
        showNotification("Thất bại", "Keyword không hợp lệ", "red");
        return;
      }
    }
    let chunkedKeywords = [];

    if (selectedCreateCampMethodForKW === 1 && !maximumKwPerCampaign) {
      chunkedKeywords = [listKeywords];
    } else if (selectedCreateCampMethodForKW === 2 && !maximumKwPerCampaign) {
      chunkedKeywords = chunk(listKeywords, 10);
    } else if (selectedCreateCampMethodForKW === 3 && maximumKwPerCampaign) {
      chunkedKeywords = chunk(listKeywords, maximumKwPerCampaign);
    }
    const preparedData = [];
    for (let store of selectAvailableStore) {
      let chunkedSKUs = [];
      const listSKUs = filter(allSKUs, (SKU) => {
        const foundListRunAds = find(listRunAds, (x) => x.SKU === SKU);
        return includes(foundListRunAds?.store, store);
      });
      if (selectedCreateCampMethodForSKU === 1 && !maximumSKUPerCampaign) {
        chunkedSKUs = [listSKUs];
      } else if (
        selectedCreateCampMethodForSKU === 2 &&
        !maximumSKUPerCampaign
      ) {
        chunkedSKUs = chunk(listSKUs, 1);
      } else if (
        selectedCreateCampMethodForSKU === 3 &&
        maximumSKUPerCampaign
      ) {
        chunkedSKUs = chunk(listSKUs, maximumSKUPerCampaign);
      }
      for (let index = 0; index < chunkedSKUs.length; index++) {
        const chunkListSKUs = chunkedSKUs[index];
        const transformedSKUs = map(chunkListSKUs, (SKU) => {
          if (store !== "PFH") {
            return `${SKU}-${STORE_PREFIX_BRAND[store].prefix}`;
          }
          return SKU;
        });

        if (isEmpty(transformedSKUs)) {
          continue;
        }
        const foundPortfolio = find(portfolios, (x) => x.store === store);
        if (!foundPortfolio) {
          showNotification(
            "Thất bại",
            `Không tìm thấy Portfolio cho store ${store}`,
            "red"
          );
          continue;
        }

        for (let i = 0; i < chunkedKeywords.length; i++) {
          const chunkListKeywords = chunkedKeywords[i];
          const firstSKU = transformedSKUs[0];
          const transformedCampType = campType === "KEYWORD" ? "KW" : campType;
          let campaignName = `${channel}_${firstSKU}${
            extendPrefix ? "_" + extendPrefix : ""
          }_${transformedCampType}_${moment().format(
            "MMMDD"
          )}_${generateRandomBytes(6)}`;
          if (strategy && strategy === "UP_AND_DOWN") {
            campaignName = `${channel}_${firstSKU}${
              extendPrefix ? "_" + extendPrefix : ""
            }_${transformedCampType}_U&D_${moment().format(
              "MMMDD"
            )}_${generateRandomBytes(6)}`;
          }
          preparedData.push({
            skus: join(transformedSKUs, ","),
            ...(campType === "KEYWORD"
              ? {
                  keywords: join(chunkListKeywords, ","),
                }
              : campType === "ASIN"
              ? {
                  asins: join(chunkListKeywords, ","),
                }
              : {}),
            store,
            defaultBid,
            state: "ENABLED",
            dailyBudget: budget,
            ...(campType !== "AUTO" && { bid }),
            ...(campType === "KEYWORD" && { matchType }),
            ...(campType === "ASIN" && { expressionType }),
            type: campType === "AUTO" ? "AUTO" : "MANUAL",
            topOfSearch,
            adGroupName: `Ad group - ${moment().format(
              "YYYY-MM-DD HH:mm:ss.SSS"
            )}`,
            campaignName,
            strategy: MAPPED_STRATEGY[strategy],
            portfolioId: foundPortfolio?.portfolioId,
          });
        }
      }
    }
    console.log(preparedData);
    return preparedData;
  };

  const onSubmit = async (data) => {
    if (!portfolioId) {
      const inputPortfolioId = getValues("portfolioId");
      if (!inputPortfolioId) {
        showNotification("Thât bại", "Chưa sync Product Line", "red");
        return;
      }
    }
    openLoadingCreateCamp();
    const preparedData = transformedData(data);
    if (isEmpty(preparedData)) {
      closeLoadingCreateCamp();
      showNotification("Thất bại", "Vui lòng thử lại", "red");
      return;
    }
    const createCampaignsResult = await campaignServices.createCamps(
      preparedData
    );
    if (!createCampaignsResult) {
      showNotification("Thất bại", "Tạo campaign thất bại", "red");
      setCreateCampaignResult("Contact IT để biết chi tiết lỗi");
    } else {
      setCreateCampaignResult(createCampaignsResult);
      showNotification("Thành công", "Tạo campaign thành công", "green");
    }
    setPortfolioId("");
    setPortfolios([]);
    setReviewData([]);
    closeLoadingCreateCamp();
    setVisibleCreateCampResult(true);
    return true;
  };

  const handlePreviewData = () => {
    const data = getValues();
    console.log(data);
    if (!data.SKUs) {
      showNotification("Thất bại", "Vui lòng nhập SKUs hoặc Keywords", "red");
      setReviewData([]);
      return;
    }
    if (campType !== "AUTO" && isEmpty(data.keywords)) {
      showNotification("Thất bại", "Vui lòng nhập KW/ASIN", "red");
      setReviewData([]);
      return;
    }
    if (isEmpty(selectAvailableStore)) {
      showNotification("Thất bại", "Vui lòng chọn store", "red");
      setReviewData([]);
      return;
    }
    if (
      campType !== "AUTO" &&
      selectedCreateCampMethodForKW === 3 &&
      !data.maximumKwPerCampaign
    ) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập Maximum KW/ASIN Per Campaign",
        "red"
      );
      setReviewData([]);
      return;
    }
    if (selectedCreateCampMethodForSKU === 3 && !data.maximumSKUPerCampaign) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập Maximum SKU Per Campaign",
        "red"
      );
      setReviewData([]);
      return;
    }
    const listKeywords = uniq(
      compact(map(split(trim(data.keywords), "\n"), (keyword) => trim(keyword)))
    );
    if (campType === "ASIN") {
      const asinPattern = /^[bB]0.*/;
      const invalidAsins = listKeywords.filter(
        (keyword) => !asinPattern.test(keyword)
      );
      if (invalidAsins.length > 0) {
        showNotification("Thất bại", "ASIN không hợp lệ", "red");
        return;
      }
    } else if (campType === "KEYWORD") {
      const pattern = /^(?![Bb]0)[a-zA-Z0-9\s'-]*$/;
      const invalidKeywords = listKeywords.filter(
        (keyword) => !pattern.test(keyword)
      );
      if (invalidKeywords.length > 0) {
        showNotification("Thất bại", "Keyword không hợp lệ", "red");
        return;
      }
    }
    const preparedData = transformedData(data);
    console.log(preparedData);
    setReviewData(preparedData);
    setVisiblePreviewData(true);
  };

  const handleResetData = () => {
    setValue("SKUs", "");
    setValue("keywords", "");
    setValue("extendPrefix", "");
    setValue("portfolioId", "");
    setPortfolioId("");
    setPortfolios([]);
    setReviewData([]);
    setVisiblePreviewData(false);
    setCreateCampaignResult("");
    setActiveDefaultValueTab(DEFAULT_VALUES_NAVIGATIONS[0]);
    setCampType(CAMP_TYPES[0]);
    setValue("maximumKwPerCampaign", null);
    setValue("maximumSKUPerCampaign", null);
  };

  useEffect(() => {
    switch (campType) {
      case "AUTO":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1.25);
          setValue("budget", 15);
          setValue("topOfSearch", 0);
        }
        break;
      case "KEYWORD":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1.25);
          setValue("budget", 15);
          setValue("topOfSearch", 0);
          setValue("bid", 1.25);
        }
        setCampTypePlaceHolder(`father gifts\ngifts\nmother gifts`);
        setCampTypeTitle("KW");
        break;
      case "ASIN":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1.25);
          setValue("budget", 15);
          setValue("topOfSearch", 0);
          setValue("bid", 1.25);
        }
        setCampTypePlaceHolder(`B0C99KFYS6\nB09P48SXPN\nB0CBKT4SJ5`);
        setCampTypeTitle("ASIN");
        break;
      default:
        break;
    }
  }, [campType, activeDefaultValueTab]);

  useEffect(() => {
    setValue("extendPrefix", "Gr");
  }, []);

  const fetchTemplates = async () => {
    const templates = await keywordServices.getTemplatesKeyword({
      isTakeAll: true,
    });
    setAllTemplates(templates.data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: "relative" }}>
        <LoadingOverlay
          visible={visibleLoadingCreateCamp}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <CampaignInfo
              className={styles.card}
              campType={campType}
              setCampType={setCampType}
              channel={channel}
              setChannel={setChannel}
              selectedCreateCampMethod={selectedCreateCampMethodForSKU}
              handleChange={handleChangeForSKU}
              handleSubmit={handleSubmit}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              setVisibleReviewTable={setVisiblePreviewData}
              setReviewData={setReviewData}
              handleResetData={handleResetData}
              previewData={reviewData}
              handlePreviewData={handlePreviewData}
              setFormValue={setValue}
              handleSKUsBlur={handleSKUsBlur}
              availableStores={availableStores}
              setAvailableStores={setAvailableStores}
              loadingAvailableStores={loadingAvailableStores}
              selectAvailableStore={selectAvailableStore}
              setSelectAvailableStore={setSelectAvailableStore}
            />
            {createCampaignResult && visibleCreateCampResult && (
              <Card
                className={cn(styles.card)}
                title="Kết quả"
                classTitle="title-red"
                classCardHead={styles.classCardHead}
                head={
                  <div className={cn(styles.nav, "tablet-hide")}>
                    <div
                      className={cn(styles.link, {
                        [styles.active]: visibleCreateCampResult,
                      })}
                      onClick={() => setVisibleCreateCampResult(false)}
                      style={{ cursor: "pointer" }}
                    >
                      Hide
                    </div>
                  </div>
                }
              >
                <TextInput
                  className={styles.maximumCamp}
                  name="createCampaignResult"
                  type="text"
                  label={"Chi tiết kết quả"}
                  isTextArea={true}
                  value={createCampaignResult}
                />
              </Card>
            )}
          </div>
          <div className={styles.col}>
            <Box pos="relative">
              <LoadingOverlay
                visible={visibleSyncLoadingProductLine}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: "pink", type: "bars" }}
              />
              <Card
                className={cn(styles.card)}
                title="3. Product Line"
                classTitle="title-orange"
                classCardHead={styles.classCardHead}
                head={
                  <>
                    <div className={cn(styles.nav, "tablet-hide")}>
                      {PRODUCT_LINES_OPTIONS.map((x, index) => (
                        <div
                          className={cn(styles.link, {
                            [styles.active]: x === activeProductLineTab,
                          })}
                          onClick={() => setActiveProductLineTab(x)}
                          key={index}
                          style={{ cursor: "pointer" }}
                        >
                          {x}
                        </div>
                      ))}
                    </div>
                  </>
                }
              >
                {activeProductLineTab === "Default" && (
                  <>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-html="Data được sync từ Google Sheet, ví dụ SKU: ONM-K12 thì sẽ lấy prefix là ONM để đi tìm bên Google Sheet <br>Trường hợp có nhiều Product Line được tìm thấy thì mặc định sẽ lấy Product Line đầu tiên</br>
                      <br>Click để xem chi tiết</br>"
                      data-tooltip-place="top"
                      style={{ cursor: "pointer", marginRight: "12px" }}
                      target="_blank"
                      href="https://docs.google.com/spreadsheets/d/1F1CIRG4LzfBl2fKu9cNWa6wzGSTB93qTCPcozDb9aS0/edit?exids=71471476%2C71471470&gid=273441149#gid=273441149"
                    >
                      <Icon name="info" size={24} />
                    </a>
                    <Tooltip id="my-tooltip" />
                    <div
                      className={cn(
                        "button-stroke button-small",
                        styles.createButton
                      )}
                      type="button"
                      style={{ cursor: "pointer", marginBottom: "24px" }}
                      onClick={handleSyncProductLine}
                    >
                      <Icon name="link" size="12" />
                      <span>Sync</span>
                    </div>
                    {!isEmpty(portfolios) && visiblePreviewProductLine && (
                      <div
                        className={cn(
                          "button-stroke button-small",
                          styles.createButton
                        )}
                        type="button"
                        style={{
                          cursor: "pointer",
                          marginLeft: "12px",
                        }}
                        onClick={() => setVisiblePreviewProductLine(false)}
                      >
                        <Icon name="close" size="12" />
                        <span>Hide</span>
                      </div>
                    )}
                    {!isEmpty(portfolios) && visiblePreviewProductLine && (
                      <div>
                        <ProductLine data={portfolios} activeTable={true} />
                      </div>
                    )}
                  </>
                )}
                {activeProductLineTab === "New" && (
                  <div className={styles.description}>
                    <TextInput
                      className={styles.maximumCamp}
                      name="portfolioId"
                      type="text"
                      placeholder="Enter Portfolio ID"
                      register={register("portfolioId", { required: true })}
                      error={errors.portfolioId}
                    />
                  </div>
                )}
                {activeProductLineTab === "Product Line" && (
                  <>
                    <div className={styles.description}>
                      <TextInput
                        className={styles.maximumCamp}
                        name="productLine"
                        type="text"
                        placeholder="Enter Product Line"
                        value={productLine}
                        onChange={(e) => setProductLine(e.target.value)}
                      />
                    </div>
                    <div
                      className={cn(
                        "button-stroke button-small",
                        styles.createButton
                      )}
                      type="button"
                      style={{
                        cursor: "pointer",
                        marginTop: "24px",
                        marginBottom: "24px",
                      }}
                      onClick={handleFindProductLine}
                    >
                      <Icon name="leaderboard" size="12" />
                      <span>Find</span>
                    </div>
                    {!isEmpty(portfolios) && visiblePreviewProductLine && (
                      <div
                        className={cn(
                          "button-stroke button-small",
                          styles.createButton
                        )}
                        type="button"
                        style={{
                          cursor: "pointer",
                          marginLeft: "12px",
                        }}
                        onClick={() => setVisiblePreviewProductLine(false)}
                      >
                        <Icon name="close" size="12" />
                        <span>Hide</span>
                      </div>
                    )}
                    {!isEmpty(portfolios) && visiblePreviewProductLine && (
                      <div>
                        <ProductLine data={portfolios} activeTable={true} />
                      </div>
                    )}
                  </>
                )}
              </Card>
            </Box>
            {campType !== "AUTO" && (
              <Card
                className={cn(styles.card)}
                title={campTypeTitle === "KW" ? "5. KW" : "5. ASIN"}
                classTitle="title-orange"
                classCardHead={styles.classCardHead}
                head={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "15px",
                    }}
                  >
                    <span>
                      <Autocomplete
                        placeholder="Pick value or enter"
                        data={map(allTemplates, "name") || []}
                        withScrollArea={false}
                        styles={{
                          dropdown: { maxHeight: 200, overflowY: "auto" },
                        }}
                        onChange={(value) => {
                          if (value) {
                            const foundTemplate = find(
                              allTemplates,
                              (x) => x.name === value
                            );
                            if (foundTemplate) {
                              setValue(
                                "keywords",
                                join(foundTemplate.keywords, "\n")
                              );
                            }
                          }
                        }}
                        onBlur={handleKeywordBlur}
                      />
                    </span>
                  </div>
                }
              >
                <div className={styles.description}>
                  <div
                    className={styles.group}
                    style={{ width: "100%", marginBottom: 24 }}
                  >
                    <TextInput
                      className={styles.maximumCamp}
                      name="keywords"
                      type="text"
                      onBlur={handleKeywordBlur}
                      isTextArea={true}
                      placeholder={campTypePlaceHolder}
                      register={register("keywords", {
                        required: campType !== "AUTO",
                        pattern: /^[a-zA-Z0-9\s]+$/,
                      })}
                      error={errors.keywords}
                    />
                    {keywordCount !== 0 && <p>Số lượng: {keywordCount}</p>}
                    <div
                      style={{
                        display: "flex",
                        minWidth: "100%",
                        marginLeft: 6,
                      }}
                    >
                      {CREATE_KW_CAMP_METHOD.map((x, index) => (
                        <Checkbox
                          className={styles.checkbox}
                          content={x.title}
                          value={selectedCreateCampMethodForKW === x.id}
                          onChange={() => handleChangeForKW(x.id)}
                          key={index}
                        />
                      ))}
                    </div>

                    {selectedCreateCampMethodForKW === 3 && (
                      <TextInput
                        className={styles.maximumCamp}
                        name="maximumKwPerCampaign"
                        type="number"
                        placeholder="3"
                        tooltip="BT-P005_Gr_1kw"
                        register={register("maximumKwPerCampaign", {
                          required: true,
                          valueAsNumber: true,
                        })}
                        error={errors.maximumKwPerCampaign}
                      />
                    )}
                  </div>
                </div>
              </Card>
            )}

            <DefaultValue
              className={styles.defaultValue}
              activeDefaultValueTab={activeDefaultValueTab}
              setActiveDefaultValueTab={setActiveDefaultValueTab}
              setStrategy={setStrategy}
              strategy={strategy}
              matchType={matchType}
              setMatchType={setMatchType}
              expressionType={expressionType}
              setExpressionType={setExpressionType}
              campaignType={campType}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        {visiblePreviewData && (
          <div
            style={{
              marginTop: "12px",
            }}
          >
            <Card
              className={cn(styles.card)}
              title="Review"
              classTitle="title-blue"
              classCardHead={styles.classCardHead}
              head={
                <div className={cn(styles.nav, "tablet-hide")}>
                  <div
                    className={cn(styles.link, {
                      [styles.active]: visiblePreviewData,
                    })}
                    onClick={() => setVisiblePreviewData(false)}
                    style={{ cursor: "pointer" }}
                  >
                    Hide
                  </div>
                </div>
              }
            >
              <Table
                className={styles.table}
                activeTable={visiblePreviewData}
                setActiveTable={visiblePreviewData}
                data={reviewData}
              />
            </Card>
          </div>
        )}
      </form>
    </>
  );
};

export default NewCampaigns;
