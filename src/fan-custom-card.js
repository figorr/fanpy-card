import "./fan-custom-card-editor.js";
import { t } from "./translations.js";

const STYLE = `
  :host {
    --fc-gap: 12px;
    --fc-radius: 12px;
    --fc-transition: 0.15s ease;
  }
  .fan-card {
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border-radius: var(--fc-radius);
    padding: 16px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.08));
    border: 1px solid var(--ha-card-border-color, rgba(0,0,0,0.04));
    transition: box-shadow var(--fc-transition);
  }
  .fan-card:hover {
    box-shadow: var(--ha-card-box-shadow-hover, 0 4px 12px rgba(0,0,0,0.12));
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--divider-color, rgba(0,0,0,0.08));
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .fan-icon-wrap {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--disabled-text-color, #9e9e9e);
    transition: color 0.3s;
  }
  .fan-icon-wrap.on {
    color: var(--primary-color, #03a9f4);
  }
  @keyframes fc-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .fan-icon-wrap.spinning ha-icon {
    animation: fc-spin var(--fc-spin-duration, 1.5s) linear infinite;
  }
  .room-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    letter-spacing: 0.3px;
  }
  .power-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border: 2px solid var(--disabled-text-color, #bdbdbd);
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--paper-font-body_-_font-family, inherit);
    background: transparent;
    color: var(--disabled-text-color, #9e9e9e);
    transition: all var(--fc-transition);
    user-select: none;
  }
  .power-btn:hover {
    border-color: var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 6%, transparent);
  }
  .power-btn.on {
    border-color: var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
  }
  .power-btn.on:hover {
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 18%, transparent);
  }
  .toggle-track {
    width: 30px;
    height: 18px;
    border-radius: 10px;
    background: var(--disabled-text-color, #ccc);
    position: relative;
    flex-shrink: 0;
    transition: background var(--fc-transition);
  }
  .power-btn.on .toggle-track {
    background: var(--primary-color, #03a9f4);
  }
  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    transition: transform var(--fc-transition);
  }
  .power-btn.on .toggle-thumb {
    transform: translateX(12px);
  }
  .row-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--secondary-text-color, #727272);
    margin-bottom: 6px;
  }
  .btn-row {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
  }
  .btn-row:last-child {
    margin-bottom: 0;
  }
  .ctrl {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;
    min-width: 0;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    transition: all var(--fc-transition);
    font-family: var(--paper-font-body_-_font-family, inherit);
    font-size: 13px;
    font-weight: 600;
  }
  .ctrl:hover {
    background: var(--primary-color, #03a9f4);
    color: #fff;
  }
  .ctrl:active {
    transform: scale(0.94);
  }
  .ctrl ha-icon {
    --ha-icon-display: block;
    --mdc-icon-size: 20px;
    pointer-events: none;
  }
  .ctrl .lbl {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    opacity: 0.85;
    pointer-events: none;
  }
  .ctrl.luz-active {
    background: #ffd54f;
    color: #333;
  }
  .speed-grid {
    display: grid;
    grid-template-columns: repeat(var(--fc-speed-cols, 6), 1fr);
    gap: 4px;
    margin-bottom: 4px;
  }
  .speed-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    transition: all var(--fc-transition);
    font-family: var(--paper-font-body_-_font-family, inherit);
  }
  .speed-btn:hover {
    background: var(--primary-color, #03a9f4);
    color: #fff;
  }
  .speed-btn:active {
    transform: scale(0.92);
  }
  .speed-btn.active {
    background: var(--primary-color, #03a9f4);
    color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-color) 40%, transparent);
  }
  .fan-card.power-off .speed-btn.active {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #03a9f4) 50%, transparent);
    font-weight: 700;
  }
  .speed-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--secondary-text-color, #727272);
    padding: 0 2px;
  }
  .empty-state {
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
    font-size: 14px;
  }
`;

class FanCustomCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  static async getConfigElement() {
    await customElements.whenDefined("fan-custom-card-editor");
    return document.createElement("fan-custom-card-editor");
  }

  static getStubConfig() {
    return { name: "SALÓN", prefix: "ventilador_salon" };
  }

  setConfig(config) {
    if (!config) {
      this._config = {};
      this._render();
      return;
    }
    this._config = JSON.parse(JSON.stringify(config));
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _state(entity) {
    if (!this._hass) return null;
    const s = this._hass.states[entity];
    return s ? s.state : null;
  }

  _call(script) {
    if (!this._hass || !script) return;
    const name = script.replace(/^script\./, "");
    if (!this._hass.callService) return;
    this._hass.callService("script", name).catch((e) => {
      console.error("FanCustomCard: service call failed", script, e);
    });
  }

  _render() {
    const root = this.shadowRoot;
    const config = this._config;
    const hass = this._hass;

    if (!config) {
      root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_config")}</div>`;
      return;
    }
    if (!hass) {
      root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_hass")}</div>`;
      return;
    }

    if (config.mode === "direct") {
      if (!config.entity_fan) {
        root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_config")}</div>`;
        return;
      }
      root.innerHTML = `<style>${STYLE}</style>${this._directHTML()}`;
      this._bindDirect();
      return;
    }

    if (!config.prefix) {
      root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_config")}</div>`;
      return;
    }
    root.innerHTML = `<style>${STYLE}</style>${this._fanHTML()}`;
    this._bind();
  }

  _fanHTML() {
    const config = this._config;
    const p = config.prefix;
    const pow = this._state(`input_boolean.${p}_power`);
    const luz = this._state(`input_boolean.${p}_luz`);
    const velEntity = this._hass?.states?.[`input_select.${p}_velocidad`];
    const velOptions = velEntity?.attributes?.options;
    const vel = this._state(`input_select.${p}_velocidad`) || "0";
    const numVel = Array.isArray(velOptions) ? velOptions.length : 6;
    const isOn = pow === "on";
    const luzOn = luz === "on";
    const spd = Math.max(0.6, 2.5 - parseInt(vel || "0", 10) * (0.3 * 6 / numVel));
    const activeClass = (cur, expected) => (cur === String(expected) ? "active" : "");

    const hasLight = config.has_light !== false;
    const hasTemp = hasLight && config.has_light_temperature !== false;
    const hasInt = hasLight && config.has_light_intensity !== false;

    return `
      <div class="fan-card ${isOn ? "" : "power-off"}">
        <div class="header">
          <div class="header-left" data-more-info="power">
            <div class="fan-icon-wrap ${isOn ? "on spinning" : ""}" style="--fc-spin-duration: ${spd}s">
              <ha-icon icon="mdi:fan"></ha-icon>
            </div>
            <span class="room-name">${config.name || p}</span>
          </div>
          <button class="power-btn ${isOn ? "on" : "off"}" data-cmd="power">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>${isOn ? t(this._hass, "on") : t(this._hass, "off")}</span>
          </button>
        </div>

        ${hasLight ? `
          <div class="row-label" data-more-info="luz">${t(this._hass, "luz")}</div>
          <div class="btn-row">
            <button class="ctrl ${luzOn ? "luz-active" : ""}" data-cmd="luz">
              <ha-icon icon="mdi:lightbulb${luzOn ? "-outline" : ""}"></ha-icon>
              <span class="lbl">${t(this._hass, "luz")}</span>
            </button>
          </div>
        ` : ""}

        ${hasTemp ? `
          <div class="row-label">${t(this._hass, "temperatura")}</div>
          <div class="btn-row">
            <button class="ctrl" data-cmd="luz_fria">
              <ha-icon icon="mdi:snowflake"></ha-icon>
              <span class="lbl">${t(this._hass, "fria")}</span>
            </button>
            <button class="ctrl" data-cmd="luz_calida">
              <ha-icon icon="mdi:white-balance-sunny"></ha-icon>
              <span class="lbl">${t(this._hass, "calida")}</span>
            </button>
          </div>
        ` : ""}

        ${hasInt ? `
          <div class="row-label">${t(this._hass, "intensidad")}</div>
          <div class="btn-row">
            <button class="ctrl" data-cmd="intensidad_baja">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <button class="ctrl" data-cmd="intensidad_alta">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        ` : ""}

        <div class="row-label">${t(this._hass, "velocidad")}</div>
        <div class="speed-grid" style="--fc-speed-cols: ${numVel}">
          ${Array.from({ length: numVel }, (_, i) => i + 1).map((i) => `
            <button class="speed-btn ${activeClass(vel, i)}" data-cmd="vel" data-val="${i}">${i}</button>
          `).join("")}
        </div>
        <div class="speed-footer">
          <span>${t(this._hass, "velocidad")}: ${vel}/${numVel}</span>
        </div>
      </div>`;
  }

  _bind() {
    const root = this.shadowRoot;
    const card = root.querySelector(".fan-card");
    if (!card) return;

    const scriptFor = (key, fallback) => {
      return this._config[key] || `script.${this._config.prefix}_${fallback}`;
    };

    card.addEventListener("click", (e) => {
      const infoEl = e.target.closest("[data-more-info]");
      if (infoEl) {
        const p = this._config.prefix;
        const entityId = infoEl.dataset.moreInfo === "power"
          ? `binary_sensor.${p}_power`
          : `binary_sensor.${p}_luz`;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId },
          bubbles: true, composed: true,
        }));
        return;
      }

      const btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      const cmd = btn.dataset.cmd;
      const p = this._config.prefix;

      switch (cmd) {
        case "power": {
          const on = this._state(`input_boolean.${p}_power`) === "on";
          this._call(on ? scriptFor("power_off_script", "power_off") : scriptFor("power_on_script", "power_on"));
          break;
        }
        case "luz": {
          const on = this._state(`input_boolean.${p}_luz`) === "on";
          this._call(on ? scriptFor("luz_off_script", "luz_off") : scriptFor("luz_on_script", "luz_on"));
          break;
        }
        case "luz_fria":
          this._call(scriptFor("luz_fria_script", "luz_fria"));
          break;
        case "luz_calida":
          this._call(scriptFor("luz_calida_script", "luz_calida"));
          break;
        case "intensidad_baja":
          this._call(scriptFor("intensidad_baja_script", "intensidad_baja"));
          break;
        case "intensidad_alta":
          this._call(scriptFor("intensidad_alta_script", "intensidad_alta"));
          break;
        case "vel":
          this._call(scriptFor(`velocidad_${btn.dataset.val}_script`, `velocidad_${btn.dataset.val}`));
          break;
      }
    });
  }

  _slugify(text) {
    if (!text) return "";
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  _directHTML() {
    const config = this._config;
    const fanState = this._state(config.entity_fan);
    const lightState = this._state(config.entity_light);
    const fanOn = fanState === "on";
    const lightOn = lightState === "on";
    const hasLight = config.has_light !== false && config.entity_light;
    const hasTemp = hasLight && config.has_light_temperature !== false;
    const hasInt = hasLight && config.has_light_intensity !== false;
    const speedPrefix = config.prefix || (config.name ? `ventilador_${this._slugify(config.name)}` : null);
    const velEntity = speedPrefix ? this._hass?.states?.[`input_select.${speedPrefix}_velocidad`] : null;
    const velOptions = velEntity?.attributes?.options;
    const hasSpeed = !!velEntity;
    const vel = hasSpeed ? (this._state(`input_select.${speedPrefix}_velocidad`) || "0") : "0";
    const numVel = Array.isArray(velOptions) ? velOptions.length : 6;
    const activeClass = (cur, expected) => (cur === String(expected) ? "active" : "");
    const spd = Math.max(0.6, 2.5 - parseInt(vel || "0", 10) * (0.3 * 6 / numVel));

    return `
      <div class="fan-card ${fanOn ? "" : "power-off"}">
        <div class="header">
          <div class="header-left" data-more-info="power">
            <div class="fan-icon-wrap ${fanOn ? "on spinning" : ""}" style="--fc-spin-duration: ${spd}s">
              <ha-icon icon="mdi:fan"></ha-icon>
            </div>
            <span class="room-name">${config.name || config.entity_fan}</span>
          </div>
          <button class="power-btn ${fanOn ? "on" : "off"}" data-cmd="power">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>${fanOn ? t(this._hass, "on") : t(this._hass, "off")}</span>
          </button>
        </div>

        ${hasLight ? `
          <div class="row-label" data-more-info="luz">${t(this._hass, "luz")}</div>
          <div class="btn-row">
            <button class="ctrl ${lightOn ? "luz-active" : ""}" data-cmd="luz">
              <ha-icon icon="mdi:lightbulb${lightOn ? "-outline" : ""}"></ha-icon>
              <span class="lbl">${t(this._hass, "luz")}</span>
            </button>
          </div>
        ` : ""}

        ${hasTemp ? `
          <div class="row-label">${t(this._hass, "temperatura")}</div>
          <div class="btn-row">
            <button class="ctrl" data-cmd="luz_fria">
              <ha-icon icon="mdi:snowflake"></ha-icon>
              <span class="lbl">${t(this._hass, "fria")}</span>
            </button>
            <button class="ctrl" data-cmd="luz_calida">
              <ha-icon icon="mdi:white-balance-sunny"></ha-icon>
              <span class="lbl">${t(this._hass, "calida")}</span>
            </button>
          </div>
        ` : ""}

        ${hasInt ? `
          <div class="row-label">${t(this._hass, "intensidad")}</div>
          <div class="btn-row">
            <button class="ctrl" data-cmd="intensidad_baja">
              <ha-icon icon="mdi:minus"></ha-icon>
            </button>
            <button class="ctrl" data-cmd="intensidad_alta">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        ` : ""}

        ${hasSpeed ? `
          <div class="row-label">${t(this._hass, "velocidad")}</div>
          <div class="speed-grid" style="--fc-speed-cols: ${numVel}">
            ${Array.from({ length: numVel }, (_, i) => i + 1).map((i) => `
              <button class="speed-btn ${activeClass(vel, i)}" data-cmd="vel" data-val="${i}">${i}</button>
            `).join("")}
          </div>
          <div class="speed-footer">
            <span>${t(this._hass, "velocidad")}: ${vel}/${numVel}</span>
          </div>
        ` : ""}
      </div>`;
  }

  _bindDirect() {
    const root = this.shadowRoot;
    const card = root.querySelector(".fan-card");
    if (!card) return;
    const config = this._config;
    const speedPrefix = config.prefix || (config.name ? `ventilador_${this._slugify(config.name)}` : null);

    const scriptFor = (key, fallback) => {
      return config[key] || `script.${speedPrefix}_${fallback}`;
    };

    card.addEventListener("click", (e) => {
      const infoEl = e.target.closest("[data-more-info]");
      if (infoEl) {
        const entityId = infoEl.dataset.moreInfo === "power"
          ? config.entity_fan
          : config.entity_light;
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId },
          bubbles: true, composed: true,
        }));
        return;
      }

      const btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      const cmd = btn.dataset.cmd;

      switch (cmd) {
        case "power": {
          const on = this._state(config.entity_fan) === "on";
          this._hass.callService("switch", on ? "turn_off" : "turn_on", { entity_id: config.entity_fan });
          break;
        }
        case "luz": {
          const on = this._state(config.entity_light) === "on";
          this._hass.callService("light", on ? "turn_off" : "turn_on", { entity_id: config.entity_light });
          break;
        }
        case "luz_fria": {
          this._hass.callService("light", "turn_on", { entity_id: config.entity_light, color_temp: 153 });
          break;
        }
        case "luz_calida": {
          this._hass.callService("light", "turn_on", { entity_id: config.entity_light, color_temp: 500 });
          break;
        }
        case "intensidad_baja": {
          this._hass.callService("light", "turn_on", { entity_id: config.entity_light, brightness_step_pct: -25 });
          break;
        }
        case "intensidad_alta": {
          this._hass.callService("light", "turn_on", { entity_id: config.entity_light, brightness_step_pct: 25 });
          break;
        }
        case "vel": {
          this._call(scriptFor(`velocidad_${btn.dataset.val}_script`, `velocidad_${btn.dataset.val}`));
          break;
        }
      }
    });
  }
}

customElements.define("fan-custom-card", FanCustomCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "fan-custom-card",
  name: "Fan Custom Card",
  description: "Custom card to control ceiling fans with light and speed",
  preview: false,
});
