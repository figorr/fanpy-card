import "./fanpy-card-editor.js";
import { t } from "./translations.js";

const STYLE = `
  :host {
    --fc-gap: 12px;
    --fc-radius: 16px;
    --fc-transition: 0.2s ease;
  }
  .fan-card {
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border-radius: var(--fc-radius);
    padding: 20px;
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
    margin-bottom: 8px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .header-left ha-icon {
    --mdc-icon-size: 28px;
    color: var(--disabled-text-color, #9e9e9e);
    transition: color 0.3s;
  }
  .fan-card:not(.power-off) .header-left ha-icon {
    color: var(--primary-color, #03a9f4);
  }
  .room-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
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
  .ring-section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 2px 0 4px;
    padding: 4px 0;
  }
  .speed-ring {
    width: 100%;
    max-width: 260px;
    aspect-ratio: 1;
    cursor: pointer;
    touch-action: none;
  }
  .speed-ring svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .speed-ring .arc-bg {
    stroke: var(--secondary-background-color, #f5f5f5);
    stroke-linecap: round;
    opacity: 0.45;
  }
  .speed-ring .arc-active {
    stroke: var(--primary-color, #03a9f4);
    stroke-linecap: butt;
    transition: stroke-width var(--fc-transition);
  }
  .speed-ring .arc-active.arc-idle {
    stroke: var(--disabled-text-color, #9e9e9e);
    opacity: 0.2;
  }
  .speed-ring .arc-dot {
    fill: #fff;
    stroke: var(--primary-color, #03a9f4);
    stroke-width: 2.5;
  }
  .speed-ring .arc-dot.arc-idle {
    fill: var(--disabled-text-color, #9e9e9e);
    stroke: var(--disabled-text-color, #9e9e9e);
    opacity: 0.25;
  }
  .speed-ring .center-blades {
    transform-origin: 50% 50%;
  }
  .speed-ring .center-blades.spin {
    animation: fc-spin-ring var(--fc-spin-duration, 1.5s) linear infinite;
  }
  @keyframes fc-spin-ring {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .speed-ring .speed-num {
    font-size: 30px;
    font-weight: 700;
    fill: var(--primary-color, #03a9f4);
    text-anchor: middle;
    dominant-baseline: central;
  }
  .speed-ring .speed-num.off {
    fill: var(--secondary-text-color, #727272);
  }
  .speed-ring .speed-label-ring {
    font-size: 8px;
    font-weight: 600;
    fill: var(--secondary-text-color, #727272);
    text-anchor: middle;
    dominant-baseline: central;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .speed-status {
    text-align: center;
    font-size: 11px;
    font-weight: 500;
    color: var(--secondary-text-color, #727272);
    margin-top: -10px;
    letter-spacing: 0.3px;
  }
  .speed-status .on {
    color: var(--primary-color, #03a9f4);
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
  .ctrl.speed-selected.speed-active {
    background: var(--primary-color, #03a9f4);
    color: #fff;
  }
  .power-off .ctrl.speed-selected {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    box-shadow: inset 0 0 0 2px var(--primary-color, #03a9f4);
  }
  .ctrl.luz-active {
    background: #ffd54f;
    color: #333;
  }
  .light-section {
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px solid var(--divider-color, rgba(0,0,0,0.06));
  }
  .timer-row {
    display: flex;
    gap: 6px;
  }
  .timer-btn {
    flex: 1;
    padding: 7px 0;
    border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--paper-font-body_-_font-family, inherit);
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color, #212121);
    transition: all var(--fc-transition);
    text-align: center;
  }
  .timer-btn:hover {
    border-color: var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 6%, transparent);
  }
  .timer-btn.luz-active {
    background: var(--primary-color, #03a9f4);
    color: #fff;
    border-color: var(--primary-color, #03a9f4);
  }
  .timer-btn:active {
    transform: scale(0.94);
  }
  .power-off .timer-btn {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }
  .timer-section {
    margin-top: 6px;
    padding-top: 10px;
    border-top: 1px solid var(--divider-color, rgba(0,0,0,0.06));
  }
  .section-divider {
    height: 1px;
    background: var(--divider-color, rgba(0,0,0,0.06));
    margin: 6px 0 10px;
  }
  .empty-state {
    padding: 32px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
    font-size: 14px;
  }
`;

