import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import EditorJS, { ToolConstructable } from "@editorjs/editorjs";
import TextColorPlugin from 'editorjs-text-color-plugin';
import axios from "axios";
import ConvertEditorJsToHTML from "@/utils/convertJsonToHtml";

export default function RichTextEditor({ onChange, content }: any) {
  const editorRef = useRef<EditorJS | null>(null);
  const [savedData, setSavedData] = useState<any>(null);

  useEffect(() => {
    const loadEditor = async () => {
      const EditorJSModule = await import("@editorjs/editorjs");
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Paragraph = (await import("editorjs-paragraph-with-alignment"))
        .default;
      const SimpleImage = (await import("@editorjs/simple-image")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const RawTool = (await import("@editorjs/raw")).default;
      const Checklist = (await import("@editorjs/checklist")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;
      const Table = (await import("@editorjs/table")).default;
      const Warning = (await import("@editorjs/warning")).default;
      const Alert = (await import("editorjs-alert")).default;
      const AIText = (await import("@alkhipce/editorjs-aitext")).default;
      const ColorPlugin = (await import("editorjs-text-color-plugin")).default;
      const Strikethrough = (await import("@sotaproject/strikethrough"))
        .default;
      const Marker = (await import("@editorjs/marker")).default;
      const { StyleInlineTool } = await import("editorjs-style");
      const Tooltip = (await import("editorjs-tooltip")).default;
      const { Paraphrase } = (await import("../../utils/plugins/paraphrase/Paraphrase"));

      const editorInstance = new EditorJSModule.default({
        autofocus: true,
        holder: "editorjs",
        inlineToolbar: true,
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          image: SimpleImage,
          quote: Quote,
          embed: Embed,
          raw: RawTool,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          table: Table,
          warning: Warning,
          alert: Alert,
          paraphrase: {
            class: Paraphrase as unknown as ToolConstructable,
            config: {
              callback: async (text: string) => {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gpt/sentence-paraphrase`, { promptInfo: text });
                return response?.data?.data?.list;
              },
            },
          },
          aiText: {
            class: AIText as unknown as ToolConstructable,
            config: {
              callback: (text: string) => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve("AI: " + "Generated");
                  }, 1000);
                });
              },
            },
          },
          color: {
            class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
            config: {
              colorCollections: [
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF",
              ],
              defaultColor: "#FF1300",
              type: "text",
              customPicker: true,
            },
          },
          textColor: {
            class: TextColorPlugin,
            config: {
              colorCollections: ['#FF1300', '#FF6B00', '#FFC100', '#00FF48', '#006BFF', '#D4ECFF'],
              defaultColor: '#FF1300',
              type: 'text',
            }
          },
          marker: {
            class: ColorPlugin,
            config: {
              defaultColor: "#FFBF00",
              type: "marker",
              icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
            },
          },
          Marker,
          strikethrough: Strikethrough,
          tooltip: {
            class: Tooltip,
            config: {
              location: "left",
              underline: true,
              placeholder: "Enter a tooltip",
              highlightColor: "#FFEFD5",
              backgroundColor: "#154360",
              textColor: "#FDFEFE",
              holder: "editorId",
            },
          },
          style: StyleInlineTool,
        },
        data: Object?.keys(content?.jsonData || {})?.length
          ? content?.jsonData
          : {
            blocks: [{
              id: "KBoABT5d2L",
              type: "paragraph",
              data: {
                text: "Enter Text",
                alignment: "left"
              }
            }]
          },
        onReady: async function () {
          if (!Object?.keys(content?.jsonData || {})?.length && content?.htmlContent) {
            await editorInstance.blocks.renderFromHTML(content?.htmlContent || '');
          }
        },
        onChange: function () {
          handleSave();
        },
      });

      editorRef.current = editorInstance;
    };

    loadEditor();

    return () => {
      if (
        editorRef?.current &&
        typeof editorRef?.current?.destroy === "function"
      ) {
        editorRef.current.destroy();
      }
    };
    }, []);

  const handleSave = async () => {
    if (editorRef.current) {
      
      try {
        const data = await editorRef.current.save();
        setSavedData(data);
        onChange({
          jsonData: data,
          htmlData: ConvertEditorJsToHTML(data),
        });
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  return (
    <Box width="100%" p={2} mt={1} sx={{ border: "1px solid #d4d7dd", borderRadius: '8px' }}>
      <Box id="editorjs" />
    </Box>
  );
}

