"use strict";
/* =====================================================================
   GRAFIKA: vlastní SVG znaky tříd, logo a ornamenty. Bez závislostí, žádná emoji.
   Barvy jdou z CSS proměnných (currentColor / var), takže se řídí tématem.
   ===================================================================== */

// Pětilistá sakura – jeden okvětní lístek, otočí se pětkrát po 72°
const PETAL = "M0 -11 C4 -17 12 -15 11 -7 C10 -2 5 0 0 4 C-5 0 -10 -2 -11 -7 C-12 -15 -4 -17 0 -11Z";
const sakuraPath = (cx, cy, s) => [0,72,144,216,288].map(a =>
  `<path transform="translate(${cx} ${cy}) rotate(${a}) scale(${s})" d="${PETAL}"/>`).join("");

// Znak samuraje: kruh, katana s tsuba
const CREST = {
  samurai: `<circle cx="32" cy="32" r="29" class="cr-ring"/>
    <path d="M14 50 L51 13" class="cr-blade"/>
    <path d="M10 46 L18 54" class="cr-grip"/>
    <ellipse cx="38" cy="26" rx="8.5" ry="3.2" transform="rotate(-45 38 26)" class="cr-guard"/>
    <circle cx="51" cy="13" r="2" class="cr-dot"/>`,
  // Znak ninji: čtyřcípá shuriken hvězda
  ninja: `<circle cx="32" cy="32" r="29" class="cr-ring"/>
    <path d="M32 6 L37 27 L58 32 L37 37 L32 58 L27 37 L6 32 L27 27Z" class="cr-star"/>
    <circle cx="32" cy="32" r="4" class="cr-core"/>`,
  // Znak mnicha: lotos, pět lístků
  monk: `<circle cx="32" cy="32" r="29" class="cr-ring"/>
    <path d="M32 12 C40 22 40 34 32 42 C24 34 24 22 32 12Z" class="cr-petal"/>
    <path d="M32 12 C40 22 40 34 32 42 C24 34 24 22 32 12Z" transform="rotate(-50 32 42)" class="cr-petal"/>
    <path d="M32 12 C40 22 40 34 32 42 C24 34 24 22 32 12Z" transform="rotate(50 32 42)" class="cr-petal"/>
    <path d="M14 46 Q32 54 50 46" class="cr-base"/>`
};

// Vrátí SVG znak třídy (samurai | ninja | monk)
const crest = cls => `<svg class="crest crest-${cls}" viewBox="0 0 64 64" aria-hidden="true">${CREST[cls] || CREST.samurai}</svg>`;

// Logo v záhlaví: sakura s katanou procházející středem
const logoMark = () => `<svg class="logo" viewBox="0 0 64 64" aria-hidden="true">
  <g class="lg-petals">${sakuraPath(32, 30, 1.9)}</g>
  <path d="M10 56 L54 10" class="lg-blade"/>
  <circle cx="32" cy="32" r="3.2" class="lg-core"/>
</svg>`;

// Ornament oddělovače: dvě linky s lístkem uprostřed
const ornament = () => `<svg class="orn" viewBox="0 0 120 12" aria-hidden="true">
  <path d="M0 6 H48 M72 6 H120" class="orn-line"/>
  <g transform="translate(60 6)" class="orn-petal">${sakuraPath(0, 0, .42)}</g></svg>`;
