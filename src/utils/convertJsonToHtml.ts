const ConvertEditorJsToHTML = (editorData: { blocks: any; }) => {
    let html = '';
    editorData.blocks.forEach((block: any ) => {
        switch (block.type) {
            case 'header':
                html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case 'paragraph':
            case 'aiText':
                html += `<p>${block.data.text}</p>`;
                break;
            case 'list':
                html += `<${block.data.style === 'ordered' ? 'ol' : 'ul'}>`;
                block.data.items.forEach((item: any) => {
                    html += `<li>${item}</li>`;
                });
                html += `</${block.data.style === 'ordered' ? 'ol' : 'ul'}>`;
                break;
            case 'quote':
                html += `<blockquote>${block.data.text}</blockquote>`;
                break;
            case 'code':
                html += `<pre><code>${block.data.code}</code></pre>`;
                break;
            case 'delimiter':
                html += '<div class="editor-delimiter"></div>';
                break;
            case 'image':
                html += `<img src="${block.data.url}" alt="${block.data.caption}">`;
                break;
            case 'embed':
                html += `<div class="embed">${block.data.embed}</div>`;
                break;
            case 'table':
                html += '<div class="table"><table>';
                block.data.content.forEach((row: any[]) => {
                    html += '<tr>';
                    row.forEach((cell: any) => {
                        html += `<td>${cell}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</table></div>';
                break;
            case 'raw':
                html += '<div class="row-html">';
                html += `${block.data.html}`;
                html += '</div>';
                break;
            case 'checklist':
                html += '<div>';
                block.data.items.forEach((item: any) => {
                    html += `<div class="checkbox">${item.checked ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="green" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"></path></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"></path></svg>'}${item.text}</div>`;
                });
                html += '</div>';
                break;
            case 'warning':
                html += `<div class="warning"><svg height="195px" width="195px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.2 -51.2 614.40 614.40" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="16.384"></g><g id="SVGRepo_iconCarrier"> <polygon style="fill:#e70d0d;" points="13.728,473.992 256,46.24 498.272,473.992 "></polygon> <path style="fill:#DB2B42;" d="M256,62.472l228.552,403.52H27.448L256,62.472 M256,30.008L0,481.992h512L256,30.008L256,30.008z"></path> <path style="fill:#ffffff;" d="M226.112,396.344c0-17.216,12.024-29.56,29.232-29.56c17.216,0,28.584,12.344,28.912,29.56 c0,16.888-11.368,29.552-28.912,29.552C237.808,425.896,226.112,413.232,226.112,396.344z M236.84,350.536l-7.48-147.144h51.648 l-7.152,147.152L236.84,350.536L236.84,350.536z"></path> </g></svg><div class="warning-title"><h3>${block.data.title}</h3><p class="warning-text">${block.data.message}</p></div></div>`;
                break;
            case 'alert':
                html += `<div class="alert ${block.data.type}"><p>${block.data.message}</p></div>`;
                break;
            default:
                break;
        }
    });    
    return html;
};

export default ConvertEditorJsToHTML;
