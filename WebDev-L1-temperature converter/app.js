/**
 * ThermoShift · Interactive Temperature Converter
 * Vanilla JavaScript Engine for Real-Time Validation, Math & UI Dynamics
 */

(() => {
  'use strict';

  // --- Constants & Thresholds ---
  const ABSOLUTE_ZERO = {
    C: -273.15,
    F: -459.67,
    K: 0
  };

  const UNIT_SYMBOLS = {
    C: '°C',
    F: '°F',
    K: 'K'
  };

  const UNIT_NAMES = {
    C: 'Celsius',
    F: 'Fahrenheit',
    K: 'Kelvin'
  };

  // --- DOM Elements ---
  const tempInput = document.getElementById('tempInput');
  const clearBtn = document.getElementById('clearBtn');
  const inputWrapper = document.getElementById('inputWrapper');
  const inputUnitTag = document.getElementById('inputUnitTag');
  const inputFeedback = document.getElementById('inputFeedback');
  const inputUnitGroup = document.getElementById('inputUnitGroup');
  const convertBtn = document.getElementById('convertBtn');
  const absoluteZeroBanner = document.getElementById('absoluteZeroBanner');
  const absoluteZeroText = document.getElementById('absoluteZeroText');
  const toast = document.getElementById('toast');

  // Thermal Gauge Elements
  const thermalCard = document.getElementById('thermalCard');
  const thermalBadge = document.getElementById('thermalBadge');
  const thermalBadgeText = document.getElementById('thermalBadgeText');
  const thermalMeterFill = document.getElementById('thermalMeterFill');
  const thermalMeterTrack = document.getElementById('thermalMeterTrack');

  // Result Elements
  const valCelsius = document.getElementById('valCelsius');
  const valFahrenheit = document.getElementById('valFahrenheit');
  const valKelvin = document.getElementById('valKelvin');
  const formulaCelsius = document.getElementById('formulaCelsius');
  const formulaFahrenheit = document.getElementById('formulaFahrenheit');
  const formulaKelvin = document.getElementById('formulaKelvin');

  const cardCelsius = document.getElementById('cardCelsius');
  const cardFahrenheit = document.getElementById('cardFahrenheit');
  const cardKelvin = document.getElementById('cardKelvin');
  const resultCards = [cardCelsius, cardFahrenheit, cardKelvin];

  const presetChips = document.querySelectorAll('.chip-btn');
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const copyBtns = document.querySelectorAll('.copy-btn');

  let toastTimeout = null;

  // --- Helper Math & Formatting Functions ---

  /**
   * Format numbers cleanly:
   * - Eliminates floating point noise (e.g. 77.00000000000001 -> 77)
   * - Keeps up to 2 decimal places if fractional, up to 4 if precision requires
   * - Normalizes -0 to 0
   */
  function formatTemperature(num) {
    if (Object.is(num, -0)) num = 0;
    if (Number.isInteger(num)) {
      return num.toLocaleString('en-US');
    }
    // Round to 2 decimal places by default
    const rounded = Math.round(num * 100) / 100;
    // Check if rounding to 2 decimals rounded away non-zero digits
    if (rounded === 0 && num !== 0) {
      return (Math.round(num * 10000) / 10000).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      });
    }
    return rounded.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  /**
   * Get active input unit ('C', 'F', or 'K')
   */
  function getSelectedInputUnit() {
    const checkedRadio = document.querySelector('input[name="inputUnit"]:checked');
    return checkedRadio ? checkedRadio.value : 'C';
  }

  /**
   * Set active input unit programmatically
   */
  function setSelectedInputUnit(unit) {
    const radio = document.querySelector(`input[name="inputUnit"][value="${unit}"]`);
    if (radio) {
      radio.checked = true;
      updateUnitCardStyles();
      inputUnitTag.textContent = UNIT_SYMBOLS[unit];
    }
  }

  /**
   * Update visual highlight for the active unit card
   */
  function updateUnitCardStyles() {
    const currentUnit = getSelectedInputUnit();
    document.querySelectorAll('.unit-card').forEach(card => {
      const cardUnit = card.getAttribute('data-unit');
      if (cardUnit === currentUnit) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Also highlight source card in results grid
    resultCards.forEach(card => {
      if (card.getAttribute('data-unit') === currentUnit) {
        card.classList.add('is-input-source');
      } else {
        card.classList.remove('is-input-source');
      }
    });
  }

  /**
   * Core conversion formulas
   */
  function convertTemperatures(val, fromUnit) {
    let c, f, k;
    let formulaC = '', formulaF = '', formulaK = '';

    const formattedVal = formatTemperature(val);

    switch (fromUnit) {
      case 'C':
        c = val;
        f = (val * 9 / 5) + 32;
        k = val + 273.15;
        formulaC = 'Source input value';
        formulaF = `(${formattedVal} × 9/5) + 32`;
        formulaK = `${formattedVal} + 273.15`;
        break;

      case 'F':
        f = val;
        c = (val - 32) * 5 / 9;
        k = ((val - 32) * 5 / 9) + 273.15;
        formulaF = 'Source input value';
        formulaC = `(${formattedVal} − 32) × 5/9`;
        formulaK = `((${formattedVal} − 32) × 5/9) + 273.15`;
        break;

      case 'K':
        k = val;
        c = val - 273.15;
        f = ((val - 273.15) * 9 / 5) + 32;
        formulaK = 'Source input value';
        formulaC = `${formattedVal} − 273.15`;
        formulaF = `(${formattedVal} − 273.15) × 9/5 + 32`;
        break;
    }

    return {
      celsius: c,
      fahrenheit: f,
      kelvin: k,
      formulaC,
      formulaF,
      formulaK
    };
  }

  /**
   * Update the live thermal sensation gauge based on Celsius equivalent
   */
  function updateThermalGauge(celsius, isAbsZeroViolation) {
    let label = '';
    let badgeBg = '';
    let badgeBorder = '';
    let badgeColor = '';
    let meterPercent = 0;

    if (isAbsZeroViolation) {
      label = 'Below Absolute Zero (Impossible)';
      badgeBg = 'rgba(239, 68, 68, 0.2)';
      badgeBorder = 'rgba(239, 68, 68, 0.5)';
      badgeColor = '#ef4444';
      meterPercent = 0;
    } else if (celsius <= -273.15) {
      label = 'Absolute Zero (0 K)';
      badgeBg = 'rgba(99, 102, 241, 0.2)';
      badgeBorder = 'rgba(99, 102, 241, 0.5)';
      badgeColor = '#818cf8';
      meterPercent = 2;
    } else if (celsius < -50) {
      label = 'Cryogenic Deep Freeze';
      badgeBg = 'rgba(56, 189, 248, 0.2)';
      badgeBorder = 'rgba(56, 189, 248, 0.5)';
      badgeColor = '#38bdf8';
      meterPercent = 10;
    } else if (celsius < 0) {
      label = 'Freezing Cold (< 0°C)';
      badgeBg = 'rgba(14, 165, 233, 0.2)';
      badgeBorder = 'rgba(14, 165, 233, 0.5)';
      badgeColor = '#0ea5e9';
      meterPercent = 25;
    } else if (celsius <= 15) {
      label = 'Chilly / Cool Weather';
      badgeBg = 'rgba(20, 184, 166, 0.2)';
      badgeBorder = 'rgba(20, 184, 166, 0.5)';
      badgeColor = '#14b8a6';
      meterPercent = 40;
    } else if (celsius <= 26) {
      label = 'Comfortable Room Temp (20-25°C)';
      badgeBg = 'rgba(16, 185, 129, 0.2)';
      badgeBorder = 'rgba(16, 185, 129, 0.5)';
      badgeColor = '#10b981';
      meterPercent = 55;
    } else if (celsius <= 38) {
      label = 'Warm / Human Body Temp (~37°C)';
      badgeBg = 'rgba(245, 158, 11, 0.2)';
      badgeBorder = 'rgba(245, 158, 11, 0.5)';
      badgeColor = '#f59e0b';
      meterPercent = 68;
    } else if (celsius < 100) {
      label = 'Hot / Scalding';
      badgeBg = 'rgba(249, 115, 22, 0.2)';
      badgeBorder = 'rgba(249, 115, 22, 0.5)';
      badgeColor = '#f97316';
      meterPercent = 82;
    } else if (celsius <= 105) {
      label = 'Water Boiling Point (100°C)';
      badgeBg = 'rgba(239, 68, 68, 0.2)';
      badgeBorder = 'rgba(239, 68, 68, 0.5)';
      badgeColor = '#ef4444';
      meterPercent = 92;
    } else {
      label = 'Extreme Superheated Environment';
      badgeBg = 'rgba(217, 70, 239, 0.2)';
      badgeBorder = 'rgba(217, 70, 239, 0.5)';
      badgeColor = '#d946ef';
      meterPercent = 100;
    }

    thermalBadgeText.textContent = label;
    thermalBadge.style.backgroundColor = badgeBg;
    thermalBadge.style.borderColor = badgeBorder;
    thermalBadge.style.color = badgeColor;
    thermalMeterFill.style.width = `${meterPercent}%`;
    thermalMeterTrack.setAttribute('aria-valuenow', Math.round(celsius));
  }

  /**
   * Reset/Clear the displayed results
   */
  function clearResults() {
    valCelsius.textContent = '—';
    valFahrenheit.textContent = '—';
    valKelvin.textContent = '—';
    formulaCelsius.textContent = 'Awaiting valid input';
    formulaFahrenheit.textContent = 'Awaiting valid input';
    formulaKelvin.textContent = 'Awaiting valid input';
    thermalBadgeText.textContent = 'Awaiting Input';
    thermalBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    thermalBadge.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    thermalBadge.style.color = '#94a3b8';
    thermalMeterFill.style.width = '0%';
    absoluteZeroBanner.classList.remove('show');
    absoluteZeroBanner.setAttribute('aria-hidden', 'true');
  }

  /**
   * Primary calculation and validation handler
   */
  function calculate() {
    const rawVal = tempInput.value.trim();
    const unit = getSelectedInputUnit();

    // Reset feedback states
    inputFeedback.textContent = '';
    inputFeedback.className = 'feedback-msg';
    inputWrapper.classList.remove('is-invalid', 'is-warning');
    tempInput.setAttribute('aria-invalid', 'false');

    // Edge Case 1: Empty input
    if (rawVal === '') {
      inputFeedback.textContent = 'Please enter a numeric temperature value.';
      inputFeedback.classList.add('error');
      inputWrapper.classList.add('is-invalid');
      tempInput.setAttribute('aria-invalid', 'true');
      clearResults();
      return;
    }

    // Edge Case 2: Incomplete input like "-" or "." while typing
    if (rawVal === '-' || rawVal === '+' || rawVal === '.') {
      inputFeedback.textContent = 'Please complete entering the number...';
      inputFeedback.classList.add('error');
      clearResults();
      return;
    }

    // Edge Case 3: Non-numeric validation check (reject letters, symbols, multiple dots/minuses)
    // Supports standard decimals and scientific notation like 1e5
    const numericPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
    if (!numericPattern.test(rawVal)) {
      inputFeedback.textContent = 'Invalid input: Please enter a valid number (e.g. 25, -10, 98.6).';
      inputFeedback.classList.add('error');
      inputWrapper.classList.add('is-invalid');
      tempInput.setAttribute('aria-invalid', 'true');
      clearResults();
      return;
    }

    const numVal = parseFloat(rawVal);
    if (Number.isNaN(numVal) || !Number.isFinite(numVal)) {
      inputFeedback.textContent = 'Please enter a finite number.';
      inputFeedback.classList.add('error');
      inputWrapper.classList.add('is-invalid');
      tempInput.setAttribute('aria-invalid', 'true');
      clearResults();
      return;
    }

    // Edge Case 4: Absolute Zero Violations
    const absZeroLimit = ABSOLUTE_ZERO[unit];
    const isBelowAbsZero = numVal < absZeroLimit;

    if (isBelowAbsZero) {
      inputWrapper.classList.add('is-warning');
      absoluteZeroBanner.classList.add('show');
      absoluteZeroBanner.setAttribute('aria-hidden', 'false');
      absoluteZeroText.innerHTML = `
        <strong>${formatTemperature(numVal)} ${UNIT_SYMBOLS[unit]}</strong> is below Absolute Zero 
        (<strong>${absZeroLimit} ${UNIT_SYMBOLS[unit]}</strong> / <strong>0 K</strong>). 
        According to the Third Law of Thermodynamics, temperatures cannot physically fall below absolute zero. 
        Displayed results below represent theoretical extrapolation.
      `;
      inputFeedback.textContent = `Warning: Input is below Absolute Zero (${absZeroLimit} ${UNIT_SYMBOLS[unit]}).`;
      inputFeedback.classList.add('error');
    } else {
      absoluteZeroBanner.classList.remove('show');
      absoluteZeroBanner.setAttribute('aria-hidden', 'true');
      inputFeedback.textContent = `✓ Valid ${UNIT_NAMES[unit]} temperature entered.`;
      inputFeedback.classList.add('valid');
    }

    // Perform Conversions
    const results = convertTemperatures(numVal, unit);

    // Update Result Display Values
    valCelsius.textContent = formatTemperature(results.celsius);
    valFahrenheit.textContent = formatTemperature(results.fahrenheit);
    valKelvin.textContent = formatTemperature(results.kelvin);

    formulaCelsius.textContent = results.formulaC;
    formulaFahrenheit.textContent = results.formulaF;
    formulaKelvin.textContent = results.formulaK;

    // Update Thermal Sensation Gauge
    updateThermalGauge(results.celsius, isBelowAbsZero);
  }

  /**
   * Clipboard Copy Utility
   */
  async function copyToClipboard(text, unitLabel) {
    if (!text || text === '—') return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https or restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast(`Copied ${text} ${unitLabel} to clipboard!`);
    } catch (err) {
      showToast(`Failed to copy: ${err.message}`);
    }
  }

  /**
   * Show Toast Notification
   */
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // --- Event Listeners Setup ---

  // Real-time typing validation & conversion
  tempInput.addEventListener('input', () => {
    calculate();
  });

  // Clear button action
  clearBtn.addEventListener('click', () => {
    tempInput.value = '';
    tempInput.focus();
    calculate();
  });

  // Convert button click action
  convertBtn.addEventListener('click', () => {
    calculate();

    // Subtle button click feedback animation on result cards
    resultCards.forEach(card => {
      if (!card.classList.contains('is-hidden')) {
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
      }
    });
  });

  // Keyboard shortcut: Enter to trigger conversion
  tempInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    } else if (e.key === 'Escape') {
      tempInput.value = '';
      calculate();
    }
  });

  // Unit radio change listeners
  inputUnitGroup.addEventListener('change', (e) => {
    if (e.target.name === 'inputUnit') {
      const newUnit = e.target.value;
      inputUnitTag.textContent = UNIT_SYMBOLS[newUnit];
      updateUnitCardStyles();
      calculate();
    }
  });

  // Allow clicking anywhere on the unit card
  document.querySelectorAll('.unit-card').forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        radio.checked = true;
        const newUnit = radio.value;
        inputUnitTag.textContent = UNIT_SYMBOLS[newUnit];
        updateUnitCardStyles();
        calculate();
      }
    });
  });

  // Quick Preset buttons
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-val');
      const unit = chip.getAttribute('data-unit');
      setSelectedInputUnit(unit);
      tempInput.value = val;
      tempInput.focus();
      calculate();
    });
  });

  // Output View Filter (All Units vs Specific Unit)
  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const view = btn.getAttribute('data-view');
      resultCards.forEach(card => {
        const cardUnit = card.getAttribute('data-unit');
        if (view === 'all' || view === cardUnit) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // Copy Buttons
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      const parentCard = btn.closest('.result-card');
      const unitSymbol = parentCard ? parentCard.querySelector('.result-symbol').textContent : '';
      if (targetEl) {
        copyToClipboard(targetEl.textContent, unitSymbol);
      }
    });
  });

  // Initial calculation on page load
  updateUnitCardStyles();
  calculate();

})();
