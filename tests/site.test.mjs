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

  it('كل بطاقة خدمة فيها مجسم بصري للخدمة', () => {
    expect(doc.querySelectorAll('#services .svc > .card').length).toBe(4);
    expect(doc.querySelector('#services .mock-search'), 'مجسم بحث جوجل مفقود').toBeTruthy();
    expect(doc.querySelector('#services .mock-ad'), 'مجسم الإعلان مفقود').toBeTruthy();
    expect(doc.querySelector('#services .mock-social'), 'مجسم السوشيال مفقود').toBeTruthy();
    expect(doc.querySelector('#services .mock-chart'), 'مجسم التقارير مفقود').toBeTruthy();
  });

  it('أيقونات التواصل بألوان علاماتها', () => {
    for (const c of ['mail', 'play', 'li', 'gh']) {
      expect(doc.querySelectorAll(`.socials a.${c}`).length, `a.${c} في hero وfooter`).toBe(2);
    }
    expect(doc.querySelector('linearGradient#plA'), 'تدرجات Google Play مفقودة').toBeTruthy();
    expect(doc.querySelector('.socials a.play path[fill="url(#plA)"]')).toBeTruthy();
    expect(styleText).toMatch(/#ea4335/i);
    expect(styleText).toMatch(/#0a66c2/i);
  });

  it('بطاقات المهارات بألوان تناسب كل واحدة', () => {
    expect(doc.querySelector('#marketing .svc3 .card.mob .ic'), 'بطاقة الموبايل').toBeTruthy();
    expect(doc.querySelector('#marketing .svc3 .card.web .ic'), 'بطاقة الويب').toBeTruthy();
    expect(doc.querySelector('#marketing .svc3 .card.des .ic'), 'بطاقة التصميم').toBeTruthy();
    expect(styleText).toMatch(/#0468d7/i);
    expect(styleText).toMatch(/#a259ff/i);
    expect(styleText).toMatch(/#f59e0b/i);
  });

  it('بطاقة حاسبة فيها صورة حقيقية للموقع', () => {
    const img = doc.querySelector('.pcard a.pc-shot img[src*="hasba-screenshot"]');
    expect(img, 'صورة الحاسبة مفقودة').toBeTruthy();
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    expect(img.getAttribute('width'), 'عرض الصورة مطلوب لمنع CLS').toBeTruthy();
    expect(img.getAttribute('height'), 'طول الصورة مطلوب لمنع CLS').toBeTruthy();
    expect(doc.querySelector('.mini-calc'), 'الويدجت القديم لسه موجود').toBeNull();
    expect(existsSync(resolve(ROOT, 'hasba-screenshot.webp'))).toBe(true);
  });

  it('بطاقة تخفيضات مثلهما: صورة حقيقية والكارتين قد بعض', () => {
    const img = doc.querySelector('.pcard a.pc-shot img[src*="takhfeedat-screenshot"]');
    expect(img, 'صورة تخفيضات مفقودة').toBeTruthy();
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
    expect(img.getAttribute('width')).toBeTruthy();
    expect(img.getAttribute('height')).toBeTruthy();
    expect(doc.querySelector('.soon-list'), 'القائمة القديمة لسه موجودة').toBeNull();
    expect(existsSync(resolve(ROOT, 'takhfeedat-screenshot.webp'))).toBe(true);
    expect(doc.querySelectorAll('.proj2 .pcard').length).toBe(2);
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

describe('الهوية «التركواز» (زي اللوجو)', () => {
  it('توكنز الوضع الداكن: نفس الألوان الأصلية', () => {
    expect(rootBlock).toContain('--bg:#050d0c');
    expect(rootBlock).toContain('--accent:#3fd4a8');
  });

  it('توكنز الوضع الفاتح: نفس الألوان الأصلية', () => {
    expect(lightBlock).toContain('--bg:#f7f5ef');
    expect(lightBlock).toContain('--accent:#0f9d7e');
  });

  it('لا بقايا للذهبي في CSS الصفحة', () => {
    const forbidden = [/d9a441/i, /b8862f/i, /8a6217/i, /6e4d12/i, /217,164,65/, /138,98,23/, /184,134,47/];
    for (const re of forbidden) expect(styleText, `لون ذهبي: ${re}`).not.toMatch(re);
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
