# Fan Custom Card

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/plugin)

Custom Lovelace card for Home Assistant to control ceiling fans with light and speed settings.

## Background

This card was born from a real need. I bought some ceiling fans that weren't smart — they worked via RF remote control. I discovered I could make them smart by using a **Broadlink RM4 Pro** to learn the RF commands and integrate them into Home Assistant.

After teaching the commands to HA (following the [Broadlink integration docs](https://www.home-assistant.io/integrations/broadlink/)), I created **scripts** to execute them and exposed those scripts to Alexa through the [Alexa Smart Home skill](https://www.home-assistant.io/integrations/alexa.smart_home/). Voice control worked, but I wanted a proper dashboard card.

I couldn't find an existing card that fit my needs, so I built this one. The **Helpers mode** is the original design: it combines `input_boolean` entities (for state tracking), `input_select` (for speed), `input_button` entities, and scripts that call the Broadlink RF commands.

Later I added a Shelly 2PM Gen 3 to control an extractor fan and its light in a bathroom. Since the Shelly exposes native `switch.*` and `light.*` entities, I added the **Direct mode** — no scripts or helpers needed, just direct service calls.

This card is the result of that journey, and I hope it helps others in similar situations.

## Features

- ✅ **Two modes**: Helpers (scripts + `input_*` entities) and Direct (native `switch.*` / `light.*` entities)
- ✅ Control fan power (on/off)
- ✅ Control light (on/off, warm/cold temperature, brightness up/down)
- ✅ Speed selection (1-6) with dynamic button count
- ✅ Spinning fan animation with speed-dependent rotation
- ✅ Visual editor with mode selector, area dropdown, and toggle switches
- ✅ Multi-language support (en, es, ca)
- ✅ Script override for non-standard setups (helpers mode)
- ✅ Direct service calls for temperature and brightness (direct mode)
- ✅ Auto-detected speed section — create `input_select.{prefix}_velocidad` and buttons appear

## Installation

### HACS (Recommended)

1. Open HACS.
2. Search for **Fan Custom Card** and install it.
3. Refresh the Lovelace.

### Manual

1. Download the `fan-custom-card.zip` from the latest release.
2. Unzip and copy `fan-custom-card.js` to your Home Assistant `www` folder:
   ```
   /config/www/fan-custom-card/fan-custom-card.js
   ```
3. Add the resource in **Settings > Dashboards > Resources > Add Resource**:
   - URL: `/local/fan-custom-card/fan-custom-card.js`
   - Type: `module`
4. Refresh (Ctrl+F5 / Cmd+Shift+R).

## Configuration

### Visual Editor

The editor has two modes selectable at the top.

#### Helpers Mode

Select the **Area** from the dropdown. The name and prefix are auto-generated:
- **Name**: area name (e.g., `SALÓN`)
- **Prefix**: `ventilador_{area}` (e.g., `ventilador_salon`)

Use the toggle switches to show/hide light, temperature, and intensity controls.

To override scripts, switch to the **code editor** (YAML mode).

![Helpers Mode](images/fan_custom_card_visual_editor_helpers.png)

#### Direct Mode

Select the **Name** from the area list, then choose the **Fan entity** (`switch.*`) and **Light entity** (`light.*`) from their dropdowns.

Use the toggle switches to enable/disable light, color temperature, and intensity controls.

Temperature and intensity buttons call `light.turn_on` directly with `color_temp` / `brightness_step_pct` parameters — no scripts needed.

Speed buttons appear automatically when `input_select.{prefix}_velocidad` exists in your HA instance.

![Direct Mode](images/fan_custom_card_visual_editor_direct.png)

### YAML Examples

#### Helpers Mode

```yaml
type: custom:fan-custom-card
name: "SALÓN"
prefix: "ventilador_salon"
has_light: true
has_light_temperature: true
has_light_intensity: true
# Optional: override specific scripts if they differ from the auto-generated names
# power_on_script: "script.mi_script_personalizado"
# power_off_script: "script.otro_script_apagar"
```

#### Direct Mode

```yaml
type: custom:fan-custom-card
mode: direct
name: "LAVABO ROSA"
entity_fan: switch.lavabo_rosa_ventilador
entity_light: light.lavabo_rosa_luz
has_light: true
has_light_temperature: false
has_light_intensity: false
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `"helpers"` | Card mode: `"helpers"` (scripts + `input_*`) or `"direct"` (`switch.*` / `light.*`) |
| `name` | string | — | Display name for the fan (e.g., `SALÓN`) |
| `prefix` | string | — | Entity ID prefix (e.g., `ventilador_salon`). Auto-generated from name in direct mode |
| `entity_fan` | string | — | Fan entity ID (direct mode only, e.g. `switch.lavabo_rosa_ventilador`) |
| `entity_light` | string | — | Light entity ID (direct mode only, e.g. `light.lavabo_rosa_luz`) |
| `has_light` | boolean | `true` | Show/hide the light section |
| `has_light_temperature` | boolean | `true` (helpers) / `false` (direct) | Show/hide color temperature buttons |
| `has_light_intensity` | boolean | `true` (helpers) / `false` (direct) | Show/hide brightness buttons |
| `power_on_script` | string | — | Override: power ON script (helpers mode, default: `script.{prefix}_power_on`) |
| `power_off_script` | string | — | Override: power OFF script (helpers mode, default: `script.{prefix}_power_off`) |
| `luz_on_script` | string | — | Override: light ON script (helpers mode, default: `script.{prefix}_luz_on`) |
| `luz_off_script` | string | — | Override: light OFF script (helpers mode, default: `script.{prefix}_luz_off`) |
| `luz_fria_script` | string | — | Override: cold light script (helpers mode, default: `script.{prefix}_luz_fria`) |
| `luz_calida_script` | string | — | Override: warm light script (helpers mode, default: `script.{prefix}_luz_calida`) |
| `intensidad_baja_script` | string | — | Override: dim down script (helpers mode, default: `script.{prefix}_intensidad_baja`) |
| `intensidad_alta_script` | string | — | Override: dim up script (helpers mode, default: `script.{prefix}_intensidad_alta`) |
| `velocidad_{n}_script` | string | — | Override: speed {n} script (default: `script.{prefix}_velocidad_{n}`) |

### Helpers Mode — Auto-generated Entity & Script Names

If no override is specified, the card auto-generates names from the prefix:

| Entity | Auto-generated ID |
|--------|------------------|
| Power state | `input_boolean.{prefix}_power` |
| Light state | `input_boolean.{prefix}_luz` |
| Speed state | `input_select.{prefix}_velocidad` |
| Power ON | `script.{prefix}_power_on` |
| Power OFF | `script.{prefix}_power_off` |
| Light ON | `script.{prefix}_luz_on` |
| Light OFF | `script.{prefix}_luz_off` |
| Cold light | `script.{prefix}_luz_fria` |
| Warm light | `script.{prefix}_luz_calida` |
| Dim down | `script.{prefix}_intensidad_baja` |
| Dim up | `script.{prefix}_intensidad_alta` |
| Speed 1-6 | `script.{prefix}_velocidad_{1-6}` |

### Helpers Mode — Scripts Example (Broadlink RF)

Below is a real `scripts.yaml` example for a ceiling fan with 6 speeds and light (temperature + intensity), controlled via a Broadlink RM4 Pro.

**Important:** For the card to work in Helpers mode you must manually create:
- **`input_boolean.{prefix}_power`** — tracks fan power state
- **`input_boolean.{prefix}_luz`** — tracks light state
- **`input_select.{prefix}_velocidad`** — tracks speed, with options `1`, `2`, `3`, etc. (one per speed level)
- **`input_button.{prefix}_power_on`**, **`input_button.{prefix}_power_off`**, etc. — (optional, for automations)
- All the **scripts** below (they send RF commands via Broadlink and update the helper entities)

Each script sends the RF command and updates the corresponding helper entity so the card reflects the correct state.

<details>
<summary>Click to expand scripts.yaml (32 scripts)</summary>

```yaml
ventilador_salon_power_on:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: 'on'
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_boolean.turn_on
    metadata: {}
    data: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
  alias: Ventilador Salón Power ON
  description: ''

ventilador_salon_power_off:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: 'off'
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_boolean.turn_off
    metadata: {}
    data: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
  alias: Ventilador Salón Power OFF
  description: ''

ventilador_salon_luz_on:
  sequence:
  - action: remote.send_command
    metadata: {}
    target:
      entity_id: remote.broadlink_salon
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: luz
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_luz
    data: {}
  alias: Ventilador Salón Luz ON
  description: ''

ventilador_salon_luz_off:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: luz
    target:
      entity_id: remote.broadlink_salon
  - action: input_boolean.turn_off
    metadata: {}
    data: {}
    target:
      entity_id: input_boolean.ventilador_salon_luz
  alias: Ventilador Salon Luz OFF
  description: ''

ventilador_salon_luz_calida:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: luz_calida
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  alias: Ventilador Salón Luz Cálida
  description: ''

ventilador_salon_luz_fria:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: luz_fria
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  alias: Ventilador Salón Luz Fría
  description: ''

ventilador_salon_intensidad_alta:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: intensidad_alta
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  alias: Ventilador Salón Intensidad Alta
  description: ''

ventilador_salon_intensidad_baja:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: intensidad_baja
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  alias: Ventilador Salón Intensidad Baja
  description: ''

ventilador_salon_velocidad_1:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad1
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '1'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 1
  description: ''

ventilador_salon_velocidad_2:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad2
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '2'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 2
  description: ''

ventilador_salon_velocidad_3:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad3
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '3'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 3
  description: ''

ventilador_salon_velocidad_4:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad4
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '4'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 4
  description: ''

ventilador_salon_velocidad_5:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad5
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '5'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 5
  description: ''

ventilador_salon_velocidad_6:
  sequence:
  - action: remote.send_command
    metadata: {}
    data:
      num_repeats: 1
      delay_secs: 0.4
      hold_secs: 0
      device: ventilador_salon
      command: velocidad6
    target:
      device_id: YOUR_BROADLINK_DEVICE_ID
  - action: input_select.select_option
    metadata: {}
    data:
      option: '6'
    target:
      entity_id: input_select.ventilador_salon_velocidad
  - action: input_boolean.turn_on
    metadata: {}
    target:
      entity_id: input_boolean.ventilador_salon_power
    data: {}
  alias: Ventilador Salón Velocidad 6
  description: ''
```

</details>

## Card Preview

The card renders a compact control panel. Example layout with all sections visible:

```
┌─────────────────────────────┐
│ 🌀 SALÓN             ● ON   │
│                             │
│ LUZ                         │
│          [💡]               │
│                             │
│ TEMPERATURA LUZ             │
│     [❄️]         [☀️]      │
│                             │
│ INTENSIDAD LUZ              │
│     [−]         [+]         │
│                             │
│ VELOCIDAD                   │
│  1   2   3   4   5   6      │
│         ●                   │
│       Speed 3/6             │
└─────────────────────────────┘
```

- The fan icon spins when the fan is ON, with speed depending on the selected velocity.
- Active speed is highlighted with the theme accent color.
- Light button shows yellow when light is on.
- Sections can be hidden via toggle switches in the editor or `has_light`, `has_light_temperature`, `has_light_intensity` YAML options.

![Fan Custom Card Example](images/fan_custom_card.png)

## Development

```bash
# Clone
git clone https://github.com/figorr/fan-custom-card.git
cd fan-custom-card

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run watch
```

## Translations

To add a new language:

1. Create `src/translations/{lang}.json` with the same keys as `en.json`.
2. Add the import in `src/translations.js`.
3. Submit a PR.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache-2.0. See [LICENSE](LICENSE).
