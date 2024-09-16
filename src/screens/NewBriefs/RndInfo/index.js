import React, { useCallback, useEffect } from "react";
import cn from "classnames";
import styles from "./RndInfo.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import { debounce, filter, isEmpty, map, uniq } from "lodash";
import { Grid, Image, List, ThemeIcon, rem, Skeleton } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import {
  BD_TEAMS,
  BRIEF_TYPES,
  BRIEF_VALUES,
  CHOOSE_BRIEF_TYPES,
  RND_SIZES,
} from "../../../constant";
import { Autocomplete } from "@mantine/core";
import Icon from "../../../components/Icon";

const RndInfo = ({
  className,
  workGroup,
  setWorkGroup,
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
  epmMember,
  setEpmMember,
  fetchAllProducts,
}) => {
  useEffect(() => {
    if (!isEmpty(previewData)) setVisibleReviewTable(true);
  }, [previewData]);
  // Debounce the fetchAllProducts function
  const debouncedFetchAllProducts = useCallback(
    debounce((value) => {
      fetchAllProducts(value);
    }, 300),
    []
  );
  return (
    <>
      <Card
        className={cn(styles.card, className)}
        title="Info của Batch"
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
              options={BD_TEAMS}
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
              className={styles.dropdown}
              label={"RND"}
              classDropdownHead={styles.dropdownHead}
              value={rndMember}
              setValue={setRndMember}
              options={
                !isEmpty(filter(users, { position: "rnd", team: workGroup }))
                  ? map(
                    filter(users, { position: "rnd", team: workGroup }),
                    "name"
                  )
                  : []
              }
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"Designer"}
              classDropdownHead={styles.dropdownHead}
              value={designerMember}
              setValue={setDesignerMember}
              options={
                !isEmpty(
                  filter(users, { position: "designer", team: workGroup })
                )
                  ? map(
                    filter(users, { position: "designer", team: workGroup }),
                    "name"
                  )
                  : []
              }
              classOutSideClick={styles.memberDropdown}
            />{" "}
            <Dropdown
              className={styles.dropdown}
              label={"EPM"}
              classDropdownHead={styles.dropdownHead}
              value={epmMember}
              setValue={setEpmMember}
              options={map(filter(users, { position: "epm" }), "name") || []}
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
            options={CHOOSE_BRIEF_TYPES}
          />{" "}
        </div>
      </Card>
      {briefType !== BRIEF_TYPES[3] &&
        briefType !== BRIEF_TYPES[4] &&
        briefType !== BRIEF_TYPES[5] && (
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
                onChange={(value) => {
                  setSearch(value);
                  debouncedFetchAllProducts(value);
                }}
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
                  <hr />
                  {!SKU?.productLineFromLibrary && (
                    <i>
                      Lưu ý: Không tìm thấy PL trên Library{" "}
                      {SKU.productLine ? `của ${SKU.productLine}` : ""}
                    </i>
                  )}
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
        )}
    </>
  );
};

export default RndInfo;
