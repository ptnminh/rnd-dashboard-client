import React from "react";
import cn from "classnames";
import styles from "./RndInfo.module.sass";
import Card from "../../../components/Card";
import Dropdown from "../../../components/Dropdown";
import { filter, isEmpty, map } from "lodash";
import { BD_TEAMS, BRIEF_VALUES, RND_SIZES } from "../../../constant";

const RndInfo = ({
  className,
  workGroup,
  setWorkGroup,
  rndMember,
  setRndMember,
  briefValue,
  setBriefValue,
  rndSize,
  setRndSize,
  users,
}) => {
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
              options={
                !isEmpty(filter(users, { position: "rnd", team: workGroup }))
                  ? map(
                      filter(users, { position: "rnd", team: workGroup }),
                      "name"
                    )
                  : []
              }
              classOutSideClick={styles.memberDropdown}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default RndInfo;
