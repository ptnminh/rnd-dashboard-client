import React, { useEffect, useRef, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import RndInfo from "./RndInfo";
import cn from "classnames";
import Card from "../../components/Card";
import {
  BRIEF_TYPES,
  KEEP_CLIPARTS,
  LAYOUT_TYPES,
  RND_SIZES,
} from "../../constant";
import Editor from "../../components/Editor";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import {
  LoadingOverlay,
  ScrollArea,
  Modal,
  Image,
  Grid,
  Badge,
  Flex,
  Button,
  TextInput as MantineTextInput,
  Card as MantineCard,
  Text,
  Pagination,
  MultiSelect,
  Select,
  Tooltip,
  Group,
  Textarea,
} from "@mantine/core";
import { showNotification } from "../../utils/index";
import Dropdown from "../../components/Dropdown";
import CustomTable from "../../components/Table";
import {
  ceil,
  compact,
  concat,
  filter,
  find,
  findIndex,
  includes,
  isEmpty,
  keys,
  map,
  merge,
  orderBy,
  sortBy,
  toLower,
  uniq,
} from "lodash";
import { dashboardServices, rndServices } from "../../services";
import { CONVERT_STATUS_TO_NUMBER, getEditorStateAsString } from "../../utils";
import {
  IconSearch,
  IconFilterOff,
  IconCheck,
  IconEye,
  IconRotateClockwise,
  IconCodePlus,
  IconCodeMinus,
  IconPlus,
} from "@tabler/icons-react";
import LazyLoad from "react-lazyload";
import { useNavigate } from "react-router";
import ProductBase from "./ProductBase";
import RefDesign from "./RefDesign";
import Loader from "../../components/Loader";
import SKUComponent from "./SKU";
import Clipart from "./Clipart";
import MarketBriefDesign from "./MarketBrief";
import ModalPreviewMixMatch from "./ModalPreviewMixMatch";
import ModalPreviewGroupClipart from "./ModalPreviewGroupClipart";
import Optimized from "./Optimized";
import ModalPreviewOptimized from "./ModalPreviewOptimized";

const generateScaleProductLinesTable = ({
  selectedProductLines,
  SKU,
  rndSortName,
  rndId,
}) => {
  const allProductLines = compact(concat(SKU?.sameLayouts, SKU?.diffLayouts));
  let skuPrefixAccumulators = [];
  let tables = compact(
    map(
      sortBy(selectedProductLines, (productLine) => toLower(productLine)),
      (x, index) => {
        const foundProductLine = find(allProductLines, { uid: x.uid });
        const skuAccumulators = foundProductLine?.skuAccumulators || [];
        const currentRnDAccumulator =
          find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
        const prefix = foundProductLine?.skuPrefix || "XX";
        if (!foundProductLine) return null;
        let realRnDAccumulator =
          find(skuPrefixAccumulators, { prefix })?.accumulator + 1 ||
          currentRnDAccumulator + 1;
        if (prefix !== "XX") {
          let foundPrefixIndex = findIndex(skuPrefixAccumulators, { prefix });
          if (foundPrefixIndex !== -1) {
            const foundPrefix = skuPrefixAccumulators[foundPrefixIndex];
            foundPrefix.accumulator = foundPrefix.accumulator + 1;
          } else {
            skuPrefixAccumulators.push({
              prefix,
              accumulator: realRnDAccumulator,
            });
          }
        }
        const name = `${prefix}-${rndSortName}${String(
          realRnDAccumulator
        ).padStart(4, "0")}`;
        return {
          No: index + 1,
          "Product Line": foundProductLine?.name,
          Hình: foundProductLine?.image,
          SKU: name,
          Remove: "x",
          nextAccumulator: realRnDAccumulator,
          skuPrefix: prefix,
          uid: foundProductLine?.uid,
          uniqueId: `${foundProductLine?.uid}_${foundProductLine?.image}_${realRnDAccumulator}`,
          productLineId: foundProductLine?.uid,
        };
      }
    )
  );
  return map(tables, (table) => {
    const { skuPrefix } = table;
    const foundPrefix = find(skuPrefixAccumulators, { prefix: skuPrefix });
    return {
      ...table,
      nextAccumulator: foundPrefix?.accumulator || table.nextAccumulator,
    };
  });
};

const generateTextPreview = (type, layout) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return layout || "Product Base";
    case BRIEF_TYPES[1]:
      return "Clipart";
    case BRIEF_TYPES[2]:
      return "Niche";
    case BRIEF_TYPES[3]:
      return "New - Phủ Market";
    case BRIEF_TYPES[4]:
      return "Design";
    case BRIEF_TYPES[6]:
      return BRIEF_TYPES[6];
    case BRIEF_TYPES[7]:
      return BRIEF_TYPES[7];
    case BRIEF_TYPES[8]:
      return BRIEF_TYPES[8];
    default:
      return "";
  }
};
const generateCardTitle = (type) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return "4. Note";
    case BRIEF_TYPES[1]:
      return "4. Note";
    case BRIEF_TYPES[2]:
      return "5. Note";
    case BRIEF_TYPES[3]:
      return "5. Note";
    case BRIEF_TYPES[4]:
      return "4. Note";
    case BRIEF_TYPES[5]:
      return "6. Note";
    case BRIEF_TYPES[6]:
      return "3. Note";
    default:
      return "Note";
  }
};

const generateScaleDesignTable = ({
  selectedSKUs,
  rndSortName,
  selectedProductBases,
  rndId,
}) => {
  const prefix = selectedProductBases[0]?.skuPrefix || "XX";
  const skuAccumulators = selectedProductBases[0]?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(selectedSKUs, (x, index) => {
      const realRnDAccumulator = currentRnDAccumulator + index + 1;
      const name = `${prefix}-${rndSortName}${String(
        realRnDAccumulator
      ).padStart(4, "0")}`;
      return {
        No: index + 1,
        "Product Base": x?.productLine || "",
        Hình: x?.productInfo?.imageSrc,
        SKU: name,
        Remove: "x",
        uid: x?.uid,
        designLinkRef: x?.attribute?.nasShareLink || "",
        nextAccumulator: currentRnDAccumulator + selectedSKUs.length,
        skuPrefix: prefix,
        skuRef: x.sku,
        imageRef:
          selectedProductBases[0]?.image || selectedProductBases[0]?.imageSrc,
        uniqueId: `${x.uid}`,
        productLineId: selectedProductBases[0]?.uid,
      };
    })
  );
};

const generateScaleClipArtTable = ({
  SKU,
  grouppedCliparts,
  rndSortName,
  rndId,
}) => {
  const skuAccumulators = SKU?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(grouppedCliparts, (x, index) => {
      const realRnDAccumulator = currentRnDAccumulator + index + 1;
      const name = `${
        SKU?.skuPrefix ? SKU?.skuPrefix : "XX"
      }-${rndSortName}${String(realRnDAccumulator).padStart(4, "0")}`;
      return {
        No: index + 1,
        Hình: map(x.cliparts, "imageSrc"),
        SKU: name,
        Remove: "x",
        uid: x.index,
        nextAccumulator: currentRnDAccumulator + grouppedCliparts.length,
        skuPrefix: SKU?.skuPrefix,
        clipartIds: map(x.cliparts, "uid"),
        uniqueId: `${realRnDAccumulator}_${x.index}`,
        productLineId: SKU?.productLineId,
      };
    })
  );
};

