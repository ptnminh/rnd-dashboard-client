import React, { useEffect } from "react";
import cn from "classnames";
import styles from "./CampaignInfo.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import { find, isEmpty, map, uniq, uniqBy } from "lodash";
import TextInput from "../../../components/TextInput";
import {
  Grid,
  Image,
  List,
  ThemeIcon,
  rem,
  Skeleton,
  Group,
  Avatar,
  Text,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import {
  BRIEF_TYPES,
  BRIEF_VALUES,
  DESIGNER_MEMBERS,
  GROUP_WORKS,
  MEMBERS,
  RND_SIZES,
} from "../../../constant";
import { showNotification } from "../../../utils/index";
import { Autocomplete } from "@mantine/core";
import Icon from "../../../components/Icon";

const CampaignInfo = ({
  className,
  workGroup,
  setWorkGroup,
  register,
  errors,
  setVisibleReviewTable,
  previewData,
  rndMember,
  setRndMember,
  briefType,
  setBriefType,
  search,
  setSearch,
  handleSearchSKU,
  loadingSearchSKU,
  SKU,
  products,
  designerMember,
  setDesignerMember,
  briefValue,
  setBriefValue,
  rndSize,
  setRndSize,
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
              label={"Team"}
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={workGroup}
              setValue={setWorkGroup}
              options={GROUP_WORKS}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              label={"Value"}
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={briefValue}
              setValue={setBriefValue}
              options={BRIEF_VALUES}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              label={"RND Size"}
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={rndSize}
              setValue={setRndSize}
              options={RND_SIZES}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"RND"}
              classDropdownHead={styles.dropdownHead}
              value={rndMember}
              setValue={setRndMember}
              options={MEMBERS}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"Designer"}
              classDropdownHead={styles.dropdownHead}
              value={designerMember}
              setValue={setDesignerMember}
              options={DESIGNER_MEMBERS}
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
          <Autocomplete
            placeholder="Search SKU"
            data={uniq(map(products, "SKU"))}
            withScrollArea={true}
            defaultDropdownOpened={false}
            maxDropdownHeight={100}
            leftSection={
              <span
                onClick={handleSearchSKU}
                style={{
                  cursor: "pointer",
                }}
              >
                <Icon name="search" size={18} />
              </span>
            }
            value={search}
            onChange={(value) => setSearch(value)}
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
                {SKU.productLink && (
                  <List.Item>
                    Link Product:{" "}
                    <a href={SKU.productLink} target="_blank">
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
