import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
export const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const progress = () => {
  return Math.floor(Math.random() * 90) + 10 + "%";
};

export const delayTime = (number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, number);
  });
};

export const getEditorStateAsString = (editorState) => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  return draftToHtml(rawContentState);
};

// Convert string to editor state
export const getStringAsEditorState = (htmlString) => {
  if (!htmlString || typeof htmlString !== "string") {
    // Return an empty editor state if the input is invalid
    return EditorState.createEmpty();
  }

  const contentBlock = htmlToDraft(htmlString);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    return EditorState.createWithContent(contentState);
  }

  // Return an empty editor state if the content block is invalid
  return EditorState.createEmpty();
};

export const CONVERT_STATUS_TO_NUMBER = {
  Small: 1,
  Medium: 2,
  Big: 3,
};

export const CONVERT_NUMBER_TO_STATUS = {
  1: "Small",
  2: "Medium",
  3: "Big",
};

export const CONVERT_BRIEF_TYPE_TO_OBJECT_NAME = {
  "Scale - Product Base": "productLine",
  "Scale - Clipart": "clipart",
  "Scale - Niche": "clipart",
};
