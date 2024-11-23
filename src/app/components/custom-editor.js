'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Italic, Mention, Paragraph, Image, Undo, ImageInsert, Underline, Link, Table, TableToolbar, Heading, Alignment, List } from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

function CustomEditor(props) {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={props?.data || ""}
            config={{
                toolbar: {
                    items: ["heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "link",
                        "|",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "insertTable",
                        "|",
                        "alignment",
                        "imageInsert",
                        "|",
                        "undo",
                        "redo",],

                },
                plugins: [
                    Heading, Bold, Essentials, Italic, Underline, Link, Table, TableToolbar, Mention, List, Paragraph, Undo, Image, ImageInsert, Alignment
                ],
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                image: {    
                    insert: {
                        integrations: ['url'],
                    },
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true,
                    },
                },
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                props.onChange("content", data);
            }}
        />
    );
}

export default CustomEditor;