# Modern Vanilla JavaScript Calculator

A modern, responsive, and accessible browser-based calculator engineered with HTML5, CSS3 (CSS Grid & Custom Properties), and pure Vanilla JavaScript (ES6+).

## 🚀 Live Demo & How to Run
Simply open `index.html` in any modern web browser:
- Double click `index.html` in your file explorer, OR
- Serve with any lightweight server (e.g., Python `python -m http.server 8000`, VS Code Live Server).

---

## 📋 Feature Checklist Verification

- [x] **Display Screen**:
  - Upper secondary screen showing current expression/history (e.g., `5 + 3 ×`).
  - Primary main screen showing current inputs and evaluated results formatted with standard comma delimiters.
  - Automatic dynamic font-scaling (`small-text`, `tiny-text`) to accommodate long numbers without layout overflow.
- [x] **Numeric & Decimal Keys**:
  - Full digit pad (`0`–`9`).
  - Robust decimal handling (`.`): prevents multiple decimals (`5.2.3` blocked) and auto-prefixes `0.` when starting with a decimal point.
- [x] **Arithmetic Operators**:
  - Addition (`+`), Subtraction (`−`), Multiplication (`×`), and Division (`÷`).
  - Active operator highlighting on the keypad to provide continuous visual context.
- [x] **Equals (`=`)**:
  - Evaluates pending arithmetic expressions cleanly.
  - Formats results and transitions smoothly into the next calculation.
- [x] **Clear (`C`)**:
  - Full reset of operands, operators, memory, and error states back to initial zero.
- [x] **Backspace / Delete (`⌫`)**:
  - Removes the last entered character; gracefully resets to `0` when all digits are deleted.
- [x] **Prevent Division-by-Zero**:
  - Explicitly intercepts `current === 0` during division.
  - Displays `"Cannot divide by 0"` error message with an alert animation and distinct styling, preventing browser freezes, `Infinity`, or `NaN`.
- [x] **Operator Chaining**:
  - Allows sequential operations without requiring an intermediate equals button press (e.g., `5 + 3 × 2 =` computes `5 + 3` into `8` when `×` is pressed, then `8 × 2` into `16` when `=` is pressed).
  - Allows changing the pending operator seamlessly before entering the next number.
- [x] **CSS Grid Button Layout**:
  - Button keypad structured using CSS Grid: `grid-template-columns: repeat(4, 1fr)` with consistent gap spacing and responsive scaling.
- [x] **Event-Driven Architecture (No Inline Handlers)**:
  - 100% of event listeners are registered via JavaScript `addEventListener()` on `DOMContentLoaded`.
  - Zero `onclick="..."` inline attributes in the HTML markup.
- [x] **MDN-Compliant Logic (No `eval`)**:
  - Calculation engine built with conditional `switch` statements and `parseFloat()`.
  - Accurately rounds IEEE-754 floating-point calculations (e.g., `0.1 + 0.2` = `0.3`).
- [x] **Bonus Features**:
  - **Full Physical Keyboard Support**: `0-9`, `.`, `+`, `-`, `*`, `/`, `Enter`/`=`, `Backspace`, `Escape`/`C`, `%`, and `T` (theme toggle).
  - **Dark / Light Theme Toggle**: Seamless toggle with local preference caching (`localStorage`).
  - **Negate (`±`) & Percent (`%`)**: Built-in helper operations.
  - **Haptic/Visual Micro-interactions**: Buttons animate with active scale effects on click or keyboard press.

---

## 🛠️ Project Structure
```
calculator/
├── index.html       # Semantic HTML5 layout and accessibility markup
├── styles.css       # CSS Grid, custom properties, themes & animations
├── script.js        # Calculator class, arithmetic logic & event bindings
└── README.md        # Documentation and feature verification
```

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Calculator Action |
| :--- | :--- |
| `0` – `9` | Numeric input |
| `.` | Decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` or `x` | Multiplication |
| `/` | Division |
| `Enter` or `=` | Calculate / Equals |
| `Backspace` | Delete last digit |
| `Escape` or `c` | Clear (C) |
| `%` | Percent |
| `t` | Toggle Dark/Light Theme |
