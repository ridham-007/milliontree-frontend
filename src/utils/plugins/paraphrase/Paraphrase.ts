import type {
    API,
    InlineTool,
    InlineToolConstructorOptions,
  } from "@editorjs/editorjs";
  import { EditorJSStyleElement } from "./EditorJSStyleElement";
  
  class Paraphrase implements InlineTool {
    static get isInline() {
      return true;
    }
  
    static get title() {
      return "Paraphrase";
    }
  
    static prepare() {
      if (customElements.get("editorjs-paraphrase")) {
        return;
      }
  
      customElements.define("editorjs-paraphrase", EditorJSStyleElement);
    }
  
    actions: HTMLDivElement;
    api: API;
    callback: Function | null;
    selectedRange: Range | null;
    isActive: Boolean;
    isUiLoaded: Boolean;
  
    constructor({ api, config }: InlineToolConstructorOptions) {
      this.actions = document.createElement("div");
      this.api = api;
      this.callback = config?.callback || null;
      this.selectedRange = null;
      this.isActive = false;
      this.isUiLoaded = false;
    }
  
    get shortcut() {
      return "CMD+P";
    }
  
    checkState(selectionData: Selection) {
      if (!this.selectedRange) {
        this.selectedRange = selectionData.getRangeAt(0);
      }
  
      if (!this.isActive || this.isUiLoaded) {
        this.clear();
        this.isUiLoaded = false;
        return false;
      }
  
      this.actions.innerHTML = "";
      const loader = document.createElement("div");
      loader.innerHTML = `
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.99988V5.99988M12 20.9999V17.9999M4.20577 16.4999L6.80385 14.9999M21 11.9999H18M16.5 19.7941L15 17.196M3 11.9999H6M7.5 4.20565L9 6.80373M7.5 19.7941L9 17.196M19.7942 16.4999L17.1962 14.9999M4.20577 7.49988L6.80385 8.99988" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      loader.id = "paraphrase-suggestions-loader";
      loader.style.display = "inline-flex";
      loader.style.alignItems = "center";
      loader.style.width = "24px";
      loader.style.height = "24px";
      loader.style.color = "lightgray";
      loader.style.margin = "auto";
  
      loader.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        {
          duration: 2000,
          iterations: Infinity,
        }
      );
  
      const container = document.createElement("div");
      container.style.marginBottom = "16px";
      container.style.marginLeft = "16px";
      container.style.marginRight = "16px";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.flexDirection = "column";
  
      container.appendChild(loader);
  
      this.actions.appendChild(container);
      if (this.callback) {
        const selectedText = window.getSelection
          ? window.getSelection()?.toString().trim()
          : "";
        if (selectedText && selectedText?.length > 0 && this.isActive) {
          this.callback(selectedText).then((res: any) => {
            if (this.isActive && this.actions.contains(container)) {
  
              this.actions.removeChild(container);
              const suggestionList = document.createElement("div");
              suggestionList.classList.add("suggestion-list");
  
              res.forEach((option: string) => {
                const suggestionItem = document.createElement("div");
                suggestionItem.textContent = option;
                suggestionItem.classList.add("suggestion-item");
                suggestionItem.style.padding = "4px 8px";
                suggestionItem.style.margin = "3px";
                suggestionItem.style.backgroundColor = "#f0f0f0";
                suggestionItem.style.borderRadius = "4px";
                suggestionItem.style.cursor = "pointer";
                suggestionItem.style.transition = "background-color 0.3s ease";
  
                suggestionItem.addEventListener("mouseover", () => {
                  suggestionItem.style.backgroundColor = "#e0e0e0";
                });
                suggestionItem.addEventListener("mouseleave", () => {
                  suggestionItem.style.backgroundColor = "#f0f0f0";
                });
  
                suggestionItem.addEventListener("click", () => {
                  if (this.selectedRange) {
                    const newText: string = suggestionItem.textContent || "";
                    this.selectedRange.deleteContents();
                    this.selectedRange.insertNode(
                      document.createTextNode(newText)
                    );
                  }
                });
  
                suggestionList.appendChild(suggestionItem);
              });
  
              this.actions.appendChild(suggestionList);
            }
          });
        }
      }
      this.isUiLoaded = true;
      return true;
    }
  
    clear() {
      this.actions.innerHTML = "";
    }
  
    render() {
      const button = document.createElement("button");
  
      button.classList.add(this.api.styles.inlineToolButton);
      button.type = "button";
  
      button.innerHTML = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><path class="cls-1" d="M14.86,5.3H5.32A3.81,3.81,0,0,0,1.5,9.11v5.73a3.82,3.82,0,0,0,3.82,3.82H7.23l2.86,2.86L13,18.66h1.91a3.82,3.82,0,0,0,3.82-3.82V9.11A3.81,3.81,0,0,0,14.86,5.3Z"/><path class="cls-1" d="M18.68,14.84A3.82,3.82,0,0,0,22.5,11V5.3a3.82,3.82,0,0,0-3.82-3.82H9.14A3.82,3.82,0,0,0,5.32,5.3"/><line class="cls-1" x1="6.27" y1="11.98" x2="13.91" y2="11.98"/><line class="cls-1" x1="10.09" y1="8.16" x2="10.09" y2="15.8"/></svg>
      `;
  
      return button;
    }
  
    renderActions(): HTMLElement {
      return this.actions;
    }
  
    surround(range: Range) {
      this.isActive = true;
    }
  }
  
  export { Paraphrase };
  