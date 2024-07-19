import React, { useMemo, useCallback, useState } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { Descendant, Transforms, Text } from "slate";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconCode,
} from "@tabler/icons-react";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "This is editable text!" }],
  },
];

const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate
      editor={editor}
      value={value}
      initialValue={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <div>
        <Toolbar>
          <MarkButton format="bold" icon={<IconBold />} />
          <MarkButton format="italic" icon={<IconItalic />} />
          <MarkButton format="underline" icon={<IconUnderline />} />
          <MarkButton format="code" icon={<IconCode />} />
        </Toolbar>
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some text..."
      />
    </Slate>
  );
};

const Toolbar = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #ddd",
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Transforms.removeNodes(editor, { match: (n) => n[format], split: true });
  } else {
    Transforms.setNodes(
      editor,
      { [format]: true },
      { match: (n) => Text.isText(n), split: true }
    );
  }
};

const isMarkActive = (editor, format) => {
  const marks = Text.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "heading":
      return <h2 {...attributes}>{children}</h2>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default SlateEditor;
