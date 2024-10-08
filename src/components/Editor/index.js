import React, { useCallback } from "react";
import styles from "./Editor.module.sass";
import cn from "classnames";
import { Editor as ReactEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Tooltip from "../Tooltip";
import { uploadServices } from "../../services/uploads";
import { generateRandomString } from "../../utils";
import { AtomicBlockUtils, EditorState } from "draft-js";
import { ActionIcon, Tooltip as MantineTooltip } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";

// Function to handle image uploads
const uploadImageCallBack = async (file) => {
  const fileName = generateRandomString(10);
  const updateFileResponse = await uploadServices.upload(file, fileName);
  if (updateFileResponse) {
    return { data: { link: updateFileResponse.data.url } };
  }
};

const Editor = ({
  state,
  onChange,
  classEditor,
  label,
  classLabel,
  tooltip,
  place,
  button,
  readOnly = false,
  classEditorWrapper,
  isHideToolbar = false,
  onClick,
  loading,
}) => {
  const handlePastedFiles = useCallback(
    (files) => {
      const file = files[0];
      uploadImageCallBack(file).then((result) => {
        const editorState = state;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "IMAGE",
          "MUTABLE",
          { src: result.data.link, width: "90%", height: "90%" }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
          editorState,
          { currentContent: contentStateWithEntity },
          "create-entity"
        );
        const newState = AtomicBlockUtils.insertAtomicBlock(
          newEditorState,
          entityKey,
          " "
        );
        onChange(newState);
      });
    },
    [state, onChange]
  );

  return (
    <div
      className={cn(
        styles.editor,
        { [styles.editorButton]: button },
        classEditor
      )}
    >
      {label && (
        <div className={cn(classLabel, styles.label)}>
          {label}{" "}
          {tooltip && (
            <Tooltip
              className={styles.tooltip}
              title={tooltip}
              icon="info"
              place={place ? place : "right"}
            />
          )}
        </div>
      )}
      <ReactEditor
        readOnly={readOnly}
        editorState={state}
        toolbarClassName={styles.editorToolbar}
        wrapperClassName={cn(styles.editorWrapper, classEditorWrapper)}
        editorClassName={styles.editorMain}
        onEditorStateChange={onChange}
        toolbar={{
          options: isHideToolbar
            ? ["inline", "list", "textAlign"]
            : ["inline", "list", "textAlign", "emoji", "embedded", "image"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
          link: {
            options: ["link"],
          },
          list: {
            options: ["unordered"],
          },
          textAlign: {
            options: ["center"],
          },
          embedded: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            embedCallback: undefined,
            defaultSize: {
              height: "100%",
              width: "100%",
            },
          },
          image: {
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            uploadCallback: uploadImageCallBack,
            previewImage: false,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: "90%",
              width: "90%",
            },
          },
        }}
        handlePastedFiles={handlePastedFiles}
      />
      {button && (
        <MantineTooltip label="Save">
          <ActionIcon
            variant="filled"
            aria-label="Settings"
            style={{
              position: "absolute",
              top: "45px",
              right: "5px",
            }}
            onClick={onClick}
            loading={loading || false}
          >
            <IconDeviceFloppy
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </MantineTooltip>
      )}
    </div>
  );
};

export default Editor;
