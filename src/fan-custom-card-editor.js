import { t } from "./translations.js";

class FanCustomCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = JSON.parse(JSON.stringify(config || {}));
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _dispatch() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true, composed: true,
    }));
  }

  _slugify(text) {
    if (!text) return "";
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  _render() {
    const root = this.shadowRoot;
    const c = this._config;
    const hass = this._hass;
    const L = (k) => t(hass, k);

    if (!hass) {
      root.innerHTML = `<div style="padding:16px;color:var(--secondary-text-color,#727272);">${L("loading")}</div>`;
      return;
    }

    const areas = hass.areas ? Object.entries(hass.areas) : [];
    const prefix = c.prefix || "";
    const currentArea = areas.find(([, a]) =>
      `ventilador_${this._slugify(a.name)}` === prefix || a.name === c.name
    );
    const currentId = currentArea ? currentArea[0] : "";

    root.innerHTML = `<style>
      .editor { padding: 8px 0; }
      .field-row { display: flex; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
      .field-row > * { flex: 1; min-width: 150px; }
      .field-label {
        font-size: 11px; font-weight: 500; color: var(--secondary-text-color, #727272);
        text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;
      }
      select {
        width: 100%; padding: 8px 10px; border: 1px solid var(--divider-color, rgba(0,0,0,0.15));
        border-radius: 6px; font-size: 14px; font-family: var(--paper-font-body_-_font-family, inherit);
        background: var(--card-background-color, var(--ha-card-background, #fff));
        color: var(--primary-text-color, #212121); outline: none; cursor: pointer;
        box-sizing: border-box;
      }
      select:focus { border-color: var(--primary-color, #03a9f4); }
      .summary { margin-top: 4px; padding: 10px 12px; background: var(--secondary-background-color, #f5f5f5);
        border-radius: 6px; font-size: 13px; line-height: 1.5; }
      .summary strong { font-weight: 600; }
      .summary .hint { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 4px; font-style: italic; }
    </style>
    <div class="editor">
      <div class="field-row">
        <div>
          <span class="field-label">${L("area")}</span>
          <select id="area-select">
            <option value="">— ${L("select_area")} —</option>
            ${areas.map(([id, a]) =>
              `<option value="${id}" ${id === currentId ? "selected" : ""}>${a.name}</option>`
            ).join("")}
          </select>

        </div>
      </div>
      <div class="summary">
        <div><strong>${L("name")}:</strong> <span id="preview-name">${c.name || "—"}</span></div>
        <div><strong>${L("prefix")}:</strong> <span id="preview-prefix">${prefix || "—"}</span></div>
        <div class="hint">${L("edit_code_hint")}</div>
      </div>
    </div>`;

    const select = root.getElementById("area-select");
    select.addEventListener("change", () => {
      const areaId = select.value;
      if (!areaId) return;
      const area = hass.areas[areaId];
      if (!area) return;
      const slug = this._slugify(area.name);
      this._config.name = area.name.toUpperCase();
      this._config.prefix = `ventilador_${slug}`;
      this._dispatch();
      root.getElementById("preview-name").textContent = area.name.toUpperCase();
      root.getElementById("preview-prefix").textContent = `ventilador_${slug}`;
    });
  }
}

customElements.define("fan-custom-card-editor", FanCustomCardEditor);
