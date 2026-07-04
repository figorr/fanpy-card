import { t } from "./translations.js";

class FanpyCardEditor extends HTMLElement {
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

  _slugifyArea(area) {
    return area.name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  _detectFanpyConfigs(hass) {
    const areaFans = {}; // {slug: number[]}
    Object.keys(hass.states || {}).forEach(entityId => {
      const m = entityId.match(/^select\.fanpy_ventilador_(.+)_velocidad$/);
      if (!m) return;
      let raw = m[1];
      // fan number suffix convention: ventilador_{slug}_{N}
      const parts = raw.split('_');
      const last = parseInt(parts[parts.length - 1], 10);
      let slug, fanNum;
      if (!isNaN(last) && last >= 2 && last <= 5) {
        slug = parts.slice(0, -1).join('_');
        fanNum = last;
      } else {
        slug = raw;
        fanNum = 1;
      }
      if (!areaFans[slug]) areaFans[slug] = [];
      if (!areaFans[slug].includes(fanNum)) areaFans[slug].push(fanNum);
    });
    return areaFans;
  }

  _numTimers() {
    const c = this._config;
    const pp = c.prefix || `ventilador_${this._slugify(c.name || "")}`;
    const entityId = `select.fanpy_${pp}_num_timers`;
    const state = this._hass?.states?.[entityId]?.state;
    if (state !== undefined) return parseInt(state, 10) || 0;
    if (c.num_timers !== undefined) return parseInt(c.num_timers, 10) || 0;
    return 3;
  }

  _renderTimerRows(c, timerEntities) {
    const n = this._numTimers();
    if (n <= 0) return "";
    const defaultLabels = { 1: "1h", 2: "2h", 3: "4h" };
    return Array.from({ length: n }, (_, i) => {
      const num = i + 1;
      const entKey = `timer${num}_entity`;
      const labelKey = `timer${num}_label`;
      const defaultLabel = defaultLabels[num] || `${num}h`;
      return `<div style="display:flex;gap:6px;align-items:center;">
        <select id="timer${num}-entity" style="flex:1;padding:6px 8px;border:1px solid var(--divider-color,rgba(0,0,0,0.15));border-radius:6px;font-size:13px;font-family:var(--paper-font-body_-_font-family,inherit);background:var(--card-background-color,var(--ha-card-background,#fff));color:var(--primary-text-color,#212121);outline:none;box-sizing:border-box;cursor:pointer;">
          <option value="">— Timer ${num} —</option>
          ${timerEntities.map(e => {
            const friendly = this._hass?.states?.[e]?.attributes?.friendly_name || e;
            return `<option value="${e}" ${e === (c[entKey] || "") ? "selected" : ""}>${friendly}</option>`;
          }).join("")}
        </select>
        <input type="text" id="timer${num}-label" value="${c[labelKey] || defaultLabel}"
          style="width:80px;padding:6px 8px;border:1px solid var(--divider-color,rgba(0,0,0,0.15));border-radius:6px;font-size:13px;font-family:var(--paper-font-body_-_font-family,inherit);background:var(--card-background-color,var(--ha-card-background,#fff));color:var(--primary-text-color,#212121);outline:none;box-sizing:border-box;text-align:center;">
      </div>`;
    }).join("");
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

    const mode = c.mode || "fanpy_remote";
    const isHelpers = mode === "helpers";
    const isDirect = mode === "direct";
    const isFanpyRemote = mode === "fanpy_remote";
    const isFanpyDirect = mode === "fanpy_direct";
    const isFanpy = isFanpyRemote || isFanpyDirect;
    const isEntityMode = isDirect || isFanpyDirect;

    const areas = hass.areas ? Object.entries(hass.areas) : [];
    const prefix = c.prefix || "";
    const fanNum = c.fan_number || 1;

    // Build prefix mapping for area matching
    // prefix like "ventilador_salon" or "ventilador_bodega_2"
    const prefixMatch = prefix.match(/^ventilador_(.+?)(?:_(\d+))?$/);
    const prefixSlug = prefixMatch ? prefixMatch[1] : null;
    const prefixFan = prefixMatch && prefixMatch[2] ? parseInt(prefixMatch[2], 10) : 1;

    const currentArea = areas.find(([, a]) => {
      const slug = this._slugifyArea(a)
      return slug === prefixSlug || a.name === c.name;
    });
    const currentId = currentArea ? currentArea[0] : "";

    // Detect fanpy configurations for area filtering
    const fanpyConfigs = this._detectFanpyConfigs(hass);
    const fanpyAreas = areas.filter(([, a]) => fanpyConfigs[this._slugifyArea(a)]);
    const currentFanpyFans = (currentId && fanpyConfigs[this._slugifyArea(hass.areas[currentId])]) || [1];

    const hasLight = c.has_light !== false;
    const hasTemp = isEntityMode ? (c.has_light_temperature === true) : (c.has_light_temperature !== false);
    const hasInt = isEntityMode ? (c.has_light_intensity === true) : (c.has_light_intensity !== false);
    const hasRing = c.has_ring !== false;
    const fanEntities = Object.keys(hass.states || {}).filter(e => e.startsWith("switch.")).sort();
    const lightEntities = Object.keys(hass.states || {}).filter(e => e.startsWith("light.")).sort();
    const timerEntities = Object.keys(hass.states || {})
      .filter(e => e.startsWith("timer."))
      .filter(e => !prefix || e.includes(prefix))
      .sort();

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
            <option value="fanpy_remote" ${isFanpyRemote ? "selected" : ""}>${L("mode_fanpy_remote")}</option>
            <option value="fanpy_direct" ${isFanpyDirect ? "selected" : ""}>${L("mode_fanpy_direct")}</option>
            <option value="helpers" ${isHelpers ? "selected" : ""}>${L("mode_helpers")}</option>
            <option value="direct" ${isDirect ? "selected" : ""}>${L("mode_direct")}</option>
          </select>
        </div>
      </div>

      <div id="fanpy-fields" style="display:${isFanpy ? "" : "none"}">
        <div class="field-row">
          <div>
            <span class="field-label">${L("area")}</span>
            <select id="fanpy-area-select">
              <option value="">— ${L("select_area")} —</option>
              ${fanpyAreas.map(([id, a]) =>
                `<option value="${id}" ${id === currentId ? "selected" : ""}>${a.name}</option>`
              ).join("")}
            </select>
          </div>
          <div>
            <span class="field-label">${L("fan_number")}</span>
            <select id="fanpy-fan-number">
              ${currentFanpyFans.map(n =>
                `<option value="${n}" ${n === prefixFan ? "selected" : ""}>${n}</option>`
              ).join("")}
            </select>
          </div>
        </div>
      </div>

      <div id="helpers-fields" style="display:${isHelpers ? "" : "none"}">
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

      <div id="direct-fields" style="display:${isEntityMode ? "" : "none"}">
        ${isDirect ? `
        <div class="field-row">
          <div>
            <span class="field-label">${L("area")}</span>
            <select id="direct-name">
              <option value="">— ${L("select_area")} —</option>
              ${areas.map(([id, a]) =>
                `<option value="${a.name.toUpperCase()}" ${a.name.toUpperCase() === (c.name || "") ? "selected" : ""}>${a.name}</option>`
              ).join("")}
            </select>
          </div>
        </div>
        ` : ""}
        <div class="field-row">
          <div>
            <span class="field-label">${L("entity_fan")}</span>
            <select id="entity-fan">
              <option value="">— ${L("entity_fan")} —</option>
              ${fanEntities.map(e => {
                const friendly = hass.states?.[e]?.attributes?.friendly_name || e;
                return `<option value="${e}" ${e === (c.entity_fan || "") ? "selected" : ""}>${friendly}</option>`;
              }).join("")}
            </select>
          </div>
          <div>
            <span class="field-label">${L("entity_light")}</span>
            <select id="entity-light">
              <option value="">— ${L("entity_light")} —</option>
              ${lightEntities.map(e => {
                const friendly = hass.states?.[e]?.attributes?.friendly_name || e;
                return `<option value="${e}" ${e === (c.entity_light || "") ? "selected" : ""}>${friendly}</option>`;
              }).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="section-title">${L("basic")}</div>
      <div class="field-row">
        <div>
          <div class="toggle-row">
            <label class="toggle-switch">
              <input type="checkbox" id="tog-ring" ${hasRing ? "checked" : ""}>
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <label for="tog-ring">${L("has_ring")}</label>
          </div>

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

          <div class="toggle-row">
            <label class="toggle-switch">
              <input type="checkbox" id="tog-timer" ${c.has_timer !== false ? "checked" : ""} ${this._numTimers() === 0 ? "disabled" : ""}>
              <span class="toggle-track"></span>
              <span class="toggle-thumb"></span>
            </label>
            <label for="tog-timer" class="${this._numTimers() === 0 ? "disabled" : ""}">${L("has_timer")}</label>
          </div>
          <div id="timer-fields" style="display:${c.has_timer !== false ? "" : "none"};margin-left:24px;margin-top:4px;">
            <div id="timer-rows" style="display:flex;flex-direction:column;gap:6px;">
              ${this._renderTimerRows(c, timerEntities)}
            </div>
          </div>
      </div>

      <div class="summary">
        <div><strong>${L("name")}:</strong> <span id="preview-name">${c.name || "—"}</span></div>
        ${!isDirect ? `<div><strong>${L("prefix")}:</strong> <span id="preview-prefix">${prefix || "—"}</span></div>` : ""}
        ${isEntityMode ? `<div><strong>${L("entity_fan")}:</strong> <span>${c.entity_fan || "—"}</span></div>
        <div><strong>${L("entity_light")}:</strong> <span>${c.entity_light || "—"}</span></div>` : ""}
        <div class="hint">${L("edit_code_hint")}</div>
      </div>
    </div>`;

    const modeSelect = root.getElementById("mode-select");
    const fanpyFields = root.getElementById("fanpy-fields");
    const helpersFields = root.getElementById("helpers-fields");
    const directFields = root.getElementById("direct-fields");

    modeSelect.addEventListener("change", () => {
      const newMode = modeSelect.value;
      this._config.mode = newMode;
      if (newMode === "direct" || newMode === "fanpy_direct") {
        this._config.has_light_temperature = false;
        this._config.has_light_intensity = false;
        if (newMode === "direct") {
          delete this._config.name;
          delete this._config.prefix;
        }
        fanpyFields.style.display = newMode === "fanpy_direct" ? "" : "none";
        helpersFields.style.display = "none";
        directFields.style.display = "";
      } else if (newMode === "fanpy_remote") {
        delete this._config.entity_fan;
        delete this._config.entity_light;
        if (this._config.has_light_temperature === false) delete this._config.has_light_temperature;
        if (this._config.has_light_intensity === false) delete this._config.has_light_intensity;
        fanpyFields.style.display = "";
        helpersFields.style.display = "none";
        directFields.style.display = "none";
      } else {
        delete this._config.entity_fan;
        delete this._config.entity_light;
        delete this._config.name;
        delete this._config.prefix;
        if (this._config.has_light_temperature === false) delete this._config.has_light_temperature;
        if (this._config.has_light_intensity === false) delete this._config.has_light_intensity;
        fanpyFields.style.display = "none";
        helpersFields.style.display = "";
        directFields.style.display = "none";
      }
      this._dispatch();
      this._render();
    });

    const fanpyAreaSelect = root.getElementById("fanpy-area-select");
    const fanpyFanNumber = root.getElementById("fanpy-fan-number");

    const updateFanpyPrefix = () => {
      const areaId = fanpyAreaSelect?.value;
      if (!areaId) return;
      const area = hass.areas[areaId];
      if (!area) return;
      const slug = this._slugifyArea(area);
      const n = parseInt(fanpyFanNumber?.value || "1", 10);
      const newPrefix = n > 1 ? `ventilador_${slug}_${n}` : `ventilador_${slug}`;
      this._config.name = area.name.toUpperCase();
      this._config.prefix = newPrefix;
      this._config.fan_number = n;
      this._dispatch();
      const previewName = root.getElementById("preview-name");
      if (previewName) previewName.textContent = area.name.toUpperCase();
      const previewPrefix = root.getElementById("preview-prefix");
      if (previewPrefix) previewPrefix.textContent = newPrefix;
    };

    if (fanpyAreaSelect) {
      fanpyAreaSelect.addEventListener("change", updateFanpyPrefix);
    }
    if (fanpyFanNumber) {
      fanpyFanNumber.addEventListener("change", updateFanpyPrefix);
    }

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
        const slug = this._slugifyArea(area);
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
        const val = directName.value || "";
        this._config.name = val || undefined;
        if (val) {
          const slug = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
          this._config.prefix = `ventilador_${slug}`;
        } else {
          delete this._config.prefix;
        }
        this._dispatch();
        const previewName = root.getElementById("preview-name");
        if (previewName) previewName.textContent = val || "—";
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
    const cbRing = root.getElementById("tog-ring");

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

    const cbTimer = root.getElementById("tog-timer");
    const timerFields = root.getElementById("timer-fields");

    const saveTimerLabels = () => {
      const n = this._numTimers();
      const defaultLabels = { 1: "1h", 2: "2h", 3: "4h" };
      for (let i = 1; i <= n; i++) {
        const labelEl = root.getElementById(`timer${i}-label`);
        const entEl = root.getElementById(`timer${i}-entity`);
        const labelKey = `timer${i}_label`;
        const entKey = `timer${i}_entity`;
        const defaultLabel = defaultLabels[i] || `${i}h`;
        if (labelEl) {
          const v = labelEl.value.trim();
          if (v && v !== defaultLabel) this._config[labelKey] = v;
          else delete this._config[labelKey];
        }
        if (entEl) {
          const v = entEl.value.trim();
          if (v) this._config[entKey] = v;
          else delete this._config[entKey];
        }
      }
      // Clean up any stale keys beyond current count
      for (let i = n + 1; i <= 3; i++) {
        delete this._config[`timer${i}_label`];
        delete this._config[`timer${i}_entity`];
      }
      this._dispatch();
    };

    const saveToggles = () => {
      if (cbLight) this._config.has_light = cbLight.checked;
      if (cbTemp) this._config.has_light_temperature = cbLight.checked && cbTemp.checked;
      if (cbInt) this._config.has_light_intensity = cbLight.checked && cbInt.checked;
      if (cbRing) this._config.has_ring = cbRing.checked;
      if (cbTimer) {
        this._config.has_timer = cbTimer.checked;
        if (timerFields) timerFields.style.display = cbTimer.checked ? "" : "none";
      }
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
    if (cbRing) cbRing.addEventListener("change", saveToggles);
    if (cbTimer) cbTimer.addEventListener("change", saveToggles);
    const n = this._numTimers();
    for (let i = 1; i <= n; i++) {
      const l = root.getElementById(`timer${i}-label`);
      const e = root.getElementById(`timer${i}-entity`);
      if (l) l.addEventListener("change", saveTimerLabels);
      if (e) e.addEventListener("change", saveTimerLabels);
    }
  }
}

customElements.define("fanpy-card-editor", FanpyCardEditor);
