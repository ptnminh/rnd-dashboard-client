import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import cn from "classnames";
import Card from "../../components/Card";
import {
  BRIEF_TYPES,
  BRIEF_VALUES,
  DESIGNER_MEMBERS,
  GROUP_WORKS,
  KEEP_CLIPARTS,
  MEMBERS,
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
  Tooltip,
  Select,
} from "@mantine/core";
import { showNotification } from "../../utils/index";

import Dropdown from "../../components/Dropdown";
import CustomTable from "../../components/Table";
import {
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
import { rndServices } from "../../services";
import { CONVERT_STATUS_TO_NUMBER, getEditorStateAsString } from "../../utils";
import {
  IconSearch,
  IconFilterOff,
  IconCheck,
  IconDeselect,
  IconSelector,
  IconRotateClockwise,
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
      return "Clip Art";
    case BRIEF_TYPES[2]:
      return "Niche";
    case BRIEF_TYPES[3]:
      return "New - Phủ Market";
    case BRIEF_TYPES[4]:
      return "Design";
    default:
      return "";
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
      };
    })
  );
};

const generateScaleClipArtTable = ({
  SKU,
  selectedClipArts,
  rndSortName,
  rndId,
}) => {
  const skuAccumulators = SKU?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(
      sortBy(selectedClipArts, (clipArt) => toLower(clipArt.name)),
      (x, index) => {
        const realRnDAccumulator = currentRnDAccumulator + index + 1;
        const name = `${
          SKU?.skuPrefix ? SKU?.skuPrefix : "XX"
        }-${rndSortName}${String(realRnDAccumulator).padStart(4, "0")}`;
        return {
          No: index + 1,
          "Clip Art": x.name,
          Hình: x.imageSrc,
          SKU: name,
          Remove: "x",
          uid: x.uid,
          nextAccumulator: currentRnDAccumulator + selectedClipArts.length,
          skuPrefix: SKU?.skuPrefix,
        };
      }
    )
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
            Hình: selectedClipArts[0].imageSrc,
          }),
          SKU: name,
          Remove: "x",
          uid: x.uid,
          nextAccumulator: currentRnDAccumulator + selectedQuotes.length,
          skuPrefix: SKU?.skuPrefix,
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
        Design: x.imageRef,
        Clipart: x?.clipart?.imageSrc,
        SKU: name,
        Remove: "x",
        clipartId: x?.clipart?.uid,
        designLinkRef: x?.designLinkRef,
        nextAccumulator: currentRnDAccumulator + designs.length,
        skuPrefix: prefix,
      };
    })
  );
};
const generateScaleMixMatch = ({
  selectedProductBases,
  rndSortName,
  rndId,
  marketBrief,
  selectedClipArts,
}) => {
  const prefix = selectedProductBases[0]?.skuPrefix || "XX";
  const skuAccumulators = selectedProductBases[0]?.skuAccumulators || [];
  const currentRnDAccumulator =
    find(skuAccumulators, { rndId: rndId })?.accumulator || 500;
  return compact(
    map(selectedClipArts, (x, index) => {
      const realRnDAccumulator = currentRnDAccumulator + index + 1;
      const name = `${prefix}-${rndSortName}${String(
        realRnDAccumulator
      ).padStart(4, "0")}`;
      return {
        No: index + 1,
        "Product Base": selectedProductBases[0]?.name,
        Hình: marketBrief?.imageRef,
        Clipart: x.imageSrc,
        SKU: name,
        Remove: "x",
        uid: x.uid,
        clipartId: x?.uid,
        designLinkRef: x?.marketBrief?.designLinkRef,
        nextAccumulator: currentRnDAccumulator + selectedClipArts.length,
        skuPrefix: prefix,
      };
    })
  );
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
}) => {
  switch (type) {
    case BRIEF_TYPES[0]:
      return generateScaleProductLinesTable({
        selectedProductLines: selectedProductBases,
        SKU,
        collections,
        rndSortName,
        rndId,
      });
    case BRIEF_TYPES[1]:
      return generateScaleClipArtTable({
        SKU,
        selectedClipArts,
        rndSortName,
        rndId,
      });
    case BRIEF_TYPES[2]:
      return generateScaleQuoteTable({
        selectedQuotes,
        rndSortName,
        SKU,
        selectedClipArts,
        rndId,
      });
    case BRIEF_TYPES[3]:
      return generateScaleNewDesign({
        designs,
        rndSortName,
        selectedProductBases,
        rndId,
      });
    case BRIEF_TYPES[4]:
      return generateScaleDesignTable({
        selectedSKUs,
        rndSortName,
        selectedProductBases,
        rndId,
      });
    case BRIEF_TYPES[5]:
      return generateScaleMixMatch({
        selectedProductBases,
        rndSortName,
        rndId,
        selectedClipArts,
        marketBrief,
      });
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
        headers: ["No", "Clip Art", "Hình", "SKU", "Remove"],
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
        headers: ["No", "Design", "Clipart", "SKU", "Remove"],
        removeHeader: "Design",
      };
    case BRIEF_TYPES[4]:
      return {
        headers: ["No", "Product Base", "Hình", "SKU", "Remove", "uid"],
      };
    case BRIEF_TYPES[5]:
      return {
        headers: [
          "No",
          "Product Base",
          "Ref",
          "Clipart",
          "SKU",
          "Remove",
          "uid",
        ],
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
  const [selectedQuotes, setSelectedQuotes] = useState([]);
  const [briefValue, setBriefValue] = useState(BRIEF_VALUES[0]);
  const [rndMember, setRndMember] = useState(MEMBERS[0]);
  const [epmMember, setEpmMember] = useState(MEMBERS[0]);
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
  const [selectedProductBases, setSelectedProductBases] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [loadingProductBase, setLoadingProductBase] = useState(false);
  const [loadingSKU, setLoadingSKU] = useState(false);
  const [queryQuote, setQueryQuote] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [foundSKUs, setFoundSKUs] = useState([]);
  const [isKeepClipArt, setKeepClipArt] = useState(KEEP_CLIPARTS[0]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [loaderIcon, setLoaderIcon] = useState(false);
  const handleSearchSKU = async () => {
    if (isEmpty(search)) {
      showNotification("Thất bại", "Vui lòng nhập SKU", "red");
      return;
    }
    setSelectedCollection([]);
    setSelectedProductLines([]);
    setLoadingSearchSKU(true);
    setLoadingProductLines(true);
    // await delayTime(2000);
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
        setSelectedClipArts(filter(selectedClipArts, (x) => x.name !== name));
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
        setSelectedClipArts(filter(selectedClipArts, (x) => x.uid !== name));
        break;
      default:
        break;
    }
  };

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
    const designers = filter(data, { role: "designer" });
    const rnds = filter(data, { role: "rnd" });
    const epms = filter(data, { role: "epm" });
    const teams = compact(uniq(map(data, "team")));
    const team = teams[0];
    setWorkGroup(team);
    setRndMember(map(filter(rnds, { team }), "name")[0]);
    setDesignerMember(map(designers, "name")[0]);
    setEpmMember(map(epms, "name")[0]);
    setUsers(data);
    setTeams(uniq(map(data, "team")));
  };
  useEffect(() => {
    const rnds = filter(users, { role: "rnd", team: workGroup });
    const designers = !isEmpty(
      filter(users, { role: "designer", team: workGroup })
    )
      ? filter(users, { role: "designer", team: workGroup })
      : filter(users, { role: "designer" });
    setRndMember(map(rnds, "name")[0]);
    setDesignerMember(map(designers, "name")[0]);
    // const epms = filter(users, { role: "epm", team: workGroup });
    // setEpmMember(map(epms, "name")[0]);
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

  const prepareSubmitData = () => {
    const rnd = find(users, { name: rndMember });
    const data = generateScaleProductBaseOnBriefType({
      type: briefType,
      SKU,
      collections: validCollections,
      rndSortName: rnd?.shortName,
      selectedClipArts,
      selectedQuotes,
      selectedProductBases,
      designs,
      rndId: rnd?.uid,
      selectedSKUs,
      marketBrief,
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
      const { SKU: sku, nextAccumulator, skuPrefix } = x;
      return {
        skuRef: SKU?.sku || "",
        linkProductRef: SKU?.productLink || "",
        imageRef: SKU?.image || "",
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
          productLine: x?.uid,
        }),
        ...(briefType === BRIEF_TYPES[1] && {
          clipart: find(clipArts, { uid: x.uid })?.uid,
        }),
        ...(briefType === BRIEF_TYPES[2] && {
          quote: x.uid,
          ...(isKeepClipArt === KEEP_CLIPARTS[1] &&
            !isEmpty(selectedClipArts) && {
              clipart: selectedClipArts[0]?.uid,
            }),
        }),
        designLinkRef: SKU?.designLink || "",
        ...(briefType === BRIEF_TYPES[3] && {
          productLine: selectedProductBases[0]?.uid,
          imageRef: x.Design,
          clipart: x.clipartId || "",
          designLinkRef: x.designLinkRef,
        }),
        nextSkuAccumulator: nextAccumulator,
        ...(skuPrefix && skuPrefix !== "XX" && { skuPrefix }),
        ...(briefType === BRIEF_TYPES[4] && {
          productLine: selectedProductBases[0]?.uid,
          designLinkRef: x.designLinkRef,
          imageRef: x.imageRef,
          skuId: x.uid,
          skuRef: x.skuRef,
        }),
      };
    });
    const createBriefResponse = await rndServices.createBriefs({
      payloads: data,
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
  }, [productBasePagination.currentPage, queryProductBase]);
  useEffect(() => {
    fetchSKUs(skuPagination.currentPage);
  }, [skuPagination.currentPage, querySKU]);
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
                  }}
                >
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
                  <Flex>
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
                            if (briefType === BRIEF_TYPES[1]) {
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
                            } else if (briefType === BRIEF_TYPES[2]) {
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
              />
            </div>
            <div className={styles.row}>
              <Card
                className={styles.card}
                classCardHead={styles.classCardHead}
                classSpanTitle={styles.classScaleSpanTitle}
                title="3. Clipart cần Scale"
                classTitle={cn("title-green", styles.title)}
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
        <div className={styles.row}>
          <Card
            className={cn(styles.cardNote)}
            title={briefType !== BRIEF_TYPES[2] ? "4. Note" : "5. Note"}
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
                    if (
                      !SKU &&
                      briefType !== BRIEF_TYPES[3] &&
                      briefType !== BRIEF_TYPES[4] &&
                      briefType !== BRIEF_TYPES[5]
                    ) {
                      showNotification("Thất bại", "Vui lòng chọn SKU", "red");
                      return;
                    }
                    if (
                      isEmpty(selectedClipArts) &&
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
                      (isEmpty(selectedSKUs) || isEmpty(selectedProductBases))
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
                      if (
                        isEmpty(marketBrief) &&
                        isEmpty(selectedClipArts) &&
                        isEmpty(selectedProductBases)
                      ) {
                        showNotification(
                          "Thất bại",
                          "Vui lòng nhập thông tin Ref",
                          "red"
                        );
                        return;
                      }
                      openModalPreviewMixMatch();
                    }
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
              {SKU?.sku && (
                <>
                  từ{" "}
                  <Badge size="md" color="pink" style={{ marginLeft: "5px" }}>
                    {SKU?.sku}
                  </Badge>{" "}
                </>
              )}
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
              {briefType !== BRIEF_TYPES[3] ? "Ref" : "Product Line"}
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
                fontSize: "18px",
              }}
            >
              Scale
            </div>
            <ScrollArea h={300} scrollbars="y" scrollbarSize={2}>
              <CustomTable
                items={generateScaleProductBaseOnBriefType({
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
                })}
                headers={generateHeaderTable(briefType, isKeepClipArt)?.headers}
                onRemove={handleRemoveRow}
                headerRemove={
                  generateHeaderTable(briefType, isKeepClipArt)?.removeHeader
                }
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
      <ModalPreviewMixMatch
        opened={openedModalPreviewMixMatch}
        close={closeModalPreviewMixMatch}
        batch={batch}
        workGroup={workGroup}
        rndMember={rndMember}
        generateScaleProductBaseOnBriefType={
          generateScaleProductBaseOnBriefType
        }
        briefType={briefType}
        users={users}
        selectedClipArts={selectedClipArts}
        selectedProductBases={selectedProductBases}
        generateHeaderTable={generateHeaderTable}
        isKeepClipArt={isKeepClipArt}
        handleSubmitBrief={handleSubmitBrief}
        marketBrief={marketBrief}
      />
    </>
  );
};

export default NewCampaigns;
