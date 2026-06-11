---
title: Numbers to Words for Text-to-Speech (TTS) — to-words
description: Generate natural language numbers for TTS engines. to-words converts numbers to spoken words in 132 locales. Works with Web Speech API, Azure TTS, Google TTS.
head:
  - - meta
    - name: keywords
      content: number to words text to speech javascript, TTS number words, spoken numbers javascript, web speech API number words
---

# Numbers for Text-to-Speech (TTS)

TTS engines speak natural language — feeding them `"12345"` sounds robotic. Feed them `"Twelve Thousand Three Hundred Forty Five"` instead.

## The Problem

Raw digits make speech engines guess. Some engines spell each digit, some pause awkwardly, and some fail entirely on locale-specific currency or number grouping.

## Before and After

```txt
Raw digits:  12345
Spoken text: Twelve Thousand Three Hundred Forty Five
```

## Browser: Web Speech API

```js
import { toWords } from 'to-words';

const utterance = new SpeechSynthesisUtterance(toWords(12345, { localeCode: 'en-US' }));
speechSynthesis.speak(utterance);
```

## Multilingual TTS

```js
import { toWords } from 'to-words';

function speakAmount(amount, localeCode, lang) {
  const utterance = new SpeechSynthesisUtterance(toWords(amount, { localeCode }));
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}

speakAmount(1500000, 'hi-IN', 'hi-IN');
speakAmount(12345, 'ar-AE', 'ar-AE');
```

## Node.js: Azure Cognitive Services

```js
import { toWords } from 'to-words';
import sdk from 'microsoft-cognitiveservices-speech-sdk';

const text = toWords(1500000, { localeCode: 'hi-IN' });
// "पंद्रह लाख"

const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
synthesizer.speakTextAsync(text);
```

## Why it matters

Without spoken-number conversion, a TTS engine will either spell out digits or guess a pronunciation. `to-words` outputs clean, grammatically correct words that every TTS engine pronounces correctly.

## Related

- [Getting Started](/guide/getting-started)
- [Hindi locale](/locales/hindi)
- [Arabic locale](/locales/arabic)
- [Framework integration](/guide/framework-integration)
