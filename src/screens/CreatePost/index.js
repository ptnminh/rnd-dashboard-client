import {
  Affix,
  Button,
  Checkbox,
  Flex,
  Group,
  Pagination,
  Progress,
  rem,
  Select,
  Tabs,
  TextInput,
  Transition,
} from "@mantine/core";
import Card from "../../components/Card";
import PostCamp from "../../components/Post";
import { IconFilterOff, IconSearch, IconArrowUp } from "@tabler/icons-react";
import styles from "./CreatePost.module.sass";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { CONVERT_STATUS_TO_NUMBER } from "../../utils";
import {
  compact,
  filter,
  find,
  flatMap,
  includes,
  isEmpty,
  map,
  values,
} from "lodash";
import { captionServices, postService, rndServices } from "../../services";
import { useWindowScroll } from "@mantine/hooks";
import { showNotification } from "../../utils/index";
import { BRIEF_SORTINGS, CONVERT_BRIEF_SORTINGS } from "../../constant/briefs";
import { CTA_STATUS } from "../../constant";

const CreatePost = ({
  brief,
  closeModalCreatePostFromBrief,
  setTriggerFetchBrief,
}) => {
  const [query, setQuery] = useState({
    status: [3],
    postStatus: ["unfulfilled", "partial"],
    view: "epm",
  });
  const hasSetChoosePosts = useRef(false);
  const [batch, setBatch] = useState("");
  const [activeTab, setActiveTab] = useState("readyPost");
  const [searchSKU, setSearchSKU] = useState("");
  const [filterCta, setFilterCta] = useState(CTA_STATUS.ASSIGNED);
  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);
  const [sortingBrief, setSortingBrief] = useState({});
  const [briefs, setBriefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [scroll, scrollTo] = useWindowScroll();
  const [fanpages, setFanpages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [allProductBases, setAllProductBases] = useState([]);
  const [queryCaption, setQueryCaption] = useState({});
  const [captionsPagination, setCaptionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [choosePosts, setChoosePosts] = useState([]);
  const [selectedFanpage, setSelectedFanpage] = useState(null);
  const [postErrors, setPostErrors] = useState([]);
  const [postPayloads, setPostPayloads] = useState([]);
  const [briefPagination, setBriefPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [progressValue, setProgressValue] = useState(50);

  const handleChangePage = (page) => {
    setBriefPagination({ ...briefPagination, currentPage: page });
  };
  const fetchUsers = async () => {
    const { data } = await rndServices.getUsers({
      limit: -1,
    });
    setUsers(data);
  };
  const fetchBriefs = async (page) => {
    setLoadingFetchBrief(true);
    setProgressValue(0); // Start at 0%

    // Simulate a short delay to show progress
    setTimeout(() => setProgressValue(50), 100); // Set to 50% after request is sent
    const response = await rndServices.fetchBriefs({
      page,
      limit: 10,
      sorted: sortingBrief,
      ...query,
    });
    let { data, metadata } = response;

    // if brief props has value
    if (brief) {
      data = [brief];
      metadata = {
        currentPage: 1,
        totalPages: 1,
      };
    }

    if (data) {
      setBriefs(
        map(
          filter(data, (x) => {
            const ads = x?.designInfo?.adsLinks;
            let filteredAds = ads;
            if (filterCta !== null && activeTab === "createdPost") {
              if (filterCta === CTA_STATUS.ASSIGNED) {
                filteredAds = filter(filteredAds, (ad) => ad.addCta);
              } else {
                filteredAds = filter(filteredAds, (ad) => !ad.addCta);
              }
              return isEmpty(filteredAds) ? false : true;
            }
            return isEmpty(x.designInfo?.adsLinks) ? false : true;
          }),
          (x) => ({
            ...x,
            ads: x.designInfo?.adsLinks,
          })
        )
      );
      const ads = flatMap(
        compact(
          map(data, (x) => {
            const { designInfo } = x;
            const ads = designInfo?.adsLinks;

            if (isEmpty(ads)) {
              return null;
            }
            let filteredAds = filter(ads, (ad) => {
              if (activeTab === "createdPost") {
                return ad.postId;
              } else {
                return !ad.postId;
              }
            });
            if (filterCta !== null && activeTab === "createdPost") {
              if (filterCta === CTA_STATUS.ASSIGNED) {
                filteredAds = filter(filteredAds, (ad) => ad.addCta);
              } else {
                filteredAds = filter(filteredAds, (ad) => !ad.addCta);
              }
            }
            return map(filteredAds, (ad, index) => ({
              uid: ad.uid,
              ctaLink: `https://pawfecthouse.com/${x.sku}`,
              ...(selectedFanpage && {
                pageId: selectedFanpage.uid,
              }),
              name:
                ad?.postName ||
                `${x.sku} - ${x.batch} - ${
                  ad.type === "image" || !ad.type ? "Image" : "Video"
                }${index + 1}`,
              image: ad.value,
              briefId: x.uid,
              sku: x.sku,
              postId: ad.postId,
              caption: ad.caption,
              addCta: ad.addCta,
            }));
          })
        )
      );
      setPostPayloads(ads);
      setBriefPagination(metadata);
    } else {
      setBriefs([]);
      setBriefPagination({ currentPage: 1, totalPages: 1 });
    }
    setLoadingFetchBrief(false);
    setProgressValue(100); // Set to 100% when request completes
  };
  const fetchFanpages = async () => {
    const { data } = await postService.fetchFanpages({
      limit: -1,
    });
    setFanpages(data);
  };
  const fetchAllProductBases = async () => {
    const { data } = await rndServices.fetchProductLines({
      limit: -1,
      fields: "uid,name",
    });
    setAllProductBases(data || []);
  };
  useEffect(() => {
    fetchBriefs(briefPagination.currentPage);
  }, [query, sortingBrief, briefPagination.currentPage, filterCta]);
  useEffect(() => {
    fetchUsers();
    fetchFanpages();
    fetchAllProductBases();
  }, []);
  const handleCreatePost = async () => {
    setLoadingCreatePost(true);
    const selectedPosts = filter(postPayloads, (x) =>
      includes(choosePosts, x.uid)
    );
    let messageError = "";
    const transformedPayloads = filter(
      map(selectedPosts, (x) => ({
        pageId: x.pageId,
        sku: x.sku,
        adsUrl: x.image,
        adsId: x.uid,
        caption: x.caption,
        name: x.name,
        briefId: x.briefId,
      })),
      (x) => {
        if (!x.pageId) {
          messageError = `Vui lòng chọn Fanpage cho post ${x.name}`;
          return false;
        }
        if (!x.caption) {
          messageError = `Vui lòng chọn Caption cho post ${x.name}`;
          return false;
        }
        return true;
      }
    );
    // check valid data
    if (isEmpty(transformedPayloads) || messageError) {
      showNotification("Thất bại", messageError || "Vui lòng chọn Post", "red");
      setLoadingCreatePost(false);
      return;
    }
    const createPostResponse = await postService.createPost(
      transformedPayloads
    );
    if (createPostResponse?.success === false) {
      showNotification(
        "Thất bại",
        createPostResponse?.message || "Tạo post thất bại",
        "red"
      );
      const errors = createPostResponse?.errorList || [];
      setPostErrors(errors);
    } else {
      showNotification("Thành công", "Tạo post thành công", "green");
      setChoosePosts([]);
      setSelectedFanpage(null);
      setPostErrors([]);
      await fetchBriefs(briefPagination.currentPage);
      if (brief) {
        setTriggerFetchBrief(true);
        closeModalCreatePostFromBrief();
      }
    }
    setLoadingCreatePost(false);
  };

  const fetchCaptions = async (page) => {
    const { data, metadata } = await captionServices.fetchCaptions({
      limit: 3,
      page,
      query: queryCaption,
    });
    if (isEmpty(data)) {
      setCaptions([]);
      setCaptionsPagination({
        currentPage: 1,
        totalPages: 1,
      });
      return;
    }
    setCaptions(
      map(data, (x) => ({
        ...x,
        checked: false,
      })) || []
    );
    setCaptionsPagination(metadata);
    return;
  };

  useEffect(() => {
    fetchCaptions(captionsPagination.currentPage);
  }, [captionsPagination.currentPage, queryCaption]);

  const handlePageChangeCaption = (page) => {
    setCaptionsPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    const resetQuery = {
      date: null,
      batch: "",
      sku: "",
      briefType: null,
      size: null,
      rndTeam: null,
      rnd: null,
      designer: null,
      status: [3],
      sizeValue: null,
      rndName: null,
      designerName: null,
      statusValue: null,
      dateValue: null,
    };
    if (activeTab === "createdPost") {
      setQuery({
        ...resetQuery,
        postStatus: ["fulfilled", "partial"],
      });
      setFilterCta(CTA_STATUS.ASSIGNED);
    } else {
      setQuery({
        ...resetQuery,
        postStatus: ["unfulfilled", "partial"],
      });
    }
    setBriefPagination({
      currentPage: 1,
      totalPages: 1,
    });
    setSortingBrief({});
  }, [activeTab]);
  useEffect(() => {
    if (
      !hasSetChoosePosts.current &&
      !isEmpty(postPayloads) &&
      activeTab === "readyPost"
    ) {
      setChoosePosts(
        map(
          filter(postPayloads, (x) => !x.postId),
          "uid"
        )
      );
      hasSetChoosePosts.current = true;
    }
  }, [postPayloads, activeTab]);
  return (
    <>
      {progressValue < 100 && (
        <Progress
          value={progressValue}
          size="sm"
          transitionDuration={200}
          striped
          animated
        />
      )}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="readyPost">Ready Post</Tabs.Tab>
          {isEmpty(brief) && (
            <Tabs.Tab value="createdPost">Created Post</Tabs.Tab>
          )}
        </Tabs.List>
        <Tabs.Panel value="readyPost">
          <Card
            className={cn(styles.card, styles.clipArtCard)}
            title="Tạo Post"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            {isEmpty(brief) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 5px",
                  gap: "10px",
                  flexWrap: "wrap-reverse",
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      size="lg"
                      checked={
                        choosePosts.length === postPayloads.length &&
                        !isEmpty(postPayloads)
                      }
                      onChange={() => {
                        if (!isEmpty(filter(postPayloads, (x) => !x.postId))) {
                          if (choosePosts.length === postPayloads.length) {
                            setChoosePosts([]);
                          } else {
                            setChoosePosts(map(postPayloads, "uid"));
                          }
                        }
                      }}
                    />
                  </div>

                  <TextInput
                    placeholder="Batch"
                    size="sm"
                    width="100px"
                    leftSection={
                      <span
                        onClick={() => {
                          setQuery({ ...query, batch });
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
                        width: "100px",
                      },
                    }}
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setQuery({ ...query, batch });
                      }
                    }}
                  />
                  <TextInput
                    placeholder="SKU"
                    size="sm"
                    width="100px"
                    leftSection={
                      <span
                        onClick={() => {
                          setQuery({ ...query, sku: searchSKU });
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
                        width: "100px",
                      },
                    }}
                    value={searchSKU}
                    onChange={(e) => setSearchSKU(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setQuery({ ...query, sku: searchSKU });
                      }
                    }}
                  />
                  <Select
                    placeholder="Value"
                    data={["Small", "Medium", "Big", "Super Big"]}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={query?.valueName}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        value: CONVERT_STATUS_TO_NUMBER[value],
                        valueName: value,
                      })
                    }
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        value: null,
                        valueName: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="Team"
                    data={["BD1", "BD2", "BD3", "POD-Biz"]}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={query?.rndTeam}
                    onChange={(value) => setQuery({ ...query, rndTeam: value })}
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        rndTeam: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="RND"
                    data={map(filter(users, { role: "rnd" }), "name") || []}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={query?.rndName}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        rndName: find(users, { name: value })?.name,
                        rnd: find(users, { name: value })?.uid,
                      })
                    }
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        rndName: null,
                        rnd: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="Fanpages"
                    data={map(fanpages, "name") || []}
                    styles={{
                      input: {
                        width: "150px",
                      },
                    }}
                    value={selectedFanpage?.name || null}
                    onChange={(value) => {
                      setSelectedFanpage(find(fanpages, { name: value }));
                    }}
                    clearable
                    onClear={() => {
                      setSelectedFanpage(null);
                    }}
                  />
                  <Select
                    placeholder="Sorting"
                    data={BRIEF_SORTINGS}
                    styles={{
                      input: {
                        width: "150px",
                      },
                    }}
                    value={
                      !isEmpty(sortingBrief?.value)
                        ? CONVERT_BRIEF_SORTINGS[sortingBrief?.value]
                        : null
                    }
                    onChange={(value) => {
                      if (value) {
                        setSortingBrief({
                          ...sortingBrief,
                          value: value === BRIEF_SORTINGS[0] ? "asc" : "desc",
                        });
                      }
                    }}
                    clearable
                    onClear={() => {
                      setSortingBrief({});
                    }}
                  />

                  <Button
                    onClick={() => {
                      setSortingBrief({});
                      setSelectedFanpage(null);
                      setQuery({
                        date: null,
                        batch: "",
                        sku: "",
                        view: "epm",
                        briefType: null,
                        size: null,
                        rndTeam: null,
                        rnd: null,
                        designer: null,
                        status: [3],
                        valueName: null,
                        value: null,
                        rndName: null,
                        designerName: null,
                        statusValue: null,
                        dateValue: null,
                        postStatus:
                          activeTab === "createdPost"
                            ? ["fulfilled", "partial"]
                            : ["unfulfilled", "partial"],
                      });
                      setBatch("");
                      setSearchSKU("");
                    }}
                  >
                    <IconFilterOff />
                  </Button>
                </Flex>
              </div>
            )}
            <Flex gap={30} direction="column">
              {map(briefs, (brief) => (
                <PostCamp
                  {...brief}
                  postPayloads={postPayloads}
                  setPostPayloads={setPostPayloads}
                  selectedFanpage={selectedFanpage}
                  fanpages={fanpages}
                  choosePosts={choosePosts}
                  setChoosePosts={setChoosePosts}
                  captions={captions}
                  setQueryCaption={setQueryCaption}
                  handlePageChangeCaption={handlePageChangeCaption}
                  captionsPagination={captionsPagination}
                  allProductBases={allProductBases}
                  postErrors={postErrors}
                />
              ))}
            </Flex>
          </Card>
          <Group
            justify={isEmpty(brief) ? "space-between" : "flex-end"}
            style={{
              marginRight: "20px",
            }}
          >
            {isEmpty(brief) && (
              <Pagination
                total={briefPagination.totalPages}
                page={briefPagination.currentPage}
                onChange={handleChangePage}
                color="pink"
                size="md"
                style={{ marginTop: "20px", marginRight: "auto" }}
              />
            )}
            <Button
              color="green"
              onClick={handleCreatePost}
              loading={loadingCreatePost}
            >
              Create Post
            </Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="createdPost">
          <Card
            className={cn(styles.card, styles.clipArtCard)}
            title="Post đã tạo"
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            {isEmpty(brief) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 5px",
                  gap: "10px",
                  flexWrap: "wrap-reverse",
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
                  <TextInput
                    placeholder="Batch"
                    size="sm"
                    width="100px"
                    leftSection={
                      <span
                        onClick={() => {
                          setQuery({ ...query, batch });
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
                        width: "100px",
                      },
                    }}
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setQuery({ ...query, batch });
                      }
                    }}
                  />
                  <TextInput
                    placeholder="SKU"
                    size="sm"
                    width="100px"
                    leftSection={
                      <span
                        onClick={() => {
                          setQuery({ ...query, sku: searchSKU });
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
                        width: "100px",
                      },
                    }}
                    value={searchSKU}
                    onChange={(e) => setSearchSKU(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setQuery({ ...query, sku: searchSKU });
                      }
                    }}
                  />
                  <Select
                    placeholder="Value"
                    data={["Small", "Medium", "Big", "Super Big"]}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={query?.valueName}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        value: CONVERT_STATUS_TO_NUMBER[value],
                        valueName: value,
                      })
                    }
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        value: null,
                        valueName: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="Team"
                    data={["BD1", "BD2", "BD3", "POD-Biz"]}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={query?.rndTeam}
                    onChange={(value) => setQuery({ ...query, rndTeam: value })}
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        rndTeam: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="RND"
                    data={map(filter(users, { role: "rnd" }), "name") || []}
                    styles={{
                      input: {
                        width: "150px",
                      },
                    }}
                    value={query?.rndName}
                    onChange={(value) =>
                      setQuery({
                        ...query,
                        rndName: find(users, { name: value })?.name,
                        rnd: find(users, { name: value })?.uid,
                      })
                    }
                    clearable
                    onClear={() => {
                      setQuery({
                        ...query,
                        rndName: null,
                        rnd: null,
                      });
                    }}
                  />
                  <Select
                    placeholder="CTA"
                    data={values(CTA_STATUS)}
                    styles={{
                      input: {
                        width: "100px",
                      },
                    }}
                    value={filterCta}
                    onChange={(value) => setFilterCta(value)}
                    clearable
                    onClear={() => {
                      setFilterCta(null);
                    }}
                  />
                  <Select
                    placeholder="Sorting"
                    data={BRIEF_SORTINGS}
                    styles={{
                      input: {
                        width: "150px",
                      },
                    }}
                    value={
                      !isEmpty(sortingBrief?.value)
                        ? CONVERT_BRIEF_SORTINGS[sortingBrief?.value]
                        : null
                    }
                    onChange={(value) => {
                      setSortingBrief({
                        ...sortingBrief,
                        value: value === BRIEF_SORTINGS[0] ? "asc" : "desc",
                      });
                    }}
                    clearable
                    onClear={() => {
                      setSortingBrief({});
                    }}
                  />

                  <Button
                    onClick={() => {
                      setSelectedFanpage(null);
                      setQuery({
                        date: null,
                        batch: "",
                        sku: "",
                        view: "epm",
                        briefType: null,
                        valueName: null,
                        value: null,
                        rndTeam: null,
                        rnd: null,
                        designer: null,
                        status: [3],
                        sizeValue: null,
                        rndName: null,
                        designerName: null,
                        statusValue: null,
                        dateValue: null,
                        postStatus:
                          activeTab === "createdPost"
                            ? ["fulfilled", "partial"]
                            : ["unfulfilled", "partial"],
                      });
                      setBatch("");
                      setSearchSKU("");
                      setSortingBrief(null);
                      setFilterCta(null);
                    }}
                  >
                    <IconFilterOff />
                  </Button>
                </Flex>
              </div>
            )}
            <Flex gap={30} direction="column">
              {map(briefs, (brief) => (
                <PostCamp
                  {...brief}
                  postPayloads={postPayloads}
                  setPostPayloads={setPostPayloads}
                  selectedFanpage={find(fanpages, {
                    uid: brief?.designInfo?.adsLinks[0]?.pageId,
                  })}
                  fanpages={fanpages}
                  choosePosts={choosePosts}
                  setChoosePosts={setChoosePosts}
                  captions={captions}
                  setQueryCaption={setQueryCaption}
                  handlePageChangeCaption={handlePageChangeCaption}
                  captionsPagination={captionsPagination}
                  allProductBases={allProductBases}
                  postErrors={postErrors}
                />
              ))}
            </Flex>
          </Card>
          <Group justify={isEmpty(brief) ? "space-between" : "flex-end"}>
            {isEmpty(brief) && (
              <Pagination
                total={briefPagination.totalPages}
                page={briefPagination.currentPage}
                onChange={handleChangePage}
                color="pink"
                size="md"
                style={{ marginTop: "20px", marginRight: "auto" }}
              />
            )}
          </Group>

          <Affix position={{ bottom: 10, left: 50 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  leftSection={
                    <IconArrowUp style={{ width: rem(16), height: rem(16) }} />
                  }
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  Scroll to top
                </Button>
              )}
            </Transition>
          </Affix>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default CreatePost;
