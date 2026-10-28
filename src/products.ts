/*
 * AlpicAir wall-mounted (air-to-air) units: content from alpicair.com (LV pages
 * and spec tables, October 2026). Photos of the indoor units are alpicair.com's
 * product shots, cut tight to each unit and kept in public/units/, so the site
 * does not depend on hot-linking.
 */

const SITE = "https://alpicair.com";


export type Spec = [label: string, value: string];
export type Variant = { code: string; label: string; specs: Spec[] };
export type WallProduct = {
  id: string;
  name: string;
  finish?: string;
  kicker: string;
  /** indoor unit photo; empty until the product has one */
  img?: string;
  /** pixel size of the photo (already cut tight to the unit) */
  size?: [width: number, height: number];
  /** dark casing: gets a faint rim light so it reads against the wall */
  dark?: boolean;
  /** product announced but without photo and data yet */
  upcoming?: boolean;
  desc: string;
  highlights: [value: string, label: string][];
  variants: Variant[];
  url?: string;
};

const acSpecs = (c: string, h: string, seer: string, scop: string, cls: string, noise: string, heat: string, cool: string): Spec[] => [
  ["Dzesēšanas jauda", `${c} kW`],
  ["Sildīšanas jauda", `${h} kW`],
  ["SEER", seer],
  ["SCOP", scop],
  ["Energoklase (dzes./apk.)", cls],
  ["Iekšdaļas troksnis no", `${noise} dB(A)`],
  ["Darbība apsildē", heat],
  ["Darbība dzesēšanā", cool],
];

