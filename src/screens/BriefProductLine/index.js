import React, { useEffect, useState } from "react";
import styles from "./ImageRef.module.sass";
import RndInfo from "./RndInfo";
import cn from "classnames";
import Card from "../../components/Card";
import Editor from "../../components/Editor";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Grid, Flex, Button, TextInput } from "@mantine/core";
import { showNotification } from "../../utils/index";

import { filter, find, includes, map, orderBy, uniq } from "lodash";
import { artistServices, productlineService, rndServices } from "../../services";
import { CONVERT_STATUS_TO_NUMBER, getEditorStateAsString } from "../../utils";
import ArtistRef from "./ImageRef";

const BriefProductLineScreen = () => {
  const [productLineNote, setProductLineNote] = useState("");
  const [teams, setTeams] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [users, setUsers] = useState([]);
  const [productName, setProductName] = useState("");
  const [workGroup, setWorkGroup] = useState();
  const [rndSize, setRndSize] = useState();
  const [briefValue, setBriefValue] = useState();
  const [rndMember, setRndMember] = useState();
  const [createBriefLoading, setCreateBriefLoading] = useState(false);
  const [artistDesignRefLink, setArtistDesignRefLink] = useState("");

  useEffect(() => {
    const rnds = filter(users, { position: "rnd", team: workGroup });
    if (!includes(map(rnds, "name"), rndMember)) {
      setRndMember(null);
    }
  }, [workGroup]);

  const [opened, { open, close }] = useDisclosure(false);
  const handleSubmitBrief = async () => {
    if (!workGroup || !rndMember || !rndSize || !briefValue || !artistDesignRefLink || !productLineNote || !productName) {
      if (!workGroup) {
        showNotification("Thất bại", "Vui lòng chọn Team", "red");
        return;
      }
      if (!rndMember) {
        showNotification("Thất bại", "Vui lòng chọn RND", "red");
        return;
      }
      if (!rndSize) {
        showNotification("Thất bại", "Vui lòng chọn Size", "red");
        return;
      }
      if (!briefValue) {
        showNotification("Thất bại", "Vui lòng chọn Value", "red");
        return;
      }
      if (!artistDesignRefLink) {
        showNotification("Thất bại", "Vui lòng upload ảnh", "red");
        return;
      }
      if (!productLineNote) {
        showNotification("Thất bại", "Vui lòng nhập nội dung Brief", "red");
        return;
      }
      if (!productName) {
        showNotification("Thất bại", "Vui lòng nhập tên sản phẩm", "red");
        return;
      }
    }
    setCreateBriefLoading(true);
    const payload = {
      rndTeam: workGroup,
      size: {
        rnd: CONVERT_STATUS_TO_NUMBER[rndSize],
      },
      name: productName,
      imageRef: artistDesignRefLink,
      value: {
        rnd: CONVERT_STATUS_TO_NUMBER[briefValue],
      },
      rndId: find(users, { name: rndMember })?.uid,
      ...(productLineNote
        ? {
          note: {
            ...(productLineNote && { newProductLine: getEditorStateAsString(productLineNote) }),
          },
        }
        : {}),
    };
    const createBriefResponse = await productlineService.createBatchProductlines({
      payloads: [payload],
    });
    if (createBriefResponse) {
      showNotification("Thành công", "Tạo brief thành công", "green");
      close();
    }
    setCreateBriefLoading(false);
    setIsPreview(false);
  };

  const fetchUsers = async () => {
    let { data } = await rndServices.getUsers({
      limit: -1,
    });
    data = orderBy(data, ["team"], ["asc"]);
    setUsers(data);
    setTeams(uniq(map(data, "team")));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={styles.row}>
          <div className={styles.col}>
            <RndInfo
              className={styles.card}
              workGroup={workGroup}
              setWorkGroup={setWorkGroup}
              rndMember={rndMember}
              setRndMember={setRndMember}
              briefValue={briefValue}
              setBriefValue={setBriefValue}
              rndSize={rndSize}
              setRndSize={setRndSize}
              users={users}
              teams={teams}
            />
          </div>
        </div>
        <div className={styles.row}>
          <Card
            className={cn(styles.cardNote)}
            title={"Ref"}
            classTitle="title-green"
            classCardHead={styles.classCardHead}
            classSpanTitle={styles.classScaleSpanTitle}
          >
            <Grid>
              <Grid.Col span={3}>
                <ArtistRef
                  artistDesignRefLink={artistDesignRefLink}
                  setArtistDesignRefLink={setArtistDesignRefLink}
                />
              </Grid.Col>
              <Grid.Col span={9}>
                <TextInput
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ marginBottom: "12px" }}
                  styles={{
                    label: {
                      marginBottom: "12px",
                      fontWeight: 600,
                      lineHeight: 1.7,
                      fontSize: "14px",
                    }
                  }}
                  required
                />
                <Editor
                  state={productLineNote}
                  onChange={setProductLineNote}
                  classEditorWrapper={styles.editor}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <div
                  className={cn(
                    "button-stroke-blue button-small",
                    styles.createButton
                  )}
                  onClick={() => {
                    if (!workGroup) {
                      showNotification("Thất bại", "Vui lòng chọn Team", "red");
                      return;
                    }
                    if (!rndMember) {
                      showNotification("Thất bại", "Vui lòng chọn RND", "red");
                      return;
                    }
                    if (!rndSize) {
                      showNotification("Thất bại", "Vui lòng chọn Size", "red");
                      return;
                    }
                    if (!briefValue) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng chọn Value",
                        "red"
                      );
                      return;
                    }
                    if (!artistDesignRefLink) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng nhập link design",
                        "red"
                      );
                      return;
                    }
                    if (!productLineNote) {
                      showNotification(
                        "Thất bại",
                        "Vui lòng nhập nội dung Brief",
                        "red"
                      );
                      return;
                    }
                    setIsPreview(true);
                    open();
                  }}
                  style={{
                    marginTop: "24px",
                    marginBottom: "12px",
                    margin: "auto",
                    width: "150px",
                    borderRadius: "20px",
                    borderColor: "#62D256",
                    borderWidth: "2px",
                    backgroundColor: "#D9F5D6",
                    border: "1px solid #62D256",
                    color: "#000000",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
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
        onClose={() => {
          setIsPreview(false);
          close();
        }}
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
              PREVIEW CARD
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Flex direction="column">
                <div>
                  RnD:{" "}
                  <span
                    style={{
                      color: "#1356F0",
                    }}
                  >
                    @{rndMember}
                  </span>
                </div>
                <div>Value: {briefValue}</div>
              </Flex>
            </div>
          </Grid.Col>
          <Grid.Col span={3}>
            <ArtistRef
              artistDesignRefLink={artistDesignRefLink}
              setArtistDesignRefLink={setArtistDesignRefLink}
              isPreview={isPreview}
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <TextInput
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{ marginBottom: "12px" }}
              styles={{
                label: {
                  marginBottom: "12px",
                  fontWeight: 600,
                  lineHeight: 1.7,
                  fontSize: "14px",
                }
              }}
              required
            />
            <Editor
              state={productLineNote}
              onChange={setProductLineNote}
              classEditorWrapper={styles.editor}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
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
                loading={createBriefLoading}
              >
                Tạo Card
              </Button>
            </div>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};

export default BriefProductLineScreen;
