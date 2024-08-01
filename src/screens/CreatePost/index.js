import {
  Affix,
  Button,
  Checkbox,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  rem,
  Select,
  TextInput,
  Transition,
} from "@mantine/core";
import Card from "../../components/Card";
import PostCamp from "../../components/Post";
import { IconFilterOff, IconSearch, IconArrowUp } from "@tabler/icons-react";
import styles from "./CreatePost.module.sass";
import cn from "classnames";
import { useEffect, useState } from "react";
import { CONVERT_STATUS_TO_NUMBER } from "../../utils";
import { compact, filter, find, flatMap, includes, isEmpty, map } from "lodash";
import { captionServices, postService, rndServices } from "../../services";
import { useWindowScroll } from "@mantine/hooks";
import { showNotification } from "../../utils/index";

const CreatePost = () => {
  const [query, setQuery] = useState({
    status: [3],
  });
  const [batch, setBatch] = useState("");
  const [searchSKU, setSearchSKU] = useState("");
  const [loadingFetchBrief, setLoadingFetchBrief] = useState(false);
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);
  const [sortingBrief, setSortingBrief] = useState({});
  const [briefs, setBriefs] = useState([]);
  const [users, setUsers] = useState([]);
  const [scroll, scrollTo] = useWindowScroll();
  const [fanpages, setFanpages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [queryCaption, setQueryCaption] = useState("");
  const [captionsPagination, setCaptionsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [choosePosts, setChoosePosts] = useState([]);
  const [selectedFanpage, setSelectedFanpage] = useState(null);
  const [postPayloads, setPostPayloads] = useState([]);
  const [briefPagination, setBriefPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
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
    const response = await rndServices.fetchBriefs({
      page,
      limit: 10,
      sorting: sortingBrief,
      ...query,
    });
    const { data, metadata } = response;
    if (data) {
      setBriefs(
        map(
          filter(data, (x) => x.designInfo?.adsLinks),
          (x) => ({
            ...x,
            ads: x.designInfo?.adsLinks,
          })
        )
      );
      setPostPayloads(
        flatMap(
          compact(
            map(data, (x) => {
              const { designInfo } = x;
              const ads = designInfo?.adsLinks;
              if (isEmpty(ads)) {
                return null;
              }
              return map(ads, (ad) => ({
                uid: ad.uid,
                ctaLink: `https://pawfecthouse.com/${x.sku}`,
                ...(selectedFanpage && {
                  pageId: selectedFanpage.uid,
                }),
                name: `${x.sku} - ${x.batch}`,
                image: ad.value,
                briefId: x.uid,
                sku: x.sku,
                postId: ad.postId,
              }));
            })
          )
        )
      );
      setBriefPagination(metadata);
    } else {
      setBriefs([]);
      setBriefPagination({ currentPage: 1, totalPages: 1 });
    }
    setLoadingFetchBrief(false);
  };
  const fetchFanpages = async () => {
    const { data } = await postService.fetchFanpages({
      limit: -1,
    });
    setFanpages(data);
  };
  useEffect(() => {
    fetchBriefs(briefPagination.currentPage);
  }, [query, sortingBrief, briefPagination.currentPage]);
  useEffect(() => {
    fetchUsers();
    fetchFanpages();
  }, []);
  useEffect(() => {
    if (!isEmpty(postPayloads)) {
      setChoosePosts(
        map(
          filter(postPayloads, (x) => !x.postId),
          "uid"
        )
      );
    }
  }, [postPayloads]);
  const handleCreatePost = async () => {
    setLoadingCreatePost(true);
    const selectedPosts = filter(postPayloads, (x) =>
      includes(choosePosts, x.uid)
    );
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
      (x) =>
        x.pageId &&
        x.sku &&
        x.adsUrl &&
        x.adsId &&
        x.caption &&
        x.name &&
        x.briefId
    );
    // check valid data
    if (isEmpty(transformedPayloads)) {
      showNotification("Thất bại", "Vui lòng xem lại thông tin", "red");
      return;
    }
    const createPostResponse = await postService.createPost(
      transformedPayloads
    );
    if (createPostResponse) {
      showNotification("Thành công", "Tạo post thành công", "green");
      setChoosePosts([]);
      setSelectedFanpage(null);
    }
    setLoadingCreatePost(false);

    await fetchBriefs(briefPagination.currentPage);
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
  return (
    <>
      <Card
        className={cn(styles.card, styles.clipArtCard)}
        title="Tạo Post"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
      >
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
                  if (choosePosts.length === postPayloads.length) {
                    setChoosePosts([]);
                  } else {
                    setChoosePosts(map(postPayloads, "uid"));
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
              placeholder="Size"
              data={["Small", "Medium", "Big"]}
              styles={{
                input: {
                  width: "100px",
                },
              }}
              value={query?.sizeValue}
              onChange={(value) =>
                setQuery({
                  ...query,
                  size: CONVERT_STATUS_TO_NUMBER[value],
                  sizeValue: value,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  size: null,
                  sizeValue: null,
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
              placeholder="Designer"
              data={map(filter(users, { role: "designer" }), "name") || []}
              styles={{
                input: {
                  width: "120px",
                },
              }}
              value={query?.designerName}
              onChange={(value) =>
                setQuery({
                  ...query,
                  designerName: find(users, { name: value })?.name,
                  designer: find(users, { name: value })?.uid,
                })
              }
              clearable
              onClear={() => {
                setQuery({
                  ...query,
                  designerName: null,
                  designer: null,
                });
              }}
            />
            <Select
              placeholder="Fanpages"
              data={map(fanpages, "name") || []}
              styles={{
                input: {
                  width: "200px",
                },
              }}
              value={selectedFanpage?.name || ""}
              onChange={(value) => {
                setSelectedFanpage(find(fanpages, { name: value }));
              }}
              clearable
            />

            <Button
              onClick={() => {
                setSelectedFanpage(null);
                setQuery({
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
                });
                setBatch("");
                setSearchSKU("");
              }}
            >
              <IconFilterOff />
            </Button>
          </Flex>
        </div>
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
            />
          ))}
        </Flex>
      </Card>
      <Group justify="space-between">
        <Pagination
          total={briefPagination.totalPages}
          page={briefPagination.currentPage}
          onChange={handleChangePage}
          color="pink"
          size="md"
          style={{ marginTop: "20px", marginRight: "auto" }}
        />
        <Button
          color="green"
          onClick={handleCreatePost}
          loading={loadingCreatePost}
        >
          Create Post
        </Button>
      </Group>

      <Affix position={{ bottom: 20, right: 200 }}>
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
    </>
  );
};

export default CreatePost;
