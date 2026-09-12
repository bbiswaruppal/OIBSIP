# 🌡️ ThermoShift · Interactive Temperature Converter Website

A modern, responsive, and mathematically precise web tool for converting temperature values across **Celsius (°C)**, **Fahrenheit (°F)**, and **Kelvin (K)**, with real-time input validation and edge-case handling.

Built for **TASK 3 · Temperature Converter Website** using pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (Zero external dependencies).

---

## ✨ Features Checklist

- [x] **Numeric Input Field**: Supports integers, decimals, negative temperatures, and scientific notation with real-time input validation.
- [x] **Non-Numeric Rejection**: Instantly catches and rejects non-numeric entries (e.g. letters, malformed numbers, duplicate symbols) with accessible inline error alerts.
- [x] **Input Unit Selector**: Interactive unit cards (Celsius / Fahrenheit / Kelvin) with keyboard navigation and ARIA radiogroup roles.
- [x] **Simultaneous & Target Output Views**:
  - Displays all 3 units simultaneously in real time.
  - Includes a segmented display filter to isolate individual units (Celsius Only, Fahrenheit Only, Kelvin Only) or view All Units at once.
- [x] **Convert Button**: Explicit "Convert Now" button with click animation, accompanied by live instant recalculation as you type and Enter key support.
- [x] **Result Display Area**: Clear cards showing converted values, proper unit symbols (`°C`, `°F`, `K`), and formula calculation breakdowns.
- [x] **Absolute Zero Edge Case Handling**: Highlights temperatures below absolute zero (below $-273.15\text{ °C}$, $-459.67\text{ °F}$, or $0\text{ K}$) with a high-visibility warning notification grounded in the Third Law of Thermodynamics.
- [x] **Live Thermal Sensation Gauge**: Visual color meter and descriptive status badge reflecting real-world thermal conditions (Cryogenic, Freezing, Room Temperature, Human Body, Boiling, Superheated).
- [x] **Quick Reference Presets**: One-click chip buttons for common benchmark temperatures (Absolute Zero, Freezing Point, Room Temp, Body Temp, Boiling Point).
- [x] **One-Click Clipboard Copy**: Easy copy button on each result card with animated toast notification.
- [x] **Clean, Centered UI Layout**: Modern glassmorphism aesthetic, centered layout, high-contrast dark theme, and mobile-friendly responsive breakpoints.

---

## 📐 Conversion Formulas

| From | To | Mathematical Formula |
| :--- | :--- | :--- |
| **Celsius (°C)** | **Fahrenheit (°F)** | $F = (C \times \frac{9}{5}) + 32$ |
| **Celsius (°C)** | **Kelvin (K)** | $K = C + 273.15$ |
| **Fahrenheit (°F)** | **Celsius (°C)** | $C = (F - 32) \times \frac{5}{9}$ |
| **Fahrenheit (°F)** | **Kelvin (K)** | $K = (F - 32) \times \frac{5}{9} + 273.15$ |
| **Kelvin (K)** | **Celsius (°C)** | $C = K - 273.15$ |
| **Kelvin (K)** | **Fahrenheit (°F)** | $F = (K - 273.15) \times \frac{9}{5} + 32$ |

---

## 🧊 Physical Limits (Absolute Zero)

Absolute zero is the theoretical point where all classical thermal motion ceases:
- **Celsius**: $-273.15\text{ °C}$
- **Fahrenheit**: $-459.67\text{ °F}$
- **Kelvin**: $0\text{ K}$

Any temperature below these values automatically triggers a user-friendly warning banner and alerts the user to thermodynamic impossibility.

---

## 🚀 How to Run Locally

Because this project is built with 100% vanilla web standards, no installation or build steps are required.

### Option 1: Open Directly in Any Browser
Simply open the `index.html` file in your favorite web browser (Chrome, Edge, Firefox, Safari):
```powershell
Start-Process "index.html"
```

### Option 2: Run with Python Built-in Server
From within the project directory:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📁 File Structure

```text
temperature-converter/
├── index.html     # Semantic HTML5 markup with accessible controls
├── style.css      # Responsive CSS3 styling, variables, and dark theme
├── app.js         # Vanilla JavaScript engine (validation, math, DOM)
└── README.md      # Comprehensive documentation and reference
```
