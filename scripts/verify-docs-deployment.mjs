#!/usr/bin/env node

const siteUrl = process.env.DOCS_URL ?? process.argv[2];
const maximumAttempts = 8;
const retryDelayMs = 5_000;

if (!siteUrl) {
  throw new Error('Set DOCS_URL or pass the deployed GitHub Pages URL as the first argument.');
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function verify() {
  const response = await fetch(siteUrl, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`home page returned HTTP ${response.status}`);
  }

  const html = await response.text();
  if (!/<meta name="generator" content="VitePress v[^"]+">/.test(html)) {
    const generator = /<meta name="generator" content="([^"]+)">/.exec(html)?.[1] ?? 'none';
    throw new Error(`expected VitePress, but the deployed generator is ${generator}`);
  }
  if (!html.includes('Twelve Thousand Three Hundred Forty Five Dollars And Sixty Seven Cents Only')) {
    throw new Error('the deployed number demo is not server-rendered correctly');
  }
  if (html.includes('Loading…') || html.includes('<NumberDemo')) {
    throw new Error('the deployed home page contains an unrendered number demo');
  }

  const modulePath = /<script type="module" src="([^"]+)"><\/script>/.exec(html)?.[1];
  if (!modulePath) {
    throw new Error('the deployed page has no VitePress client module');
  }

  const moduleUrl = new URL(modulePath, response.url);
  const moduleResponse = await fetch(moduleUrl);
  if (!moduleResponse.ok) {
    throw new Error(`client module returned HTTP ${moduleResponse.status}: ${moduleUrl}`);
  }
}

let lastError;
for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
  try {
    await verify();
    console.log(`Verified deployed VitePress site and demo at ${siteUrl}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`Deployment verification attempt ${attempt}/${maximumAttempts} failed: ${error.message}`);
    if (attempt < maximumAttempts) {
      await delay(retryDelayMs);
    }
  }
}

throw lastError;