export const PRODUCTS: WallProduct[] = [
  {
    id: "fjord",
    name: "Fjord Prime",
    kicker: "Sienas tipa split sistēma · jaunums",
    img: "units/fjord-prime.webp",
    size: [471, 180],
    desc: "Leģendārās Hyper Nordic sērijas pēctecis: patentēts divpakāpju kompresors ar EVI, palielināts ārējā bloka siltummainis un apsilde līdz −35 °C. Iebūvēts Wi-Fi ar Bluetooth, Cold Plasma ģenerators un iekšējais bloks no 19 dB(A).",
    highlights: [
      ["−35 °C", "apsilde līdz"],
      ["8,6", "SEER līdz"],
      ["19 dB(A)", "no"],
    ],
    variants: [
      { code: "AWI-30HRDC1S", label: "2,7 kW", specs: acSpecs("2,7", "3,5", "8,6", "5,1", "A+++ / A+++", "19", "−35…+30 °C", "−18…+52 °C") },
      { code: "AWI-42HRDC1S", label: "3,5 kW", specs: acSpecs("3,53", "4,2", "8,5", "5,1", "A+++ / A+++", "20", "−35…+30 °C", "−18…+52 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri/Fjord-Prime-s%C4%93rijas`,
  },
  {
    id: "hyper-nordic",
    name: "Hyper Nordic",
    kicker: "Sienas tipa split sistēma",
    img: "units/hyper-nordic.webp",
    size: [432, 143],
    desc: "Augstas efektivitātes invertora kondicionieris ekstremālām temperatūrām. Darbojas kluss un spēj uzturēt telpā arī zemu temperatūru — līdz +8 °C.",
    highlights: [
      ["−30 °C", "apsilde līdz"],
      ["8,5", "SEER līdz"],
      ["A+++", "energoklase"],
    ],
    variants: [
      { code: "AWI-20HRDC1A", label: "2,7 kW", specs: acSpecs("2,7", "3,5", "8,50", "5,10", "A+++ / A+++", "22", "−30…+24 °C", "−15…+52 °C") },
      { code: "AWI-40HRDC1A", label: "3,5 kW", specs: acSpecs("3,5", "4,2", "8,50", "5,10", "A+++ / A+++", "21", "−30…+24 °C", "−15…+52 °C") },
      { code: "AWI-60HRDC1A", label: "5,3 kW", specs: acSpecs("5,3", "5,6", "6,60", "4,40", "A++ / A+", "33", "−30…+24 °C", "−15…+52 °C") },
      { code: "AWI-80HRDC1A", label: "7,0 kW", specs: acSpecs("7,0", "7,0", "6,50", "4,10", "A++ / A+", "35", "−30…+24 °C", "−15…+52 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri/hyper-nordic-series`,
  },
  {
    id: "premium-pro",
    name: "Premium PRO III",
    kicker: "Sienas tipa split sistēma",
    img: "units/premium-pro.webp",
    size: [474, 149],
    desc: "Kluss un efektīvs AlpicAir Premium klases invertora kondicionieris. Plaša jaudu izvēle — no 1,5 kW mazai guļamistabai līdz 7,1 kW lielai dzīvojamajai telpai.",
    highlights: [
      ["8,4", "SEER līdz"],
      ["21 dB(A)", "no"],
      ["1,5–7,1 kW", "jaudas"],
    ],
    variants: [
      { code: "AWI-15HRDC1G", label: "1,5 kW", specs: acSpecs("1,5", "2,1", "6,6", "4,0", "A++ / A+", "21", "−15…+44 °C", "−15…+43 °C") },
      { code: "AWI-26HRDC1G", label: "2,7 kW", specs: acSpecs("2,7", "3,0", "8,4", "4,5", "A++ / A+", "22", "−25…+30 °C", "−25…+50 °C") },
      { code: "AWI-36HRDC1G", label: "3,5 kW", specs: acSpecs("3,51", "3,81", "7,1", "4,1", "A++ / A+", "25", "−25…+30 °C", "−25…+50 °C") },
      { code: "AWI-54HRDC1G", label: "5,3 kW", specs: acSpecs("5,3", "5,6", "7,3", "4,2", "A++ / A+", "28", "−25…+30 °C", "−25…+50 °C") },
      { code: "AWI-71HRDC1G", label: "7,1 kW", specs: acSpecs("7,1", "7,8", "7,0", "4,2", "A++ / A+", "35", "−25…+30 °C", "−25…+50 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri/sienas-tipa-split-sist%C4%93mas?product_id=220`,
  },
  {
    id: "trendy-black",
    name: "Trendy",
    finish: "Black",
    dark: true,
    kicker: "Sienas tipa split sistēma",
    img: "units/trendy-black.webp",
    size: [473, 156],
    desc: "Kluss un efektīvs Premium klases invertora kondicionieris melnā korpusā. Zems enerģijas patēriņš, vairāki darbības režīmi un LED ekrāns.",
    highlights: [
      ["8,5", "SEER līdz"],
      ["22 dB(A)", "no"],
      ["−25 °C", "apsilde līdz"],
    ],
    variants: [
      { code: "AWI-26HRDC1TB", label: "2,7 kW", specs: acSpecs("2,7", "3,0", "8,5", "4,6", "A+++ / A++", "22", "−25…+30 °C", "−15…+50 °C") },
      { code: "AWI-36HRDC1TB", label: "3,5 kW", specs: acSpecs("3,51", "3,81", "7,2", "4,1", "A++ / A+", "25", "−25…+30 °C", "−15…+50 °C") },
      { code: "AWI-54HRDC1TB", label: "5,3 kW", specs: acSpecs("5,3", "5,35", "7,3", "4,2", "A++ / A+", "26", "−25…+30 °C", "−15…+50 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri/sienas-tipa-split-sist%C4%93mas?product_id=210`,
  },
  {
    id: "trendy-white",
    name: "Trendy",
    finish: "White",
    kicker: "Sienas tipa split sistēma",
    img: "units/trendy-white.webp",
    size: [491, 164],
    desc: "Tā pati Trendy sērija baltā korpusā — kluss Premium klases invertora kondicionieris ar LED ekrānu un vairākiem darbības režīmiem.",
    highlights: [
      ["8,5", "SEER līdz"],
      ["7,1 kW", "jauda līdz"],
      ["−25 °C", "apsilde līdz"],
    ],
    variants: [
      { code: "AWI-26HRDC1TW", label: "2,7 kW", specs: acSpecs("2,7", "3,0", "8,5", "4,6", "A+++ / A++", "22", "−25…+30 °C", "−15…+50 °C") },
      { code: "AWI-36HRDC1TW1", label: "3,5 kW", specs: acSpecs("3,51", "3,81", "7,2", "4,1", "A++ / A+", "25", "−25…+30 °C", "−15…+50 °C") },
      { code: "AWI-54HRDC1TW1", label: "5,3 kW", specs: acSpecs("5,3", "5,35", "7,3", "4,2", "A++ / A+", "26", "−25…+30 °C", "−15…+50 °C") },
      { code: "AWI-71HRDC1TW1", label: "7,1 kW", specs: acSpecs("7,1", "7,3", "7,0", "4,3", "A++ / A+", "33", "−25…+30 °C", "−15…+50 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri/sienas-tipa-split-sist%C4%93mas?product_id=214`,
  },
  {
    id: "eco-x",
    name: "Eco X",
    kicker: "Sienas tipa split sistēma",
    img: "units/eco-x.webp",
    size: [371, 143],
    desc: "Mūsdienīga un stilīga dizaina kondicionieris jebkuram interjeram. Swing režīms kustina žalūzijas, lai temperatūra telpā sadalītos vienmērīgi.",
    highlights: [
      ["6,7", "SEER līdz"],
      ["27 dB(A)", "no"],
      ["A++ / A+", "energoklase"],
    ],
    variants: [
      { code: "AWI-25HRDC1XD", label: "2,65 kW", specs: acSpecs("2,65", "2,7", "6,5", "4,0", "A++ / A+", "27", "−15…+30 °C", "−10…+49 °C") },
      { code: "AWI-35HRDC1XD", label: "3,5 kW", specs: acSpecs("3,5", "3,6", "6,2", "4,0", "A++ / A+", "27", "−15…+30 °C", "−10…+49 °C") },
      { code: "AWI-54HRDC1XD", label: "5,1 kW", specs: acSpecs("5,1", "5,2", "6,7", "4,0", "A++ / A+", "31", "−15…+32 °C", "−15…+49 °C") },
      { code: "AWI-71HRDC1XD", label: "7,2 kW", specs: acSpecs("7,2", "7,2", "6,1", "4,0", "A++ / A+", "32", "−15…+32 °C", "−15…+49 °C") },
    ],
    url: `${SITE}/lv/produkti/sadz%C4%ABves-gaisa-kondicionieri?product_id=193`,
  },
];

export const LOGO = "logo.webp";
export const CONTACT = `${SITE}/contact`;
export const HOME = `${SITE}/lv/`;
