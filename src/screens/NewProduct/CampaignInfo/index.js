import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./CampaignInfo.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import { filter, find, isEmpty, map, uniq, uniqBy } from "lodash";
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
  Button,
  Flex,
  Select,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconRotateClockwise,
  IconSearch,
  IconFilterOff,
} from "@tabler/icons-react";
import {
  BRIEF_TYPES,
  BRIEF_VALUES,
  DESIGNER_MEMBERS,
  GROUP_WORKS,
  MEMBERS,
  RND_SIZES,
} from "../../../constant";
import { Autocomplete } from "@mantine/core";
import Icon from "../../../components/Icon";
import moment from "moment-timezone";
import { DateRangePicker } from "rsuite";
import { CONVERT_STATUS_TO_NUMBER } from "../../../utils";

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
  users,
  teams,
  epmMember,
  setEpmMember,
  handleSyncUser,
}) => {
  useEffect(() => {
    if (!isEmpty(previewData)) setVisibleReviewTable(true);
  }, [previewData]);

  const [searchSKU, setSearchSKU] = useState("");
  const [batch, setBatch] = useState("");
  const [query, setQuery] = useState({
    date: null,
    batch: "",
    sku: "",
    briefType: null,
    size: null,
    rndTeam: null,
    rnd: null,
    epm: null,
    designer: null,
    status: [2, 3],
    sizeValue: null,
    rndName: null,
    designerName: null,
    epmName: null,
    statusValue: null,
    dateValue: null,
  });
  return (
    <>
      <Card
        className={cn(styles.card, className)}
        title="Info của RnD"
        classTitle="title-red"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classSpanTitle}
        head={
          <Button
            onClick={handleSyncUser}
            leftSection={<IconRotateClockwise />}
          >
            Sync User
          </Button>
        }
      >
        <div className={styles.description}>
          <div className={styles.campType}>
            <Dropdown
              label={"Team"}
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={workGroup}
              setValue={setWorkGroup}
              options={teams || []}
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
              label={"Size"}
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
              options={map(filter(users, { role: "rnd" }), "name") || []}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"Designer"}
              classDropdownHead={styles.dropdownHead}
              value={designerMember}
              setValue={setDesignerMember}
              options={map(filter(users, { role: "designer" }), "name") || []}
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"EPM"}
              classDropdownHead={styles.dropdownHead}
              value={epmMember}
              setValue={setEpmMember}
              options={map(filter(users, { role: "epm" }), "name") || []}
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearchSKU();
              }
            }}
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
                    <a
                      style={{
                        display: "inline-block",
                        width: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textDecoration: "none",
                        color: "#228be6",
                        verticalAlign: "middle",
                      }}
                      href={SKU.productLink}
                      target="_blank"
                    >
                      {SKU.productLink}
                    </a>
                  </List.Item>
                )}
                {SKU.designLink && (
                  <List.Item>
                    Link Design:{" "}
                    <a
                      style={{
                        display: "inline-block",
                        width: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textDecoration: "none",
                        color: "#228be6",
                        verticalAlign: "middle",
                      }}
                      href={SKU.designLink}
                      target="_blank"
                    >
                      {SKU.designLink}
                    </a>
                  </List.Item>
                )}
                {SKU.mockupLink && (
                  <List.Item>
                    Link Mockup:{" "}
                    <a
                      style={{
                        display: "inline-block",
                        width: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textDecoration: "none",
                        color: "#228be6",
                        verticalAlign: "middle",
                      }}
                      href={SKU.mockupLink}
                      target="_blank"
                    >
                      {SKU.mockupLink}
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
                {SKU.productLine && (
                  <List.Item>PL: {SKU.productLine}</List.Item>
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
