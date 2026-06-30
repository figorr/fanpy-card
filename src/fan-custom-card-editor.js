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

    const mode = c.mode || "helpers";
    const isDirect = mode === "direct";

    const areas = hass.areas ? Object.entries(hass.areas) : [];
    const prefix = c.prefix || "";
    const currentArea = areas.find(([, a]) =>
      `ventilador_${this._slugify(a.name)}` === prefix || a.name === c.name
    );
    const currentId = currentArea ? currentArea[0] : "";

    const hasLight = isDirect ? (c.has_light !== false) : (c.has_light !== false);
    const hasTemp = isDirect ? (c.has_light_temperature === true) : (c.has_light_temperature !== false);
    const hasInt = isDirect ? (c.has_light_intensity === true) : (c.has_light_intensity !== false);
    const fanEntities = Object.keys(hass.states || {}).filter(e => e.startsWith("switch.")).sort();
    const lightEntities = Object.keys(hass.states || {}).filter(e => e.startsWith("light.")).sort();

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
      .toggle-row { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
      .toggle-row + .toggle-row { margin-top: 2px; }
      .toggle-row.indent { margin-left: 24px; }
      .toggle-row label { font-size: 13px; cursor: pointer; user-select: none; color: var(--primary-text-color, #212121); }
      .toggle-row label.disabled { opacity: 0.35; cursor: not-allowed; }
      .toggle-switch {
        position: relative; width: 36px; height: 20px; flex-shrink: 0; cursor: pointer;
      }
      .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
      .toggle-track {
        width: 100%; height: 100%; border-radius: 10px;
        background: var(--disabled-text-color, #ccc); transition: background 0.15s; display: block;
      }
      .toggle-switch input:checked + .toggle-track { background: var(--primary-color, #03a9f4); }
      .toggle-thumb {
        position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%;
        background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: transform 0.15s; pointer-events: none;
      }
      .toggle-switch input:checked ~ .toggle-thumb { transform: translateX(16px); }
      .section-title {
        font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
        color: var(--secondary-text-color, #727272); margin: 8px 0 4px;
      }
      .summary { margin-top: 4px; padding: 10px 12px; background: var(--secondary-background-color, #f5f5f5);
        border-radius: 6px; font-size: 13px; line-height: 1.5; }
      .summary strong { font-weight: 600; }
      .summary .hint { font-size: 11px; color: var(--secondary-text-color, #727272); margin-top: 4px; font-style: italic; }
    </style>
    <div class="editor">

      <div class="field-row">
        <div>
          <span class="field-label">${L("mode")}</span>
          <select id="mode-select">
            <option value="helpers" ${!isDirect ? "selected" : ""}>${L("mode_helpers")}</option>
            <option value="direct" ${isDirect ? "selected" : ""}>${L("mode_direct")}</option>
          </select>
        </div>
      </div>

      <div id="helpers-fields" style="display:${isDirect ? "none" : ""}">
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
      </div>

      <div id="direct-fields" style="display:${isDirect ? "" : "none"}">
        <div class="field-row">
          <div>
            <span class="field-label">${L("name")}</span>
            <select id="direct-name">
              <option value="">— ${L("name")} —</option>
              ${areas.map(([id, a]) =>
                `<option value="${a.name.toUpperCase()}" ${a.name.toUpperCase() === (c.name || "") ? "selected" : ""}>${a.name}</option>`
              ).join("")}
            </select>
          </div>
        </div>
        <div class="field-row">
          <div>
            <span class="field-label">${L("entity_fan")}</span>
            <select id="entity-fan">
              <option value="">— ${L("entity_fan")} —</option>
              ${fanEntities.map(e =>
                `<option value="${e}" ${e === (c.entity_fan || "") ? "selected" : ""}>${e}</option>`
              ).join("")}
            </select>
          </div>
          <div>
            <span class="field-label">${L("entity_light")}</span>
            <select id="entity-light">
              <option value="">— ${L("entity_light")} —</option>
              ${lightEntities.map(e =>
                `<option value="${e}" ${e === (c.entity_light || "") ? "selected" : ""}>${e}</option>`
              ).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="section-title">${L("basic")}</div>
      <div class="field-row">
        <div>
          <div class="toggle-row">
            <label class="toggle-switch">
              <input type="checkbox" id="tog-light" ${hasLight ? "checked" : ""}>
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <label for="tog-light">${L("has_light")}</label>
          </div>

          <div class="toggle-row indent">
            <label class="toggle-switch">
              <input type="checkbox" id="tog-temp" ${hasTemp && hasLight ? "checked" : ""} ${!hasLight ? "disabled" : ""}>
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <label for="tog-temp" class="${!hasLight ? "disabled" : ""}">${L("has_light_temperature")}</label>
          </div>

          <div class="toggle-row indent">
            <label class="toggle-switch">
              <input type="checkbox" id="tog-int" ${hasInt && hasLight ? "checked" : ""} ${!hasLight ? "disabled" : ""}>
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <label for="tog-int" class="${!hasLight ? "disabled" : ""}">${L("has_light_intensity")}</label>
        </div>
      </div>

      <div class="summary">
        <div><strong>${L("name")}:</strong> <span id="preview-name">${c.name || "—"}</span></div>
        ${!isDirect ? `<div><strong>${L("prefix")}:</strong> <span id="preview-prefix">${prefix || "—"}</span></div>` : ""}
        ${isDirect ? `<div><strong>${L("entity_fan")}:</strong> <span>${c.entity_fan || "—"}</span></div>
        <div><strong>${L("entity_light")}:</strong> <span>${c.entity_light || "—"}</span></div>` : ""}
        <div class="hint">${L("edit_code_hint")}</div>
      </div>
    </div>`;

    const modeSelect = root.getElementById("mode-select");
    const helpersFields = root.getElementById("helpers-fields");
    const directFields = root.getElementById("direct-fields");

    modeSelect.addEventListener("change", () => {
      const newMode = modeSelect.value;
      if (newMode === "direct") {
        this._config.mode = "direct";
        this._config.has_light_temperature = false;
        this._config.has_light_intensity = false;
        helpersFields.style.display = "none";
        directFields.style.display = "";
      } else {
        this._config.mode = "helpers";
        delete this._config.entity_fan;
        delete this._config.entity_light;
        if (this._config.has_light_temperature === false) delete this._config.has_light_temperature;
        if (this._config.has_light_intensity === false) delete this._config.has_light_intensity;
        helpersFields.style.display = "";
        directFields.style.display = "none";
      }
      this._dispatch();
      this._render();
    });

    const areaSelect = root.getElementById("area-select");
    const directName = root.getElementById("direct-name");
    const entityFan = root.getElementById("entity-fan");
    const entityLight = root.getElementById("entity-light");

    if (areaSelect) {
      areaSelect.addEventListener("change", () => {
        const areaId = areaSelect.value;
        if (!areaId) return;
        const area = hass.areas[areaId];
        if (!area) return;
        const slug = this._slugify(area.name);
        this._config.name = area.name.toUpperCase();
        this._config.prefix = `ventilador_${slug}`;
        this._dispatch();
        const previewName = root.getElementById("preview-name");
        if (previewName) previewName.textContent = area.name.toUpperCase();
        const previewPrefix = root.getElementById("preview-prefix");
        if (previewPrefix) previewPrefix.textContent = `ventilador_${slug}`;
      });
    }

    if (directName) {
      directName.addEventListener("change", () => {
        this._config.name = directName.value || undefined;
        this._dispatch();
        const previewName = root.getElementById("preview-name");
        if (previewName) previewName.textContent = directName.value || "—";
      });
    }

    if (entityFan) {
      entityFan.addEventListener("change", () => {
        this._config.entity_fan = entityFan.value || undefined;
        this._dispatch();
      });
    }
    if (entityLight) {
      entityLight.addEventListener("change", () => {
        this._config.entity_light = entityLight.value || undefined;
        this._dispatch();
      });
    }

    const cbLight = root.getElementById("tog-light");
    const cbTemp = root.getElementById("tog-temp");
    const cbInt = root.getElementById("tog-int");

    const toggleLabel = (cb) => {
      if (!cb) return;
      const label = root.querySelector(`label[for="${cb.id}"]`);
      if (!label) return;
      label.classList.toggle("disabled", cb.disabled);
    };

    const syncSubToggles = () => {
      const enabled = cbLight && cbLight.checked;
      if (cbTemp) {
        cbTemp.disabled = !enabled;
        if (!enabled) cbTemp.checked = false;
        toggleLabel(cbTemp);
      }
      if (cbInt) {
        cbInt.disabled = !enabled;
        if (!enabled) cbInt.checked = false;
        toggleLabel(cbInt);
      }
    };

    const saveToggles = () => {
      if (cbLight) this._config.has_light = cbLight.checked;
      if (cbTemp) this._config.has_light_temperature = cbLight.checked && cbTemp.checked;
      if (cbInt) this._config.has_light_intensity = cbLight.checked && cbInt.checked;
      this._dispatch();
      const previewName = root.getElementById("preview-name");
      if (previewName) previewName.textContent = this._config.name || "—";
    };

    if (cbLight) {
      cbLight.addEventListener("change", () => {
        syncSubToggles();
        saveToggles();
      });
    }
    if (cbTemp) cbTemp.addEventListener("change", saveToggles);
    if (cbInt) cbInt.addEventListener("change", saveToggles);
  }
}

customElements.define("fan-custom-card-editor", FanCustomCardEditor);