const generateScaleQuoteTable = ({
  selectedQuotes,
  rndSortName,
  SKU,
  selectedClipArts,
  rndId,
}) => {
  const skuAccumulators = SKU?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(
      sortBy(selectedQuotes, (quote) => toLower(quote.name)),
      (x, index) => {
        const realRnDAccumulator = currentRnDAccumulator + index + 1;
        const name = `${
          SKU?.skuPrefix ? SKU?.skuPrefix : "XX"
        }-${rndSortName}${String(realRnDAccumulator).padStart(4, "0")}`;
        return {
          No: index + 1,
          Quote: x.quote.slice(0, 50) + (x.quote.length > 50 ? "..." : ""),
          ...(!isEmpty(selectedClipArts) && {
            Hình: map(selectedClipArts, "imageSrc"),
            clipartIds: map(selectedClipArts, "uid"),
          }),
          SKU: name,
          Remove: "x",
          uid: x.uid,
          nextAccumulator: currentRnDAccumulator + selectedQuotes.length,
          skuPrefix: SKU?.skuPrefix,
          uniqueId: x.uid,
          productLineId: SKU?.productLineId,
        };
      }
    )
  );
};
const generateScaleNewDesign = ({
  designs,
  rndSortName,
  selectedProductBases,
  rndId,
}) => {
  const prefix = selectedProductBases[0]?.skuPrefix || "XX";
  const skuAccumulators = selectedProductBases[0]?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(designs, (x, index) => {
      const realRnDAccumulator = currentRnDAccumulator + index + 1;
      const name = `${prefix}-${rndSortName}${String(
        realRnDAccumulator
      ).padStart(4, "0")}`;
      return {
        No: index + 1,
        Ref: x.imageRef,
        Clipart: map(x?.clipart, "imageSrc"),
        SKU: name,
        Remove: "x",
        clipartIds: map(x?.clipart, "uid"),
        designLinkRef: x?.designLinkRef,
        nextAccumulator: currentRnDAccumulator + designs.length,
        skuPrefix: prefix,
        ...(x?.note && {
          note: getEditorStateAsString(x?.note),
        }),
        uniqueId: `${realRnDAccumulator}_${x?.designLinkRef}`,
        productLineId: selectedProductBases[0]?.uid,
      };
    })
  );
};
const generateScaleMixMatch = ({
  selectedProductBases,
  rndSortName,
  rndId,
  marketBrief,
  grouppedCliparts,
}) => {
  const prefix = selectedProductBases[0]?.skuPrefix || "XX";
  const skuAccumulators = selectedProductBases[0]?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  const tables = compact(
    map(grouppedCliparts, (x, index) => {
      const realRnDAccumulator = currentRnDAccumulator + index + 1;
      const name = `${prefix}-${rndSortName}${String(
        realRnDAccumulator
      ).padStart(4, "0")}`;
      return {
        No: index + 1,
        "Hình Product Base":
          selectedProductBases[0]?.image || selectedProductBases[0]?.imageSrc,
        Ref: marketBrief?.imageRef,
        "Hình Clipart": map(x.cliparts, "imageSrc"),
        SKU: name,
        Remove: "x",
        uid: x.index.toString(),
        clipartIds: map(x?.cliparts, "uid"),
        designLinkRef: marketBrief?.designLinkRef,
        nextAccumulator: currentRnDAccumulator + grouppedCliparts.length,
        skuPrefix: prefix,
        uniqueId: `${realRnDAccumulator}_${x.index}_${marketBrief?.designLinkRef}`,
        productLineId: selectedProductBases[0]?.uid,
      };
    })
  );
  return tables;
};

const generateOptimizedSKU = ({ SKU }) => {
  if (isEmpty(SKU)) return [];
  return [
    {
      No: 1,
      Hình: SKU?.image,
      SKU: SKU?.sku,
      Remove: "x",
      uid: SKU?.uid,
      skuPrefix: SKU?.skuPrefix,
      uniqueId: `${SKU?.uid}`,
    },
  ];
};

const generateScaleProductBaseOnBriefType = ({
  type,
  SKU,
  collections,
  rndSortName,
  selectedClipArts,
  selectedQuotes,
  designs,
  selectedProductBases,
  rndId,
  selectedSKUs,
  marketBrief,
  grouppedCliparts,
}) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      const productLinePayloads = generateScaleProductLinesTable({
        selectedProductLines: selectedProductBases,
        SKU,
        collections,
        rndSortName,
        rndId,
      });
      return productLinePayloads;
    case BRIEF_TYPES[1]:
      const clipartPayloads = generateScaleClipArtTable({
        SKU,
        grouppedCliparts,
        rndSortName,
        rndId,
      });
      return clipartPayloads;
    case BRIEF_TYPES[2]:
      const quotePayloads = generateScaleQuoteTable({
        selectedQuotes,
        rndSortName,
        SKU,
        selectedClipArts,
        rndId,
      });
      return quotePayloads;
    case BRIEF_TYPES[3]:
      const newDesignPayloads = generateScaleNewDesign({
        designs,
        rndSortName,
        selectedProductBases,
        rndId,
      });
      return newDesignPayloads;
    case BRIEF_TYPES[4]:
      const designPayloads = generateScaleDesignTable({
        selectedSKUs,
        rndSortName,
        selectedProductBases,
        rndId,
      });
      return designPayloads;
    case BRIEF_TYPES[5]:
      const mixMatchPayloads = generateScaleMixMatch({
        selectedProductBases,
        rndSortName,
        rndId,
        grouppedCliparts,
        marketBrief,
      });
      return mixMatchPayloads;
    case BRIEF_TYPES[6]:
      const optimizedListingPayloads = generateOptimizedSKU({
        SKU,
        rndId,
      });
      return optimizedListingPayloads;
    case BRIEF_TYPES[7]:
      const generateOptimizedAdsPayloads = generateOptimizedSKU({
        SKU,
        rndId,
      });
      return generateOptimizedAdsPayloads;
    case BRIEF_TYPES[8]:
      const generateOptimizedFullflow = generateOptimizedSKU({
        SKU,
        rndId,
      });
      return generateOptimizedFullflow;
    default:
      return [];
  }
};

const generateHeaderTable = (type, isKeepClipArt = true) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return {
        headers: ["No", "Product Line", "Hình", "SKU", "Remove"],
        removeHeader: "Product Line",
      };
    case BRIEF_TYPES[1]:
      return {
        headers: ["No", "Hình", "SKU", "Remove"],
        removeHeader: "Clip Art",
      };
    case BRIEF_TYPES[2]:
      return isKeepClipArt === KEEP_CLIPARTS[0]
        ? {
            headers: ["No", "Quote", "SKU", "Remove", "uid"],
          }
        : {
            headers: ["No", "Quote", "Hình", "SKU", "Remove", "uid"],
          };
    case BRIEF_TYPES[3]:
      return {
        headers: ["No", "Ref", "Clipart", "SKU", "Remove"],
        removeHeader: "Ref",
      };
    case BRIEF_TYPES[4]:
      return {
        headers: ["No", "Hình", "SKU", "Remove", "uid"],
      };
    case BRIEF_TYPES[5]:
      return {
        headers: [
          "No",
          "Hình Product Base",
          "Ref",
          "Hình Clipart",
          "SKU",
          "Remove",
          "uid",
        ],
      };
    case BRIEF_TYPES[6]:
      return {
        headers: ["No", "Hình", "SKU", "Remove"],
      };
    case BRIEF_TYPES[7]:
      return {
        headers: ["No", "Hình", "SKU", "Remove"],
      };
    case BRIEF_TYPES[8]:
      return {
        headers: ["No", "Hình", "SKU", "Remove"],
      };
    default:
      return [];
  }
};