// Blades are inside _buildRingSVG

class FanpyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._timerCancelPending = new Set();
  }

  static async getConfigElement() {
    await customElements.whenDefined("fanpy-card-editor");
    return document.createElement("fanpy-card-editor");
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
    const prevHass = this._hass;
    this._hass = hass;
    if (prevHass) {
      const n = this._numTimers();
      for (let i = 1; i <= n; i++) {
        const e = this._timerEntity(i);
        const ps = prevHass.states?.[e]?.state;
        const cs = hass.states?.[e]?.state;
        if (ps === "active" && cs === "idle") {
          if (this._timerCancelPending.has(e)) {
            this._timerCancelPending.delete(e);
          } else {
            this._autoPowerOff();
          }
        }
      }
    }
    this._render();
  }

  _state(entity) {
    if (!this._hass || !entity) return null;
    const s = this._hass.states[entity];
    return s ? s.state : null;
  }

  _call(script) {
    if (!this._hass || !script) return Promise.reject(new Error("no hass or script"));
    const name = script.replace(/^script\./, "");
    if (!this._hass.callService) return Promise.reject(new Error("no callService"));
    if (!this._hass.states[script]) return Promise.reject(new Error(`script not found: ${script}`));
    return this._hass.callService("script", name).catch((e) => {
      console.error("FanCustomCard: service call failed", script, e);
    });
  }

  _callService(domain, service, data) {
    if (!this._hass) return Promise.reject(new Error("no hass"));
    if (data && data.entity_id && !this._hass.states[data.entity_id]) {
      return Promise.reject(new Error(`entity not found: ${data.entity_id}`));
    }
    return this._hass.callService(domain, service, data).catch((e) => {
      console.error("FanCustomCard: service call failed", `${domain}.${service}`, e);
    });
  }

  _mode() {
    return this._config.mode || "fanpy_remote";
  }

  _numTimers() {
    const config = this._config;
    const pp = config.prefix || `ventilador_${this._slugify(config.name)}`;
    const entityId = `select.fanpy_${pp}_num_timers`;
    const state = this._hass?.states?.[entityId]?.state;
    if (state !== undefined) return parseInt(state, 10) || 0;
    if (config.num_timers !== undefined) return parseInt(config.num_timers, 10) || 0;
    return 3;
  }

  _mapEntity(type) {
    const mode = this._mode();
    const p = this._config.prefix;
    const speedPrefix = p || (this._config.name ? `ventilador_${this._slugify(this._config.name)}` : null);
    const isFanpy = mode.startsWith("fanpy");
    const isDirect = mode === "direct" || mode === "fanpy_direct";

    switch (type) {
      case "power_state":
        if (isDirect) return this._config.entity_fan;
        return isFanpy ? `switch.fanpy_${p}_power` : `input_boolean.${p}_power`;
      case "light_state":
        if (isDirect) return this._config.entity_light;
        return isFanpy ? `switch.fanpy_${p}_luz` : `input_boolean.${p}_luz`;
      case "speed_state":
        if (isFanpy) return `select.fanpy_${speedPrefix}_velocidad`;
        return `input_select.${speedPrefix}_velocidad`;
      case "power_moreinfo":
        if (isDirect) return this._config.entity_fan;
        return isFanpy ? `binary_sensor.fanpy_${p}_power` : `binary_sensor.${p}_power`;
      case "light_moreinfo":
        if (isDirect) return this._config.entity_light;
        return isFanpy ? `binary_sensor.fanpy_${p}_luz` : `binary_sensor.${p}_luz`;
    }
    return null;
  }

  _execute(cmd, data) {
    const mode = this._mode();
    const isDirect = mode === "direct" || mode === "fanpy_direct";
    const config = this._config;
    let p;

    const scriptFor = (key, fallback) => {
      return config[key] || `script.${config.prefix || `ventilador_${this._slugify(config.name)}`}_${fallback}`;
    };

    switch (cmd) {
      case "power": {
        const on = isDirect
          ? this._state(config.entity_fan) === "on"
          : this._state(this._mapEntity("power_state")) === "on";
        if (isDirect) {
          p = this._callService("switch", on ? "turn_off" : "turn_on", { entity_id: config.entity_fan });
        } else {
          p = this._call(on ? scriptFor("power_off_script", "power_off") : scriptFor("power_on_script", "power_on"));
        }
        if (on && config.has_timer !== false) {
          for (let i = 1; i <= 3; i++) {
            const te = this._timerEntity(i);
            if (this._hass?.states?.[te]?.state === "active") {
              this._timerCancelPending.add(te);
              this._callService("timer", "cancel", { entity_id: te });
            }
          }
        }
        break;
      }
      case "luz": {
        if (isDirect) {
          const on = this._state(config.entity_light) === "on";
          p = this._callService("light", on ? "turn_off" : "turn_on", { entity_id: config.entity_light });
        } else {
          const on = this._state(this._mapEntity("light_state")) === "on";
          p = this._call(on ? scriptFor("luz_off_script", "luz_off") : scriptFor("luz_on_script", "luz_on"));
        }
        break;
      }
      case "luz_fria":
        p = isDirect
          ? this._callService("light", "turn_on", { entity_id: config.entity_light, color_temp: 153 })
          : this._call(scriptFor("luz_fria_script", "luz_fria"));
        break;
      case "luz_calida":
        p = isDirect
          ? this._callService("light", "turn_on", { entity_id: config.entity_light, color_temp: 500 })
          : this._call(scriptFor("luz_calida_script", "luz_calida"));
        break;
      case "intensidad_baja":
        p = isDirect
          ? this._callService("light", "turn_on", { entity_id: config.entity_light, brightness_step_pct: -25 })
          : this._call(scriptFor("intensidad_baja_script", "intensidad_baja"));
        break;
      case "intensidad_alta":
        p = isDirect
          ? this._callService("light", "turn_on", { entity_id: config.entity_light, brightness_step_pct: 25 })
          : this._call(scriptFor("intensidad_alta_script", "intensidad_alta"));
        break;
      case "vel":
        p = this._call(scriptFor(`velocidad_${data}_script`, `velocidad_${data}`));
        break;
      case "timer": {
        const pow = this._state(this._mapEntity("power_state"));
        if (pow !== "on") return;
        const te = this._timerEntity(data);
        if (this._timerRunning(data)) {
          this._timerCancelPending.add(te);
          this._callService("timer", "cancel", { entity_id: te });
          return;
        }
        for (let i = 1; i <= 3; i++) {
          if (i !== parseInt(data) && this._timerRunning(i)) {
            const ot = this._timerEntity(i);
            this._timerCancelPending.add(ot);
            this._callService("timer", "cancel", { entity_id: ot });
          }
        }
        p = this._callService("timer", "start", { entity_id: te });
        break;
      }
    }
    return p;
  }

  _timerEntity(timerNum) {
    return this._config[`timer${timerNum}_entity`] || `timer.timer_${this._config.prefix || `ventilador_${this._slugify(this._config.name)}`}_${timerNum}`;
  }

  _timerRunning(timerNum) {
    const entity = this._timerEntity(timerNum);
    return this._hass?.states?.[entity]?.state === "active";
  }

  _autoPowerOff() {
    const config = this._config;
    const mode = this._mode();
    if (mode === "direct" || mode === "fanpy_direct") {
      this._callService("switch", "turn_off", { entity_id: config.entity_fan });
    } else {
      const s = (key, fallback) => config[key] || `script.${config.prefix || `ventilador_${this._slugify(config.name)}`}_${fallback}`;
      this._call(s("power_off_script", "power_off"));
    }
  }

  _getActiveSpeed() {
    const vel = this._state(this._mapEntity("speed_state"));
    return vel ? parseInt(vel, 10) || null : null;
  }

  _slugify(text) {
    if (!text) return "";
    return text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  _buildRingSVG(numVel, activeVel, isOn) {
    const CX = 160, CY = 160, R = 145, SW = 24;
    const MAX = 270, ROT = 135;
    const toRad = (d) => d * Math.PI / 180;

    const arc = (cx, cy, r, s, e) => {
      const sr = toRad(s), er = toRad(e);
      const sx = cx + r * Math.cos(sr), sy = cy + r * Math.sin(sr);
      const ex = cx + r * Math.cos(er), ey = cy + r * Math.sin(er);
      const la = Math.abs(e - s) > 180 ? 1 : 0;
      return `M ${sx} ${sy} A ${r} ${r} 0 ${la} 1 ${ex} ${ey}`;
    };

    const bgArc = arc(0, 0, R, 0, MAX);
    let prop = 0;
    if (isOn) {
      if (numVel > 1) {
        prop = Math.max(0, Math.min(1, (activeVel - 1) / (numVel - 1)));
      } else {
        prop = 1;
      }
    }
    const actDeg = prop * MAX;
    const actArc = actDeg > 0 ? arc(0, 0, R, 0, actDeg) : "";

    const dRad = toRad(ROT + actDeg);
    const dx = CX + R * Math.cos(dRad);
    const dy = CY + R * Math.sin(dRad);

    const spinDur = numVel <= 1 ? 1.3 : Math.max(0.6, 2.5 - activeVel * (0.3 * 6 / numVel));
    const blade = "M160,66 C182,66 192,108 186,138 C180,162 160,182 160,182 C160,182 140,162 134,138 C128,108 138,66 160,66 Z";
    const dotR = SW / 2 - 2;
    const showText = numVel > 1;

    return `<svg viewBox="0 0 320 320">
      <defs>
        <linearGradient id="fc-blade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2196f3"/>
          <stop offset="100%" stop-color="#00bcd4"/>
        </linearGradient>
      </defs>
      <g transform="translate(${CX} ${CY}) rotate(${ROT})">
        <path d="${bgArc}" class="arc-bg" stroke-width="${SW}" fill="none"/>
        <path d="${actArc || "M 0 0"}" class="arc-active${isOn ? "" : " arc-idle"}" stroke-width="${SW}" fill="none"/>
      </g>
      <circle cx="${dx}" cy="${dy}" r="${dotR}" class="arc-dot${isOn ? "" : " arc-idle"}"/>
      <g class="center-blades${isOn ? " spin" : ""}" style="--fc-spin-duration: ${spinDur}s">
        <path d="${blade}" fill="url(#fc-blade)" opacity="${isOn ? "0.7" : "0.2"}"/>
        <path d="${blade}" fill="url(#fc-blade)" opacity="${isOn ? "0.7" : "0.2"}" transform="rotate(120 160 160)"/>
        <path d="${blade}" fill="url(#fc-blade)" opacity="${isOn ? "0.7" : "0.2"}" transform="rotate(240 160 160)"/>
        <circle cx="160" cy="160" r="6" fill="#0d47a1" opacity="${isOn ? "1" : "0.3"}"/>
        <circle cx="160" cy="160" r="8" fill="none" stroke="#fff" stroke-width="1.5" opacity="${isOn ? "0.7" : "0.2"}"/>
      </g>
      ${showText ? `
      <text x="160" y="250" class="speed-num${isOn ? "" : " off"}">${activeVel}</text>
      <text x="160" y="268" class="speed-label-ring">${t(this._hass, "velocidad")}</text>
      ` : ""}
    </svg>`;
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

    const mode = this._mode();
    const isDirect = mode === "direct" || mode === "fanpy_direct";

    if (isDirect && !config.entity_fan) {
      root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_config")}</div>`;
      return;
    }

    if (!isDirect && !config.prefix) {
      root.innerHTML = `<style>${STYLE}</style><div class="empty-state">${t(hass, "no_config")}</div>`;
      return;
    }

    root.innerHTML = `<style>${STYLE}</style>${this._fanHTML()}`;
    this._bind();
  }

  _fanHTML() {
    const config = this._config;
    const p = config.prefix || `ventilador_${this._slugify(config.name)}`;

    const pow = this._state(this._mapEntity("power_state"));
    const luz = this._state(this._mapEntity("light_state"));
    const isOn = pow === "on";
    const luzOn = luz === "on";

    const velEntity = this._hass?.states?.[this._mapEntity("speed_state")];
    const velOptions = velEntity?.attributes?.options;
    const vel = this._state(this._mapEntity("speed_state")) || "0";
    const activeVel = parseInt(vel, 10);
    const numVel = Array.isArray(velOptions) ? velOptions.length : 6;
    const showSpeed = numVel > 1;

    const hasLight = config.has_light !== false;
    const hasTemp = hasLight && config.has_light_temperature !== false;
    const hasInt = hasLight && config.has_light_intensity !== false;
    const hasRing = config.has_ring !== false;
    const hasTimer = config.has_timer !== false;
    const numTimers = this._numTimers();

    return `
      <div class="fan-card ${isOn ? "" : "power-off"}">
        <div class="header">
          <div class="header-left" data-more-info="power">
            <ha-icon icon="mdi:fan"></ha-icon>
            <span class="room-name">${config.name || p}</span>
          </div>
          <button class="power-btn ${isOn ? "on" : "off"}" data-cmd="power">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>${isOn ? t(this._hass, "on") : t(this._hass, "off")}</span>
          </button>
        </div>

        ${hasRing ? `
        <div class="ring-section">
          <div class="speed-ring" data-cmd="ring">
            ${this._buildRingSVG(numVel, Math.max(1, Math.min(activeVel || 1, numVel)), isOn)}
          </div>
          <div class="speed-status">${isOn ? (showSpeed ? `${t(this._hass, "velocidad")} <span class="on">${vel}/${numVel}</span>` : `<span class="on">${t(this._hass, "on")}</span>`) : t(this._hass, "off")}</div>
        </div>
        ` : ""}
        ${showSpeed ? `
        <div class="section-divider"></div>
        <div class="row-label">${t(this._hass, "velocidad")}</div>
        <div class="btn-row">
          ${Array.from({ length: numVel }, (_, i) => {
            const n = i + 1;
            const sel = activeVel === n;
            return `<button class="ctrl${sel ? " speed-selected" : ""}${sel && isOn ? " speed-active" : ""}" data-cmd="vel" data-val="${n}">
              <span class="lbl">${n}</span>
            </button>`;
          }).join("")}
        </div>
        ` : ""}

        ${hasLight ? `
        <div class="light-section">
          <div class="row-label" data-more-info="luz">${t(this._hass, "luz")}</div>
          <div class="btn-row">
            <button class="ctrl ${luzOn ? "luz-active" : ""}" data-cmd="luz">
              <ha-icon icon="mdi:lightbulb${luzOn ? "-outline" : ""}"></ha-icon>
              <span class="lbl">${t(this._hass, "luz")}</span>
            </button>
          </div>

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
        </div>
        ` : ""}

        ${hasTimer && numTimers > 0 ? `
        <div class="timer-section">
          <div class="row-label">${t(this._hass, "timer")}</div>
          <div class="timer-row">
            ${Array.from({ length: numTimers }, (_, i) => {
              const n = i + 1;
              const defaultLabels = { 1: "1h", 2: "2h", 3: "4h" };
              return `<button class="timer-btn${this._timerRunning(n) ? " luz-active" : ""}" data-cmd="timer" data-val="${n}">${config[`timer${n}_label`] || defaultLabels[n] || `${n}h`}</button>`;
            }).join("")}
          </div>
        </div>
        ` : ""}
      </div>`;
  }

  _bind() {
    const root = this.shadowRoot;
    const card = root.querySelector(".fan-card");
    if (!card) return;

    for (const el of root.querySelectorAll("[data-cmd=ring]")) {
      this._initRingDrag(el);
    }

    card.addEventListener("click", (e) => {
      const infoEl = e.target.closest("[data-more-info]");
      if (infoEl) {
        const entityId = infoEl.dataset.moreInfo === "power"
          ? this._mapEntity("power_moreinfo")
          : this._mapEntity("light_moreinfo");
        if (entityId) {
          this.dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId },
            bubbles: true, composed: true,
          }));
        }
        return;
      }

      const btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.val;

      if (cmd === "ring") return;
      if (cmd === "vel") { this._execute("vel", val); return; }

      this._execute(cmd, val);
    });
  }

  _initRingDrag(ring) {
    const velEntity = this._hass?.states?.[this._mapEntity("speed_state")];
    const velOptions = velEntity?.attributes?.options;
    const nv = Array.isArray(velOptions) ? velOptions.length : 6;
    if (nv <= 1) return;

    const toRad = (d) => d * Math.PI / 180;

    const arc = (cx, cy, r, s, e) => {
      const sr = toRad(s), er = toRad(e);
      return `M ${cx + r * Math.cos(sr)} ${cy + r * Math.sin(sr)} A ${r} ${r} 0 ${Math.abs(e - s) > 180 ? 1 : 0} 1 ${cx + r * Math.cos(er)} ${cy + r * Math.sin(er)}`;
    };

    const getSpeed = (clientX, clientY) => {
      const rect = ring.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = rect.width / 2;
      if (dist < maxR * 0.7 || dist > maxR) return -1;
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      angle -= 135;
      if (angle < 0) angle += 360;
      angle = Math.min(270, Math.max(0, angle));
      const seg = Math.round(angle / 270 * (nv - 1)) + 1;
      return Math.max(1, Math.min(nv, seg));
    };

    const updateRing = (targetVel) => {
      const svg = ring.querySelector("svg");
      if (!svg) return;
      const activeArc = svg.querySelector(".arc-active");
      const dot = svg.querySelector(".arc-dot");
      const numEl = svg.querySelector(".speed-num");
      if (!activeArc && !dot && !numEl) return;

      const velEntity = this._hass?.states?.[this._mapEntity("speed_state")];
      const velOptions = velEntity?.attributes?.options;
      const nv = Array.isArray(velOptions) ? velOptions.length : 6;

      const prop = Math.max(0, Math.min(1, (targetVel - 1) / (nv - 1)));
      const actDeg = prop * 270;

      if (activeArc) {
        const p = actDeg > 0 ? arc(0, 0, 145, 0, actDeg) : "M 0 0";
        activeArc.setAttribute("d", p);
        activeArc.classList.remove("arc-idle");
      }
      if (dot) {
        const dRad = toRad(135 + actDeg);
        dot.setAttribute("cx", 160 + 145 * Math.cos(dRad));
        dot.setAttribute("cy", 160 + 145 * Math.sin(dRad));
        dot.classList.remove("arc-idle");
      }
      if (numEl) {
        numEl.textContent = targetVel;
        numEl.classList.remove("off");
      }
    };

    let dragData = null;

    ring.addEventListener("pointerdown", (e) => {
      const vel = getSpeed(e.clientX, e.clientY);
      if (vel < 0) return;
      ring.setPointerCapture(e.pointerId);
      const restore = this._getActiveSpeed() || 1;
      dragData = { restore };
      updateRing(vel);
    });

    ring.addEventListener("pointermove", (e) => {
      if (!dragData) return;
      const vel = getSpeed(e.clientX, e.clientY);
      if (vel < 0) return;
      updateRing(vel);
    });

    ring.addEventListener("pointerup", (e) => {
      if (!dragData) return;
      const vel = getSpeed(e.clientX, e.clientY);
      if (vel > 0) {
        this._execute("vel", vel).catch(() => {
          updateRing(dragData.restore);
        });
      }
      dragData = null;
    });

    ring.addEventListener("pointercancel", () => {
      if (dragData) updateRing(dragData.restore);
      dragData = null;
    });
  }
}

customElements.define("fanpy-card", FanpyCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "fanpy-card",
  name: "Fanpy Card",
  description: "Fanpy card to control ceiling fans with light and speed",
  preview: false,
});
