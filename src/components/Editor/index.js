import React from "react";
import styles from "./Editor.module.sass";
import cn from "classnames";
import { Editor as ReactEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Tooltip from "../Tooltip";

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
}) => {
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
        readOnly={readOnly} // Step 2: Pass readOnly to ReactEditor
        editorState={state}
        toolbarClassName={styles.editorToolbar}
        wrapperClassName={styles.editorWrapper}
        editorClassName={styles.editorMain}
        onEditorStateChange={onChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            "image",
            "remove",
            "history",
          ],
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
            uploadCallback: undefined,
            previewImage: false,
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            alt: { present: false, mandatory: false },
            defaultSize: {
              height: "90%",
              width: "90%",
            },
          },
        }}
      />
      {button && (
        <button className={cn("button-small", styles.button)}>{button}</button>
      )}
    </div>
  );
};

export default Editor;