const CreateNewQuote = ({
  quote,
  setQuote,
  quoteFilters,
  close,
  fetchQuotes,
  quotePagination,
}) => {
  const [loading, setLoading] = useState(false);
  const handleCreateQuote = async () => {
    setLoading(true);
    const createQuoteResponse = await rndServices.createQuote({
      payloads: [quote],
    });
    if (createQuoteResponse) {
      await fetchQuotes(quotePagination.currentPage);
      setQuote({});
    }
    setLoading(false);
    close();
  };
  return (
    <>
      <Select
        label="Quote Name"
        placeholder="Choose Quote Name"
        data={quoteFilters?.names || []}
        value={quote?.name || null}
        data-autofocus
        styles={{
          label: {
            marginBottom: "10px",
          },
        }}
        onChange={(value) => {
          setQuote((prev) => ({
            ...prev,
            name: value,
          }));
        }}
      />
      <Textarea
        label="Quote"
        placeholder="Enter Quote"
        value={quote?.quote || ""}
        autosize
        minRows={5}
        maxRows={5}
        onChange={(e) => {
          setQuote({
            ...quote,
            quote: e.target.value,
          });
        }}
        styles={{
          label: {
            marginBottom: "10px",
          },
        }}
      />
      <Button
        fullWidth
        loading={loading}
        onClick={async () => {
          await handleCreateQuote();
          close();
        }}
        mt="md"
      >
        Submit
      </Button>
    </>
  );
};

