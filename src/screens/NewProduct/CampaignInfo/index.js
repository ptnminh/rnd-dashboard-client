import React, { useEffect } from "react";
import cn from "classnames";
import styles from "./CampaignInfo.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import { isEmpty } from "lodash";
import TextInput from "../../../components/TextInput";
import { Grid, Image, List, ThemeIcon, rem, Skeleton } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { BRIEF_TYPES, GROUP_WORKS, MEMBERS } from "../../../constant";
import { showNotification } from "../../../utils/index";
const CampaignInfo = ({
  className,
  workGroup,
  setWorkGroup,
  register,
  errors,
  setVisibleReviewTable,
  previewData,
  openPreviewModal,
  rndMember,
  setRndMember,
  briefType,
  setBriefType,
  search,
  setSearch,
  handleSearchSKU,
  loadingSearchSKU,
  SKU,
  selectedProductLines,
}) => {
  useEffect(() => {
    if (!isEmpty(previewData)) setVisibleReviewTable(true);
  }, [previewData]);
  return (
    <>
      <Card
        className={cn(styles.card, className)}
        title="Info của RnD"
        classTitle="title-red"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classSpanTitle}
      >
        <div className={styles.description}>
          <div className={styles.campType}>
            <Dropdown
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={workGroup}
              setValue={setWorkGroup}
              options={GROUP_WORKS}
              classOutSideClick={styles.groupDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={rndMember}
              setValue={setRndMember}
              options={MEMBERS}
              classOutSideClick={styles.memberDropdown}
            />{" "}
          </div>
        </div>
      </Card>
      <Card
        className={cn(styles.card, className)}
        title="1. Loại Brief"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classSpanBriefTitle}
      >
        <div
          className={styles.group}
          style={{ width: "100%", marginBottom: 24 }}
        >
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={briefType}
            setValue={setBriefType}
            options={BRIEF_TYPES}
          />{" "}
        </div>
      </Card>
      <Card
        className={cn(styles.card, className)}
        title="2. Input Ref"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classSpanBriefTitle}
        head={
          <TextInput
            className={styles.form}
            placeholder="Search SKU"
            type="text"
            name="search"
            icon="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClickIcon={handleSearchSKU}
          />
        }
      >
        {SKU && !loadingSearchSKU && (
          <Grid>
            <Grid.Col span={6}>
              <Image
                radius="md"
                src={SKU.image || "/images/content/not_found_2.jpg"}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <List
                spacing="lg"
                size="sm"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  </ThemeIcon>
                }
              >
                {SKU.pfhLink && (
                  <List.Item>
                    Link PFH:{" "}
                    <a href={SKU.pfhLink} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
                {SKU.designLink && (
                  <List.Item>
                    Link Design:{" "}
                    <a href={SKU.designLink} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
                {SKU.mockupLink && (
                  <List.Item>
                    Link Mockup:{" "}
                    <a href={SKU.mockupLink} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
                {SKU.tibLink && (
                  <List.Item>
                    Link TIB:{" "}
                    <a href={SKU.tibLink} target="_blank">
                      Click
                    </a>
                  </List.Item>
                )}
              </List>
            </Grid.Col>
            <Grid.Col span={12}>
              <div
                className={cn(
                  "button-stroke-blue button-small",
                  styles.createButton
                )}
                onClick={() => {
                  if (isEmpty(selectedProductLines)) {
                    showNotification(
                      "Thất bại",
                      "Vui lòng chọn Product Line",
                      "red"
                    );
                    return;
                  }
                  openPreviewModal();
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
        )}
        {loadingSearchSKU && (
          <Grid>
            <Grid.Col span={6}>
              <Skeleton height={260} radius="md" />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton height={50} mt={10} radius="md" />
              <Skeleton height={50} mt={10} radius="md" />
              <Skeleton height={50} mt={10} radius="md" />
              <Skeleton height={50} mt={10} radius="md" />
            </Grid.Col>
          </Grid>
        )}
      </Card>
    </>
  );
};

export default CampaignInfo;
