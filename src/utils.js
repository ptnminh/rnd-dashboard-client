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
  const contentBlock = htmlToDraft(htmlString);
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  return EditorState.createWithContent(contentState);
};
