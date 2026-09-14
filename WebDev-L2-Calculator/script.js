/**
 * Modern Browser-Based Calculator
 * Built using Vanilla JavaScript (ES6+), Event Listeners & State Machine.
 * Adheres to standard MDN best practices: parseFloat(), switch statements, no eval().
 */

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement, displayContainer) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.displayContainer = displayContainer;
    this.clear();
  }

  /**
   * Resets all internal calculator state to default.
   */
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = null;
    this.shouldResetScreen = false;
    this.isError = false;
    this.errorMessage = '';
    this.lastEvaluatedExpression = '';
    this.clearActiveOperatorButtons();
  }

  /**
   * Deletes the last character from current input (Backspace/Delete).
   */
  delete() {
    if (this.isError) {
      this.clear();
      return;
    }

    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
      return;
    }

    if (this.currentOperand === '0') return;

    if (
      this.currentOperand.length === 1 ||
      (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))
    ) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  /**
   * Appends a digit or decimal point to the current operand.
   * Prevents multiple decimals and handles initial leading zero replacement.
   * @param {string} number - The clicked or typed number/decimal string.
   */
  appendNumber(number) {
    if (this.isError) {
      this.clear();
    }

    // If a calculation was just evaluated and user starts typing a number, start fresh
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.previousOperand = '';
      this.lastEvaluatedExpression = '';
      this.shouldResetScreen = false;
    }

    // Decimal point handling
    if (number === '.') {
      if (this.currentOperand.includes('.')) return;
      if (this.currentOperand === '' || this.currentOperand === '0') {
        this.currentOperand = '0.';
        return;
      }
    }

    // Avoid multiple leading zeros like "00"
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
      return;
    }

    // Maximum display length safety to prevent infinite digit spam
    if (this.currentOperand.replace(/[^0-9]/g, '').length >= 15) {
      return;
    }

    this.currentOperand += number;
  }

  /**
   * Selects an arithmetic operator (+, −, ×, ÷) and handles operator chaining.
   * Sequential operations (e.g. 5 + 3 × 2) compute the intermediate result automatically.
   * @param {string} operation - The chosen arithmetic operator.
   */
  chooseOperation(operation) {
    if (this.isError) return;

    // Normalizing operator symbols
    const normalizedOp = this.normalizeOperator(operation);

    // If an operation was already chosen but user hasn't typed a new number yet,
    // allow changing the pending operator without re-calculating
    if (this.currentOperand === '' && this.previousOperand !== '') {
      this.operation = normalizedOp;
      this.updateActiveOperatorButton();
      return;
    }

    // Operator Chaining: if both operands exist, compute previous operation first
    if (this.previousOperand !== '' && this.currentOperand !== '') {
      this.compute();
      if (this.isError) return;
    }

    this.operation = normalizedOp;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
    this.shouldResetScreen = false;
    this.lastEvaluatedExpression = '';
    this.updateActiveOperatorButton();
  }

  /**
   * Evaluates the arithmetic expression using switch statement and parseFloat().
   * Strictly avoids eval() and safely detects division-by-zero.
   */
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // If either operand is missing or invalid, abort compute
    if (isNaN(prev) || isNaN(current) || !this.operation) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '−':
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        // Division-by-zero protection
        if (current === 0) {
          this.isError = true;
          this.errorMessage = 'Cannot divide by 0';
          this.clearActiveOperatorButtons();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Fix IEEE-754 floating point imprecisions (e.g., 0.1 + 0.2 = 0.3)
    computation = this.roundAccurately(computation, 12);

    this.lastEvaluatedExpression = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation} ${this.formatDisplayNumber(this.currentOperand)} =`;
    this.currentOperand = String(computation);
    this.operation = null;
    this.previousOperand = '';
    this.clearActiveOperatorButtons();
  }

  /**
   * Finalizes an evaluation when Equals (=) is clicked.
   */
  equals() {
    if (this.isError) return;
    if (this.operation === null || this.previousOperand === '' || this.currentOperand === '') {
      return;
    }

    this.compute();
    if (!this.isError) {
      this.shouldResetScreen = true;
    }
  }

  /**
   * Inverts the sign of the current number (±).
   */
  negate() {
    if (this.isError || this.currentOperand === '0' || this.currentOperand === '') return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.substring(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
  }

  /**
   * Converts the current number to a percentage (divides by 100).
   */
  percent() {
    if (this.isError || this.currentOperand === '') return;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    const result = this.roundAccurately(current / 100, 12);
    this.currentOperand = String(result);
  }

  /**
   * Helper to round floating numbers accurately without floating-point artifacts.
   * @param {number} num - The calculated number.
   * @param {number} precision - Max decimal places.
   * @returns {number} Rounded number.
   */
  roundAccurately(num, precision = 12) {
    const factor = Math.pow(10, precision);
    return Math.round((num + Number.EPSILON) * factor) / factor;
  }

  /**
   * Maps common operator characters to canonical UI symbols.
   * @param {string} op
   * @returns {string} Normalized operator symbol.
   */
  normalizeOperator(op) {
    if (op === '*' || op === 'x' || op === 'X') return '×';
    if (op === '/') return '÷';
    if (op === '-') return '−';
    return op;
  }

  /**
   * Formats a raw number string with thousands comma separators,
   * while keeping trailing decimals during typing.
   * @param {string} numberStr
   * @returns {string} Formatted number string.
   */
  formatDisplayNumber(numberStr) {
    if (numberStr === '' || numberStr === null || numberStr === undefined) return '';
    if (numberStr === '-') return '-';

    const stringNumber = String(numberStr);
    const isNegative = stringNumber.startsWith('-');
    const cleanNumber = isNegative ? stringNumber.substring(1) : stringNumber;

    const parts = cleanNumber.split('.');
    const integerPart = parseFloat(parts[0]);
    const decimalPart = parts[1];

    let formattedInteger;
    if (isNaN(integerPart)) {
      formattedInteger = '0';
    } else {
      formattedInteger = integerPart.toLocaleString('en-US');
    }

    const sign = isNegative ? '-' : '';
    if (decimalPart != null) {
      return `${sign}${formattedInteger}.${decimalPart}`;
    } else {
      return `${sign}${formattedInteger}`;
    }
  }

  /**
   * Highlights the active operator button on the keypad.
   */
  updateActiveOperatorButton() {
    this.clearActiveOperatorButtons();
    if (!this.operation) return;

    const opBtn = document.querySelector(`.btn-operator[data-operator="${this.operation}"]`);
    if (opBtn) {
      opBtn.classList.add('active-operator');
    }
  }

  /**
   * Clears active highlights from operator buttons.
   */
  clearActiveOperatorButtons() {
    document.querySelectorAll('.btn-operator').forEach((btn) => {
      btn.classList.remove('active-operator');
    });
  }

  /**
   * Refreshes the display DOM elements and manages text scaling and error states.
   */
  updateDisplay() {
    // Check Error State
    if (this.isError) {
      this.currentOperandTextElement.textContent = this.errorMessage;
      this.currentOperandTextElement.classList.add('error-text');
      this.displayContainer.classList.add('error-state');
      this.previousOperandTextElement.textContent = '';
      return;
    }

    // Normal State
    this.currentOperandTextElement.classList.remove('error-text');
    this.displayContainer.classList.remove('error-state');

    // Update main display
    if (this.currentOperand !== '') {
      this.currentOperandTextElement.textContent = this.formatDisplayNumber(this.currentOperand);
    } else {
      this.currentOperandTextElement.textContent = '0';
    }

    // Auto-scale font size for long numbers
    const charCount = this.currentOperandTextElement.textContent.length;
    this.currentOperandTextElement.classList.remove('small-text', 'tiny-text');
    if (charCount > 13) {
      this.currentOperandTextElement.classList.add('tiny-text');
    } else if (charCount > 9) {
      this.currentOperandTextElement.classList.add('small-text');
    }

    // Update secondary upper display
    if (this.operation != null && this.previousOperand !== '') {
      this.previousOperandTextElement.textContent = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else if (this.lastEvaluatedExpression !== '') {
      this.previousOperandTextElement.textContent = this.lastEvaluatedExpression;
    } else {
      this.previousOperandTextElement.textContent = '';
    }
  }
}

/* ==========================================================================
   DOM Initialization & Event Listeners (Zero Inline Onclick)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const previousOperandTextElement = document.getElementById('previous-operand');
  const currentOperandTextElement = document.getElementById('current-operand');
  const displayContainer = document.querySelector('.display-container');

  const numberButtons = document.querySelectorAll('[data-number]');
  const operatorButtons = document.querySelectorAll('[data-operator]');
  const clearButton = document.querySelector('[data-action="clear"]');
  const deleteButton = document.querySelector('[data-action="delete"]');
  const equalsButton = document.querySelector('[data-action="equals"]');
  const negateButton = document.querySelector('[data-action="negate"]');
  const percentButton = document.querySelector('[data-action="percent"]');
  const themeToggleButton = document.getElementById('theme-toggle');

  // Initialize Calculator
  const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement,
    displayContainer
  );
  calculator.updateDisplay();

  /* --------------------------------------------------------------------------
     Button Click Event Listeners
     -------------------------------------------------------------------------- */

  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      triggerButtonPressAnimation(button);
      calculator.appendNumber(button.dataset.number);
      calculator.updateDisplay();
    });
  });

  operatorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      triggerButtonPressAnimation(button);
      calculator.chooseOperation(button.dataset.operator);
      calculator.updateDisplay();
    });
  });

  if (equalsButton) {
    equalsButton.addEventListener('click', () => {
      triggerButtonPressAnimation(equalsButton);
      calculator.equals();
      calculator.updateDisplay();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      triggerButtonPressAnimation(clearButton);
      calculator.clear();
      calculator.updateDisplay();
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      triggerButtonPressAnimation(deleteButton);
      calculator.delete();
      calculator.updateDisplay();
    });
  }

  if (negateButton) {
    negateButton.addEventListener('click', () => {
      triggerButtonPressAnimation(negateButton);
      calculator.negate();
      calculator.updateDisplay();
    });
  }

  if (percentButton) {
    percentButton.addEventListener('click', () => {
      triggerButtonPressAnimation(percentButton);
      calculator.percent();
      calculator.updateDisplay();
    });
  }

  /* --------------------------------------------------------------------------
     Theme Switcher Logic
     -------------------------------------------------------------------------- */

  function initTheme() {
    try {
      const savedTheme = localStorage.getItem('calc-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        return;
      }
    } catch (e) {
      // Ignore storage errors
    }

    // Default to dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('calc-theme', newTheme);
    } catch (e) {
      // Ignore private browsing storage restrictions
    }
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  initTheme();

  /* --------------------------------------------------------------------------
     Micro-interaction Helper for Visual Feedback
     -------------------------------------------------------------------------- */

  function triggerButtonPressAnimation(button) {
    if (!button) return;
    button.classList.add('is-pressed');
    setTimeout(() => {
      button.classList.remove('is-pressed');
    }, 120);
  }

  /* --------------------------------------------------------------------------
     Physical Keyboard Navigation Support
     -------------------------------------------------------------------------- */

  window.addEventListener('keydown', (e) => {
    // Prevent default scrolling on spacebar or page navigation if active
    if (e.key === ' ' || e.key === 'Tab') return;

    let targetButton = null;

    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      calculator.appendNumber(e.key);
      targetButton = document.querySelector(`[data-number="${e.key}"]`);
    } else if (e.key === '+' || e.key === '-') {
      const op = e.key === '-' ? '−' : '+';
      calculator.chooseOperation(op);
      targetButton = document.querySelector(`[data-operator="${op}"]`);
    } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
      calculator.chooseOperation('×');
      targetButton = document.querySelector(`[data-operator="×"]`);
    } else if (e.key === '/') {
      e.preventDefault(); // Prevent browser quick-find shortcut
      calculator.chooseOperation('÷');
      targetButton = document.querySelector(`[data-operator="÷"]`);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      calculator.equals();
      targetButton = equalsButton;
    } else if (e.key === 'Backspace') {
      calculator.delete();
      targetButton = deleteButton;
    } else if (e.key === 'Escape' || e.key === 'Delete' || e.key.toLowerCase() === 'c') {
      calculator.clear();
      targetButton = clearButton;
    } else if (e.key === '%') {
      calculator.percent();
      targetButton = percentButton;
    } else if (e.key.toLowerCase() === 't') {
      toggleTheme();
      return;
    }

    if (targetButton) {
      triggerButtonPressAnimation(targetButton);
    }
    calculator.updateDisplay();
  });
});
