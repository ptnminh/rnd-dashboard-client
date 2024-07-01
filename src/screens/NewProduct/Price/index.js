import React, { useState } from "react";
import cn from "classnames";
import styles from "./DefaultValue.module.sass";
import Card from "../../../components/Card";
import TextInput from "../../../components/TextInput";
import Dropdown from "../../../components/Dropdown";
import {
  EXPRESSION_TYPES,
  MATCH_TYPES,
  STRATEGIES,
  DEFAULT_VALUES_NAVIGATIONS,
} from "../../../constant";

const CampaignAuto = ({ setStrategy, strategy, isEdit, register, errors }) => {
  return (
    <div className={cn(styles.price)}>
      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Daily Budget"
            step="any"
            name="budget"
            type="number"
            required
            currency="$"
            disabled={!isEdit}
            error={errors.budget}
            register={register("budget", {
              required: true,
              valueAsNumber: true,
            })}
          />
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="AdGroup Default Bid"
            name="defaultBid"
            step="any"
            type="number"
            required
            disabled={!isEdit}
            register={register("defaultBid", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.defaultBid}
          />
        </div>
      )}

      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Top Of Search"
            name="topOfSearch"
            step="any"
            type="number"
            required
            currency="%"
            disabled={!isEdit}
            register={register("topOfSearch", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.topOfSearch}
          />
          <Dropdown
            className={styles.dropdown}
            classDropdownLabel={styles.label}
            classDropdownHead={styles.classDropdownHead}
            value={strategy}
            setValue={setStrategy}
            options={STRATEGIES}
            label={"Strategy"}
            classOutsideClick={styles.outsideClick}
            disabled={!isEdit}
          />
        </div>
      )}
      {!isEdit && (
        <Dropdown
          className={styles.dropdown}
          classDropdownLabel={styles.label}
          classDropdownHead={styles.classDropdownHead}
          value={strategy}
          setValue={setStrategy}
          options={STRATEGIES}
          label={"Strategy"}
          classOutsideClick={styles.outsideClick}
          disabled={!isEdit}
        />
      )}
    </div>
  );
};

const CampaignKeywords = ({
  setStrategy,
  strategy,
  matchType,
  setMatchType,
  isEdit,
  register,
  errors,
}) => {
  return (
    <div className={cn(styles.price)}>
      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Daily Budget"
            step="any"
            name="budget"
            type="number"
            required
            currency="$"
            disabled={!isEdit}
            register={register("budget", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.budget}
          />
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="AdGroup Default Bid"
            name="defaultBid"
            step="any"
            type="number"
            required
            disabled={!isEdit}
            register={register("defaultBid", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.defaultBid}
          />
        </div>
      )}

      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Bid"
            step="any"
            name="bid"
            type="number"
            required
            disabled={!isEdit}
            register={register("bid", { required: true, valueAsNumber: true })}
            error={errors.bid}
          />
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Top Of Search"
            name="topOfSearch"
            step="any"
            type="number"
            required
            currency="%"
            disabled={!isEdit}
            register={register("topOfSearch", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.topOfSearch}
          />
        </div>
      )}

      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <Dropdown
          className={styles.field}
          classDropdownLabel={styles.label}
          classDropdownHead={styles.classDropdownHead}
          value={matchType}
          setValue={setMatchType}
          options={MATCH_TYPES}
          label={"Match Type"}
          classOutsideClick={styles.outsideClick}
        />{" "}
      </div>
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <Dropdown
          className={styles.field}
          classDropdownLabel={styles.label}
          classDropdownHead={styles.classDropdownHead}
          value={strategy}
          setValue={setStrategy}
          options={STRATEGIES}
          label={"Strategy"}
          classOutsideClick={styles.outsideClick}
        />{" "}
      </div>
    </div>
  );
};

const CampaignASINs = ({
  setStrategy,
  strategy,
  expressionType,
  setExpressionType,
  isEdit,
  register,
  errors,
}) => {
  return (
    <div className={cn(styles.price)}>
      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Daily Budget"
            step="any"
            name="budget"
            type="number"
            required
            currency="$"
            disabled={!isEdit}
            register={register("budget", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.budget}
          />
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="AdGroup Default Bid"
            name="defaultBid"
            step="any"
            type="number"
            required
            disabled={!isEdit}
            register={register("defaultBid", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.defaultBid}
          />
        </div>
      )}
      {isEdit && (
        <div className={styles.fieldset}>
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Bid"
            step="any"
            name="bid"
            type="number"
            required
            disabled={!isEdit}
            register={register("bid", { required: true, valueAsNumber: true })}
            error={errors.bid}
          />
          <TextInput
            className={styles.field}
            classLabel={styles.label}
            classInput={styles.classInput}
            label="Top Of Search"
            name="topOfSearch"
            step="any"
            type="number"
            required
            currency="%"
            disabled={!isEdit}
            register={register("topOfSearch", {
              required: true,
              valueAsNumber: true,
            })}
            error={errors.topOfSearch}
          />
        </div>
      )}

      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <Dropdown
          className={styles.field}
          classDropdownLabel={styles.label}
          classDropdownHead={styles.classDropdownHead}
          value={expressionType}
          setValue={setExpressionType}
          options={EXPRESSION_TYPES}
          label={"Expression Type"}
          classOutsideClick={styles.outsideClick}
        />{" "}
      </div>
      <div
        style={{
          marginBottom: "10px",
        }}
      >
        <Dropdown
          className={styles.field}
          classDropdownLabel={styles.label}
          classDropdownHead={styles.classDropdownHead}
          value={strategy}
          setValue={setStrategy}
          options={STRATEGIES}
          label={"Strategy"}
          classOutsideClick={styles.outsideClick}
        />{" "}
      </div>
    </div>
  );
};

const DefaultValue = ({
  className,
  campaignType = "AUTO",
  activeDefaultValueTab,
  setActiveDefaultValueTab,
  setStrategy,
  strategy,
  matchType,
  setMatchType,
  expressionType,
  setExpressionType,
  register,
  errors,
}) => {
  return (
    <Card
      className={cn(styles.card, className)}
      title="7. Bid/Bud"
      classTitle="title-orange"
      head={
        <div className={cn(styles.nav, "tablet-hide")}>
          {DEFAULT_VALUES_NAVIGATIONS.map((x, index) => (
            <div
              className={cn(styles.link, {
                [styles.active]: x === activeDefaultValueTab,
              })}
              onClick={() => setActiveDefaultValueTab(x)}
              key={index}
              style={{ cursor: "pointer" }}
            >
              {x}
            </div>
          ))}
        </div>
      }
    >
      {campaignType === "AUTO" && (
        <CampaignAuto
          setStrategy={setStrategy}
          strategy={strategy}
          isEdit={activeDefaultValueTab === "Edit"}
          register={register}
          errors={errors}
        />
      )}
      {campaignType === "KEYWORD" && (
        <CampaignKeywords
          setStrategy={setStrategy}
          strategy={strategy}
          matchType={matchType}
          setMatchType={setMatchType}
          isEdit={activeDefaultValueTab === "Edit"}
          register={register}
          errors={errors}
        />
      )}
      {campaignType === "ASIN" && (
        <CampaignASINs
          setStrategy={setStrategy}
          strategy={strategy}
          expressionType={expressionType}
          setExpressionType={setExpressionType}
          isEdit={activeDefaultValueTab === "Edit"}
          register={register}
          errors={errors}
        />
      )}
    </Card>
  );
};

export default DefaultValue;
