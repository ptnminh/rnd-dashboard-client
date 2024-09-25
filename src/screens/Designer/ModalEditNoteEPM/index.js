import { Button, Grid, Modal } from "@mantine/core";
import styles from "./styles.module.sass";
import Editor from "../../../components/Editor";
import { getEditorStateAsString, getStringAsEditorState } from "../../../utils";
import { useState } from "react";
import { rndServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { isEmpty } from "lodash";
import { STATUS } from "../../../constant";

const ModalEditNoteEPM = ({ opened, close, selectedSKU, setTrigger }) => {
  const [noteForEPM, setNoteForEPM] = useState(
    getStringAsEditorState(selectedSKU?.note?.noteForEPM || "")
  );
  const [loading, setLoading] = useState(false);
  const updateNoteForEPM = async () => {
    setLoading(true);
    const updateNoteForEPMResponse = await rndServices.updateBriefDesign({
      uid: selectedSKU.uid,
      data: {
        note: {
          noteForEPM: getEditorStateAsString(noteForEPM),
        },
      },
    });
    if (updateNoteForEPMResponse) {
      setTrigger(true);
      showNotification("Thành công", "Cập nhật Note thành công", "green");
      close();
    }
    setLoading(false);
  };
  return (
    <Modal
      opened={opened}
      onClose={close}
      transitionProps={{ transition: "fade", duration: 200 }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      radius="md"
      size="lg"
      title="Note For EPM"
      styles={{
        title: {
          fontSize: 18,
          fontWeight: 700,
        },
      }}
    >
      <Grid>
        <Grid.Col span={12}>
          <Editor
            state={noteForEPM}
            classEditorWrapper={styles.editor}
            onChange={setNoteForEPM}
          />
        </Grid.Col>
        <Grid.Col
          span={12}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              const note = getEditorStateAsString(noteForEPM);
              if (isEmpty(note)) {
                showNotification("Thất bại", "Không có gì thay đổi", "red");
                return;
              }
              updateNoteForEPM();
            }}
            disabled={selectedSKU?.status === STATUS.DESIGNED}
            loading={loading}
          >
            Confirm
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default ModalEditNoteEPM;
