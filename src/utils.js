import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { concat, findIndex, remove } from "lodash";
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
  "Super Big": 4,
};

export const CONVERT_NUMBER_TO_STATUS = {
  1: "Small",
  2: "Medium",
  3: "Big",
  4: "Super Big",
};

export const CONVERT_BRIEF_TYPE_TO_OBJECT_NAME = {
  "Scale - Product Line": "productLine",
  "Scale - Clipart": "clipart",
  "Scale - Niche": "clipart",
  "New - Phủ Market": "clipart",
  "Scale - Design": "skuInfo",
  "New - Mix Match": "productLine",
};
export function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export function reorderArrayById(items, id) {
  // Find the index of the item with the specified id
  const index = findIndex(items, { uid: id });

  if (index !== -1) {
    // Remove the item from its original position
    const [item] = remove(items, (item, i) => i === index);
    // Concatenate the item at the beginning of the array
    items = concat([item], items);
  }

  return items;
}
export function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (match) => match.toLowerCase());
}
export function toPascalCase(str) {
  return str
    ?.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c?.toUpperCase() : ""))
    ?.replace(/^[a-z]/, (match) => match?.toUpperCase());
}
