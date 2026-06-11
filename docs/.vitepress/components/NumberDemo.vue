<template>
  <div class="demo-widget">
    <div class="demo-card">
      <!-- Input row -->
      <div class="demo-input-row">
        <div class="demo-input-group">
          <label for="demo-number">Enter a Number</label>
          <input
            id="demo-number"
            v-model="numberValue"
            type="text"
            class="demo-number-input"
            placeholder="Try any number…"
            autocomplete="off"
            spellcheck="false"
            @input="convert"
          />
        </div>
        <button class="demo-action-btn" title="Random number" aria-label="Generate random number" @click="randomNumber">
          🎲
        </button>
      </div>

      <!-- Controls row -->
      <div class="demo-controls">
        <div class="demo-input-group demo-locale-group">
          <label for="demo-locale-search">Language &amp; Region</label>
          <div class="demo-locale-wrapper" ref="localeWrapper">
            <input
              id="demo-locale-search"
              v-model="localeSearch"
              type="text"
              class="demo-locale-input"
              placeholder="Search locale…"
              autocomplete="off"
              spellcheck="false"
              @focus="onLocaleFocus"
              @blur="onLocaleBlur"
              @input="onLocaleInput"
              @keydown="onLocaleKeydown"
            />
            <div v-if="dropdownOpen" class="demo-locale-dropdown">
              <div
                v-for="(loc, i) in filteredLocales"
                :key="loc.code"
                class="demo-locale-option"
                :class="{ highlighted: i === highlightIndex, selected: loc.code === selectedLocale }"
                @mousedown.prevent="selectLocale(loc)"
              >
                <span class="demo-flag">{{ loc.flag }}</span>
                <div class="demo-locale-details">
                  <div class="demo-lang-country">{{ loc.language }} — {{ loc.country }}</div>
                  <div class="demo-locale-code">{{ loc.code }}</div>
                </div>
              </div>
              <div v-if="filteredLocales.length === 0" class="demo-no-results">No locales found</div>
            </div>
          </div>
        </div>

        <div class="demo-input-group">
          <label>Mode</label>
          <div class="demo-mode-group">
            <button
              v-for="m in modes"
              :key="m.value"
              class="demo-mode-btn"
              :class="{ active: mode === m.value }"
              @click="setMode(m.value)"
            >
              {{ m.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Result -->
      <div class="demo-result" :class="{ error: hasError }">
        <span class="demo-result-text">{{ resultText }}</span>
        <button class="demo-copy-btn" title="Copy result" @click="copyResult">
          {{ copied ? '✅ Copied' : '📋 Copy' }}
        </button>
      </div>

      <div class="demo-result-stats">
        <span>📝 {{ wordCount }} words</span>
        <span>🔤 {{ charCount }} characters</span>
        <span class="demo-locale-badge">{{ selectedLocale }}</span>
      </div>

      <!-- Quick examples -->
      <div class="demo-examples">
        <p class="demo-examples-label">Quick Examples</p>
        <div class="demo-example-grid">
          <button v-for="ex in examples" :key="ex.value" class="demo-example-btn" @click="setExample(ex)">
            <span class="demo-example-num">{{ ex.display }}</span>
            <span class="demo-example-desc">{{ ex.desc }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="demo-stats-bar">
      <span class="demo-stat">🌍 132 Locales</span>
      <span class="demo-stat">⚡ 4M+ ops/sec</span>
      <span class="demo-stat">📦 ~3 KB gzip</span>
      <span class="demo-stat">🔷 TypeScript</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Locale {
  code: string;
  language: string;
  country: string;
  flag: string;
}

// ---------------------------------------------------------------------------
// Library — loaded from CDN so the docs build has no dep on dist/
// ---------------------------------------------------------------------------
declare const ToWords: any;

function loadLibrary(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof ToWords !== 'undefined') {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/to-words@5/dist/umd/to-words.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load to-words from CDN'));
    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Locale list
// ---------------------------------------------------------------------------
const LOCALES: Locale[] = [
  { code: 'af-ZA', language: 'Afrikaans', country: 'South Africa', flag: '🇿🇦' },
  { code: 'am-ET', language: 'Amharic', country: 'Ethiopia', flag: '🇪🇹' },
  { code: 'ar-AE', language: 'Arabic', country: 'UAE', flag: '🇦🇪' },
  { code: 'ar-DZ', language: 'Arabic', country: 'Algeria', flag: '🇩🇿' },
  { code: 'ar-EG', language: 'Arabic', country: 'Egypt', flag: '🇪🇬' },
  { code: 'ar-IQ', language: 'Arabic', country: 'Iraq', flag: '🇮🇶' },
  { code: 'ar-LB', language: 'Arabic', country: 'Lebanon', flag: '🇱🇧' },
  { code: 'ar-MA', language: 'Arabic', country: 'Morocco', flag: '🇲🇦' },
  { code: 'ar-SA', language: 'Arabic', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'ar-SD', language: 'Arabic', country: 'Sudan', flag: '🇸🇩' },
  { code: 'ar-YE', language: 'Arabic', country: 'Yemen', flag: '🇾🇪' },
  { code: 'as-IN', language: 'Assamese', country: 'India', flag: '🇮🇳' },
  { code: 'az-AZ', language: 'Azerbaijani', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'be-BY', language: 'Belarusian', country: 'Belarus', flag: '🇧🇾' },
  { code: 'bg-BG', language: 'Bulgarian', country: 'Bulgaria', flag: '🇧🇬' },
  { code: 'bn-BD', language: 'Bengali', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'bn-IN', language: 'Bengali', country: 'India', flag: '🇮🇳' },
  { code: 'ca-ES', language: 'Catalan', country: 'Spain', flag: '🇪🇸' },
  { code: 'cs-CZ', language: 'Czech', country: 'Czech Republic', flag: '🇨🇿' },
  { code: 'da-DK', language: 'Danish', country: 'Denmark', flag: '🇩🇰' },
  { code: 'de-AT', language: 'German', country: 'Austria', flag: '🇦🇹' },
  { code: 'de-CH', language: 'German', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'de-DE', language: 'German', country: 'Germany', flag: '🇩🇪' },
  { code: 'ee-EE', language: 'Estonian', country: 'Estonia', flag: '🇪🇪' },
  { code: 'el-GR', language: 'Greek', country: 'Greece', flag: '🇬🇷' },
  { code: 'en-AE', language: 'English', country: 'UAE', flag: '🇦🇪' },
  { code: 'en-AU', language: 'English', country: 'Australia', flag: '🇦🇺' },
  { code: 'en-BD', language: 'English', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'en-CA', language: 'English', country: 'Canada', flag: '🇨🇦' },
  { code: 'en-GB', language: 'English', country: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-GH', language: 'English', country: 'Ghana', flag: '🇬🇭' },
  { code: 'en-HK', language: 'English', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'en-IE', language: 'English', country: 'Ireland', flag: '🇮🇪' },
  { code: 'en-IN', language: 'English', country: 'India', flag: '🇮🇳' },
  { code: 'en-IQ', language: 'English', country: 'Iraq', flag: '🇮🇶' },
  { code: 'en-JM', language: 'English', country: 'Jamaica', flag: '🇯🇲' },
  { code: 'en-KE', language: 'English', country: 'Kenya', flag: '🇰🇪' },
  { code: 'en-LK', language: 'English', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'en-MA', language: 'English', country: 'Morocco', flag: '🇲🇦' },
  { code: 'en-MM', language: 'English', country: 'Myanmar', flag: '🇲🇲' },
  { code: 'en-MU', language: 'English', country: 'Mauritius', flag: '🇲🇺' },
  { code: 'en-MY', language: 'English', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'en-NG', language: 'English', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'en-NP', language: 'English', country: 'Nepal', flag: '🇳🇵' },
  { code: 'en-NZ', language: 'English', country: 'New Zealand', flag: '🇳🇿' },
  { code: 'en-OM', language: 'English', country: 'Oman', flag: '🇴🇲' },
  { code: 'en-PH', language: 'English', country: 'Philippines', flag: '🇵🇭' },
  { code: 'en-PK', language: 'English', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'en-SA', language: 'English', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'en-SG', language: 'English', country: 'Singapore', flag: '🇸🇬' },
  { code: 'en-TT', language: 'English', country: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'en-TZ', language: 'English', country: 'Tanzania', flag: '🇹🇿' },
  { code: 'en-UG', language: 'English', country: 'Uganda', flag: '🇺🇬' },
  { code: 'en-US', language: 'English', country: 'USA', flag: '🇺🇸' },
  { code: 'en-ZA', language: 'English', country: 'South Africa', flag: '🇿🇦' },
  { code: 'en-ZW', language: 'English', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: 'es-AR', language: 'Spanish', country: 'Argentina', flag: '🇦🇷' },
  { code: 'es-CL', language: 'Spanish', country: 'Chile', flag: '🇨🇱' },
  { code: 'es-CO', language: 'Spanish', country: 'Colombia', flag: '🇨🇴' },
  { code: 'es-ES', language: 'Spanish', country: 'Spain', flag: '🇪🇸' },
  { code: 'es-MX', language: 'Spanish', country: 'Mexico', flag: '🇲🇽' },
  { code: 'es-PE', language: 'Spanish', country: 'Peru', flag: '🇵🇪' },
  { code: 'es-US', language: 'Spanish', country: 'USA', flag: '🇺🇸' },
  { code: 'es-VE', language: 'Spanish', country: 'Venezuela', flag: '🇻🇪' },
  { code: 'fa-IR', language: 'Persian', country: 'Iran', flag: '🇮🇷' },
  { code: 'fi-FI', language: 'Finnish', country: 'Finland', flag: '🇫🇮' },
  { code: 'fil-PH', language: 'Filipino', country: 'Philippines', flag: '🇵🇭' },
  { code: 'fr-BE', language: 'French', country: 'Belgium', flag: '🇧🇪' },
  { code: 'fr-CA', language: 'French', country: 'Canada', flag: '🇨🇦' },
  { code: 'fr-CH', language: 'French', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'fr-DZ', language: 'French', country: 'Algeria', flag: '🇩🇿' },
  { code: 'fr-FR', language: 'French', country: 'France', flag: '🇫🇷' },
  { code: 'fr-MA', language: 'French', country: 'Morocco', flag: '🇲🇦' },
  { code: 'fr-SA', language: 'French', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'gu-IN', language: 'Gujarati', country: 'India', flag: '🇮🇳' },
  { code: 'ha-NG', language: 'Hausa', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'hbo-IL', language: 'Biblical Hebrew', country: 'Israel', flag: '🇮🇱' },
  { code: 'he-IL', language: 'Hebrew', country: 'Israel', flag: '🇮🇱' },
  { code: 'hi-IN', language: 'Hindi', country: 'India', flag: '🇮🇳' },
  { code: 'hr-HR', language: 'Croatian', country: 'Croatia', flag: '🇭🇷' },
  { code: 'hu-HU', language: 'Hungarian', country: 'Hungary', flag: '🇭🇺' },
  { code: 'id-ID', language: 'Indonesian', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'ig-NG', language: 'Igbo', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'is-IS', language: 'Icelandic', country: 'Iceland', flag: '🇮🇸' },
  { code: 'it-IT', language: 'Italian', country: 'Italy', flag: '🇮🇹' },
  { code: 'ja-JP', language: 'Japanese', country: 'Japan', flag: '🇯🇵' },
  { code: 'jv-ID', language: 'Javanese', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'ka-GE', language: 'Georgian', country: 'Georgia', flag: '🇬🇪' },
  { code: 'km-KH', language: 'Khmer', country: 'Cambodia', flag: '🇰🇭' },
  { code: 'kn-IN', language: 'Kannada', country: 'India', flag: '🇮🇳' },
  { code: 'ko-KR', language: 'Korean', country: 'South Korea', flag: '🇰🇷' },
  { code: 'lt-LT', language: 'Lithuanian', country: 'Lithuania', flag: '🇱🇹' },
  { code: 'lv-LV', language: 'Latvian', country: 'Latvia', flag: '🇱🇻' },
  { code: 'ml-IN', language: 'Malayalam', country: 'India', flag: '🇮🇳' },
  { code: 'mr-IN', language: 'Marathi', country: 'India', flag: '🇮🇳' },
  { code: 'ms-MY', language: 'Malay', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'ms-SG', language: 'Malay', country: 'Singapore', flag: '🇸🇬' },
  { code: 'my-MM', language: 'Burmese', country: 'Myanmar', flag: '🇲🇲' },
  { code: 'nb-NO', language: 'Norwegian', country: 'Norway', flag: '🇳🇴' },
  { code: 'nl-NL', language: 'Dutch', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'nl-SR', language: 'Dutch', country: 'Suriname', flag: '🇸🇷' },
  { code: 'np-NP', language: 'Nepali', country: 'Nepal', flag: '🇳🇵' },
  { code: 'or-IN', language: 'Odia', country: 'India', flag: '🇮🇳' },
  { code: 'pa-IN', language: 'Punjabi', country: 'India', flag: '🇮🇳' },
  { code: 'pl-PL', language: 'Polish', country: 'Poland', flag: '🇵🇱' },
  { code: 'pt-AO', language: 'Portuguese', country: 'Angola', flag: '🇦🇴' },
  { code: 'pt-BR', language: 'Portuguese', country: 'Brazil', flag: '🇧🇷' },
  { code: 'pt-MZ', language: 'Portuguese', country: 'Mozambique', flag: '🇲🇿' },
  { code: 'pt-PT', language: 'Portuguese', country: 'Portugal', flag: '🇵🇹' },
  { code: 'ro-RO', language: 'Romanian', country: 'Romania', flag: '🇷🇴' },
  { code: 'ru-RU', language: 'Russian', country: 'Russia', flag: '🇷🇺' },
  { code: 'si-LK', language: 'Sinhala', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'sk-SK', language: 'Slovak', country: 'Slovakia', flag: '🇸🇰' },
  { code: 'sl-SI', language: 'Slovenian', country: 'Slovenia', flag: '🇸🇮' },
  { code: 'sq-AL', language: 'Albanian', country: 'Albania', flag: '🇦🇱' },
  { code: 'sr-RS', language: 'Serbian', country: 'Serbia', flag: '🇷🇸' },
  { code: 'sv-SE', language: 'Swedish', country: 'Sweden', flag: '🇸🇪' },
  { code: 'sw-KE', language: 'Swahili', country: 'Kenya', flag: '🇰🇪' },
  { code: 'sw-TZ', language: 'Swahili', country: 'Tanzania', flag: '🇹🇿' },
  { code: 'ta-IN', language: 'Tamil', country: 'India', flag: '🇮🇳' },
  { code: 'te-IN', language: 'Telugu', country: 'India', flag: '🇮🇳' },
  { code: 'th-TH', language: 'Thai', country: 'Thailand', flag: '🇹🇭' },
  { code: 'tr-TR', language: 'Turkish', country: 'Turkey', flag: '🇹🇷' },
  { code: 'uk-UA', language: 'Ukrainian', country: 'Ukraine', flag: '🇺🇦' },
  { code: 'ur-PK', language: 'Urdu', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'uz-UZ', language: 'Uzbek', country: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'vi-VN', language: 'Vietnamese', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'yo-NG', language: 'Yoruba', country: 'Nigeria', flag: '🇳🇬' },
  { code: 'yue-HK', language: 'Cantonese', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'zh-CN', language: 'Chinese', country: 'China', flag: '🇨🇳' },
  { code: 'zh-TW', language: 'Chinese', country: 'Taiwan', flag: '🇹🇼' },
  { code: 'zu-ZA', language: 'Zulu', country: 'South Africa', flag: '🇿🇦' },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const numberValue = ref('12345.67');
const selectedLocale = ref('en-US');
const mode = ref<'currency' | 'words' | 'ordinal'>('currency');
const resultText = ref('Loading…');
const hasError = ref(false);
const copied = ref(false);
const libraryReady = ref(false);

const localeSearch = ref('');
const dropdownOpen = ref(false);
const highlightIndex = ref(-1);
const localeWrapper = ref<HTMLElement | null>(null);

const modes = [
  { value: 'currency', label: '💰 Currency' },
  { value: 'words', label: '🔤 Words' },
  { value: 'ordinal', label: '🏅 Ordinal' },
];

const examples = [
  { value: '42', display: '42', desc: 'The Answer', mode: 'words' },
  { value: '1234.56', display: '1,234.56', desc: 'Currency', mode: 'currency' },
  { value: '1000000', display: '1,000,000', desc: 'One Million', mode: 'words' },
  { value: '1', display: '1st', desc: 'Ordinal', mode: 'ordinal' },
  { value: '9007199254740993', display: '9×10¹⁵', desc: 'Beyond MAX_SAFE', mode: 'words' },
  { value: '100000000000000000', display: '10¹⁷', desc: 'Shankh / Quintillion', mode: 'words' },
  { value: '-273.15', display: '-273.15', desc: 'Negative', mode: 'words' },
  { value: '3.14159', display: 'π', desc: 'Pi', mode: 'words' },
];

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------
const filteredLocales = computed(() => {
  const q = localeSearch.value.toLowerCase();
  // If value matches the display format of the currently selected locale, show all
  const sel = LOCALES.find((l) => l.code === selectedLocale.value);
  if (sel && localeSearch.value === `${sel.flag} ${sel.language} — ${sel.country} (${sel.code})`) {
    return LOCALES;
  }
  return LOCALES.filter(
    (l) =>
      l.language.toLowerCase().includes(q) || l.country.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
  );
});

const wordCount = computed(() => {
  if (hasError.value) {
    return 0;
  }
  return resultText.value.split(/\s+/).filter(Boolean).length;
});

const charCount = computed(() => {
  if (hasError.value) {
    return 0;
  }
  return resultText.value.length;
});

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------
function localeDisplayText(loc: Locale) {
  return `${loc.flag} ${loc.language} — ${loc.country} (${loc.code})`;
}

function convert() {
  if (!libraryReady.value) {
    return;
  }
  const raw = numberValue.value.trim();
  try {
    const tw = new ToWords({ localeCode: selectedLocale.value });
    let result: string;
    if (mode.value === 'ordinal') {
      const n = Number.parseInt(raw, 10);
      if (Number.isNaN(n) || n < 0) {
        throw new Error('Ordinal requires a non-negative integer');
      }
      result = tw.toOrdinal(n);
    } else {
      const n = raw.includes('.') || raw.length < 16 ? Number.parseFloat(raw) : raw;
      if (typeof n === 'number' && Number.isNaN(n)) {
        throw new Error('Please enter a valid number');
      }
      result = tw.convert(n, { currency: mode.value === 'currency' });
    }
    resultText.value = result;
    hasError.value = false;
  } catch (e: any) {
    resultText.value = e.message ?? 'Error';
    hasError.value = true;
  }
}

function setMode(m: string) {
  mode.value = m as any;
  convert();
}

function setExample(ex: { value: string; mode: string }) {
  numberValue.value = ex.value;
  mode.value = ex.mode as any;
  convert();
}

function randomNumber() {
  const ranges = [
    () => Math.floor(Math.random() * 1000),
    () => (Math.random() * 10000).toFixed(2),
    () => Math.floor(Math.random() * 1000000),
  ];
  numberValue.value = String(ranges[Math.floor(Math.random() * ranges.length)]());
  convert();
}

async function copyResult() {
  if (!resultText.value || hasError.value) {
    return;
  }
  try {
    await navigator.clipboard.writeText(resultText.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // ignore
  }
}

// Locale dropdown
function onLocaleFocus() {
  localeSearch.value = '';
  dropdownOpen.value = true;
  highlightIndex.value = -1;
}

function onLocaleBlur() {
  setTimeout(() => {
    dropdownOpen.value = false;
    // Restore display text of currently selected locale
    const sel = LOCALES.find((l) => l.code === selectedLocale.value);
    if (sel) {
      localeSearch.value = localeDisplayText(sel);
    }
  }, 150);
}

function onLocaleInput() {
  dropdownOpen.value = true;
  highlightIndex.value = -1;
}

function onLocaleKeydown(e: KeyboardEvent) {
  if (!dropdownOpen.value) {
    if (e.key === 'ArrowDown') {
      dropdownOpen.value = true;
      e.preventDefault();
    }
    return;
  }
  const list = filteredLocales.value;
  if (e.key === 'ArrowDown') {
    highlightIndex.value = Math.min(highlightIndex.value + 1, list.length - 1);
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    highlightIndex.value = Math.max(highlightIndex.value - 1, 0);
    e.preventDefault();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const target = highlightIndex.value >= 0 ? list[highlightIndex.value] : list[0];
    if (target) {
      selectLocale(target);
    }
  } else if (e.key === 'Escape') {
    dropdownOpen.value = false;
  }
}

function selectLocale(loc: Locale) {
  selectedLocale.value = loc.code;
  localeSearch.value = localeDisplayText(loc);
  dropdownOpen.value = false;
  convert();
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
onMounted(async () => {
  const sel = LOCALES.find((l) => l.code === 'en-US')!;
  localeSearch.value = localeDisplayText(sel);
  try {
    await loadLibrary();
    libraryReady.value = true;
    convert();
  } catch {
    resultText.value = 'Could not load library';
    hasError.value = true;
  }
});
</script>

<style scoped>
.demo-widget {
  margin: 2rem 0;
}

.demo-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 1.5rem;
}

.demo-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.demo-input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.demo-input-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-number-input,
.demo-locale-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.demo-number-input:focus,
.demo-locale-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.demo-action-btn {
  padding: 0.75rem 1rem;
  font-size: 1.2rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.demo-action-btn:hover {
  opacity: 0.85;
}

.demo-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: start;
}

.demo-locale-group {
  min-width: 0;
}

.demo-locale-wrapper {
  position: relative;
}

.demo-locale-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 260px;
  overflow-y: auto;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand-1);
  border-top: none;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.demo-locale-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background 0.1s;
}

.demo-locale-option:last-child {
  border-bottom: none;
}
.demo-locale-option:hover,
.demo-locale-option.highlighted {
  background: var(--vp-c-brand-soft);
}
.demo-locale-option.selected {
  background: var(--vp-c-brand-1);
  color: white;
}
.demo-locale-option.selected .demo-locale-code {
  color: rgba(255, 255, 255, 0.75);
}

.demo-flag {
  font-size: 1.2rem;
}
.demo-locale-details {
  display: flex;
  flex-direction: column;
}
.demo-lang-country {
  font-size: 0.9rem;
  font-weight: 500;
}
.demo-locale-code {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}

.demo-no-results {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.demo-mode-group {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.demo-mode-btn {
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.demo-mode-btn:hover {
  border-color: var(--vp-c-brand-1);
}
.demo-mode-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.demo-result {
  position: relative;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-3) 100%);
  border-radius: 12px;
  padding: 1.25rem 4rem 1.25rem 1.25rem;
  min-height: 3.5rem;
  display: flex;
  align-items: center;
}

.demo-result.error {
  background: var(--vp-c-danger-soft);
}
.demo-result.error .demo-result-text {
  color: var(--vp-c-danger-1);
}

.demo-result-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  line-height: 1.5;
}

.demo-copy-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.demo-copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.demo-result-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
}

.demo-locale-badge {
  margin-left: auto;
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
}

.demo-examples {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}
.demo-examples-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.demo-example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.6rem;
}

.demo-example-btn {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0.75rem;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
}

.demo-example-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.demo-example-num {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}
.demo-example-desc {
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
}

.demo-stats-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.demo-stat {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
}

@media (max-width: 600px) {
  .demo-controls {
    grid-template-columns: 1fr;
  }
  .demo-input-row {
    flex-direction: column;
  }
  .demo-action-btn {
    align-self: flex-start;
  }
}
</style>
