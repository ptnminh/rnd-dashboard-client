import Card from "../../../components/Card";
import styles from "./Optimized.module.sass";
import cn from "classnames";
import { Grid } from "@mantine/core";

import Editor from "../../../components/Editor";
import { BRIEF_TYPES } from "../../../constant";
import { find, isEmpty } from "lodash";
import { showNotification } from "../../../utils/index";

const GenerateEditorColumn = ({
  designerNote,
  setDesignerNote,
  epmNote,
  setEPMNote,
  mktNote,
  setMKTNote,
  briefType,
  openModal,
  SKU,
  rndMember,
}) => {
  switch (briefType) {
    case BRIEF_TYPES[6]: {
      return (
        <>
          <Grid.Col span={6}>
            <Editor
              state={designerNote}
              onChange={setDesignerNote}
              classEditor={styles.editor}
              label="Designer Note"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Editor
              state={epmNote}
              onChange={setEPMNote}
              classEditor={styles.editor}
              label="EPM Note"
            />
          </Grid.Col>
        </>
      );
    }
    case BRIEF_TYPES[7]: {
      return (
        <>
          <Grid.Col span={6}>
            <Editor
              state={designerNote}
              onChange={setDesignerNote}
              classEditor={styles.editor}
              label="Designer Note"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Editor
              state={mktNote}
              onChange={setMKTNote}
              classEditor={styles.editor}
              label="MKT Note"
            />
          </Grid.Col>
        </>
      );
    }
    case BRIEF_TYPES[8]: {
      return (
        <>
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
        </>
      );
    }
    default: {
      return null;
    }
  }
};

const Optimized = ({
  briefType,
  generateCardTitle,
  designerNote,
  setDesignerNote,
  epmNote,
  setEPMNote,
  mktNote,
  setMKTNote,
  users,
  rndMember,
  setEditSKUs,
  SKU,
  generateScaleProductBaseOnBriefType,
  openModal,
}) => {
  return (
    <div className={styles.row}>
      <Card
        className={cn(styles.cardNote)}
        title={generateCardTitle(briefType)}
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        classSpanTitle={styles.classScaleSpanTitle}
      >
        <Grid>
          <GenerateEditorColumn
            designerNote={designerNote}
            setDesignerNote={setDesignerNote}
            epmNote={epmNote}
            setEPMNote={setEPMNote}
            mktNote={mktNote}
            setMKTNote={setMKTNote}
            briefType={briefType}
          />
          <Grid.Col span={12}>
            <div
              className={cn(
                "button-stroke-blue button-small",
                styles.createButton
              )}
              onClick={() => {
                if (isEmpty(SKU)) {
                  showNotification("Thất bại", "Vui lòng chọn SKU", "red");
                }
                if (!rndMember) {
                  showNotification("Thất bại", "Vui lòng chọn RND", "red");
                  return;
                }

                const skus = generateScaleProductBaseOnBriefType({
                  type: briefType,
                  SKU,
                  rndSortName: find(users, { name: rndMember })?.shortName,
                  rndId: find(users, { name: rndMember })?.uid,
                });
                setEditSKUs(skus);
                openModal();
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
  );
};

export default Optimized;
