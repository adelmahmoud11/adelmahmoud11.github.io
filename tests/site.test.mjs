import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const FONTS_CSS = readFileSync(resolve(ROOT, 'fonts', 'fonts.css'), 'utf8');

/** Load the real index.html with its inline scripts running (stub browser APIs). */
function dom() {
  return new JSDOM(HTML, {
    url: 'https://adelmah.com/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
      window.matchMedia =
        window.matchMedia ||
        (q => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
      window.scrollTo = () => {};
      window.HTMLElement.prototype.scrollIntoView = () => {};
    }
  });
}

/** Concatenated text of every inline <style> block in index.html. */
const styleText = [...HTML.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const rootBlock = styleText.match(/:root\{[^}]*\}/)?.[0] ?? '';
const lightBlock = styleText.match(/:root\[data-theme="light"\]\{[^}]*\}/)?.[0] ?? '';

let doc;

beforeAll(() => {
  doc = dom().window.document;
});

describe('بنية الصفحة', () => {
  it('أقسام رئيسية موجودة (services, marketing, work, experience, blog)', () => {
    for (const id of ['services', 'marketing', 'work', 'experience', 'blog']) {
      expect(doc.getElementById(id), `#${id} مفقود`).toBeTruthy();
    }
  });

  it('الاتجاه RTL واللغة عربية', () => {
    expect(doc.documentElement.dir).toBe('rtl');
    expect(doc.documentElement.lang).toBe('ar');
  });
});

describe('نظام الثيم', () => {
  it('زر التبديل يقلب light → dark → light', () => {
    const root = doc.documentElement;
    const btn = doc.getElementById('themeBtn');
    expect(root.dataset.theme).toBe('light');
    btn.click();
    expect(root.dataset.theme).toBe('dark');
    btn.click();
    expect(root.dataset.theme).toBe('light');
  });
});

describe('الهوية «حبر وذهب»', () => {
  it('توكنز الوضع الداكن: خلفية حبرية + ذهبي مطفي', () => {
    expect(rootBlock).toContain('--bg:#0d0b09');
    expect(rootBlock).toContain('--accent:#d9a441');
  });

  it('توكنز الوضع الفاتح: ورقي + ذهبي داكن', () => {
    expect(lightBlock).toContain('--bg:#faf7f0');
    expect(lightBlock).toContain('--accent:#8a6217');
  });

  it('لا بقايا للون التركواز القديم في CSS الصفحة', () => {
    const forbidden = [/3fd4a8/i, /1fa985/i, /5fe3bc/i, /0f9d7e/i, /0c7f67/i, /0b7a62/i, /63,212,168/, /31,169,133/, /15,157,126/];
    for (const re of forbidden) expect(styleText, `لون قديم: ${re}`).not.toMatch(re);
  });

  it('خط Amiri مُحمّل محليًا (fonts.css + ملف woff2 + preload)', () => {
    expect(FONTS_CSS).toMatch(/@font-face\{[^}]*font-family:'Amiri'/);
    expect(existsSync(resolve(ROOT, 'fonts', 'amiri-700-ar.woff2'))).toBe(true);
    expect(HTML).toMatch(/<link rel="preload" as="font"[^>]*amiri-700-ar\.woff2/);
  });
});

describe('التواصل', () => {
  it('روابط البريد وLinkedIn موجودة', () => {
    expect(doc.querySelector('a[href^="mailto:"]')).toBeTruthy();
    expect(doc.querySelector('a[href*="linkedin.com"]')).toBeTruthy();
  });

  it.todo('رابط واتساب موجود (خطوة 5)');
});

describe('محتوى ممنوع', () => {
  it.todo('لا نص «دوام كامل / وظيفة» في meta وOG والسكيما (خطوة 4)');
});