const NewCampaigns = () => {
  const navigate = useNavigate();

  const myClipartHeaderRef = useRef(null);
  const [designerNote, setDesignerNote] = useState("");
  const [epmNote, setEPMNote] = useState("");
  const [mktNote, setMKTNote] = useState("");
  const [batch, setBatch] = useState("");
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [workGroup, setWorkGroup] = useState();
  const [rndSize, setRndSize] = useState();
  const [designerMember, setDesignerMember] = useState();
  const [selectedClipArts, setSelectedClipArts] = useState([]);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [briefValue, setBriefValue] = useState();
  const [rndMember, setRndMember] = useState();
  const [epmMember, setEpmMember] = useState();
  const [briefType, setBriefType] = useState();
  const [layout, setLayout] = useState();
  const [search, setSearch] = useState("");
  const [SKU, setSKU] = useState();
  const [collections, setCollections] = useState([]);
  const [loadingSearchSKU, setLoadingSearchSKU] = useState(false);
  const [loadingProductLines, setLoadingProductLines] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [validCollections, setValidCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [createBriefLoading, setCreateBriefLoading] = useState(false);
  const [fetchClipArtsLoading, setFetchClipArtsLoading] = useState(false);
  const [filtersClipArt, setFiltersClipArt] = useState([]);
  const [clipArts, setClipArts] = useState([]);
  const [searchClipArt, setSearchClipArt] = useState("");
  const [marketBrief, setMarketBrief] = useState({});
  const [searchKeywordQuote, setSearchKeywordQuote] = useState("");
  const [productBases, setProductBases] = useState([]);
  const [quoteFilters, setQuoteFilters] = useState([]);
  const [query, setQuery] = useState({});
  const topScrollClipArtRef = useRef(null);
  const [designs, setDesigns] = useState([]);
  const [editSKUs, setEditSKUs] = useState([]);
  const [triggerCreateSKUPayload, setTriggerCreateSKUPayload] = useState(false);
  const [
    openedModalPreviewGroupClipart,
    {
      open: openModalPreviewGroupClipart,
      close: closeModalPreviewGroupClipart,
    },
  ] = useDisclosure(false);
  const [
    openedModalCreateQuote,
    { open: openModalCreateQuote, close: closeModalCreateQuote },
  ] = useDisclosure(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [quotePagination, setQuotePagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [productBasePagination, setProductBasePagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [skuPagination, setSkuPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [queryProductBase, setQueryProductBase] = useState({});
  const [querySKU, setQuerySKU] = useState({});
  const [timeSettings, setTimeSettings] = useState([]);
  const [grouppedCliparts, setGrouppedCliparts] = useState([]);
  const [selectedProductBases, setSelectedProductBases] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [quote, setQuote] = useState({
    quote: "",
    name: "",
  });
  const [loadingProductBase, setLoadingProductBase] = useState(false);
  const [loadingSKU, setLoadingSKU] = useState(false);
  const [queryQuote, setQueryQuote] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [foundSKUs, setFoundSKUs] = useState([]);
  const [isKeepClipArt, setKeepClipArt] = useState(KEEP_CLIPARTS[0]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [loaderIcon, setLoaderIcon] = useState(false);
  const [isDeletingRow, setIsDeletingRow] = useState(false);
  const [usingInlineProductBaseData, setUsingProductBaseData] = useState(false);
  const handleSearchSKU = async () => {
    if (isEmpty(search)) {
      showNotification("Thất bại", "Vui lòng nhập SKU", "red");
      return;
    }
    setSelectedCollection([]);
    setSelectedProductLines([]);
    setLoadingSearchSKU(true);
    setLoadingProductLines(true);
    const product = await rndServices.searchProducts(search);
    if (product) {
      showNotification("Thành công", "Tìm thấy SKU", "green");
      setSKU(product);
    } else {
      setSKU(null);
    }
    setLoadingProductLines(false);
    setLoadingSearchSKU(false);
  };
  const handleSyncUser = async () => {
    await rndServices.syncUser();
    await fetchUsers();
  };
  const handleSyncQuotes = async () => {
    setLoaderIcon(true);
    await rndServices.syncQuotes();
    await fetchQuotes(quotePagination.currentPage);
    setLoaderIcon(false);
  };
  const fetchDashboardSettings = async () => {
    const response = await dashboardServices.fetchDashboardsSetting({
      page: -1,
      query: {
        actives: [0, 1],
      },
      limit: -1,
    });
    const { data } = response;
    if (data) {
      setTimeSettings(
        map(data, (time) => ({
          ...time,
          option: toLower(time.option),
        }))
      );
    }
  };
  const handleSyncProductBases = async () => {
    setLoaderIcon(true);
    await rndServices.syncProductBases();
    await fetchProductBases(productBasePagination.currentPage);
    setLoaderIcon(false);
  };
  const handleSyncCliparts = async () => {
    setLoaderIcon(true);
    await rndServices.syncCliparts();
    await fetchClipArts(pagination.currentPage);
    setLoaderIcon(false);
  };
  const handleRemoveRow = (name) => {
    if (selectedProductBases.length === 1 && selectedClipArts.length === 1) {
      showNotification("Thất bại", "Không thể xóa hết Product Line", "red");
      return;
    }
    switch (briefType) {
      case BRIEF_TYPES[0]:
        setSelectedProductBases(
          filter(selectedProductBases, (x) => x.name !== name)
        );
        break;
      case BRIEF_TYPES[1]:
        const newGroupCliparts = filter(
          grouppedCliparts,
          (x) => x.index.toString() !== name.toString()
        );
        setGrouppedCliparts(newGroupCliparts);
        break;
      case BRIEF_TYPES[2]:
        setSelectedQuotes(filter(selectedQuotes, (x) => x.uid !== name));
        break;
      case BRIEF_TYPES[3]:
        setDesigns(filter(designs, (x) => x.imageRef !== name));
        break;
      case BRIEF_TYPES[4]:
        setSelectedSKUs(filter(selectedSKUs, (x) => x.uid !== name));
        break;
      case BRIEF_TYPES[5]:
        setGrouppedCliparts(
          filter(
            grouppedCliparts,
            (x) => x.index.toString() !== name.toString()
          )
        );
        break;
      case BRIEF_TYPES[6]:
        setSKU({});
        break;
      case BRIEF_TYPES[7]:
        setSKU({});
        break;
      case BRIEF_TYPES[8]:
        setSKU({});
        break;
      default:
        break;
    }
    setIsDeletingRow(true);
  };
  useEffect(() => {
    if (isDeletingRow) {
      const skus = generateScaleProductBaseOnBriefType({
        type: briefType,
        SKU,
        collections: validCollections,
        rndSortName: find(users, { name: rndMember })?.shortName,
        selectedClipArts,
        selectedQuotes,
        designs,
        selectedProductBases,
        rndId: find(users, { name: rndMember })?.uid,
        selectedSKUs,
        marketBrief,
        grouppedCliparts,
      });
      setEditSKUs(skus);
      setIsDeletingRow(false);
    }
  }, [isDeletingRow]);

  useEffect(() => {
    if (triggerCreateSKUPayload) {
      const skus = generateScaleProductBaseOnBriefType({
        type: briefType,
        SKU,
        collections: validCollections,
        rndSortName: find(users, { name: rndMember })?.shortName,
        selectedClipArts,
        selectedQuotes,
        designs,
        selectedProductBases,
        rndId: find(users, { name: rndMember })?.uid,
        selectedSKUs,
        marketBrief,
        grouppedCliparts,
      });
      setEditSKUs(skus);
      setIsDeletingRow(false);
    }
  }, [triggerCreateSKUPayload]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data) => {};
  const fetchUsers = async () => {
    let { data } = await rndServices.getUsers({
      limit: -1,
    });
    data = orderBy(data, ["team"], ["asc"]);
    setUsers(data);
    setTeams(uniq(map(data, "team")));
  };

  useEffect(() => {
    const designers = filter(users, { position: "designer", team: workGroup });
    if (!includes(map(designers, "name"), designerMember)) {
      setDesignerMember(null);
    }
  }, [workGroup]);
  const fetchQuotes = async (page) => {
    setLoadingQuotes(true);
    const { data, metadata } = await rndServices.fetchQuotes({
      page,
      limit: 8,
      query: queryQuote,
    });
    setLoadingQuotes(false);
    if (isEmpty(data)) {
      setQuotes([]);
      setQuotePagination({ currentPage: 1, totalPages: 1 });
      return;
    }
    setQuotes(data);
    setQuotePagination(metadata);
  };
  const fetchSKUs = async (page) => {
    setLoadingSKU(true);
    const { data, metadata } = await rndServices.fetchSKUs({
      page,
      limit: 12,
      ...(!isEmpty(querySKU) && { query: querySKU }),
    });
    setLoadingSKU(false);
    if (isEmpty(data)) {
      setFoundSKUs([]);
      setSkuPagination({ currentPage: 1, totalPages: 1 });
      return;
    }
    setFoundSKUs(data);
    setSkuPagination(metadata);
  };
  const fetchProductBases = async (page) => {
    setLoadingProductBase(true);
    if (usingInlineProductBaseData) {
      const productBases =
        layout === LAYOUT_TYPES[0] ? SKU?.sameLayouts : SKU?.diffLayouts;
      let data = productBases;
      if (queryProductBase.keyword) {
        data = productBases?.filter((x) =>
          x.name.toLowerCase().includes(queryProductBase.keyword.toLowerCase())
        );
      }
      const metadata = {
        currentPage: page,
        totalPages: ceil(data.length / 12),
      };
      data = data.slice(
        (page - 1) * 12,
        page * 12 > data.length ? data.length : page * 12
      );
      setProductBases(data);
      setProductBasePagination(metadata);
      setLoadingProductBase(false);
      return;
    }
    const { data, metadata } = await rndServices.fetchProductLines({
      limit: 12,
      page,
      query: queryProductBase,
    });
    if (isEmpty(data)) {
      setLoadingProductBase(false);
      setProductBases([]);
      setProductBasePagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setLoadingProductBase(false);
    setProductBases(data || []);
    setProductBasePagination(metadata);
    return;
  };
  const fetchQuotesFilter = async () => {
    const { data } = await rndServices.fetchQuotesFilter();
    setQuoteFilters(data);
  };
  const fetchFilters = async () => {
    const { data } = await rndServices.fetchFilters();
    setFiltersClipArt(data);
  };
  const fetchCollections = async () => {
    const { data } = await rndServices.getCollections({});
    setCollections(data);
  };
  const fetchAllProducts = async (search) => {
    const data = await rndServices.getAllProducts({
      limit: 20,
      ...(search && { search }),
    });
    setProducts(
      map(data, (x) => ({
        SKU: x.sku,
        image: x.imageSrc,
      }))
    );
  };

  const handleResetState = () => {
    setSearchClipArt("");
    setSelectedClipArts([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
    });
    setProductBasePagination({
      currentPage: 1,
      totalPages: 1,
    });
    const queryKeys = keys(query);
    const transformedQuery = map(queryKeys, (key) => ({
      [key]: [],
    }));
    setQuery(merge({}, ...transformedQuery));
    setSelectedProductLines([]);
    setProductBases([]);
    setValidCollections([]);
    setLayout("");
    setSelectedProductBases([]);
    setQueryProductBase({});
    setMarketBrief({});
    setUsingProductBaseData(false);
    setGrouppedCliparts([]);
    setKeepClipArt(KEEP_CLIPARTS[0]);
  };

  useEffect(() => {
    switch (briefType) {
      case BRIEF_TYPES[0]: {
        // fetchProductBases(productBasePagination.currentPage);
        break;
      }
      case BRIEF_TYPES[1]: {
        setSelectedProductLines([]);
        break;
      }
      case BRIEF_TYPES[3]: {
        setSKU(null);
        // fetchProductBases(productBasePagination.currentPage);
        break;
      }
      default:
        break;
    }
    handleResetState();
  }, [briefType]);
  useEffect(() => {
    fetchCollections();
    fetchAllProducts();
    fetchUsers();
    fetchFilters();
    fetchQuotesFilter();
    fetchDashboardSettings();
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
    const foundRnDMemberTeam = find(users, {
      name: rndMember,
      position: "rnd",
    })?.team;
    const batch = find(users, { name: rndMember, position: "rnd" })?.nextBatch;
    setBatch(batch || "");
    setWorkGroup(foundRnDMemberTeam);
  }, [rndMember]);
  useEffect(() => {
    if (isKeepClipArt === KEEP_CLIPARTS[0] && briefType === BRIEF_TYPES[2]) {
      setSelectedClipArts([]);
    }
  }, [isKeepClipArt]);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedModalPreviewMixMatch,
    { open: openModalPreviewMixMatch, close: closeModalPreviewMixMatch },
  ] = useDisclosure(false);
  const [selectedProductLines, setSelectedProductLines] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);

  const handleSubmitBrief = async () => {
    if (
      !workGroup ||
      !rndMember ||
      !designerMember ||
      !briefType ||
      !briefValue
    ) {
      if (!workGroup) {
        showNotification("Thất bại", "Vui lòng chọn Team", "red");
        return;
      }
      if (!rndMember) {
        showNotification("Thất bại", "Vui lòng chọn RND", "red");
        return;
      }
      if (!designerMember) {
        showNotification("Thất bại", "Vui lòng chọn Designer", "red");
        return;
      }
      if (!briefType) {
        showNotification("Thất bại", "Vui lòng chọn Brief Type", "red");
        return;
      }
      if (!briefValue) {
        showNotification("Thất bại", "Vui lòng chọn Value", "red");
        return;
      }
    }
    if (
      !rndSize &&
      (briefType === BRIEF_TYPES[3] || briefType === BRIEF_TYPES[5])
    ) {
      showNotification("Thất bại", "Vui lòng chọn Size", "red");
      return;
    }
    setCreateBriefLoading(true);
    let generatedSKUs = generateScaleProductBaseOnBriefType({
      type: briefType,
      SKU,
      collections: validCollections,
      rndSortName: find(users, { name: rndMember })?.shortName,
      selectedClipArts,
      selectedQuotes,
      designs,
      selectedProductBases,
      rndId: find(users, { name: rndMember })?.uid,
      selectedSKUs,
      marketBrief,
      grouppedCliparts,
    });
    generatedSKUs = map(generatedSKUs, (x) => {
      if (x.newSku) {
        return {
          ...x,
          SKU: x.newSku,
        };
      }
      return x;
    });
    if (isEmpty(generatedSKUs)) {
      showNotification("Thất bại", "Vui lòng chọn Product Line", "red");
      setCreateBriefLoading(false);
      return;
    }
    let designerTime;
    let epmTime;
    const isOptimized =
      briefType === BRIEF_TYPES[6] ||
      briefType === BRIEF_TYPES[7] ||
      briefType === BRIEF_TYPES[8];

    switch (briefType) {
      case BRIEF_TYPES[0]: {
        if (!layout) {
          break;
        }
        const option =
          layout === LAYOUT_TYPES[0] ? "chung layout" : "khác layout";
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
          option,
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
          option,
        });
        break;
      }
      case BRIEF_TYPES[1]: {
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
        });
        break;
      }
      case BRIEF_TYPES[3]: {
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
          size: CONVERT_STATUS_TO_NUMBER[rndSize],
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
          size: CONVERT_STATUS_TO_NUMBER[rndSize],
        });
        break;
      }
      case BRIEF_TYPES[4]: {
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
        });
        break;
      }
      case BRIEF_TYPES[5]: {
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
          size: CONVERT_STATUS_TO_NUMBER[rndSize],
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
          size: CONVERT_STATUS_TO_NUMBER[rndSize],
        });
        break;
      }
      default: {
        break;
      }
    }
    const data = map(generatedSKUs, (x) => {
      const {
        SKU: sku,
        nextAccumulator,
        skuPrefix,
        note: refDesignMarketNote,
      } = x;
      // get time setting for designer and epm
      if (briefType === BRIEF_TYPES[2]) {
        const quote = x.Quote;
        let option;
        if (quote.length > 20) {
          option = "quote dài";
        } else {
          option = "quote ngắn";
        }
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
          option,
        });
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
          option,
        });
      }
      if (!designerTime) {
        designerTime = find(timeSettings, {
          team: "designer",
          scaleType: briefType,
          option: "common",
        });
      }
      if (!epmTime) {
        epmTime = find(timeSettings, {
          team: "epm",
          scaleType: briefType,
          option: "common",
        });
      }
      return {
        ...(designerTime && {
          designerTimeId: designerTime?.uid,
        }),
        ...(epmTime && {
          epmTimeId: epmTime?.uid,
        }),
        skuRef: SKU?.sku || "",
        linkProductRef: SKU?.productLink || "",
        imageRef: SKU?.image || "",
        sku,
        batch,
        briefType,
        rndTeam: workGroup,
        value: {
          rnd: CONVERT_STATUS_TO_NUMBER[briefValue],
        },
        rndId: find(users, { name: rndMember })?.uid,
        epmId: find(users, { name: epmMember })?.uid,
        designerId: find(users, { name: designerMember })?.uid,
        ...(epmNote ||
        designerNote ||
        mktNote ||
        marketBrief?.note ||
        refDesignMarketNote
          ? {
              note: {
                ...(epmNote && { epm: getEditorStateAsString(epmNote) }),
                ...(designerNote && {
                  designer: getEditorStateAsString(designerNote),
                }),
                ...(mktNote && { mkt: getEditorStateAsString(mktNote) }),
                ...(marketBrief &&
                  marketBrief.note && {
                    mixMatch: getEditorStateAsString(marketBrief?.note),
                  }),
                ...(refDesignMarketNote && {
                  mixMatch: refDesignMarketNote,
                }),
              },
            }
          : {}),
        status: 1,
        ...(briefType === BRIEF_TYPES[0] && {
          productLineId: x?.uid,
        }),
        ...(briefType === BRIEF_TYPES[1] && {
          clipartIds: x?.clipartIds,
          productLineId: x?.productLineId || "",
        }),
        ...(briefType === BRIEF_TYPES[2] && {
          quote: x.uid,
          ...(isKeepClipArt === KEEP_CLIPARTS[1] &&
            !isEmpty(selectedClipArts) && {
              clipartIds: x?.clipartIds,
            }),
          productLineId: SKU?.productLineId || "",
        }),
        designLinkRef: SKU?.designLink || "",
        ...(briefType === BRIEF_TYPES[3] && {
          productLineId: selectedProductBases[0]?.uid,
          imageRef: x.Ref,
          clipartIds: x.clipartIds,
          designLinkRef: x.designLinkRef,
          refDesignMarketNote,
        }),
        nextSkuAccumulator: nextAccumulator,
        ...(skuPrefix && skuPrefix !== "XX" && { skuPrefix }),
        ...(briefType === BRIEF_TYPES[4] && {
          productLineId: selectedProductBases[0]?.uid,
          designLinkRef: x.designLinkRef || SKU?.attribute?.nasShareLink,
          imageRef: x.imageRef,
          skuId: x.uid,
          skuRef: x.skuRef,
          linkProductRef: SKU?.productInfo?.url || "",
        }),
        ...(briefType === BRIEF_TYPES[5] && {
          productLineId: selectedProductBases[0]?.uid,
          clipartIds: x.clipartIds,
          designLinkRef: x.designLinkRef,
          imageRef: x["Ref"],
        }),
      };
    });
    const createBriefResponse = await rndServices.createBriefs({
      payloads: data,
      isOptimized,
    });
    if (createBriefResponse) {
      close();
      window.location.reload();
    }
    setCreateBriefLoading(false);
  };
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    if (topScrollClipArtRef.current) {
      topScrollClipArtRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handlePageQuoteChange = (page) => {
    setQuotePagination((prev) => ({ ...prev, currentPage: page }));
  };
  const handlePageProductBaseChange = (page) => {
    setProductBasePagination((prev) => ({ ...prev, currentPage: page }));
  };
  const handlePageSKUChange = (page) => {
    setSkuPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    fetchClipArts(pagination.currentPage);
  }, [pagination.currentPage, query]);
  useEffect(() => {
    fetchQuotes(quotePagination.currentPage);
  }, [quotePagination.currentPage, queryQuote]);
  useEffect(() => {
    fetchProductBases(productBasePagination.currentPage);
  }, [
    productBasePagination.currentPage,
    queryProductBase,
    layout,
    usingInlineProductBaseData,
  ]);
  useEffect(() => {
    fetchSKUs(skuPagination.currentPage);
  }, [skuPagination.currentPage, querySKU]);

  const handleMergeClipart = () => {
    setGrouppedCliparts([
      ...grouppedCliparts,
      {
        index: Date.now() + Math.floor(Math.random() * 1000),
        cliparts: selectedClipArts,
      },
    ]);
    setSelectedClipArts([]);
  };
  const handleSeparateClipart = () => {
    const cliparts = map(selectedClipArts, (x) => ({
      index: Date.now() + Math.floor(Math.random() * 1000),
      cliparts: [x],
    }));
    setGrouppedCliparts([...grouppedCliparts, ...cliparts]);
    setSelectedClipArts([]);
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          className={styles.row}
          style={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            padding: "12px",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              verticalAlign: "center",
              fontWeight: "bold",
              fontSize: "28px",
            }}
          >
            RnD - Brief Design
          </Text>
        </div>
        <div className={styles.row}>
          <div
            className={styles.col}
            style={{
              flex: "0 0 100%",
            }}
          >
            <RndInfo
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
              fetchAllProducts={fetchAllProducts}
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
        </div>
        {briefType === BRIEF_TYPES[0] && (
          <div className={styles.row}>
            <ProductBase
              productLines={productBases}
              setProductLines={setProductBases}
              selectedProductLines={selectedProductBases}
              setSelectedProductLines={setSelectedProductBases}
              pagination={productBasePagination}
              handlePageChange={handlePageProductBaseChange}
              setQueryProductLines={setQueryProductBase}
              fetchProductLinesLoading={loadingProductBase}
              handleSyncProductBases={handleSyncProductBases}
              loaderIcon={loaderIcon}
              title={"3. Product cần Scale"}
              collections={collections}
              layout={layout}
              setLayout={setLayout}
              validCollections={validCollections}
              setValidCollections={setValidCollections}
              briefType={briefType}
              SKU={SKU}
              fetchProductBases={fetchProductBases}
              setUsingProductBaseData={setUsingProductBaseData}
              setProductBasePagination={setProductBasePagination}
            />
          </div>
        )}
        {(briefType === BRIEF_TYPES[1] || briefType === BRIEF_TYPES[2]) && (
          <div className={styles.row} ref={topScrollClipArtRef}>
            <Card
              className={cn(styles.card, styles.clipArtCard)}
              title={
                briefType === BRIEF_TYPES[1]
                  ? "3. Clipart cần Scale"
                  : "3. Giữ / Đổi Clipart"
              }
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
                  {!isEmpty(selectedClipArts) &&
                    briefType === BRIEF_TYPES[1] && (
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
                  {!isEmpty(selectedClipArts) &&
                    briefType === BRIEF_TYPES[1] && (
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
                    {!isEmpty(grouppedCliparts) &&
                      briefType === BRIEF_TYPES[1] && (
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
                        loaderIcon ? (
                          <Loader white={true} />
                        ) : (
                          <IconRotateClockwise />
                        )
                      }
                    >
                      Sync Clipart
                    </Button>
                  </Flex>
                </div>
              }
            >
              <div>
                {briefType === BRIEF_TYPES[2] && (
                  <Dropdown
                    className={styles.dropdown}
                    classDropdownHead={styles.dropdownHead}
                    value={isKeepClipArt}
                    setValue={setKeepClipArt}
                    options={KEEP_CLIPARTS}
                    classOutSideClick={styles.keepClipArtLayout}
                  />
                )}
              </div>
              {(isKeepClipArt === KEEP_CLIPARTS[1] ||
                briefType === BRIEF_TYPES[1]) && (
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
                              includes(
                                map(selectedClipArts, "name"),
                                clipArt.name
                              )
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
                </>
              )}
            </Card>
          </div>
        )}
        {briefType === BRIEF_TYPES[2] && (
          <div className={styles.row}>
            <Card
              className={cn(styles.card, styles.clipArtCard)}
              title="4. Chọn Quote"
              classTitle="title-green"
              classCardHead={styles.classCardHead}
              classSpanTitle={styles.classScaleSpanTitle}
              head={
                <Group>
                  <Button
                    onClick={handleSyncQuotes}
                    leftSection={
                      loaderIcon ? (
                        <Loader white={true} />
                      ) : (
                        <IconRotateClockwise />
                      )
                    }
                  >
                    Sync Quotes
                  </Button>
                  <Button
                    leftSection={<IconPlus />}
                    onClick={openModalCreateQuote}
                  >
                    Create Quote
                  </Button>
                </Group>
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
                  <Select
                    placeholder="Name ..."
                    size="sm"
                    data={quoteFilters?.names || []}
                    styles={{
                      input: {
                        width: "300px",
                      },
                    }}
                    value={queryQuote?.name}
                    onChange={(value) =>
                      setQueryQuote({
                        ...queryQuote,
                        name: value,
                      })
                    }
                    clearable
                    onClear={() => {
                      setQueryQuote({
                        ...queryQuote,
                        name: "",
                      });
                    }}
                  />
                  <MantineTextInput
                    placeholder="Keyword ..."
                    size="sm"
                    leftSection={
                      <span
                        onClick={() => {
                          setQueryQuote({
                            keyword: searchKeywordQuote,
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
                    value={searchKeywordQuote}
                    onChange={(e) => setSearchKeywordQuote(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setQueryQuote({
                          keyword: searchKeywordQuote,
                        });
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      setQueryQuote({
                        name: null,
                        keyword: null,
                      });
                    }}
                  >
                    <IconFilterOff />
                  </Button>
                </Flex>
              </div>
              <ScrollArea
                h={500}
                scrollbars="y"
                scrollbarSize={4}
                scrollHideDelay={1000}
              >
                <LoadingOverlay
                  visible={loadingQuotes}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />
                <Grid
                  style={{
                    marginTop: "10px",
                  }}
                  columns={12}
                >
                  {map(quotes, (quote, index) => (
                    <Grid.Col
                      span={{ sm: 5, md: 4, lg: 3 }}
                      key={index}
                      style={{
                        position: "relative",
                      }}
                      onClick={() => {
                        if (includes(map(selectedQuotes, "uid"), quote.uid)) {
                          setSelectedQuotes(
                            selectedQuotes.filter((x) => x.uid !== quote.uid)
                          );
                        } else {
                          setSelectedQuotes((selectedQuotes) => [
                            ...selectedQuotes,
                            quote,
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
                          <div
                            style={{
                              cursor: "pointer",
                              width: "100%",
                              height: "200px",
                              padding: "10px",
                            }}
                          >
                            {quote.quote}
                          </div>
                        </MantineCard.Section>
                      </MantineCard>
                      {includes(map(selectedQuotes, "uid"), quote.uid) && (
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
                total={quotePagination.totalPages}
                page={quotePagination.currentPage}
                onChange={handlePageQuoteChange}
                color="pink"
                size="md"
                style={{ marginTop: "20px", marginLeft: "auto" }}
              />
            </Card>
          </div>
        )}
        {briefType === BRIEF_TYPES[3] && (
          <>
            <div className={styles.row}>
              <ProductBase
                productLines={productBases}
                selectedProductLines={selectedProductBases}
                setSelectedProductLines={setSelectedProductBases}
                pagination={productBasePagination}
                handlePageChange={handlePageProductBaseChange}
                setQueryProductLines={setQueryProductBase}
                fetchProductLinesLoading={loadingProductBase}
                handleSyncProductBases={handleSyncProductBases}
                loaderIcon={loaderIcon}
                briefType={briefType}
              />
            </div>
            <div className={styles.row}>
              <RefDesign
                designs={designs}
                setDesigns={setDesigns}
                clipArts={clipArts}
                fetchClipArts={fetchClipArts}
                pagination={pagination}
                searchClipArt={searchClipArt}
                setSearchClipArt={setSearchClipArt}
                filtersClipArt={filtersClipArt}
                query={query}
                selectedClipArts={selectedClipArts}
                setSelectedClipArts={setSelectedClipArts}
                handlePageChange={handlePageChange}
                briefType={briefType}
                BRIEF_TYPES={BRIEF_TYPES}
                fetchClipArtsLoading={fetchClipArtsLoading}
                setQuery={setQuery}
                rndSize={rndSize}
                setRndSize={setRndSize}
              />
            </div>
          </>
        )}
        {briefType === BRIEF_TYPES[4] && (
          <>
            <div className={styles.row}>
              <ProductBase
                productLines={productBases}
                selectedProductLines={selectedProductBases}
                setSelectedProductLines={setSelectedProductBases}
                pagination={productBasePagination}
                handlePageChange={handlePageProductBaseChange}
                setQueryProductLines={setQueryProductBase}
                fetchProductLinesLoading={loadingProductBase}
                handleSyncProductBases={handleSyncProductBases}
                loaderIcon={loaderIcon}
                briefType={briefType}
              />
            </div>
            <div className={styles.row}>
              <SKUComponent
                foundSKUs={foundSKUs}
                selectedSKUs={selectedSKUs}
                setSelectedSKUs={setSelectedSKUs}
                pagination={skuPagination}
                setPagination={setSkuPagination}
                handlePageChange={handlePageSKUChange}
                setQuerySKU={setQuerySKU}
                loadingSKU={loadingSKU}
                title={"3. Design cần Scale"}
              />
            </div>
          </>
        )}
        {briefType === BRIEF_TYPES[5] && (
          <>
            <div className={styles.row}>
              <MarketBriefDesign
                marketBrief={marketBrief}
                setMarketBrief={setMarketBrief}
                title={"2. Input Ref"}
                rndSize={rndSize}
                setRndSize={setRndSize}
              />
            </div>
            <div className={styles.row}>
              <Card
                className={styles.card}
                classCardHead={styles.classCardHead}
                classSpanTitle={styles.classScaleSpanTitle}
                title="3. Clipart cần Scale"
                classTitle={cn("title-green", styles.title)}
                head={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "20px",
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
                    </Flex>
                  </div>
                }
              >
                <Clipart
                  clipArts={clipArts}
                  fetchClipArts={fetchClipArts}
                  pagination={pagination}
                  searchClipArt={searchClipArt}
                  setSearchClipArt={setSearchClipArt}
                  filtersClipArt={filtersClipArt}
                  query={query}
                  selectedClipArts={selectedClipArts}
                  setSelectedClipArts={setSelectedClipArts}
                  handlePageChange={handlePageChange}
                  briefType={briefType}
                  BRIEF_TYPES={BRIEF_TYPES}
                  fetchClipArtsLoading={fetchClipArtsLoading}
                  setQuery={setQuery}
                />
              </Card>
            </div>
            <div className={styles.row}>
              <ProductBase
                productLines={productBases}
                selectedProductLines={selectedProductBases}
                setSelectedProductLines={setSelectedProductBases}
                pagination={productBasePagination}
                handlePageChange={handlePageProductBaseChange}
                setQueryProductLines={setQueryProductBase}
                fetchProductLinesLoading={loadingProductBase}
                handleSyncProductBases={handleSyncProductBases}
                loaderIcon={loaderIcon}
                title={"4. Chọn Product Base"}
              />
            </div>
          </>
        )}
        {(briefType === BRIEF_TYPES[3] || briefType === BRIEF_TYPES[5]) && (
          <div className={styles.row}>
            <Card
              className={cn(styles.cardNote)}
              title={
                briefType === BRIEF_TYPES[3] ? "4. Size Card" : "5. Size Card"
              }
              classTitle="title-green"
              classCardHead={styles.classCardHead}
              classSpanTitle={styles.classScaleSpanTitle}
            >
              <Grid
                style={{
                  marginTop: "10px",
                }}
              >
                <Grid.Col span={6}>
                  <Dropdown
                    className={styles.dropdown}
                    classDropdownHead={styles.dropdownHead}
                    value={rndSize}
                    setValue={setRndSize}
                    options={RND_SIZES}
                    classOutSideClick={styles.memberDropdown}
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </div>
        )}
        {briefType !== BRIEF_TYPES[6] &&
          briefType !== BRIEF_TYPES[7] &&
          briefType !== BRIEF_TYPES[8] && (
            <div className={styles.row}>
              <Card
                className={cn(styles.cardNote)}
                title={generateCardTitle(briefType)}
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
                        if (!rndMember) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn RND",
                            "red"
                          );
                          return;
                        }
                        if (
                          !SKU &&
                          briefType !== BRIEF_TYPES[3] &&
                          briefType !== BRIEF_TYPES[4] &&
                          briefType !== BRIEF_TYPES[5]
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn SKU",
                            "red"
                          );
                          return;
                        }
                        if (
                          (briefType === BRIEF_TYPES[1] ||
                            briefType === BRIEF_TYPES[5]) &&
                          isEmpty(grouppedCliparts)
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Clipart. Chọn Clipart & di chuột vào button Group hoặc Separate để biết thêm chi tiết",
                            "red"
                          );
                          myClipartHeaderRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                          return;
                        }
                        if (
                          isEmpty(grouppedCliparts) &&
                          isEmpty(selectedQuotes) &&
                          isEmpty(selectedProductBases) &&
                          isEmpty(designs) &&
                          isEmpty(selectedSKUs)
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Product Line hoặc Clipart hoặc Quote",
                            "red"
                          );
                          return;
                        }
                        if (
                          isKeepClipArt === KEEP_CLIPARTS[1] &&
                          isEmpty(selectedClipArts)
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Clipart",
                            "red"
                          );
                          return;
                        }
                        if (
                          briefType === BRIEF_TYPES[2] &&
                          isEmpty(selectedQuotes)
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Quote",
                            "red"
                          );
                          return;
                        }
                        if (
                          briefType === BRIEF_TYPES[3] &&
                          (isEmpty(selectedProductBases) || isEmpty(designs))
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Product Base hoặc Design",
                            "red"
                          );
                          return;
                        }
                        if (
                          briefType === BRIEF_TYPES[4] &&
                          (isEmpty(selectedSKUs) ||
                            isEmpty(selectedProductBases))
                        ) {
                          showNotification(
                            "Thất bại",
                            "Vui lòng chọn Product Base và Product",
                            "red"
                          );
                          return;
                        }
                        if (briefType !== BRIEF_TYPES[5]) {
                          open();
                        } else {
                          if (isEmpty(marketBrief)) {
                            showNotification(
                              "Thất bại",
                              "Vui lòng nhập thông tin Ref",
                              "red"
                            );
                            return;
                          }
                          if (isEmpty(grouppedCliparts)) {
                            showNotification(
                              "Thất bại",
                              "Vui lòng chọn Clipart",
                              "red"
                            );
                            return;
                          }
                          if (isEmpty(selectedProductBases)) {
                            showNotification(
                              "Thất bại",
                              "Vui lòng chọn Product Line",
                              "red"
                            );
                            return;
                          }
                          openModalPreviewMixMatch();
                        }
                        const skus = generateScaleProductBaseOnBriefType({
                          type: briefType,
                          SKU,
                          collections: validCollections,
                          rndSortName: find(users, { name: rndMember })
                            ?.shortName,
                          selectedClipArts,
                          selectedQuotes,
                          designs,
                          selectedProductBases,
                          rndId: find(users, { name: rndMember })?.uid,
                          selectedSKUs,
                          marketBrief,
                          grouppedCliparts,
                        });
                        setEditSKUs(skus);
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
          )}
        {(briefType === BRIEF_TYPES[6] ||
          briefType === BRIEF_TYPES[7] ||
          briefType === BRIEF_TYPES[8]) && (
          <Optimized
            briefType={briefType}
            generateCardTitle={generateCardTitle}
            designerNote={designerNote}
            setDesignerNote={setDesignerNote}
            epmNote={epmNote}
            setEPMNote={setEPMNote}
            mktNote={mktNote}
            setMKTNote={setMKTNote}
            users={users}
            rndMember={rndMember}
            setEditSKUs={setEditSKUs}
            SKU={SKU}
            generateScaleProductBaseOnBriefType={
              generateScaleProductBaseOnBriefType
            }
            openModal={open}
          />
        )}
      </div>
      {opened &&
        briefType !== BRIEF_TYPES[6] &&
        briefType !== BRIEF_TYPES[7] &&
        briefType !== BRIEF_TYPES[8] && (
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
            styles={{
              title: {
                fontSize: "21px",
                fontWeight: "bold",
                margin: "auto",
              },
              close: {
                margin: "none",
                marginInlineStart: "unset",
              },
            }}
            title="Preview Brief"
          >
            <Grid>
              <Grid.Col span={12}>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#D9F5D6",
                    border: "1px solid #62D256",
                    color: "#000000",
                    borderColor: "#62D256",
                    fontSize: "18px",
                    borderRadius: "12px",
                  }}
                >
                  <Grid>
                    <Grid.Col span={4}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        Batch: <span>&nbsp;{batch}</span>
                      </Text>
                    </Grid.Col>
                    <Grid.Col
                      span={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Badge
                        size="lg"
                        variant="gradient"
                        gradient={{ from: "blue", to: "cyan", deg: 90 }}
                        style={{ margin: "0 5px" }}
                      >
                        {generateTextPreview(briefType, layout)}
                      </Badge>{" "}
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          fontSize: "14px",
                        }}
                      >
                        {workGroup} - {rndMember}
                      </div>
                    </Grid.Col>
                  </Grid>
                </div>
              </Grid.Col>
              <Grid.Col span={4}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                    fontSize: "20px",
                    alignItems: "center",
                  }}
                >
                  {briefType !== BRIEF_TYPES[3] ? "REF" : "PRODUCT LINE"}
                </div>
                <Image
                  radius="md"
                  src={
                    SKU?.image ||
                    selectedProductBases[0]?.imageSrc ||
                    "/images/content/not_found_2.jpg"
                  }
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
                  {SKU?.sku || selectedProductBases[0]?.name}
                </div>
              </Grid.Col>
              <Grid.Col span={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                    fontSize: "20px",
                  }}
                >
                  SCALE
                </div>
                <ScrollArea h={300} scrollbars="y" scrollbarSize={2}>
                  <CustomTable
                    items={map(
                      orderBy(editSKUs, [
                        (item) => !item?.SKU?.startsWith("XX"),
                        "SKU",
                      ]),
                      (x, index) => {
                        return {
                          ...x,
                          No: index + 1,
                        };
                      }
                    )}
                    headers={
                      generateHeaderTable(briefType, isKeepClipArt)?.headers
                    }
                    onRemove={handleRemoveRow}
                    headerRemove={
                      generateHeaderTable(briefType, isKeepClipArt)
                        ?.removeHeader
                    }
                    setEditSKUs={setEditSKUs}
                    editSKUs={editSKUs}
                    productBases={productBases}
                    setProductBases={setProductBases}
                    SKU={SKU}
                    setSKU={setSKU}
                    selectedProductBases={selectedProductBases}
                    setSelectedProductBases={setSelectedProductBases}
                    rndInfo={find(users, { name: rndMember })}
                    setTriggerCreateSKUPayload={setTriggerCreateSKUPayload}
                  />
                </ScrollArea>
              </Grid.Col>
              <Grid.Col
                span={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  className={cn(
                    "button-stroke-blue button-small",
                    styles.createButton
                  )}
                  loading={createBriefLoading}
                  onClick={handleSubmitBrief}
                  style={{
                    width: "100px",
                    borderRadius: "20px",
                    borderWidth: "2px",
                    backgroundColor: "#3FA433",
                    color: "#ffffff",
                  }}
                >
                  <span>Tạo Brief</span>
                </Button>
              </Grid.Col>
            </Grid>
          </Modal>
        )}
      {opened &&
        (briefType === BRIEF_TYPES[6] ||
          briefType === BRIEF_TYPES[7] ||
          briefType === BRIEF_TYPES[8]) && (
          <ModalPreviewOptimized
            opened={opened}
            close={close}
            batch={batch}
            workGroup={workGroup}
            rndMember={rndMember}
            briefType={briefType}
            handleSubmitBrief={handleSubmitBrief}
            SKU={SKU}
            generateTextPreview={generateTextPreview}
            layout={layout}
            createBriefLoading={createBriefLoading}
          />
        )}

      {openedModalPreviewMixMatch && (
        <ModalPreviewMixMatch
          opened={openedModalPreviewMixMatch}
          close={closeModalPreviewMixMatch}
          batch={batch}
          workGroup={workGroup}
          rndMember={rndMember}
          setEditSKUs={setEditSKUs}
          editSKUs={editSKUs}
          briefType={briefType}
          users={users}
          selectedClipArts={selectedClipArts}
          selectedProductBases={selectedProductBases}
          generateHeaderTable={generateHeaderTable}
          isKeepClipArt={isKeepClipArt}
          handleSubmitBrief={handleSubmitBrief}
          marketBrief={marketBrief}
          handleRemoveRow={handleRemoveRow}
          grouppedCliparts={grouppedCliparts}
          setProductBases={setProductBases}
          productBases={productBases}
          SKU={SKU}
          setSKU={setSKU}
          setSelectedProductBases={setSelectedProductBases}
          rndInfo={find(users, { name: rndMember })}
          setTriggerCreateSKUPayload={setTriggerCreateSKUPayload}
        />
      )}

      <ModalPreviewGroupClipart
        opened={openedModalPreviewGroupClipart}
        close={closeModalPreviewGroupClipart}
        grouppedCliparts={grouppedCliparts}
        setGrouppedCliparts={setGrouppedCliparts}
      />
      <Modal
        opened={openedModalCreateQuote}
        onClose={closeModalCreateQuote}
        transitionProps={{ transition: "fade", duration: 200 }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="md"
        size="md"
      >
        <CreateNewQuote
          quote={quote}
          setQuote={setQuote}
          quoteFilters={quoteFilters}
          close={closeModalCreateQuote}
          fetchQuotes={fetchQuotes}
          quotePagination={quotePagination}
        />
      </Modal>
    </>
  );
};

export default NewCampaigns;
