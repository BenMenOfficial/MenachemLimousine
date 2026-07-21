const ACCESSIBILITY_SETTINGS_KEY = "ml_accessibility_settings";

const defaultAccessibilitySettings = {
  darkMode: false,
  highContrast: false,
  readableFont: false,
  highlightLinks: false,
  reducedMotion: false,
  fontScale: 100,
};

const accessibilityConfig = [
  {
    selector: ".acc-toggle-dark",
    className: "dark-mode",
    storageKey: "darkMode",
  },
  {
    selector: ".acc-toggle-contrast",
    className: "high-contrast",
    storageKey: "highContrast",
  },
  {
    selector: ".acc-toggle-font",
    className: "readable-font",
    storageKey: "readableFont",
  },
  {
    selector: ".acc-toggle-links",
    className: "highlight-links",
    storageKey: "highlightLinks",
  },
  {
    selector: ".acc-toggle-motion",
    className: "reduced-motion",
    storageKey: "reducedMotion",
  },
];

const FONT_SCALES = [100, 125, 150, 175, 200];

const loadAccessibilitySettings = () => {
  try {
    const raw = localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : defaultAccessibilitySettings;
  } catch (error) {
    return defaultAccessibilitySettings;
  }
};

const saveAccessibilitySettings = (settings) => {
  try {
    localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    // ignore storage errors
  }
};

const updateToggleButtons = (settings) => {
  accessibilityConfig.forEach((config) => {
    const button = document.querySelector(config.selector);
    if (!button) return;
    const enabled = Boolean(settings[config.storageKey]);
    button.setAttribute("aria-pressed", enabled.toString());
    button.classList.toggle("active", enabled);
  });
};

const updateFontValue = (settings) => {
  const fontValue = document.querySelector(".font-size-value");
  if (fontValue) {
    fontValue.textContent = `${settings.fontScale}%`;
  }
};

const applyAccessibilitySettings = (settings) => {
  const body = document.body;
  body.classList.toggle("dark-mode", Boolean(settings.darkMode));
  body.classList.toggle("high-contrast", Boolean(settings.highContrast));
  body.classList.toggle("readable-font", Boolean(settings.readableFont));
  body.classList.toggle("highlight-links", Boolean(settings.highlightLinks));
  body.classList.toggle("reduced-motion", Boolean(settings.reducedMotion));
  document.documentElement.style.fontSize = `${settings.fontScale}%`;
  document.documentElement.style.scrollBehavior = settings.reducedMotion
    ? "auto"
    : "smooth";
  updateToggleButtons(settings);
  updateFontValue(settings);
  if (settings.reducedMotion) {
    document.querySelectorAll("*").forEach((node) => {
      if (node.style) {
        node.style.animationPlayState = "paused";
        node.style.transitionDuration = "0s";
      }
    });
    document.querySelectorAll("video").forEach((video) => {
      video.pause();
    });
  }
};

const setFontScale = (settings, value) => {
  const nextValue = Math.min(200, Math.max(100, value));
  settings.fontScale = nextValue;
  applyAccessibilitySettings(settings);
  saveAccessibilitySettings(settings);
};

const setAccessibilitySetting = (key, settings) => {
  settings[key] = !settings[key];
  applyAccessibilitySettings(settings);
  saveAccessibilitySettings(settings);
};

const togglePanel = () => {
  const trigger = document.querySelector(".accessibility-trigger");
  const panel = document.getElementById("accessibility-panel");
  if (!panel || !trigger) return;
  const isOpen = panel.hasAttribute("hidden") === false;
  if (isOpen) {
    panel.setAttribute("hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
  } else {
    panel.removeAttribute("hidden");
    trigger.setAttribute("aria-expanded", "true");
    panel.querySelector("button")?.focus();
  }
};

const closePanel = () => {
  const trigger = document.querySelector(".accessibility-trigger");
  const panel = document.getElementById("accessibility-panel");
  if (!panel || !trigger) return;
  panel.setAttribute("hidden", "true");
  trigger.setAttribute("aria-expanded", "false");
  trigger.focus();
};

const initAccessibility = () => {
  const settings = loadAccessibilitySettings();

  const trigger = document.querySelector(".accessibility-trigger");
  const panel = document.getElementById("accessibility-panel");
  const closeButton = document.querySelector(".accessibility-close");
  const darkButton = document.querySelector(".acc-toggle-dark");
  const contrastButton = document.querySelector(".acc-toggle-contrast");
  const fontButton = document.querySelector(".acc-toggle-font");
  const linksButton = document.querySelector(".acc-toggle-links");
  const motionButton = document.querySelector(".acc-toggle-motion");
  const fontUp = document.querySelector(".acc-font-up");
  const fontDown = document.querySelector(".acc-font-down");
  const fontReset = document.querySelector(".acc-font-reset");

  if (trigger) {
    trigger.addEventListener("click", togglePanel);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePanel();
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", closePanel);
  }

  if (darkButton) {
    darkButton.addEventListener("click", () =>
      setAccessibilitySetting("darkMode", settings),
    );
  }
  if (contrastButton) {
    contrastButton.addEventListener("click", () =>
      setAccessibilitySetting("highContrast", settings),
    );
  }
  if (fontButton) {
    fontButton.addEventListener("click", () =>
      setAccessibilitySetting("readableFont", settings),
    );
  }
  if (linksButton) {
    linksButton.addEventListener("click", () =>
      setAccessibilitySetting("highlightLinks", settings),
    );
  }
  if (motionButton) {
    motionButton.addEventListener("click", () =>
      setAccessibilitySetting("reducedMotion", settings),
    );
  }

  if (fontUp) {
    fontUp.addEventListener("click", () => {
      const nextScale =
        FONT_SCALES.find((scale) => scale > settings.fontScale) || 200;
      setFontScale(settings, nextScale);
    });
  }

  if (fontDown) {
    fontDown.addEventListener("click", () => {
      const scales = [...FONT_SCALES].reverse();
      const nextScale =
        scales.find((scale) => scale < settings.fontScale) || 100;
      setFontScale(settings, nextScale);
    });
  }

  if (fontReset) {
    fontReset.addEventListener("click", () => setFontScale(settings, 100));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanel();
    }
  });

  applyAccessibilitySettings(settings);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAccessibility);
} else {
  initAccessibility();
}
