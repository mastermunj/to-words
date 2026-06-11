import { defineConfig } from 'vitepress';

const siteUrl = 'https://mastermunj.github.io/to-words/';

type FAQEntry = {
  question: string;
  answer: string;
};

function getCanonicalPath(relativePath: string): string {
  const normalized = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');

  if (!normalized) {
    return '/to-words/';
  }

  return `/to-words/${normalized}`;
}

function getFaqHead(pageFaq: unknown) {
  if (!Array.isArray(pageFaq) || pageFaq.length === 0) {
    return [];
  }

  const entries = pageFaq.filter(
    (entry): entry is FAQEntry =>
      Boolean(entry) &&
      typeof entry === 'object' &&
      typeof (entry as FAQEntry).question === 'string' &&
      typeof (entry as FAQEntry).answer === 'string',
  );

  if (entries.length === 0) {
    return [];
  }

  return [
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: entries.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: entry.answer,
          },
        })),
      }),
    ] as const,
  ];
}

export default defineConfig({
  site: siteUrl,
  title: 'to-words',
  description:
    'Convert numbers to words in 132 locales — JavaScript, TypeScript, ESM/CJS/UMD, BigInt, currency, ordinal.',
  base: '/to-words/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname: siteUrl,
  },

  transformHead({ pageData }) {
    const canonicalUrl = new URL(getCanonicalPath(pageData.relativePath), siteUrl).toString();

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ...getFaqHead(pageData.frontmatter.faq),
    ];
  },

  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'to-words' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Convert numbers to words in 132 locales — JavaScript, TypeScript, ESM/CJS/UMD, BigInt, currency, ordinal.',
      },
    ],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'link',
      {
        rel: 'icon',
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔢</text></svg>",
      },
    ],
  ],

  themeConfig: {
    logo: {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔢</text></svg>",
      alt: 'to-words',
    },

    nav: [
      { text: 'Demo', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Use Cases', link: '/use-cases/invoicing' },
      {
        text: 'Locales',
        items: [
          { text: 'Browse All 132 Locales', link: '/locales/' },
          { text: 'Afrikaans', link: '/locales/afrikaans' },
          { text: 'Albanian', link: '/locales/albanian' },
          { text: 'Amharic', link: '/locales/amharic' },
          { text: 'Arabic (9 locales)', link: '/locales/arabic' },
          { text: 'Assamese', link: '/locales/assamese' },
          { text: 'Azerbaijani', link: '/locales/azerbaijani' },
          { text: 'Belarusian', link: '/locales/belarusian' },
          { text: 'Bengali (2 locales)', link: '/locales/bengali' },
          { text: 'Bulgarian', link: '/locales/bulgarian' },
          { text: 'Burmese', link: '/locales/burmese' },
          { text: 'Catalan', link: '/locales/catalan' },
          { text: 'Chinese (3 locales)', link: '/locales/chinese' },
          { text: 'Croatian', link: '/locales/croatian' },
          { text: 'Czech', link: '/locales/czech' },
          { text: 'Danish', link: '/locales/danish' },
          { text: 'Dutch (2 locales)', link: '/locales/dutch' },
          { text: 'English (31 locales)', link: '/locales/english' },
          { text: 'Estonian', link: '/locales/estonian' },
          { text: 'Filipino', link: '/locales/filipino' },
          { text: 'Finnish', link: '/locales/finnish' },
          { text: 'French (7 locales)', link: '/locales/french' },
          { text: 'Georgian', link: '/locales/georgian' },
          { text: 'German (3 locales)', link: '/locales/german' },
          { text: 'Greek', link: '/locales/greek' },
          { text: 'Gujarati', link: '/locales/gujarati' },
          { text: 'Hausa', link: '/locales/hausa' },
          { text: 'Hebrew (2 locales)', link: '/locales/hebrew' },
          { text: 'Hindi', link: '/locales/hindi' },
          { text: 'Hungarian', link: '/locales/hungarian' },
          { text: 'Icelandic', link: '/locales/icelandic' },
          { text: 'Igbo', link: '/locales/igbo' },
          { text: 'Indonesian / Javanese', link: '/locales/indonesian' },
          { text: 'Italian', link: '/locales/italian' },
          { text: 'Japanese', link: '/locales/japanese' },
          { text: 'Kannada', link: '/locales/kannada' },
          { text: 'Khmer', link: '/locales/khmer' },
          { text: 'Korean', link: '/locales/korean' },
          { text: 'Latvian', link: '/locales/latvian' },
          { text: 'Lithuanian', link: '/locales/lithuanian' },
          { text: 'Malay (2 locales)', link: '/locales/malay' },
          { text: 'Malayalam', link: '/locales/malayalam' },
          { text: 'Marathi', link: '/locales/marathi' },
          { text: 'Nepali', link: '/locales/nepali' },
          { text: 'Norwegian', link: '/locales/norwegian' },
          { text: 'Odia', link: '/locales/odia' },
          { text: 'Persian', link: '/locales/persian' },
          { text: 'Polish', link: '/locales/polish' },
          { text: 'Portuguese (4 locales)', link: '/locales/portuguese' },
          { text: 'Punjabi', link: '/locales/punjabi' },
          { text: 'Romanian', link: '/locales/romanian' },
          { text: 'Russian', link: '/locales/russian' },
          { text: 'Serbian', link: '/locales/serbian' },
          { text: 'Sinhala', link: '/locales/sinhala' },
          { text: 'Slovak', link: '/locales/slovak' },
          { text: 'Slovenian', link: '/locales/slovenian' },
          { text: 'Spanish (8 locales)', link: '/locales/spanish' },
          { text: 'Swahili (2 locales)', link: '/locales/swahili' },
          { text: 'Swedish', link: '/locales/swedish' },
          { text: 'Tamil', link: '/locales/tamil' },
          { text: 'Telugu', link: '/locales/telugu' },
          { text: 'Thai', link: '/locales/thai' },
          { text: 'Turkish', link: '/locales/turkish' },
          { text: 'Ukrainian', link: '/locales/ukrainian' },
          { text: 'Urdu', link: '/locales/urdu' },
          { text: 'Uzbek', link: '/locales/uzbek' },
          { text: 'Vietnamese', link: '/locales/vietnamese' },
          { text: 'Yoruba', link: '/locales/yoruba' },
          { text: 'Zulu', link: '/locales/zulu' },
        ],
      },
      { text: 'Compare', link: '/compare/number-to-words-alternatives' },
      { text: 'npm', link: 'https://www.npmjs.com/package/to-words', target: '_blank' },
      { text: 'GitHub', link: 'https://github.com/mastermunj/to-words', target: '_blank' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'API Reference', link: '/guide/api-reference' },
            { text: 'Currency', link: '/guide/currency' },
            { text: 'Ordinal Numbers', link: '/guide/ordinal' },
            { text: 'BigInt & Large Numbers', link: '/guide/bigint' },
            { text: 'Gender-Aware Conversion', link: '/guide/gender' },
            { text: 'Fraction Style (Legal)', link: '/guide/fraction-style' },
            { text: 'Tree-Shaking', link: '/guide/tree-shaking' },
            { text: 'Framework Integration', link: '/guide/framework-integration' },
            { text: 'Migration Guide', link: '/guide/migration' },
          ],
        },
      ],
      '/use-cases/': [
        {
          text: 'Use Cases',
          items: [
            { text: 'Invoicing', link: '/use-cases/invoicing' },
            { text: 'Cheque Printing', link: '/use-cases/check-printing' },
            { text: 'Text-to-Speech', link: '/use-cases/tts' },
            { text: 'Payroll & Payslips', link: '/use-cases/payroll' },
            { text: 'E-commerce Checkout', link: '/use-cases/ecommerce' },
            { text: 'Legal Documents', link: '/use-cases/legal-documents' },
          ],
        },
      ],
      '/locales/': [
        {
          text: 'Locale Directory',
          items: [{ text: 'Browse All 132 Locales', link: '/locales/' }],
        },
        {
          text: 'Language Guides',
          items: [
            { text: 'Afrikaans', link: '/locales/afrikaans' },
            { text: 'Albanian', link: '/locales/albanian' },
            { text: 'Amharic', link: '/locales/amharic' },
            { text: 'Arabic', link: '/locales/arabic' },
            { text: 'Assamese', link: '/locales/assamese' },
            { text: 'Azerbaijani', link: '/locales/azerbaijani' },
            { text: 'Belarusian', link: '/locales/belarusian' },
            { text: 'Bengali', link: '/locales/bengali' },
            { text: 'Bulgarian', link: '/locales/bulgarian' },
            { text: 'Burmese', link: '/locales/burmese' },
            { text: 'Catalan', link: '/locales/catalan' },
            { text: 'Chinese', link: '/locales/chinese' },
            { text: 'Croatian', link: '/locales/croatian' },
            { text: 'Czech', link: '/locales/czech' },
            { text: 'Danish', link: '/locales/danish' },
            { text: 'Dutch', link: '/locales/dutch' },
            { text: 'English', link: '/locales/english' },
            { text: 'Estonian', link: '/locales/estonian' },
            { text: 'Filipino', link: '/locales/filipino' },
            { text: 'Finnish', link: '/locales/finnish' },
            { text: 'French', link: '/locales/french' },
            { text: 'Georgian', link: '/locales/georgian' },
            { text: 'German', link: '/locales/german' },
            { text: 'Greek', link: '/locales/greek' },
            { text: 'Gujarati', link: '/locales/gujarati' },
            { text: 'Hausa', link: '/locales/hausa' },
            { text: 'Hebrew', link: '/locales/hebrew' },
            { text: 'Hindi', link: '/locales/hindi' },
            { text: 'Hungarian', link: '/locales/hungarian' },
            { text: 'Icelandic', link: '/locales/icelandic' },
            { text: 'Igbo', link: '/locales/igbo' },
            { text: 'Indonesian / Javanese', link: '/locales/indonesian' },
            { text: 'Italian', link: '/locales/italian' },
            { text: 'Japanese', link: '/locales/japanese' },
            { text: 'Kannada', link: '/locales/kannada' },
            { text: 'Khmer', link: '/locales/khmer' },
            { text: 'Korean', link: '/locales/korean' },
            { text: 'Latvian', link: '/locales/latvian' },
            { text: 'Lithuanian', link: '/locales/lithuanian' },
            { text: 'Malay', link: '/locales/malay' },
            { text: 'Malayalam', link: '/locales/malayalam' },
            { text: 'Marathi', link: '/locales/marathi' },
            { text: 'Nepali', link: '/locales/nepali' },
            { text: 'Norwegian', link: '/locales/norwegian' },
            { text: 'Odia', link: '/locales/odia' },
            { text: 'Persian', link: '/locales/persian' },
            { text: 'Polish', link: '/locales/polish' },
            { text: 'Portuguese', link: '/locales/portuguese' },
            { text: 'Punjabi', link: '/locales/punjabi' },
            { text: 'Romanian', link: '/locales/romanian' },
            { text: 'Russian', link: '/locales/russian' },
            { text: 'Serbian', link: '/locales/serbian' },
            { text: 'Sinhala', link: '/locales/sinhala' },
            { text: 'Slovak', link: '/locales/slovak' },
            { text: 'Slovenian', link: '/locales/slovenian' },
            { text: 'Spanish', link: '/locales/spanish' },
            { text: 'Swahili', link: '/locales/swahili' },
            { text: 'Swedish', link: '/locales/swedish' },
            { text: 'Tamil', link: '/locales/tamil' },
            { text: 'Telugu', link: '/locales/telugu' },
            { text: 'Thai', link: '/locales/thai' },
            { text: 'Turkish', link: '/locales/turkish' },
            { text: 'Ukrainian', link: '/locales/ukrainian' },
            { text: 'Urdu', link: '/locales/urdu' },
            { text: 'Uzbek', link: '/locales/uzbek' },
            { text: 'Vietnamese', link: '/locales/vietnamese' },
            { text: 'Yoruba', link: '/locales/yoruba' },
            { text: 'Zulu', link: '/locales/zulu' },
          ],
        },
      ],
      '/compare/': [
        {
          text: 'Compare',
          items: [{ text: 'Alternatives', link: '/compare/number-to-words-alternatives' }],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/mastermunj/to-words/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mastermunj/to-words' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/to-words' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Munjal Dhamecha',
    },
  },
});
