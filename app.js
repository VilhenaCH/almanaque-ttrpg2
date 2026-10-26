/* Almanaque TTRPG, por vilhenach. Arquivo único, sem build: edite este arquivo direto.
   Seções: ícones · texturas · volumes isométricos · modelo (Ateliê e mesa) · câmera e luz · desenho · operações · toque · interface. */
(() => {
'use strict';
const VERSAO = '0.1.0';
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------------- ícones (24x24, traço) ---------------- */
const IC = {
  mover:'<path d="M12 2v20M2 12h20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3"/>',
  piso:'<path d="M3 3h18v18H3zM3 12h18M12 3v18"/><path d="M3 3h9v9H3z" fill="currentColor" stroke="none" opacity=".55"/>',
  parede:'<path d="M3 5h18v14H3zM3 12h18M9 5v7M15 12v7"/>',
  objeto:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  apagar:'<path d="M20 20H9l-5-5a2 2 0 0 1 0-3l8-8a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3zM7 10l7 7"/>',
  regua:'<path d="M2 8h20v8H2zM6 8v3M10 8v4M14 8v3M18 8v4"/>',
  luz:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  neblina:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  fichas:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  undo:'<path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>',
  redo:'<path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  iso:'<path d="M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5"/>',
  giro:'<path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>'
};
const icon = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
$('#b-undo').innerHTML = icon('undo'); $('#b-redo').innerHTML = icon('redo');
$('#b-menu').innerHTML = icon('menu'); $('#b-fit').innerHTML = icon('fit');
$('#b-iso').innerHTML = icon('iso'); $('#b-rot').innerHTML = icon('giro');
/* ---------------- texturas de piso desenhadas por código ---------------- */
const T = 96;
function rng(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function speck(c, r, n, cols, s){ for(let i = 0; i < n; i++){ c.fillStyle = cols[(r() * cols.length) | 0]; c.fillRect(r() * T, r() * T, s * (0.5 + r()), s * (0.5 + r())); } }
const FLOORS = [
  null,
  { id:'pedra', n:'Pedra', avg:'#868c92', gen(c, r){
    c.fillStyle = '#868c92'; c.fillRect(0, 0, T, T);
    const sx = T / 2 + (r() - .5) * 14, sy = T / 2 + (r() - .5) * 14;
    [[0, 0, sx, sy], [sx, 0, T - sx, sy], [0, sy, sx, T - sy], [sx, sy, T - sx, T - sy]].forEach(q => { c.fillStyle = `hsl(210,6%,${48 + r() * 12}%)`; c.fillRect(q[0], q[1], q[2], q[3]); c.strokeStyle = 'rgba(25,30,35,.6)'; c.lineWidth = 2.5; c.strokeRect(q[0] + 1, q[1] + 1, q[2] - 2, q[3] - 2); });
    speck(c, r, 70, ['rgba(255,255,255,.12)', 'rgba(0,0,0,.14)'], 2.4); } },
  { id:'madeira', n:'Madeira', avg:'#8a5a33', gen(c, r){
    for(let i = 0; i < 4; i++){ const y = i * 24; c.fillStyle = `hsl(28,42%,${32 + r() * 11}%)`; c.fillRect(0, y, T, 24);
      c.strokeStyle = 'rgba(40,22,10,.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, y + 1); c.lineTo(T, y + 1); c.stroke();
      c.strokeStyle = 'rgba(40,22,10,.22)'; c.lineWidth = 1; for(let g = 0; g < 4; g++){ const gy = y + 4 + r() * 16; c.beginPath(); c.moveTo(0, gy); c.bezierCurveTo(T * .3, gy + (r() - .5) * 4, T * .6, gy + (r() - .5) * 4, T, gy); c.stroke(); }
      const jx = 10 + r() * (T - 20); c.strokeStyle = 'rgba(40,22,10,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(jx, y); c.lineTo(jx, y + 24); c.stroke();
      c.fillStyle = 'rgba(30,18,8,.55)'; c.fillRect(jx - 4, y + 5, 2, 2); c.fillRect(jx - 4, y + 17, 2, 2); } } },
  { id:'azulejo', n:'Azulejo', avg:'#c9c0aa', gen(c, r){
    for(let i = 0; i < 2; i++) for(let j = 0; j < 2; j++){ c.fillStyle = (i + j) % 2 ? '#bdb49c' : '#dcd4c0'; c.fillRect(i * 48, j * 48, 48, 48); }
    c.strokeStyle = '#8f8978'; c.lineWidth = 2.5; c.strokeRect(1, 1, T - 2, T - 2); c.beginPath(); c.moveTo(48, 0); c.lineTo(48, T); c.moveTo(0, 48); c.lineTo(T, 48); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(6, 6, 18, 3); c.fillRect(54, 54, 18, 3); speck(c, r, 25, ['rgba(0,0,0,.06)'], 2); } },
  { id:'concreto', n:'Concreto', avg:'#9a9c99', gen(c, r){
    c.fillStyle = '#9a9c99'; c.fillRect(0, 0, T, T); speck(c, r, 220, ['rgba(255,255,255,.12)', 'rgba(0,0,0,.12)', 'rgba(0,0,0,.07)'], 2.2);
    if(r() < .5){ c.strokeStyle = 'rgba(40,40,40,.35)'; c.lineWidth = 1.4; c.beginPath(); let x = r() * T, y = 0; c.moveTo(x, y); for(let i = 0; i < 6; i++){ x += (r() - .5) * 20; y += 16; c.lineTo(x, y); } c.stroke(); } } },
  { id:'asfalto', n:'Asfalto', avg:'#3b3e42', gen(c, r){
    c.fillStyle = '#3b3e42'; c.fillRect(0, 0, T, T); speck(c, r, 320, ['rgba(255,255,255,.10)', 'rgba(255,255,255,.05)', 'rgba(0,0,0,.2)'], 2); } },
  { id:'grama', n:'Grama', avg:'#4d7a38', gen(c, r){
    c.fillStyle = '#4d7a38'; c.fillRect(0, 0, T, T);
    for(let i = 0; i < 9; i++){ c.fillStyle = r() < .5 ? 'rgba(96,142,66,.28)' : 'rgba(54,96,40,.30)'; c.beginPath(); c.ellipse(r() * T, r() * T, 10 + r() * 14, 8 + r() * 10, r() * 3, 0, 7); c.fill(); }
    const cols = ['#3d6a2c', '#68964a', '#5a8a41', '#7aa656'];
    for(let i = 0; i < 130; i++){ const x = r() * T, y = r() * T, l = 4 + r() * 6; c.strokeStyle = cols[(r() * 4) | 0]; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 4, y - l); c.stroke(); } } },
  { id:'terra', n:'Terra', avg:'#8b6b47', gen(c, r){
    c.fillStyle = '#8b6b47'; c.fillRect(0, 0, T, T);
    for(let i = 0; i < 7; i++){ c.fillStyle = r() < .5 ? 'rgba(160,125,85,.25)' : 'rgba(80,58,36,.25)'; c.beginPath(); c.ellipse(r() * T, r() * T, 10 + r() * 14, 7 + r() * 9, r() * 3, 0, 7); c.fill(); }
    for(let i = 0; i < 34; i++){ c.fillStyle = r() < .5 ? '#a68a64' : '#6e5236'; c.beginPath(); c.ellipse(r() * T, r() * T, 1.5 + r() * 2.6, 1.2 + r() * 2, r() * 3, 0, 7); c.fill(); } } },
  { id:'areia', n:'Areia', avg:'#d2bd8c', gen(c, r){
    c.fillStyle = '#d2bd8c'; c.fillRect(0, 0, T, T); speck(c, r, 220, ['#e6d4a6', '#b9a373', '#dcc896'], 1.8);
    c.strokeStyle = 'rgba(150,125,80,.22)'; c.lineWidth = 1.4; for(let i = 0; i < 3; i++){ const y = 15 + i * 30 + r() * 8; c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(30, y - 8, 60, y + 8, T, y - 2); c.stroke(); } } },
  { id:'neve', n:'Neve', avg:'#e1eaf0', gen(c, r){
    c.fillStyle = '#e9f0f5'; c.fillRect(0, 0, T, T);
    for(let i = 0; i < 8; i++){ c.fillStyle = 'rgba(176,200,218,.35)'; c.beginPath(); c.ellipse(r() * T, r() * T, 8 + r() * 16, 5 + r() * 9, r() * 3, 0, 7); c.fill(); }
    speck(c, r, 60, ['rgba(255,255,255,.95)', 'rgba(170,195,214,.35)'], 2.2); } },
  { id:'agua', n:'Água', avg:'#2f6f94', gen(c, r){
    c.fillStyle = '#2f6f94'; c.fillRect(0, 0, T, T);
    for(let i = 0; i < 7; i++){ c.fillStyle = 'rgba(30,85,120,.35)'; c.beginPath(); c.ellipse(r() * T, r() * T, 12 + r() * 14, 7 + r() * 8, r() * 3, 0, 7); c.fill(); }
    c.strokeStyle = 'rgba(150,205,230,.5)'; c.lineWidth = 1.8; for(let i = 0; i < 9; i++){ const x = r() * T, y = r() * T, w = 10 + r() * 14; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + w / 2, y - 5, x + w, y); c.stroke(); } } }
];
const TILES = FLOORS.map((f, i) => { if(!f) return null; const out = []; for(let v = 0; v < 4; v++){ const cv = document.createElement('canvas'); cv.width = cv.height = T; f.gen(cv.getContext('2d'), rng(i * 1009 + v * 31 + 7)); out.push(cv); } return out; });
const FTHUMB = TILES.map(t => t ? t[0].toDataURL() : '');

/* ---------------- objetos desenhados por código (unidade = 1 quadrado) ---------------- */
function rr(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function fs(c, fill, stroke, lw){ if(fill){ c.fillStyle = fill; c.fill(); } if(stroke){ c.strokeStyle = stroke; c.lineWidth = lw || .05; c.stroke(); } }
function disc(c, x, y, r, fill, stroke, lw){ c.beginPath(); c.arc(x, y, r, 0, 7); fs(c, fill, stroke, lw); }
function flame(c, s){ c.save(); c.scale(s, s); c.beginPath(); c.moveTo(0, -.34); c.bezierCurveTo(.2, -.12, .22, .1, 0, .2); c.bezierCurveTo(-.22, .1, -.2, -.12, 0, -.34); fs(c, '#ef8a2a'); c.beginPath(); c.moveTo(0, -.16); c.bezierCurveTo(.1, -.02, .1, .08, 0, .12); c.bezierCurveTo(-.1, .08, -.1, -.02, 0, -.16); fs(c, '#ffd36b'); c.restore(); }
const OBJ = {
  mesa:{ n:'Mesa', w:2, h:1, draw(c){ rr(c, -.92, -.42, 1.84, .84, .08); fs(c, '#9a6a3a', '#5e3b1c', .05); c.strokeStyle = 'rgba(60,35,15,.35)'; c.lineWidth = .02; for(let i = -.25; i <= .26; i += .25){ c.beginPath(); c.moveTo(-.85, i); c.lineTo(.85, i); c.stroke(); } } },
  cadeira:{ n:'Cadeira', w:1, h:1, draw(c){ rr(c, -.28, -.26, .56, .56, .08); fs(c, '#7b5232', '#4a2f18', .04); rr(c, -.3, -.36, .6, .14, .05); fs(c, '#5e3b1c', '#3a2310', .03); } },
  sofa:{ n:'Sofá', w:2, h:1, draw(c){ rr(c, -.92, -.38, 1.84, .76, .1); fs(c, '#4b6a82', '#2b4153', .05); rr(c, -.92, -.4, 1.84, .24, .08); fs(c, '#3d5a71', '#2b4153', .04); rr(c, -.84, -.12, .8, .44, .06); fs(c, '#587b96'); rr(c, .04, -.12, .8, .44, .06); fs(c, '#587b96'); } },
  cama:{ n:'Cama', w:1, h:2, draw(c){ rr(c, -.46, -.96, .92, 1.92, .08); fs(c, '#6b4524', '#3f2812', .05); rr(c, -.4, -.9, .8, 1.8, .06); fs(c, '#e3dccb'); rr(c, -.4, -.05, .8, .95, .06); fs(c, '#8a3b3b', '#5e2424', .03); rr(c, -.3, -.82, .6, .32, .08); fs(c, '#f4f0e4', '#bdb6a4', .02); } },
  bau:{ n:'Baú', w:1, h:1, draw(c){ rr(c, -.4, -.3, .8, .6, .06); fs(c, '#8a5a2b', '#4a2f14', .05); c.fillStyle = '#55585c'; c.fillRect(-.24, -.3, .1, .6); c.fillRect(.14, -.3, .1, .6); disc(c, 0, .02, .06, '#d9b64a'); } },
  barril:{ n:'Barril', w:1, h:1, draw(c){ disc(c, 0, 0, .38, '#8a5a2f', '#4a2f14', .05); disc(c, 0, 0, .3, '#a06a38'); c.beginPath(); c.arc(0, 0, .22, 0, 7); c.strokeStyle = 'rgba(60,35,15,.5)'; c.lineWidth = .03; c.stroke(); } },
  caixa:{ n:'Caixa', w:1, h:1, draw(c){ rr(c, -.36, -.36, .72, .72, .03); fs(c, '#b58850', '#6b4a24', .05); c.strokeStyle = 'rgba(80,52,22,.7)'; c.lineWidth = .04; c.beginPath(); c.moveTo(-.3, -.3); c.lineTo(.3, .3); c.moveTo(.3, -.3); c.lineTo(-.3, .3); c.stroke(); } },
  estante:{ n:'Estante', w:2, h:1, draw(c){ rr(c, -.94, -.4, 1.88, .8, .04); fs(c, '#5b3a1f', '#2e1c0d', .04); rr(c, -.88, -.34, 1.76, .68, .02); fs(c, '#3b2411'); const cols = ['#a33a3a', '#3a6aa3', '#c9a13a', '#3a8a5c', '#7a4aa3', '#d9d0b8']; let x = -.84, i = 0; while(x < .8){ const w = .09 + (i % 3) * .02, h = .2 + (i % 4) * .03; c.fillStyle = cols[i % 6]; c.fillRect(x, -.3, w, h); c.fillRect(x + .02, .04, w, h - .02); x += w + .015; i++; } } },
  fogao:{ n:'Fogão', w:1, h:1, draw(c){ rr(c, -.42, -.42, .84, .84, .05); fs(c, '#cfd3d6', '#7d8388', .04); [[-.2, -.2], [.2, -.2], [-.2, .12], [.2, .12]].forEach(p => disc(c, p[0], p[1], .12, '#2c2f33', '#15171a', .03)); [-.24, -.08, .08, .24].forEach(x => disc(c, x, .34, .035, '#4a4d52')); } },
  pilar:{ n:'Pilar', w:1, h:1, draw(c){ disc(c, 0, 0, .36, '#8f959b', '#565b61', .05); c.beginPath(); c.arc(0, 0, .24, 0, 7); c.strokeStyle = 'rgba(0,0,0,.22)'; c.lineWidth = .03; c.stroke(); } },
  pedra:{ n:'Pedra', w:1, h:1, draw(c){ const p = [[.38, 0], [.28, .3], [-.05, .4], [-.34, .22], [-.4, -.1], [-.2, -.36], [.18, -.34]]; c.beginPath(); p.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); fs(c, '#7d838a', '#4b5056', .05); c.beginPath(); c.moveTo(-.18, -.2); c.lineTo(.12, -.22); c.lineTo(.05, .02); c.lineTo(-.22, .05); c.closePath(); fs(c, '#9aa0a6'); } },
  arvore:{ n:'Árvore', w:2, h:2, draw(c){ disc(c, .1, .1, .92, 'rgba(0,0,0,.25)'); [[0, 0, .85, '#2d5a2a'], [-.3, -.25, .52, '#3a7234'], [.32, -.2, .46, '#438040'], [.05, .32, .46, '#357030'], [-.1, -.1, .26, '#5a9a4c']].forEach(q => disc(c, q[0], q[1], q[2], q[3])); c.beginPath(); c.arc(0, 0, .85, 0, 7); c.strokeStyle = 'rgba(15,40,15,.55)'; c.lineWidth = .04; c.stroke(); } },
  fogueira:{ n:'Fogueira', w:1, h:1, light:6, draw(c){ disc(c, 0, 0, .62, 'rgba(255,160,60,.22)'); for(let i = 0; i < 8; i++){ const a = i / 8 * 6.283; disc(c, Math.cos(a) * .36, Math.sin(a) * .36, .1, '#6b6f74', '#3d4044', .02); } c.save(); c.rotate(.5); c.fillStyle = '#5a3a1c'; c.fillRect(-.3, -.05, .6, .1); c.rotate(1.5); c.fillRect(-.3, -.05, .6, .1); c.restore(); flame(c, 1.1); } },
  tocha:{ n:'Tocha', w:1, h:1, light:5, draw(c){ disc(c, 0, 0, .4, 'rgba(255,160,60,.18)'); disc(c, 0, .12, .1, '#4a2f14', '#2b1a0a', .02); flame(c, .75); } },
  carro:{ n:'Carro', w:3, h:2, draw(c){ rr(c, -1.4, -.62, 2.8, 1.24, .3); fs(c, '#b3402f', '#6b2118', .05); rr(c, -.55, -.46, .72, .92, .12); fs(c, '#a03626'); rr(c, .2, -.46, .5, .92, .1); fs(c, '#8fc3d9', '#4e7f93', .02); rr(c, -1.0, -.42, .34, .84, .08); fs(c, '#7fb2c8', '#4e7f93', .02); [[-1.0, -.68], [.7, -.68], [-1.0, .56], [.7, .56]].forEach(p => { rr(c, p[0], p[1], .4, .13, .04); fs(c, '#1d1f22'); }); disc(c, 1.36, -.4, .07, '#f4e7a1'); disc(c, 1.36, .4, .07, '#f4e7a1'); } }
};
const OBJ_ORDER = ['mesa', 'cadeira', 'sofa', 'cama', 'bau', 'barril', 'caixa', 'estante', 'fogao', 'pilar', 'pedra', 'arvore', 'fogueira', 'tocha', 'carro'];
const OTHUMB = {};
OBJ_ORDER.forEach(k => { const o = OBJ[k], cv = document.createElement('canvas'); cv.width = cv.height = 96; const c = cv.getContext('2d'); c.fillStyle = '#3a4650'; c.fillRect(0, 0, 96, 96); const s = 80 / Math.max(o.w, o.h, 1.6); c.translate(48, 48); c.scale(s, s); o.draw(c); OTHUMB[k] = cv.toDataURL(); });

/* ---------------- volumes para a vista isométrica (a mesma figura vista de cima vira o "tampo") ---------------- */
const ISO = {
  mesa:{ s:'box', h:.62, c:'#8a5a30' },
  cadeira:{ s:'box', h:.46, c:'#6a4528', in:.05 },
  sofa:{ s:'box', h:.55, c:'#47657d' },
  cama:{ s:'box', h:.42, c:'#6b4524' },
  bau:{ s:'box', h:.48, c:'#7d5226', in:.08 },
  barril:{ s:'round', h:.72, r:.38, c:'#8a5a2f' },
  caixa:{ s:'box', h:.6, c:'#a97d46', in:.05 },
  estante:{ s:'box', h:1.5, c:'#4d3119', in:.04 },
  fogao:{ s:'box', h:.72, c:'#b9bec2', in:.05 },
  pilar:{ s:'round', h:1.6, r:.36, c:'#868c92' },
  pedra:{ s:'round', h:.46, r:.34, c:'#737980' },
  arvore:{ s:'tree', h:1.0, r:.13, c:'#5b3a1c', cr:.85, ch:2.1,
    blobs:[[0, 0, .85, '#2d5a2a'], [-.3, -.25, .52, '#3a7234'], [.32, -.2, .46, '#438040'], [.05, .32, .46, '#357030'], [-.1, -.1, .26, '#5a9a4c']] },
  fogueira:{ s:'fire', h:.25, r:.4, c:'#6b6f74', ground(c){ disc(c, 0, 0, .62, 'rgba(255,160,60,.22)'); for(let i = 0; i < 8; i++){ const a = i / 8 * 6.283; disc(c, Math.cos(a) * .36, Math.sin(a) * .36, .1, '#6b6f74', '#3d4044', .02); } c.save(); c.rotate(.5); c.fillStyle = '#5a3a1c'; c.fillRect(-.3, -.05, .6, .1); c.rotate(1.5); c.fillRect(-.3, -.05, .6, .1); c.restore(); } },
  tocha:{ s:'torch', h:1.05, r:.07, c:'#5a3a1c', ground(c){ disc(c, 0, 0, .4, 'rgba(255,160,60,.18)'); disc(c, 0, 0, .1, '#4a2f14', '#2b1a0a', .02); } },
  carro:{ s:'box', h:.78, c:'#a33a2b', in:.08 }
};
const shadeCache = new Map();
function shade(hex, f){
  const key = hex + '|' + f; let v = shadeCache.get(key); if(v) return v;
  const n = parseInt(hex.slice(1), 16);
  v = `rgb(${clamp(Math.round((n >> 16 & 255) * f), 0, 255)},${clamp(Math.round((n >> 8 & 255) * f), 0, 255)},${clamp(Math.round((n & 255) * f), 0, 255)})`;
  shadeCache.set(key, v); return v;
}

/* ---------------- estado: Ateliê (o mapa que se constrói) e mesa (a cópia que se joga) ---------------- */
const EDGE = { WALL:1, DOOR:2, OPEN:3, WINDOW:4 };
const D = { atelie:null, mesa:null, rev:0, mrev:0, mesaDirty:false };
let mode = 'criar', map = null, WL = [], SEGS = [], segsDirty = true, wallVer = 0;
const stacks = { criar:{ u:[], r:[] }, jogar:{ u:[], r:[] } };
let undoS = stacks.criar.u, redoS = stacks.criar.r;
const S = { tool:'mover', floor:1, floorMode:'pincel', brush:1, edge:1, obj:'mesa', erase:'obj', snapRuler:true, snap:true, sel:null, strip:true, role:'mestre', wh:1 };
const ui = { ruler:null, lit:[], litKey:'' };
const TOKEN_COLORS = ['#e2a647', '#7cc4e0', '#d96b6b', '#8fd18a', '#b58be0', '#e8e2d0'];
const WHS = [.5, 1, 1.7];
const isMaster = () => mode === 'criar' || S.role === 'mestre';

const usedIds = new Set(); let idc = 0;
function uid(p){ let id; do{ id = p + (++idc).toString(36); }while(usedIds.has(id)); usedIds.add(id); return id; }
const mkObj = (k, x, y, a, livre) => ({ id:uid('o'), k, x, y, a:a || 0, livre:!!livre });

function newMap(w, h, name){
  return { v:2, name:name || 'Mapa novo', w, h, F:new Uint8Array(w * h), walls:{}, objects:[], tokens:[], unit:{ label:'m', per:1.5 }, diag:'euclid', grid:true, fog:true, range:7, torch:true };
}
const encF = F => Array.from(F, v => v.toString(36)).join('');
const decF = (s, w, h) => { const F = new Uint8Array(w * h); for(let i = 0; i < F.length && i < s.length; i++) F[i] = parseInt(s[i], 36) || 0; return F; };
function ser(m){
  return JSON.stringify({ v:2, name:m.name, w:m.w, h:m.h, f:encF(m.F), walls:m.walls,
    objects:m.objects.map(o => ({ i:o.id, k:o.k, x:o.x, y:o.y, a:o.a, l:o.livre ? 1 : 0 })),
    tokens:m.tokens.map(t => ({ id:t.id, label:t.label, color:t.color, x:t.x, y:t.y, m:t.mestre ? 1 : 0 })),
    unit:m.unit, diag:m.diag, grid:m.grid, fog:m.fog, range:m.range, torch:m.torch });
}
const num = (v, d) => (typeof v === 'number' && isFinite(v)) ? v : (isFinite(+v) && v !== null && v !== '' ? +v : d);
function des(txt){
  const o = typeof txt === 'string' ? JSON.parse(txt) : txt;
  if(!o || (o.v !== 1 && o.v !== 2) || !(o.w >= 4 && o.w <= 200) || !(o.h >= 4 && o.h <= 200) || typeof o.f !== 'string') throw new Error('formato');
  const m = newMap(o.w | 0, o.h | 0, String(o.name || 'Mapa').slice(0, 60));
  m.F = decF(o.f, m.w, m.h);
  m.walls = {}; Object.keys(o.walls || {}).forEach(k => { if(/^[hv]\d+,\d+$/.test(k) && [1, 2, 3, 4].includes(o.walls[k])) m.walls[k] = o.walls[k]; });
  m.objects = (o.objects || []).filter(q => q && OBJ[q.k]).map(q => {
    const id = (typeof q.i === 'string' && q.i) ? q.i : uid('o'); usedIds.add(id);
    const a = q.a !== undefined ? num(q.a, 0) : ((q.r | 0) * 90);
    return { id, k:q.k, x:num(q.x, 0), y:num(q.y, 0), a:((a % 360) + 360) % 360, livre:!!q.l };
  });
  m.tokens = (o.tokens || []).map((t, i) => {
    const id = (typeof t.id === 'string' && t.id) ? t.id : uid('t'); usedIds.add(id);
    return { id, label:String(t.label || '?').slice(0, 2), color:String(t.color || TOKEN_COLORS[0]), x:num(t.x, .5), y:num(t.y, .5), mestre:!!t.m };
  });
  if(o.unit && o.unit.per > 0) m.unit = { label:String(o.unit.label || 'm').slice(0, 8), per:+o.unit.per };
  if(['euclid', 'cheb', 'alt'].includes(o.diag)) m.diag = o.diag;
  m.grid = o.grid !== false; m.fog = o.fog !== false; m.torch = o.torch !== false;
  if(o.range >= 2 && o.range <= 20) m.range = o.range | 0;
  return m;
}
const copyInto = (dst, src) => { Object.assign(dst, des(ser(src))); };

const snapshot = (m = map) => JSON.stringify({ w:m.w, h:m.h, f:encF(m.F), walls:m.walls, objects:m.objects, tokens:m.tokens });
function restore(s, m = map){
  const o = JSON.parse(s); m.w = o.w; m.h = o.h; m.F = decF(o.f, o.w, o.h); m.walls = o.walls; m.objects = o.objects; m.tokens = o.tokens;
  if(m === map){ wallsChanged(); fixSel(); }
}
function wallsChanged(){ WL = Object.keys(map.walls).map(k => { const [x, y] = k.slice(1).split(',').map(Number); return { o:k[0], x, y, t:map.walls[k], k }; }); segsDirty = true; wallVer++; }
const findObj = id => map.objects.find(o => o.id === id) || null;
const findTok = id => map.tokens.find(t => t.id === id) || null;
const selObj = () => (S.sel && S.sel.t === 'o') ? findObj(S.sel.id) : null;
const selTok = () => (S.sel && S.sel.t === 't') ? findTok(S.sel.id) : null;
function fixSel(){ if(S.sel && !(S.sel.t === 'o' ? findObj(S.sel.id) : findTok(S.sel.id))) S.sel = null; }

let saveT = 0;
function save(){
  clearTimeout(saveT);
  saveT = setTimeout(() => { try{ localStorage.setItem('almanaque:dados', JSON.stringify({ v:2, a:ser(D.atelie), m:D.mesa ? ser(D.mesa) : null, rev:D.rev, mrev:D.mrev, dirty:D.mesaDirty })); }catch(e){} }, 350);
}
function saveUi(){ try{ localStorage.setItem('almanaque:ui', JSON.stringify({ mode, role:S.role, iso:cam.iso, rot:cam.rot, wh:S.wh, snap:S.snap })); }catch(e){} }
function commitEdit(before, geom){
  const after = snapshot();
  if(after !== before){
    undoS.push(before); if(undoS.length > 120) undoS.shift(); redoS.length = 0;
    if(mode === 'criar'){ if(geom !== false) D.rev++; } else D.mesaDirty = true;
  }
  syncButtons(); save(); updateBanner();
}
function withUndo(fn, geom){ const before = snapshot(); fn(); commitEdit(before, geom); requestDraw(); }
function doUndo(){ if(!undoS.length) return; redoS.push(snapshot()); restore(undoS.pop()); if(mode === 'criar') D.rev++; else D.mesaDirty = true; syncButtons(); save(); updateBanner(); renderStrip(); requestDraw(); }
function doRedo(){ if(!redoS.length) return; undoS.push(snapshot()); restore(redoS.pop()); if(mode === 'criar') D.rev++; else D.mesaDirty = true; syncButtons(); save(); updateBanner(); renderStrip(); requestDraw(); }
function syncButtons(){ $('#b-undo').disabled = !undoS.length; $('#b-redo').disabled = !redoS.length; }

/* ---------------- mapa de exemplo ---------------- */
function room(m, x0, y0, x1, y1, floor){
  for(let y = y0; y <= y1; y++) for(let x = x0; x <= x1; x++) m.F[y * m.w + x] = floor;
  for(let x = x0; x <= x1; x++){ m.walls['h' + x + ',' + y0] = 1; m.walls['h' + x + ',' + (y1 + 1)] = 1; }
  for(let y = y0; y <= y1; y++){ m.walls['v' + x0 + ',' + y] = 1; m.walls['v' + (x1 + 1) + ',' + y] = 1; }
}
const DEMO_FOCUS = [13, 9.5, 26];
function demo(){
  const m = newMap(32, 24, 'Sítio na estrada');
  m.F.fill(6);
  for(let y = 20; y <= 21; y++) for(let x = 0; x < 32; x++) m.F[y * 32 + x] = 5;
  for(let y = 14; y <= 19; y++) for(let x = 9; x <= 10; x++) m.F[y * 32 + x] = 7;
  room(m, 6, 4, 19, 12, 2);
  for(let y = 4; y <= 12; y++) for(let x = 13; x <= 19; x++) m.F[y * 32 + x] = 3;
  for(let y = 4; y <= 9; y++) m.walls['v13,' + y] = 1;
  for(let x = 6; x <= 12; x++) m.walls['h' + x + ',9'] = 1;
  m.walls['v13,7'] = 2; m.walls['h9,9'] = 2; m.walls['h9,13'] = 2; m.walls['h16,13'] = 3;
  m.walls['h8,4'] = 4; m.walls['h9,4'] = 4; m.walls['h16,4'] = 4; m.walls['v6,7'] = 4; m.walls['v20,6'] = 4;
  room(m, 24, 14, 28, 17, 4);
  m.walls['h26,18'] = 2;
  const o = (k, x, y, r, livre) => m.objects.push(mkObj(k, x, y, (r || 0) * 90, livre));
  o('cama', 7.5, 11); o('bau', 11.5, 11.5); o('estante', 11, 9.5); o('mesa', 9, 6.5); o('cadeira', 8.5, 5.5, 0, true); o('cadeira', 9.5, 5.5, 2, true); o('cadeira', 8.5, 7.5, 0, true); o('cadeira', 9.5, 7.5, 2, true);
  o('sofa', 7, 8.5, 0);
  o('fogao', 18.5, 4.5); o('mesa', 16, 8.5); o('barril', 14.5, 11.5, 0, true); o('barril', 15.5, 11.5, 0, true); o('caixa', 19.5, 11.5, 0, true); o('pilar', 16.5, 12.5);
  o('arvore', 3, 3); o('arvore', 27, 6); o('arvore', 29, 10); o('arvore', 3, 16); o('arvore', 22, 18);
  o('pedra', 4.5, 8.5); o('pedra', 23.5, 12.5); o('fogueira', 24.5, 9.5); o('tocha', 8.5, 13.5); o('tocha', 11.5, 13.5);
  o('caixa', 25.5, 15.5, 0, true); o('barril', 27.5, 16.5, 0, true); o('carro', 15.5, 21, 0);
  m.tokens.push({ id:'t1', label:'A', color:TOKEN_COLORS[0], x:10.5, y:15.5, mestre:false }, { id:'t2', label:'B', color:TOKEN_COLORS[1], x:11.5, y:6.5, mestre:false }, { id:'t3', label:'M', color:TOKEN_COLORS[2], x:26.5, y:16.5, mestre:true });
  ['t1', 't2', 't3'].forEach(i => usedIds.add(i));
  return m;
}

/* ---------------- tela e câmera (a mesma câmera serve para a vista de cima e para a isométrica) ---------------- */
const cv = $('#cv'), ctx = cv.getContext('2d'), fog = document.createElement('canvas'), fx = fog.getContext('2d');
let cssW = 300, cssH = 400, dpr = 1;
const ISO_K = .72;
const ROT = [[1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0]];   // u = a1·dx + b1·dy, v = a2·dx + b2·dy
const cam = { x:16, y:12, z:24, iso:false, rot:0 };
const camSaved = { criar:null, jogar:null };
let M = null, dirty = false;
function requestDraw(){ M = null; if(!dirty){ dirty = true; requestAnimationFrame(draw); } }
function mat(){
  const z = cam.z, hx = cssW / 2, hy = cssH / 2;
  if(!cam.iso) return { A:z, B:0, C:0, D:z, E:hx - cam.x * z, F:hy - cam.y * z, zh:0 };
  const zi = z * ISO_K, r = ROT[cam.rot];
  const A = zi * (r[0] - r[2]), C = zi * (r[1] - r[3]), B = zi / 2 * (r[0] + r[2]), D = zi / 2 * (r[1] + r[3]);
  return { A, B, C, D, E:hx - A * cam.x - C * cam.y, F:hy - B * cam.x - D * cam.y, zh:zi };
}
const getM = () => M || (M = mat());
const P = (x, y, h) => { const m = getM(); return { x:m.A * x + m.C * y + m.E, y:m.B * x + m.D * y + m.F - (h || 0) * m.zh }; };
const toS = (x, y) => P(x, y, 0);
function toW(sx, sy){ const m = getM(), det = m.A * m.D - m.B * m.C, px = sx - m.E, py = sy - m.F; return { x:(m.D * px - m.C * py) / det, y:(-m.B * px + m.A * py) / det }; }
function anchorCam(wx, wy, sx, sy){ M = null; const g = toW(sx, sy); cam.x += wx - g.x; cam.y += wy - g.y; requestDraw(); }
const upx = () => 1 / (cam.iso ? cam.z * ISO_K : cam.z);
function fitView(){
  const w = map.w, h = map.h;
  if(!cam.iso) cam.z = clamp(Math.min(cssW / (w + 1.5), cssH / (h + 1.5)), 4, 160);
  else cam.z = clamp(Math.min(cssW / ((w + h) * ISO_K + 1.4), cssH / (((w + h) / 2 + WHS[S.wh]) * ISO_K + 1.4)), 4, 160);
  cam.x = w / 2; cam.y = h / 2; requestDraw();
}
function focusOn(cx, cy, z){ cam.z = z; cam.x = cx; cam.y = cy; requestDraw(); }
function resize(){
  const r = $('#stage').getBoundingClientRect(); cssW = Math.max(50, r.width); cssH = Math.max(50, r.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr); fog.width = cv.width; fog.height = cv.height;
  requestDraw();
}
new ResizeObserver(resize).observe($('#stage'));
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#000';

/* ---------------- visão e luz ---------------- */
function rebuildSegs(){
  SEGS = [];
  const hs = {}, vs = {};
  WL.forEach(w => { if(w.t !== EDGE.WALL && w.t !== EDGE.DOOR) return; if(w.o === 'h') (hs[w.y] = hs[w.y] || []).push(w.x); else (vs[w.x] = vs[w.x] || []).push(w.y); });
  Object.keys(hs).forEach(y => { const a = hs[y].sort((p, q) => p - q); let s = a[0], p = a[0]; for(let i = 1; i <= a.length; i++){ if(a[i] !== p + 1){ SEGS.push({ x1:s, y1:+y, x2:p + 1, y2:+y }); s = a[i]; } p = a[i]; } });
  Object.keys(vs).forEach(x => { const a = vs[x].sort((p, q) => p - q); let s = a[0], p = a[0]; for(let i = 1; i <= a.length; i++){ if(a[i] !== p + 1){ SEGS.push({ x1:+x, y1:s, x2:+x, y2:p + 1 }); s = a[i]; } p = a[i]; } });
  segsDirty = false;
}
function raySeg(ox, oy, dx, dy, s){
  const sx = s.x2 - s.x1, sy = s.y2 - s.y1, den = dx * sy - dy * sx; if(Math.abs(den) < 1e-12) return null;
  const t = ((s.x1 - ox) * sy - (s.y1 - oy) * sx) / den, u = ((s.x1 - ox) * dy - (s.y1 - oy) * dx) / den;
  return (t >= 0 && u >= 0 && u <= 1) ? t : null;
}
function visPoly(ox, oy, R){
  if(segsDirty) rebuildSegs();
  const x0 = ox - R, x1 = ox + R, y0 = oy - R, y1 = oy + R, segs = [];
  for(const s of SEGS){ if(Math.max(s.x1, s.x2) < x0 || Math.min(s.x1, s.x2) > x1 || Math.max(s.y1, s.y2) < y0 || Math.min(s.y1, s.y2) > y1) continue; segs.push(s); }
  segs.push({ x1:x0, y1:y0, x2:x1, y2:y0 }, { x1:x1, y1:y0, x2:x1, y2:y1 }, { x1:x1, y1:y1, x2:x0, y2:y1 }, { x1:x0, y1:y1, x2:x0, y2:y0 });
  const ang = [];
  segs.forEach(s => { [[s.x1, s.y1], [s.x2, s.y2]].forEach(p => { const a = Math.atan2(p[1] - oy, p[0] - ox); ang.push(a - 1e-4, a, a + 1e-4); }); });
  ang.sort((a, b) => a - b);
  const pts = [];
  for(const a of ang){ const dx = Math.cos(a), dy = Math.sin(a); let best = Infinity; for(const s of segs){ const t = raySeg(ox, oy, dx, dy, s); if(t !== null && t < best) best = t; } if(best < Infinity) pts.push([ox + dx * best, oy + dy * best]); }
  return pts;
}
// Fichas do Mestre não iluminam nada: o monstro escondido não pode acender o escuro para os jogadores.
function lights(){
  const L = map.tokens.filter(t => !t.mestre).map(t => ({ x:t.x, y:t.y, r:map.range, warm:false }));
  if(map.torch) map.objects.forEach(o => { const d = OBJ[o.k]; if(d.light) L.push({ x:o.x, y:o.y, r:d.light, warm:true }); });
  return L;
}
function litNow(){
  const L = lights(), key = wallVer + '|' + L.map(l => l.x + ',' + l.y + ',' + l.r).join(';');
  if(ui.litKey !== key){ ui.lit = L.map(l => Object.assign({ poly:visPoly(l.x, l.y, l.r) }, l)); ui.litKey = key; }
  return ui.lit;
}
function inPoly(x, y, p){ let c = false; for(let i = 0, j = p.length - 1; i < p.length; j = i++){ const a = p[i], b = p[j]; if((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
function isLit(x, y){ return litNow().some(l => l.poly.length > 2 && Math.hypot(x - l.x, y - l.y) <= l.r && inPoly(x, y, l.poly)); }
const fogActive = () => map && ((mode === 'criar' && S.tool === 'luz') || (mode === 'jogar' && map.fog));
const fogAlpha = () => mode === 'criar' ? .82 : (S.role === 'mestre' ? .6 : 1);
const tokenVisible = t => isMaster() || !t.mestre || !fogActive() || isLit(t.x, t.y);

/* ---------------- desenho ---------------- */
function hash(x, y){ return ((x * 73856093) ^ (y * 19349663)) >>> 0; }
const setScr = () => ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
function setGround(h){ const m = getM(); ctx.setTransform(dpr * m.A, dpr * m.B, dpr * m.C, dpr * m.D, dpr * m.E, dpr * (m.F - (h || 0) * m.zh)); }
const depth = (x, y) => { const r = ROT[cam.rot], dx = x - cam.x, dy = y - cam.y; return (r[0] + r[2]) * dx + (r[1] + r[3]) * dy; };
function polyPath(pts){ ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); }

function draw(){
  dirty = false; if(!map) return;
  M = null; const m = getM(), iso = cam.iso, W = cssW, H = cssH;
  setScr(); ctx.fillStyle = css('--table'); ctx.fillRect(0, 0, W, H);
  const u = upx(), cpx = iso ? cam.z * ISO_K * 1.3 : cam.z;
  const c = [toW(0, 0), toW(W, 0), toW(0, H), toW(W, H)], xs = c.map(p => p.x), ys = c.map(p => p.y);
  const x0 = clamp(Math.floor(Math.min(...xs)), 0, map.w), x1 = clamp(Math.ceil(Math.max(...xs)), 0, map.w), y0 = clamp(Math.floor(Math.min(...ys)), 0, map.h), y1 = clamp(Math.ceil(Math.max(...ys)), 0, map.h);
  if(iso) drawSlab();
  ctx.save(); setGround(0);
  ctx.fillStyle = 'rgba(128,142,154,.10)'; ctx.fillRect(0, 0, map.w, map.h);
  ctx.imageSmoothingEnabled = true;
  for(let y = y0; y < y1; y++) for(let x = x0; x < x1; x++){
    const f = map.F[y * map.w + x]; if(!f) continue;
    if(cpx < 14){ ctx.fillStyle = FLOORS[f].avg; ctx.fillRect(x, y, 1.02, 1.02); }
    else ctx.drawImage(TILES[f][hash(x, y) & 3], x, y, 1.012, 1.012);
  }
  ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 3 * u; ctx.beginPath();
  for(let y = y0; y < y1; y++) for(let x = x0; x < x1; x++){
    const f = map.F[y * map.w + x]; if(!f) continue;
    if(x + 1 >= map.w || map.F[y * map.w + x + 1] !== f){ ctx.moveTo(x + 1, y); ctx.lineTo(x + 1, y + 1); }
    if(x === 0 || map.F[y * map.w + x - 1] !== f){ ctx.moveTo(x, y); ctx.lineTo(x, y + 1); }
    if(y + 1 >= map.h || map.F[(y + 1) * map.w + x] !== f){ ctx.moveTo(x, y + 1); ctx.lineTo(x + 1, y + 1); }
    if(y === 0 || map.F[(y - 1) * map.w + x] !== f){ ctx.moveTo(x, y); ctx.lineTo(x + 1, y); }
  }
  ctx.stroke();
  if(map.grid && cpx >= 12){
    ctx.strokeStyle = 'rgba(120,135,150,.30)'; ctx.lineWidth = u; ctx.beginPath();
    for(let x = x0; x <= x1; x++){ ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
    for(let y = y0; y <= y1; y++){ ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(160,175,190,.5)'; ctx.lineWidth = 2 * u; ctx.strokeRect(0, 0, map.w, map.h);
  if(!iso){
    map.objects.forEach(o => { const d = OBJ[o.k]; ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.a * Math.PI / 180); d.draw(ctx); ctx.restore(); });
    drawWalls(x0, x1, y0, y1);
  }
  ctx.restore();
  if(iso) drawIsoScene();
  ctx.save(); setGround(0); drawPreview(); ctx.restore();
  if(!iso){ setScr(); map.tokens.forEach(token2D); }
  if(fogActive()) drawFog();
  drawSel();
  drawRuler();
}

/* ---- vista de cima: paredes, janelas e portas ---- */
function drawWalls(x0, x1, y0, y1){
  const u = upx();
  ctx.lineCap = 'butt';
  for(const w of WL){
    let ax = w.x, ay = w.y, bx = w.o === 'h' ? w.x + 1 : w.x, by = w.o === 'h' ? w.y : w.y + 1;
    if(bx < x0 - 1 || ax > x1 + 1 || by < y0 - 1 || ay > y1 + 1) continue;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
    if(w.t === EDGE.WALL){ ctx.lineCap = 'round'; ctx.strokeStyle = '#231e1a'; ctx.lineWidth = .17; ctx.stroke(); ctx.strokeStyle = '#8d8478'; ctx.lineWidth = .07; ctx.stroke(); ctx.lineCap = 'butt'; }
    else if(w.t === EDGE.WINDOW){ ctx.strokeStyle = '#231e1a'; ctx.lineWidth = .17; ctx.stroke(); ctx.strokeStyle = '#a9d6ea'; ctx.lineWidth = .09; ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = .02; ctx.stroke(); }
    else if(w.t === EDGE.DOOR){ ctx.strokeStyle = '#231e1a'; ctx.lineWidth = .19; ctx.stroke(); ctx.strokeStyle = '#a8733d'; ctx.lineWidth = .12; ctx.stroke(); const mx = ax + (bx - ax) * .72, my = ay + (by - ay) * .72; ctx.beginPath(); ctx.arc(mx, my, .045, 0, 7); ctx.fillStyle = '#e6c25a'; ctx.fill(); }
    else if(w.t === EDGE.OPEN){
      ctx.fillStyle = '#231e1a'; ctx.beginPath(); ctx.arc(ax, ay, .1, 0, 7); ctx.arc(bx, by, .1, 0, 7); ctx.fill();
      const h = w.o === 'h', ex = h ? ax : ax + 1, ey = h ? ay + 1 : ay;
      ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1.2 * u; ctx.beginPath(); ctx.arc(ax, ay, 1, 0, Math.PI / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ex, ey); ctx.strokeStyle = '#231e1a'; ctx.lineWidth = .15; ctx.stroke(); ctx.strokeStyle = '#a8733d'; ctx.lineWidth = .09; ctx.stroke();
    }
  }
}
function drawPreview(){
  const a = act; if(!a) return;
  const acc = css('--accent'), u = upx();
  if(a.tool === 'piso' && a.r){ const r = norm(a.r); ctx.fillStyle = 'rgba(226,166,71,.28)'; ctx.fillRect(r.x0, r.y0, r.x1 - r.x0 + 1, r.y1 - r.y0 + 1); ctx.strokeStyle = acc; ctx.lineWidth = 2.5 * u; ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0 + 1, r.y1 - r.y0 + 1); }
  if(a.tool === 'parede' && a.sv){
    ctx.strokeStyle = acc; ctx.lineWidth = .12; ctx.globalAlpha = .85; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a.sv.x, a.sv.y); ctx.lineTo(a.ev.x, a.ev.y); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(a.sv.x, a.sv.y, .13, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(a.ev.x, a.ev.y, .13, 0, 7); ctx.fill();
  }
  if(a.tool === 'objeto' && a.ghost){ const d = OBJ[S.obj]; ctx.save(); ctx.globalAlpha = .65; ctx.translate(a.ghost.x, a.ghost.y); d.draw(ctx); ctx.restore(); ctx.strokeStyle = acc; ctx.lineWidth = 2 * u; ctx.strokeRect(a.ghost.x - d.w / 2, a.ghost.y - d.h / 2, d.w, d.h); }
  if(a.tool === 'piso' && S.floorMode === 'pincel' && a.lc){ const o = Math.floor((S.brush - 1) / 2); ctx.strokeStyle = acc; ctx.lineWidth = 2 * u; ctx.strokeRect(a.lc.x - o, a.lc.y - o, S.brush, S.brush); }
}

/* ---- vista isométrica ---- */
function drawSlab(){
  const d = .35, w = map.w, h = map.h, r = ROT[cam.rot];
  [[[0, 0], [w, 0], 0, -1], [[w, 0], [w, h], 1, 0], [[w, h], [0, h], 0, 1], [[0, h], [0, 0], -1, 0]].forEach(e => {
    const nu = r[0] * e[2] + r[1] * e[3], nv = r[2] * e[2] + r[3] * e[3]; if(nu + nv <= 0) return;
    const a = P(e[0][0], e[0][1], 0), b = P(e[1][0], e[1][1], 0), a2 = P(e[0][0], e[0][1], -d), b2 = P(e[1][0], e[1][1], -d);
    polyPath([a, b, b2, a2]); ctx.fillStyle = shade('#46525c', nu > nv ? .8 : .6); ctx.fill();
  });
}
function faceShade(nu, nv){ const k = (nu - nv) / ((Math.abs(nu) + Math.abs(nv)) || 1); return .64 + .2 * (.5 + .5 * k); }
// Prisma reto: pts = base no chão (x,y do mundo), de h0 até h1. Só desenha os lados voltados para a câmera.
function prism(pts, h0, h1, col, topCol, alpha){
  const n = pts.length, r = ROT[cam.rot]; let cx = 0, cy = 0; pts.forEach(p => { cx += p.x; cy += p.y; }); cx /= n; cy /= n;
  if(alpha !== undefined) ctx.globalAlpha = alpha;
  for(let i = 0; i < n; i++){
    const a = pts[i], b = pts[(i + 1) % n]; let nx = b.y - a.y, ny = -(b.x - a.x);
    if(nx * ((a.x + b.x) / 2 - cx) + ny * ((a.y + b.y) / 2 - cy) < 0){ nx = -nx; ny = -ny; }
    const nu = r[0] * nx + r[1] * ny, nv = r[2] * nx + r[3] * ny; if(nu + nv <= 1e-9) continue;
    polyPath([P(a.x, a.y, h0), P(b.x, b.y, h0), P(b.x, b.y, h1), P(a.x, a.y, h1)]);
    ctx.fillStyle = shade(col, faceShade(nu, nv)); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1; ctx.stroke();
  }
  if(topCol){ polyPath(pts.map(p => P(p.x, p.y, h1))); ctx.fillStyle = topCol; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1; ctx.stroke(); }
  if(alpha !== undefined) ctx.globalAlpha = 1;
}
function cylinder(x, y, r, h, col, topCol){
  const m = getM(), p = P(x, y, 0), rx = r * m.zh * 1.4142, ry = rx / 2, H = h * m.zh;
  const g = ctx.createLinearGradient(p.x - rx, 0, p.x + rx, 0); g.addColorStop(0, shade(col, .55)); g.addColorStop(.45, shade(col, .96)); g.addColorStop(1, shade(col, .62));
  ctx.fillStyle = g; ctx.fillRect(p.x - rx, p.y - H, rx * 2, H);
  ctx.beginPath(); ctx.ellipse(p.x, p.y, rx, ry, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x - rx, p.y - H); ctx.lineTo(p.x - rx, p.y); ctx.ellipse(p.x, p.y, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(p.x + rx, p.y - H); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(p.x, p.y - H, rx, ry, 0, 0, 7); ctx.fillStyle = topCol || shade(col, 1.1); ctx.fill(); ctx.stroke();
}
function flameAt(p, sc){ ctx.save(); ctx.translate(p.x, p.y - .15 * sc); ctx.scale(sc, sc); flame(ctx, 1); ctx.restore(); }
function sprite(o, h, fn){ ctx.save(); setGround(h); ctx.translate(o.x, o.y); ctx.rotate(o.a * Math.PI / 180); (fn || OBJ[o.k].draw)(ctx); ctx.restore(); }
function boxPts(o, inset){
  const d = OBJ[o.k], hw = d.w / 2 - inset, hh = d.h / 2 - inset, a = o.a * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(q => ({ x:o.x + q[0] * ca - q[1] * sa, y:o.y + q[0] * sa + q[1] * ca }));
}
function isoShadow(o){
  const I = ISO[o.k], m = getM(), sx = I.h * m.zh * .45, sy = I.h * m.zh * .14;
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  if(I.s === 'box'){ polyPath(boxPts(o, I.in === undefined ? .06 : I.in).map(p => { const q = P(p.x, p.y, 0); return { x:q.x + sx, y:q.y + sy }; })); ctx.fill(); }
  else { const r = I.s === 'tree' ? I.cr * .8 : Math.max(I.r, .2), p = P(o.x, o.y, 0), rx = r * m.zh * 1.4142; ctx.beginPath(); ctx.ellipse(p.x + sx * (I.s === 'tree' ? 1.5 : 1), p.y + sy, rx, rx / 2, 0, 0, 7); ctx.fill(); }
}
function isoObject(o){
  const d = OBJ[o.k], I = ISO[o.k], m = getM();
  if(I.s === 'box'){ prism(boxPts(o, I.in === undefined ? .06 : I.in), 0, I.h, I.c, null); sprite(o, I.h); }
  else if(I.s === 'round'){ cylinder(o.x, o.y, I.r, I.h, I.c, 'rgba(0,0,0,0)'); sprite(o, I.h); }
  else if(I.s === 'tree'){
    cylinder(o.x, o.y, I.r, I.h, I.c);
    I.blobs.forEach(b => {
      const q = P(o.x + b[0], o.y + b[1], 1.15 + b[2] * .55), r = b[2] * m.zh * 1.15;
      const g = ctx.createRadialGradient(q.x - r * .35, q.y - r * .4, r * .1, q.x, q.y, r); g.addColorStop(0, shade(b[3], 1.3)); g.addColorStop(1, shade(b[3], .85));
      ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, 7); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(15,40,15,.45)'; ctx.lineWidth = 1; ctx.stroke();
    });
  }
  else if(I.s === 'fire'){ sprite(o, .02, I.ground); flameAt(P(o.x, o.y, .2), m.zh * 1.5); }
  else if(I.s === 'torch'){ sprite(o, .02, I.ground); cylinder(o.x, o.y, I.r, I.h, I.c); flameAt(P(o.x, o.y, I.h + .08), m.zh * 1.05); }
}
function isoWall(w, wh){
  const ax = w.x, ay = w.y, h = w.o === 'h', bx = h ? ax + 1 : ax, by = h ? ay : ay + 1, t = .09;
  const seg = (th, ext) => h ? [{ x:ax - ext, y:ay - th }, { x:bx + ext, y:ay - th }, { x:bx + ext, y:ay + th }, { x:ax - ext, y:ay + th }] : [{ x:ax - th, y:ay - ext }, { x:ax + th, y:ay - ext }, { x:ax + th, y:by + ext }, { x:ax - th, y:by + ext }];
  const WS = '#7d7468', WT = '#a79e91';
  if(w.t === EDGE.WALL) prism(seg(t, t), 0, wh, WS, WT);
  else if(w.t === EDGE.WINDOW){ prism(seg(t, t), 0, wh * .38, WS, WT); prism(seg(t * .6, t), wh * .38, wh * .82, '#a9d6ea', null, .5); prism(seg(t, t), wh * .82, wh, WS, WT); }
  else if(w.t === EDGE.DOOR){ prism(seg(t, 0), 0, wh * .92, '#a8733d', '#c58b4f'); }
  else if(w.t === EDGE.OPEN){
    const ex = h ? ax : ax + 1, ey = h ? ay + 1 : ay, s = .06;
    const post = (px, py) => prism([{ x:px - .06, y:py - .06 }, { x:px + .06, y:py - .06 }, { x:px + .06, y:py + .06 }, { x:px - .06, y:py + .06 }], 0, wh * .92, '#5a4a38', '#7d6a52');
    post(ax, ay); post(bx, by);
    const leaf = h ? [{ x:ax - s, y:ay }, { x:ax + s, y:ay }, { x:ex + s, y:ey }, { x:ex - s, y:ey }] : [{ x:ax, y:ay - s }, { x:ex, y:ey - s }, { x:ex, y:ey + s }, { x:ax, y:ay + s }];
    prism(leaf, 0, wh * .9, '#a8733d', '#c58b4f');
  }
}
function tokenHead(t){ return Math.max(7, cam.z * .4); }
function tokenIso(t){
  if(!tokenVisible(t)) return;
  const p = P(t.x, t.y, 0), r = tokenHead(t), hh = r * 1.5;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + 1, r, r * .5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = shade(t.color.length === 7 ? t.color : '#888888', .72);
  ctx.beginPath(); ctx.moveTo(p.x - r * .78, p.y); ctx.lineTo(p.x - r * .42, p.y - hh); ctx.lineTo(p.x + r * .42, p.y - hh); ctx.lineTo(p.x + r * .78, p.y); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(p.x, p.y, r * .78, r * .38, 0, 0, 7); ctx.fill();
  const hx = p.x, hy = p.y - hh - r * .15, hr = r * .82;
  ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 7); ctx.fillStyle = t.color; ctx.fill(); ctx.lineWidth = Math.max(1.5, r * .16); ctx.strokeStyle = 'rgba(255,255,255,.92)'; if(t.mestre) ctx.setLineDash([r * .5, r * .35]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#14181c'; ctx.font = '600 ' + Math.max(9, hr * 1.05) + 'px ' + css('--font-ui'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t.label, hx, hy + 1);
}
function drawIsoScene(){
  const wh = WHS[S.wh], items = [], W = cssW, H = cssH, pad = 160;
  const vis = (x, y, up) => { const p = P(x, y, 0); return p.x > -pad && p.x < W + pad && p.y > -pad - up * getM().zh && p.y < H + pad + 60; };
  map.objects.forEach(o => { if(vis(o.x, o.y, 2.4)) items.push({ k:'o', o, d:depth(o.x, o.y) }); });
  WL.forEach(w => { const mx = w.o === 'h' ? w.x + .5 : w.x, my = w.o === 'h' ? w.y : w.y + .5; if(vis(mx, my, wh)) items.push({ k:'w', w, d:depth(mx, my) }); });
  map.tokens.forEach(t => { if(vis(t.x, t.y, 1.2)) items.push({ k:'t', t, d:depth(t.x, t.y) + .35 }); });
  items.forEach(i => { if(i.k === 'o') isoShadow(i.o); });
  items.sort((a, b) => a.d - b.d);
  items.forEach(i => { if(i.k === 'o') isoObject(i.o); else if(i.k === 'w') isoWall(i.w, wh); else tokenIso(i.t); });
}

/* ---- fichas (vista de cima) ---- */
function token2D(t){
  if(!tokenVisible(t)) return;
  const p = toS(t.x, t.y), r = cam.z * .4;
  if(p.x < -r || p.y < -r || p.x > cssW + r || p.y > cssH + r) return;
  ctx.beginPath(); ctx.arc(p.x, p.y + 1.5, r, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
  ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fillStyle = t.color; ctx.fill(); ctx.lineWidth = Math.max(1.5, cam.z * .06); ctx.strokeStyle = 'rgba(255,255,255,.92)';
  if(t.mestre) ctx.setLineDash([r * .5, r * .35]); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#14181c'; ctx.font = '600 ' + Math.max(9, cam.z * .42) + 'px ' + css('--font-ui'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t.label, p.x, p.y + 1);
}
// centro e raio de toque da ficha na tela
function tokenScreen(t){
  const p = toS(t.x, t.y);
  if(!cam.iso) return { x:p.x, y:p.y, r:Math.max(24, cam.z * .45) };
  const r = tokenHead(t); return { x:p.x, y:p.y - r * 1.65, r:Math.max(26, r * 1.4) };
}

/* ---- névoa e luz ---- */
function drawFog(){
  const m = getM(), maxH = 1.2;
  // só as luzes que chegam à tela entram no desenho (mapas grandes têm dezenas de tochas)
  const L = litNow().filter(l => { const p = P(l.x, l.y, 0), r = l.r * (Math.hypot(m.A, m.B) + Math.hypot(m.C, m.D)) + maxH * m.zh + 20; return p.x > -r && p.x < cssW + r && p.y > -r && p.y < cssH + r; });
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'source-over'; fx.clearRect(0, 0, fog.width, fog.height);
  fx.fillStyle = 'rgba(4,7,10,' + fogAlpha() + ')'; fx.fillRect(0, 0, fog.width, fog.height);
  fx.globalCompositeOperation = 'destination-out';
  // Em isométrico a luz "sobe" pelas paredes e objetos: repete o recorte em várias alturas, com passos de ~2px para não formar degraus.
  const n = L.length > 12 ? 2 : clamp(Math.ceil(maxH * m.zh / 2), 3, 14);   // com muitas luzes, menos passos
  (cam.iso ? Array.from({ length:n + 1 }, (_, i) => i * maxH / n) : [0]).forEach(h => {
    fx.setTransform(dpr * m.A, dpr * m.B, dpr * m.C, dpr * m.D, dpr * m.E, dpr * (m.F - h * m.zh));
    L.forEach(l => {
      const p = l.poly; if(p.length < 3) return;
      const g = fx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.92)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      fx.beginPath(); p.forEach((q, j) => j ? fx.lineTo(q[0], q[1]) : fx.moveTo(q[0], q[1])); fx.closePath(); fx.fillStyle = g; fx.fill();
    });
  });
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(fog, 0, 0);
  setGround(0);
  L.forEach(l => {
    if(!l.warm || l.poly.length < 3) return;
    ctx.save(); ctx.beginPath(); l.poly.forEach((q, j) => j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.clip();
    const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); g.addColorStop(0, 'rgba(255,170,70,.30)'); g.addColorStop(1, 'rgba(255,170,70,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); ctx.restore();
  });
  setScr();
  if(!litNow().length){ ctx.fillStyle = 'rgba(230,235,239,.9)'; ctx.font = '500 14px ' + css('--font-ui'); ctx.textAlign = 'center'; ctx.fillText(mode === 'criar' ? 'Adicione um token para testar a visão' : 'Nenhum token em campo', cssW / 2, cssH / 2); }
}

/* ---- seleção e régua (sempre por cima) ---- */
function drawSel(){
  const s = S.sel; if(!s) return;
  const acc = css('--accent');
  if(s.t === 'o'){
    const o = findObj(s.id); if(!o || (S.tool !== 'mover' && S.tool !== 'objeto')) return;
    const d = OBJ[o.k], e = .07;
    ctx.save(); setGround(0); ctx.translate(o.x, o.y); ctx.rotate(o.a * Math.PI / 180);
    ctx.setLineDash([.2 , .12]); ctx.lineWidth = 3 * upx(); ctx.strokeStyle = acc; ctx.strokeRect(-d.w / 2 - e, -d.h / 2 - e, d.w + 2 * e, d.h + 2 * e);
    ctx.restore(); setScr();
  } else {
    const t = findTok(s.id); if(!t || !tokenVisible(t) || ['piso', 'parede', 'apagar', 'regua'].includes(S.tool)) return;
    setScr(); ctx.strokeStyle = acc; ctx.lineWidth = 2.5; ctx.beginPath();
    if(!cam.iso){ const p = toS(t.x, t.y); ctx.arc(p.x, p.y, cam.z * .4 + Math.max(3, cam.z * .1), 0, 7); }
    else { const p = P(t.x, t.y, 0), r = tokenHead(t); ctx.ellipse(p.x, p.y, r * 1.05, r * .55, 0, 0, 7); }
    ctx.stroke();
  }
}
function measure(a, b){
  const dx = Math.abs(b.x - a.x), dy = Math.abs(b.y - a.y);
  if(map.diag === 'cheb') return Math.max(dx, dy);
  if(map.diag === 'alt'){ const X = Math.round(dx), Y = Math.round(dy); return Math.max(X, Y) + Math.floor(Math.min(X, Y) / 2); }
  return Math.hypot(dx, dy);
}
const fmt = n => String(Math.round(n * 10) / 10).replace('.', ',');
function drawRuler(){
  const r = ui.ruler; if(!r) return;
  const a = toS(r.a.x, r.a.y), b = toS(r.b.x, r.b.y), fr = css('--frost');
  setScr();
  ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  ctx.strokeStyle = fr; ctx.lineWidth = 2.5; ctx.stroke();
  [a, b].forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fillStyle = fr; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.5; ctx.stroke(); });
  const sq = measure(r.a, r.b); if(sq <= 0) return;
  const txt = fmt(sq) + (Math.abs(sq - 1) < .05 ? ' quadrado' : ' quadrados') + ' · ' + fmt(sq * map.unit.per) + ' ' + map.unit.label;
  ctx.font = '500 13px ' + css('--font-num'); const w = ctx.measureText(txt).width + 18, mx = clamp((a.x + b.x) / 2, w / 2 + 6, cssW - w / 2 - 6), my = clamp((a.y + b.y) / 2 - 22, 18, cssH - 18);
  rr(ctx, mx - w / 2, my - 13, w, 26, 13); ctx.fillStyle = 'rgba(14,18,22,.92)'; ctx.fill(); ctx.strokeStyle = fr; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#e6ebef'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, mx, my + .5);
}

/* ---------------- operações no mapa ---------------- */
const cellAt = w => ({ x:clamp(Math.floor(w.x), 0, map.w - 1), y:clamp(Math.floor(w.y), 0, map.h - 1) });
const norm = r => ({ x0:Math.min(r.x0, r.x1), y0:Math.min(r.y0, r.y1), x1:Math.max(r.x0, r.x1), y1:Math.max(r.y0, r.y1) });
function setFloor(x, y, v){ if(x >= 0 && y >= 0 && x < map.w && y < map.h) map.F[y * map.w + x] = v; }
function paintBrush(cx, cy){ const o = Math.floor((S.brush - 1) / 2); for(let j = 0; j < S.brush; j++) for(let i = 0; i < S.brush; i++) setFloor(cx - o + i, cy - o + j, S.floor); }
function lineCells(a, b, fn){ let x = a.x, y = a.y; const dx = Math.abs(b.x - a.x), dy = Math.abs(b.y - a.y), sx = a.x < b.x ? 1 : -1, sy = a.y < b.y ? 1 : -1; let e = dx - dy; for(;;){ fn(x, y); if(x === b.x && y === b.y) break; const e2 = 2 * e; if(e2 > -dy){ e -= dy; x += sx; } if(e2 < dx){ e += dx; y += sy; } } }
function validEdge(o, x, y){ return o === 'h' ? (x >= 0 && x < map.w && y >= 0 && y <= map.h) : (x >= 0 && x <= map.w && y >= 0 && y < map.h); }
function nearestEdge(w, onlyExisting){
  const cx = Math.floor(w.x), cy = Math.floor(w.y), fx = w.x - cx, fy = w.y - cy;
  const c = [['h', cx, cy, fy], ['h', cx, cy + 1, 1 - fy], ['v', cx, cy, fx], ['v', cx + 1, cy, 1 - fx]];
  let best = null;
  c.forEach(q => { const k = q[0] + q[1] + ',' + q[2]; if(!validEdge(q[0], q[1], q[2])) return; if(onlyExisting && !map.walls[k]) return; if(!best || q[3] < best.d) best = { k, d:q[3] }; });
  return best;
}
const vertexAt = w => ({ x:clamp(Math.round(w.x), 0, map.w), y:clamp(Math.round(w.y), 0, map.h) });
function axisSnap(s, e){ return Math.abs(e.x - s.x) >= Math.abs(e.y - s.y) ? { x:e.x, y:s.y } : { x:s.x, y:e.y }; }
function lineEdges(s, e){
  const out = []; if(s.x === e.x && s.y === e.y) return out;
  if(s.y === e.y){ for(let x = Math.min(s.x, e.x); x < Math.max(s.x, e.x); x++) out.push('h' + x + ',' + s.y); }
  else { for(let y = Math.min(s.y, e.y); y < Math.max(s.y, e.y); y++) out.push('v' + s.x + ',' + y); }
  return out.filter(k => { const m = /^([hv])(\d+),(\d+)$/.exec(k); return validEdge(m[1], +m[2], +m[3]); });
}
function setEdges(keys, type){
  const all = keys.length && keys.every(k => map.walls[k] === type);
  keys.forEach(k => { if(all) delete map.walls[k]; else map.walls[k] = type; });
  wallsChanged();
}
function applyRoom(r, walls){
  r = norm(r);
  for(let y = r.y0; y <= r.y1; y++) for(let x = r.x0; x <= r.x1; x++) setFloor(x, y, S.floor);
  if(!walls) return;
  const put = k => { const t = map.walls[k]; if(t === EDGE.DOOR || t === EDGE.OPEN || t === EDGE.WINDOW) return; map.walls[k] = EDGE.WALL; };
  for(let x = r.x0; x <= r.x1; x++){ put('h' + x + ',' + r.y0); put('h' + x + ',' + (r.y1 + 1)); }
  for(let y = r.y0; y <= r.y1; y++){ put('v' + r.x0 + ',' + y); put('v' + (r.x1 + 1) + ',' + y); }
  wallsChanged();
}

/* ---- objetos: posição, encaixe, toque ---- */
const canMoveObj = o => isMaster() || !!o.livre;
const canMoveTok = t => isMaster() || !t.mestre;
// Encaixe: com a grade ligada o objeto cai no quadrado certo para o tamanho dele (como antes). Com ela desligada, vai exatamente onde o dedo soltar.
function snapPos(k, a, x, y){
  const d = OBJ[k];
  if(S.snap){
    const q = ((a % 90) + 90) % 90;
    if(q < 1 || q > 89){
      const odd = Math.round(a / 90) % 2 !== 0, fw = odd ? d.h : d.w, fh = odd ? d.w : d.h;
      return { x:clamp(fw % 2 ? Math.floor(x) + .5 : Math.round(x), fw / 2, map.w - fw / 2), y:clamp(fh % 2 ? Math.floor(y) + .5 : Math.round(y), fh / 2, map.h - fh / 2) };
    }
    return { x:clamp(Math.round(x * 2) / 2, 0, map.w), y:clamp(Math.round(y * 2) / 2, 0, map.h) };
  }
  return { x:clamp(x, 0, map.w), y:clamp(y, 0, map.h) };
}
function hitObj2D(w){
  const tol = clamp(8 / cam.z, .05, .35);
  for(let i = map.objects.length - 1; i >= 0; i--){
    const o = map.objects[i], d = OBJ[o.k], a = o.a * Math.PI / 180, dx = w.x - o.x, dy = w.y - o.y;
    const lx = dx * Math.cos(a) + dy * Math.sin(a), ly = -dx * Math.sin(a) + dy * Math.cos(a);
    if(Math.abs(lx) <= d.w / 2 + tol && Math.abs(ly) <= d.h / 2 + tol) return o;
  }
  return null;
}
function hull(pts){
  const p = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y); if(p.length < 3) return p;
  const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x), lo = [], up = [];
  p.forEach(q => { while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
  for(let i = p.length - 1; i >= 0; i--){ const q = p[i]; while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  lo.pop(); up.pop(); return lo.concat(up);
}
function objShape(o){
  const I = ISO[o.k], ring = (r, n) => Array.from({ length:n }, (_, i) => ({ x:o.x + Math.cos(i / n * 6.2832) * r, y:o.y + Math.sin(i / n * 6.2832) * r }));
  if(I.s === 'box') return { pts:boxPts(o, 0), top:I.h };
  if(I.s === 'tree') return { pts:ring(I.cr * .8, 10), top:I.ch };
  return { pts:ring(Math.max(I.r, .3), 10), top:I.h + (I.s === 'torch' ? .2 : 0) };
}
function hitObjIso(sx, sy){
  const list = map.objects.map(o => ({ o, d:depth(o.x, o.y) })).sort((a, b) => b.d - a.d), shapes = new Map();
  for(const it of list){
    const sh = objShape(it.o), pts = []; shapes.set(it.o, sh);
    sh.pts.forEach(q => { pts.push(P(q.x, q.y, 0), P(q.x, q.y, sh.top)); });
    const hl = hull(pts).map(q => [q.x, q.y]);
    if(hl.length >= 3 && inPoly(sx, sy, hl)) return it.o;
  }
  // Ninguém exatamente sob o dedo: aceita o mais próximo, com folga proporcional ao zoom (objeto pequeno e longe é difícil de acertar).
  let best = null, bd = clamp(cam.z * ISO_K * .7, 6, 14);
  for(const it of list){ const sh = shapes.get(it.o), c = P(it.o.x, it.o.y, sh.top / 2), d = Math.hypot(sx - c.x, sy - c.y); if(d < bd){ bd = d; best = it.o; } }
  return best;
}
const pickObject = (sx, sy, w) => cam.iso ? hitObjIso(sx, sy) : hitObj2D(w);
function pickToken(sx, sy){
  let best = null, bd = Infinity;
  map.tokens.forEach(t => { if(!tokenVisible(t)) return; const s = tokenScreen(t), d = Math.hypot(s.x - sx, s.y - sy); if(d <= s.r && d < bd){ bd = d; best = t; } });
  return best;
}
function doorAt(sx, sy, w){
  if(!cam.iso){
    const e = nearestEdge(w, true), t = e && map.walls[e.k];
    return (e && e.d < clamp(16 / cam.z, .38, .5) && (t === EDGE.DOOR || t === EDGE.OPEN)) ? e.k : null;
  }
  let best = null, bd = 30;
  WL.forEach(q => { if(q.t !== EDGE.DOOR && q.t !== EDGE.OPEN) return; const p = P(q.o === 'h' ? q.x + .5 : q.x, q.o === 'h' ? q.y : q.y + .5, WHS[S.wh] * .45), d = Math.hypot(p.x - sx, p.y - sy); if(d < bd){ bd = d; best = q.k; } });
  return best;
}
function toggleDoor(k){ const t = map.walls[k]; map.walls[k] = t === EDGE.DOOR ? EDGE.OPEN : EDGE.DOOR; wallsChanged(); }
function eraseAt(sx, sy, w){
  if(S.erase === 'obj'){ const o = pickObject(sx, sy, w); if(o) map.objects.splice(map.objects.indexOf(o), 1); }
  else if(S.erase === 'wall'){ const e = nearestEdge(w, true); if(e && e.d < .34){ delete map.walls[e.k]; wallsChanged(); } }
  else { const c = cellAt(w); const o = Math.floor((S.brush - 1) / 2); for(let j = 0; j < S.brush; j++) for(let i = 0; i < S.brush; i++) setFloor(c.x - o + i, c.y - o + j, 0); }
}

/* ---- ações sobre a seleção ---- */
function selectItem(t, id){ S.sel = id ? { t, id } : null; renderStrip(); requestDraw(); }
function rotateSel(deg){
  const o = selObj(); if(!o || !canMoveObj(o)) return;
  withUndo(() => { o.a = (((o.a + deg) % 360) + 360) % 360; if(S.snap){ const p = snapPos(o.k, o.a, o.x, o.y); o.x = p.x; o.y = p.y; } }, true);
  renderStrip();
}
function dupSel(){
  const o = selObj(); if(!o || !isMaster()) return;
  let n = null;
  withUndo(() => { const p = snapPos(o.k, o.a, o.x + 1, o.y + 1); n = { id:uid('o'), k:o.k, x:p.x, y:p.y, a:o.a, livre:o.livre }; map.objects.push(n); }, true);
  selectItem('o', n.id);
}
function delSel(){
  const o = selObj(); if(!o || !isMaster()) return;
  withUndo(() => { map.objects.splice(map.objects.indexOf(o), 1); S.sel = null; }, true);
  renderStrip();
}
function toggleLivre(){ const o = selObj(); if(!o || !isMaster()) return; withUndo(() => { o.livre = !o.livre; }, true); renderStrip(); }
function addToken(){
  if(!isMaster()) return;
  const c = toW(cssW / 2, cssH / 2), n = map.tokens.length; let t = null;
  withUndo(() => {
    t = { id:uid('t'), label:String.fromCharCode(65 + n % 26), color:TOKEN_COLORS[n % TOKEN_COLORS.length], x:clamp(Math.floor(c.x) + .5, .5, map.w - .5), y:clamp(Math.floor(c.y) + .5, .5, map.h - .5), mestre:false };
    map.tokens.push(t);
  }, false);
  selectItem('t', t.id);
}
function removeToken(){ const t = selTok(); if(!t || !isMaster()) return; withUndo(() => { map.tokens.splice(map.tokens.indexOf(t), 1); S.sel = null; }, false); renderStrip(); }
function toggleTokMestre(){ const t = selTok(); if(!t || !isMaster()) return; withUndo(() => { t.mestre = !t.mestre; }, false); renderStrip(); }

/* ---------------- toque e mouse ---------------- */
const ptrs = new Map();
let act = null, gesture = null, mustLift = false;
const MOVER_LIKE = ['mover', 'luz', 'neblina', 'fichas'];
const pos = e => { const r = cv.getBoundingClientRect(); return { x:e.clientX - r.left, y:e.clientY - r.top }; };
const rulerPt = w => S.snapRuler ? { x:clamp(Math.floor(w.x) + .5, 0, map.w), y:clamp(Math.floor(w.y) + .5, 0, map.h) } : { x:clamp(w.x, 0, map.w), y:clamp(w.y, 0, map.h) };
function startAct(sx, sy){
  const w = toW(sx, sy), t = S.tool; act = { tool:t, sx, sy, w0:w, moved:false, before:null };
  if(MOVER_LIKE.includes(t)){
    const tk = pickToken(sx, sy), ob = t === 'mover' ? pickObject(sx, sy, w) : null, dr = doorAt(sx, sy, w);
    // A ficha tem uma área de toque generosa, mas só ganha de um objeto ou de uma porta se o dedo estiver bem em cima dela.
    const ts = tk && tokenScreen(tk), strict = tk && Math.hypot(ts.x - sx, ts.y - sy) <= Math.max(14, ts.r * .55);
    let it = null, kind = 't';
    if(tk && (strict || (!ob && !dr))) it = tk; else if(ob){ it = ob; kind = 'o'; }
    if(it && (kind === 't' ? canMoveTok(it) : canMoveObj(it))){
      act.drag = { kind, it, g0:w, p0:{ x:it.x, y:it.y } }; act.before = snapshot();
      if(!S.sel || S.sel.id !== it.id){ S.sel = { t:kind, id:it.id }; renderStrip(); }
    } else { act.pan = true; act.g0 = w; if(it) act.blocked = true; }
  }
  else if(t === 'piso'){
    act.before = snapshot(); const c = cellAt(w);
    if(S.floorMode === 'pincel'){ paintBrush(c.x, c.y); act.lc = c; } else act.r = { x0:c.x, y0:c.y, x1:c.x, y1:c.y };
  }
  else if(t === 'parede'){ act.before = snapshot(); act.sv = vertexAt(w); act.ev = act.sv; }
  else if(t === 'objeto'){ act.before = snapshot(); act.ghost = snapPos(S.obj, 0, w.x, w.y); }
  else if(t === 'apagar'){ act.before = snapshot(); act.last = { x:sx, y:sy }; eraseAt(sx, sy, w); }
  else if(t === 'regua'){ const p = rulerPt(w); ui.ruler = { a:p, b:p }; }
  requestDraw();
}
function moveAct(sx, sy){
  const a = act, w = toW(sx, sy); if(Math.hypot(sx - a.sx, sy - a.sy) > 8) a.moved = true;
  switch(a.tool){
    case 'mover': case 'luz': case 'neblina': case 'fichas':
      if(a.drag){
        if(a.moved){
          const dx = w.x - a.drag.g0.x, dy = w.y - a.drag.g0.y, it = a.drag.it;
          if(a.drag.kind === 't'){ it.x = clamp(a.drag.p0.x + dx, .2, map.w - .2); it.y = clamp(a.drag.p0.y + dy, .2, map.h - .2); }
          else { const p = snapPos(it.k, it.a, a.drag.p0.x + dx, a.drag.p0.y + dy); it.x = p.x; it.y = p.y; }
        }
      } else if(a.pan) anchorCam(a.g0.x, a.g0.y, sx, sy);
      break;
    case 'piso': { const c = cellAt(w); if(a.r){ a.r.x1 = c.x; a.r.y1 = c.y; } else { lineCells(a.lc, c, (x, y) => paintBrush(x, y)); a.lc = c; } break; }
    case 'parede': a.ev = axisSnap(a.sv, vertexAt(w)); break;
    case 'objeto': a.ghost = snapPos(S.obj, 0, w.x, w.y); break;
    case 'apagar': { const n = Math.max(1, Math.ceil(Math.hypot(sx - a.last.x, sy - a.last.y) / Math.max(6, cam.z * .25))); for(let i = 1; i <= n; i++){ const px = a.last.x + (sx - a.last.x) * i / n, py = a.last.y + (sy - a.last.y) * i / n; eraseAt(px, py, toW(px, py)); } a.last = { x:sx, y:sy }; break; }
    case 'regua': ui.ruler.b = rulerPt(w); break;
  }
  requestDraw();
}
function endAct(cancel){
  const a = act; if(!a) return; act = null;
  if(cancel){
    if(a.before) restore(a.before);
    if(a.tool === 'regua') ui.ruler = null;
    renderStrip(); requestDraw(); return;
  }
  switch(a.tool){
    case 'mover': case 'luz': case 'neblina': case 'fichas':
      if(a.drag){
        if(a.moved){
          const it = a.drag.it;
          if(a.drag.kind === 't' && S.snap){ it.x = clamp(Math.floor(it.x) + .5, .5, map.w - .5); it.y = clamp(Math.floor(it.y) + .5, .5, map.h - .5); }
          commitEdit(a.before, a.drag.kind === 'o'); renderStrip();
        }
      } else if(!a.moved){
        const k = doorAt(a.sx, a.sy, a.w0);
        if(k){ if(isMaster()) withUndo(() => toggleDoor(k), true); else toast('Só o Mestre abre portas.'); }
        else if(a.blocked) toast('Só o Mestre mexe nisso.');
        else if(S.sel && a.tool === 'mover'){ S.sel = null; renderStrip(); }
      }
      break;
    case 'piso':
      if(a.r) applyRoom(a.r, S.floorMode === 'sala');
      commitEdit(a.before, true); break;
    case 'parede':
      if(a.sv.x === a.ev.x && a.sv.y === a.ev.y || !a.moved){ const e = nearestEdge(a.w0, false); if(e) setEdges([e.k], S.edge); }
      else setEdges(lineEdges(a.sv, a.ev), S.edge);
      commitEdit(a.before, true); break;
    case 'objeto':
      if(a.ghost){ const o = { id:uid('o'), k:S.obj, x:a.ghost.x, y:a.ghost.y, a:0, livre:false }; map.objects.push(o); S.sel = { t:'o', id:o.id }; }
      commitEdit(a.before, true); renderStrip(); break;
    case 'apagar': commitEdit(a.before, true); break;
    case 'regua': if(!a.moved) ui.ruler = null; break;
  }
  requestDraw();
}
function startGesture(){
  const p = Array.from(ptrs.values()); if(p.length < 2) return;
  const mid = { x:(p[0].x + p[1].x) / 2, y:(p[0].y + p[1].y) / 2 };
  gesture = { d0:Math.max(10, Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)), z0:cam.z, wp:toW(mid.x, mid.y) };
}
function moveGesture(){
  const p = Array.from(ptrs.values()); if(p.length < 2 || !gesture) return;
  const mid = { x:(p[0].x + p[1].x) / 2, y:(p[0].y + p[1].y) / 2 }, d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  cam.z = clamp(gesture.z0 * d / gesture.d0, 4, 220); M = null; anchorCam(gesture.wp.x, gesture.wp.y, mid.x, mid.y);
}
cv.addEventListener('pointerdown', e => {
  e.preventDefault();
  try{ cv.setPointerCapture(e.pointerId); }catch(_){}
  const p = pos(e);
  if(e.pointerType === 'mouse' && (e.button === 1 || e.button === 2)){ ptrs.set(e.pointerId, p); act = { tool:'pan', pan:true, g0:toW(p.x, p.y), sx:p.x, sy:p.y, moved:true }; return; }
  ptrs.set(e.pointerId, p);
  if(ptrs.size === 2){ endAct(true); startGesture(); mustLift = true; return; }
  if(ptrs.size > 2 || mustLift) return;
  startAct(p.x, p.y);
});
cv.addEventListener('pointermove', e => {
  if(!ptrs.has(e.pointerId)) return;
  const p = pos(e); ptrs.set(e.pointerId, p);
  if(gesture){ moveGesture(); return; }
  if(!act || mustLift) return;
  if(act.tool === 'pan'){ anchorCam(act.g0.x, act.g0.y, p.x, p.y); return; }
  moveAct(p.x, p.y);
});
function up(e){
  if(!ptrs.has(e.pointerId)) return;
  ptrs.delete(e.pointerId);
  if(gesture){ if(ptrs.size < 2) gesture = null; if(ptrs.size === 0) mustLift = false; return; }
  if(mustLift){ if(ptrs.size === 0) mustLift = false; return; }
  if(act && act.tool === 'pan'){ act = null; return; }
  endAct(e.type === 'pointercancel');
}
cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
cv.addEventListener('contextmenu', e => e.preventDefault());
cv.addEventListener('wheel', e => {
  e.preventDefault(); const p = pos(e), w = toW(p.x, p.y);
  cam.z = clamp(cam.z * Math.exp(-e.deltaY * .0015), 4, 220); M = null; anchorCam(w.x, w.y, p.x, p.y);
}, { passive:false });

/* ---------------- ferramentas e faixa de opções ---------------- */
const TOOL_NAMES = { mover:'Mover', piso:'Piso', parede:'Parede', objeto:'Objeto', apagar:'Apagar', regua:'Régua', luz:'Luz', neblina:'Névoa', fichas:'Tokens' };
function toolset(){ return mode === 'criar' ? ['mover', 'piso', 'parede', 'objeto', 'apagar', 'regua', 'luz'] : (S.role === 'mestre' ? ['mover', 'regua', 'neblina', 'fichas'] : ['mover', 'regua']); }
const HINTS_CRIAR = {
  mover:'Toque num objeto para escolher. Arraste para mover.',
  piso:'Arraste para pintar. Dois dedos movem e dão zoom.',
  parede:'Arraste em linha reta. Toque numa borda para pôr ou tirar.',
  objeto:'Toque para colocar. Para mexer num que já está, use Mover.',
  apagar:'Arraste sobre o que quer apagar.',
  regua:'Arraste para medir a distância.',
  luz:'Tokens enxergam até onde as paredes deixam. Porta fechada bloqueia.'
};
const HINTS_MESA = {
  mover:{ mestre:'Mestre: arraste qualquer peça. Toque numa porta para abrir.', jogador:'Arraste seus tokens e o que o Mestre liberou.' },
  regua:{ mestre:'Arraste para medir a distância.', jogador:'Arraste para medir a distância.' },
  neblina:{ mestre:'Ligue ou desligue a névoa e ajuste a visão.' },
  fichas:{ mestre:'Adicione tokens. Marque os que só o Mestre mexe.' }
};
const hintText = () => mode === 'criar' ? HINTS_CRIAR[S.tool] : ((HINTS_MESA[S.tool] || {})[S.role] || '');
function renderTools(){
  $('#tools').innerHTML = toolset().map(t => `<button type="button" class="tool" data-tool="${t}" aria-pressed="${S.tool === t}">${icon(t)}<span>${TOOL_NAMES[t]}</span></button>`).join('');
}
const seg = (key, label, items, cur) => `<div class="seg" role="group" aria-label="${label}">${items.map(i => `<button type="button" data-set="${key}" data-v="${i[0]}" aria-pressed="${String(i[0]) === String(cur)}">${i[1]}</button>`).join('')}</div>`;
const chip = (act, label, pressed, dis) => `<button type="button" class="chip" data-act="${act}"${pressed === undefined ? '' : ` aria-pressed="${pressed}"`}${dis ? ' disabled' : ''}>${label}</button>`;
const snapChip = () => chip('snap', 'Encaixe na grade', S.snap);
const addChip = () => chip('addtoken', icon('plus') + 'Token');
function objChips(){ const o = selObj(); if(!o || !isMaster()) return ''; return chip('rot90', 'Girar 90°') + chip('rot15', 'Girar 15°') + chip('dup', 'Duplicar') + chip('del', 'Apagar') + chip('livre', 'Jogadores mexem', !!o.livre) + snapChip(); }
function tokChips(){ const t = selTok(); if(!t || !isMaster()) return ''; return chip('tokmestre', 'Só o Mestre mexe', !!t.mestre) + chip('rmtoken', 'Remover token') + addChip() + snapChip(); }
const rangeStepper = () => `<div class="stepper" role="group" aria-label="Alcance da visão"><button type="button" data-act="rangeminus" aria-label="Diminuir alcance">−</button><b>${map.range} quadr.</b><button type="button" data-act="rangeplus" aria-label="Aumentar alcance">+</button></div>`;
function renderStrip(){
  const el = $('#opts'); let h = '', two = false;
  const rs = mode === 'jogar' ? seg('role', 'Ver como', [['mestre', 'Mestre'], ['jogador', 'Jogador']], S.role) : '';
  const master = isMaster(), so = selObj(), st = selTok();
  switch(S.tool){
    case 'mover': h = master ? (so ? objChips() : st ? tokChips() : addChip() + snapChip()) : '<span class="lbl">Seus tokens e o que o Mestre liberou.</span>'; break;
    case 'piso':
      two = true;
      h = '<div class="orow">' + seg('floorMode', 'Modo do piso', [['pincel', 'Pincel'], ['retangulo', 'Retângulo'], ['sala', 'Sala']], S.floorMode);
      if(S.floorMode === 'pincel') h += seg('brush', 'Tamanho do pincel', [[1, '1'], [2, '2'], [3, '3']], S.brush);
      h += '</div><div class="orow">' + FLOORS.slice(1).map((f, i) => `<button type="button" class="sw" data-floor="${i + 1}" aria-label="${f.n}" aria-pressed="${S.floor === i + 1}"><img alt="" src="${FTHUMB[i + 1]}"></button>`).join('') + '</div>';
      break;
    case 'parede': h = seg('edge', 'Tipo de borda', [[1, 'Parede'], [4, 'Janela'], [2, 'Porta']], S.edge); break;
    case 'objeto': {
      const cat = OBJ_ORDER.map(k => `<button type="button" class="sw" data-obj="${k}" aria-label="${OBJ[k].n}" aria-pressed="${S.obj === k}"><img alt="" src="${OTHUMB[k]}"></button>`).join('');
      if(so){ two = true; h = `<div class="orow">${objChips()}</div><div class="orow">${cat}</div>`; } else h = cat;
      break;
    }
    case 'apagar':
      h = seg('erase', 'O que apagar', [['obj', 'Objetos'], ['wall', 'Paredes'], ['floor', 'Pisos']], S.erase);
      if(S.erase === 'floor') h += seg('brush', 'Tamanho do pincel', [[1, '1'], [2, '2'], [3, '3']], S.brush);
      break;
    case 'regua': h = chip('snapruler', 'Encaixar no centro dos quadrados', S.snapRuler); break;
    case 'luz': h = rangeStepper() + chip('torches', 'Tochas acendem', map.torch) + addChip() + chip('rmtoken', 'Remover token', undefined, !st); break;
    case 'neblina': h = chip('fog', map.fog ? 'Névoa ligada' : 'Névoa desligada', map.fog) + rangeStepper() + chip('torches', 'Tochas acendem', map.torch); break;
    case 'fichas': h = st ? tokChips() : addChip() + snapChip(); break;
  }
  if(rs && !two) h = rs + h;
  el.className = 'gut opts' + (two ? ' two' : ''); el.innerHTML = h; el.hidden = !S.strip;
  $('#hint').textContent = hintText();
}
function renderFabs(){ $('#b-iso').setAttribute('aria-pressed', String(cam.iso)); $('#b-iso').setAttribute('aria-label', cam.iso ? 'Voltar para a vista de cima' : 'Vista isométrica'); $('#b-rot').hidden = !cam.iso; }
function readout(){ $('#readout').textContent = map.w + '×' + map.h + ' · 1 quadrado = ' + fmt(map.unit.per) + ' ' + map.unit.label; }
function updateBanner(){
  const show = mode === 'jogar' && S.role === 'mestre' && D.rev !== D.mrev;
  $('#banner').hidden = !show; $('#hint').hidden = show;
}
function renderAll(){
  renderTools(); renderStrip(); updateBanner(); renderFabs(); readout(); syncButtons();
  document.querySelectorAll('#modeseg [data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  $('#cv').setAttribute('aria-label', (mode === 'criar' ? 'Mapa em edição' : 'Mesa de jogo') + (cam.iso ? ', vista isométrica' : ''));
}
function touchMap(){ if(mode === 'criar') D.rev++; save(); updateBanner(); requestDraw(); }

/* ---------------- modos: Criar (Ateliê) e Jogar (mesa) ---------------- */
function bindMode(m){
  mode = m; map = m === 'criar' ? D.atelie : D.mesa; undoS = stacks[m].u; redoS = stacks[m].r;
  ui.ruler = null; ui.litKey = ''; act = null; S.sel = null; wallsChanged();
  if(!toolset().includes(S.tool)) S.tool = 'mover';
}
function applyMode(m){
  camSaved[mode] = { x:cam.x, y:cam.y, z:cam.z };
  bindMode(m);
  const c = camSaved[m]; if(c){ cam.x = c.x; cam.y = c.y; cam.z = c.z; } else fitView();
  renderAll(); requestDraw(); saveUi();
}
function setMode(m){
  if(m === mode) return;
  if(m === 'jogar' && !D.mesa){ D.mesa = des(ser(D.atelie)); D.mrev = D.rev; D.mesaDirty = false; save(); toast('Mesa criada a partir do Ateliê.'); }
  applyMode(m);
}
function setRole(r){
  if(r === S.role) return;
  S.role = r; S.sel = null; ui.litKey = '';
  if(!toolset().includes(S.tool)) S.tool = 'mover';
  renderAll(); requestDraw(); saveUi();
}
function setIso(on){ cam.iso = !!on; renderAll(); requestDraw(); saveUi(); }
function rotView(){ cam.rot = (cam.rot + 1) % 4; requestDraw(); saveUi(); }
function sendToMesa(){
  if(!D.mesa) D.mesa = des(ser(D.atelie)); else copyInto(D.mesa, D.atelie);
  D.mrev = D.rev; D.mesaDirty = false; stacks.jogar.u.length = 0; stacks.jogar.r.length = 0;
  if(mode === 'jogar'){ map = D.mesa; wallsChanged(); S.sel = null; ui.litKey = ''; }
  syncButtons(); save(); updateBanner(); renderStrip(); requestDraw(); toast('A mesa agora é uma cópia do Ateliê.');
}
function fetchFromMesa(){
  if(!D.mesa){ toast('Ainda não há mesa. Entre em Jogar uma vez.'); return; }
  const before = snapshot(D.atelie);
  copyInto(D.atelie, D.mesa);
  stacks.criar.u.push(before); stacks.criar.r.length = 0; D.rev++; D.mrev = D.rev; D.mesaDirty = false;
  if(mode === 'criar'){ wallsChanged(); fixSel(); }
  ui.litKey = ''; syncButtons(); save(); updateBanner(); renderStrip(); readout(); requestDraw(); toast('O Ateliê agora é uma cópia da mesa.');
}
function armed(btn, label, fn){
  if(btn.dataset.armed !== '1'){ btn.dataset.armed = '1'; btn._t = btn.textContent; btn.textContent = label; setTimeout(() => { if(btn.dataset.armed === '1'){ btn.dataset.armed = ''; btn.textContent = btn._t; } }, 3500); return; }
  btn.dataset.armed = ''; btn.textContent = btn._t; fn();
}

/* ---------------- eventos da faixa e da barra ---------------- */
$('#modeseg').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if(b) setMode(b.dataset.mode); });
$('#tools').addEventListener('click', e => {
  const b = e.target.closest('[data-tool]'); if(!b) return;
  if(S.tool === b.dataset.tool) S.strip = !S.strip; else { S.tool = b.dataset.tool; S.strip = true; ui.ruler = null; }
  renderTools(); renderStrip(); requestDraw();
});
$('#opts').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.set){ const k = b.dataset.set; if(k === 'role'){ setRole(b.dataset.v); return; } S[k] = (k === 'brush' || k === 'edge') ? +b.dataset.v : b.dataset.v; renderStrip(); }
  else if(b.dataset.floor){ S.floor = +b.dataset.floor; renderStrip(); }
  else if(b.dataset.obj){ S.obj = b.dataset.obj; renderStrip(); }
  else if(b.dataset.act){
    const a = b.dataset.act;
    if(a === 'addtoken') addToken(); else if(a === 'rmtoken') removeToken(); else if(a === 'tokmestre') toggleTokMestre();
    else if(a === 'rot90') rotateSel(90); else if(a === 'rot15') rotateSel(15); else if(a === 'dup') dupSel(); else if(a === 'del') delSel(); else if(a === 'livre') toggleLivre();
    else if(a === 'snap'){ S.snap = !S.snap; saveUi(); renderStrip(); }
    else if(a === 'snapruler'){ S.snapRuler = !S.snapRuler; renderStrip(); }
    else if(a === 'torches'){ map.torch = !map.torch; renderStrip(); touchMap(); }
    else if(a === 'fog'){ map.fog = !map.fog; renderStrip(); touchMap(); }
    else if(a === 'rangeminus'){ map.range = clamp(map.range - 1, 2, 20); renderStrip(); touchMap(); }
    else if(a === 'rangeplus'){ map.range = clamp(map.range + 1, 2, 20); renderStrip(); touchMap(); }
  }
});
$('#b-undo').addEventListener('click', doUndo);
$('#b-redo').addEventListener('click', doRedo);
$('#b-fit').addEventListener('click', fitView);
$('#b-iso').addEventListener('click', () => setIso(!cam.iso));
$('#b-rot').addEventListener('click', rotView);
$('#banner-b').addEventListener('click', e => { if(D.mesaDirty) armed(e.currentTarget, 'Perde o que moveu. Toque de novo', sendToMesa); else sendToMesa(); });
document.addEventListener('keydown', e => {
  if(e.target.closest && e.target.closest('input,textarea,select')) return;
  if(e.key === 'Escape') closeSheet();
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'){ e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); }
  else if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y'){ e.preventDefault(); doRedo(); }
  else if(e.key === 'Delete' || e.key === 'Backspace'){ if(selObj()){ e.preventDefault(); delSel(); } }
  else if(e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey){ if(selObj()) rotateSel(e.shiftKey ? 15 : 90); }
});

/* ---------------- menu do mapa ---------------- */
let toastT = 0;
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2400); }
function openSheet(){
  $('#m-name').value = map.name; $('#m-size').value = [map.w, map.h].join('x'); if($('#m-size').value !== map.w + 'x' + map.h) $('#m-size').value = '32x24';
  $('#m-per').value = map.unit.per; $('#m-unit').value = map.unit.label; $('#m-diag').value = map.diag; $('#m-grid').checked = map.grid; $('#m-wallh').value = String(S.wh); $('#m-text').value = '';
  $('#sec-edit').hidden = mode !== 'criar'; $('#sec-measure').hidden = !isMaster(); $('#sec-mesa').hidden = !isMaster(); $('#sec-backup').hidden = !isMaster(); $('#m-load').hidden = mode !== 'criar';
  $('#sh-title').textContent = mode === 'criar' ? 'Ateliê' : 'Mesa';
  $('#m-new').textContent = 'Novo mapa vazio'; $('#m-new').dataset.armed = ''; $('#sheet').hidden = false; $('#sh-close').focus();
}
function closeSheet(){ if($('#sheet').hidden) return; $('#sheet').hidden = true; $('#b-menu').focus(); }
$('#b-menu').addEventListener('click', openSheet); $('#sh-close').addEventListener('click', closeSheet);
$('#sheet').addEventListener('click', e => { if(e.target.id === 'sheet') closeSheet(); });
// Troca o conteúdo do Ateliê por outro mapa (exemplo, vazio ou texto colado).
function loadIntoAtelie(m, msg, focus){
  Object.assign(D.atelie, m); stacks.criar.u.length = 0; stacks.criar.r.length = 0; D.rev++; ui.ruler = null; ui.litKey = ''; S.sel = null;
  if(mode === 'criar') wallsChanged();
  syncButtons(); readout(); renderStrip(); updateBanner(); fitView(); if(focus) focusOn(focus[0], focus[1], Math.min(focus[2], cssW / 14)); save(); if(msg) toast(msg);
}
$('#m-name').addEventListener('input', e => { map.name = e.target.value.slice(0, 60); save(); });
$('#m-apply').addEventListener('click', () => {
  const [w, h] = $('#m-size').value.split('x').map(Number); if(w === map.w && h === map.h){ toast('O mapa já tem esse tamanho.'); return; }
  const before = snapshot(), F = new Uint8Array(w * h); for(let y = 0; y < Math.min(h, map.h); y++) for(let x = 0; x < Math.min(w, map.w); x++) F[y * w + x] = map.F[y * map.w + x];
  const walls = {}; Object.keys(map.walls).forEach(k => { const [x, y] = k.slice(1).split(',').map(Number); const o = k[0]; if(o === 'h' ? (x < w && y <= h) : (x <= w && y < h)) walls[k] = map.walls[k]; });
  map.w = w; map.h = h; map.F = F; map.walls = walls; map.objects = map.objects.filter(o => o.x <= w && o.y <= h); map.tokens.forEach(t => { t.x = Math.min(t.x, w - .5); t.y = Math.min(t.y, h - .5); });
  fixSel(); wallsChanged(); commitEdit(before); readout(); fitView(); toast('Tamanho mudou para ' + w + ' × ' + h + '.');
});
$('#m-demo').addEventListener('click', () => { loadIntoAtelie(demo(), 'Mapa de exemplo carregado.', DEMO_FOCUS); closeSheet(); });
$('#m-new').addEventListener('click', e => armed(e.currentTarget, 'Toque de novo para apagar tudo', () => { const [w, h] = $('#m-size').value.split('x').map(Number); loadIntoAtelie(newMap(w, h, 'Mapa novo'), 'Mapa vazio criado.'); closeSheet(); }));
$('#m-per').addEventListener('change', e => { const v = parseFloat(String(e.target.value).replace(',', '.')); if(v > 0){ map.unit.per = v; readout(); touchMap(); } });
$('#m-unit').addEventListener('change', e => { map.unit.label = e.target.value.trim().slice(0, 8) || 'm'; readout(); touchMap(); });
$('#m-p15').addEventListener('click', () => { map.unit = { label:'m', per:1.5 }; $('#m-per').value = 1.5; $('#m-unit').value = 'm'; readout(); touchMap(); });
$('#m-p5').addEventListener('click', () => { map.unit = { label:'pés', per:5 }; $('#m-per').value = 5; $('#m-unit').value = 'pés'; readout(); touchMap(); });
$('#m-diag').addEventListener('change', e => { map.diag = e.target.value; touchMap(); });
$('#m-grid').addEventListener('change', e => { map.grid = e.target.checked; touchMap(); });
$('#m-wallh').addEventListener('change', e => { S.wh = +e.target.value; saveUi(); requestDraw(); });
$('#m-send').addEventListener('click', e => { if(D.mesaDirty) armed(e.currentTarget, 'Perde o que moveu. Toque de novo', () => { sendToMesa(); closeSheet(); }); else { sendToMesa(); closeSheet(); } });
$('#m-fetch').addEventListener('click', e => armed(e.currentTarget, 'Troca o Ateliê. Toque de novo', () => { fetchFromMesa(); closeSheet(); }));
$('#m-copy').addEventListener('click', async () => {
  const txt = ser(map), ta = $('#m-text'); ta.value = txt;
  try{ await navigator.clipboard.writeText(txt); toast('Mapa copiado.'); }
  catch(_){ ta.focus(); ta.select(); toast('Selecionei o texto. Use Copiar do aparelho.'); }
});
$('#m-load').addEventListener('click', () => {
  const t = $('#m-text').value.trim(); if(!t){ toast('Cole o texto do mapa primeiro.'); return; }
  try{ loadIntoAtelie(des(t), 'Mapa carregado.'); closeSheet(); }catch(_){ toast('Esse texto não é um mapa do Almanaque.'); }
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', requestDraw);
new MutationObserver(requestDraw).observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

/* ---------------- início ---------------- */
let prefs = {}; try{ prefs = JSON.parse(localStorage.getItem('almanaque:ui') || '{}') || {}; }catch(_){ prefs = {}; }
let a0 = null, m0 = null;
try{ const raw = localStorage.getItem('almanaque:dados'); if(raw){ const o = JSON.parse(raw); a0 = des(o.a); m0 = o.m ? des(o.m) : null; D.rev = o.rev | 0; D.mrev = o.mrev | 0; D.mesaDirty = !!o.dirty; } }catch(_){ a0 = null; m0 = null; D.rev = 0; D.mrev = 0; }
const fresh = !a0;
D.atelie = a0 || demo(); D.mesa = m0;
if(prefs.role === 'jogador') S.role = 'jogador';
if([0, 1, 2].includes(prefs.wh)) S.wh = prefs.wh;
S.snap = prefs.snap !== false; cam.iso = !!prefs.iso; cam.rot = (((prefs.rot | 0) % 4) + 4) % 4;
resize();
bindMode(prefs.mode === 'jogar' && D.mesa ? 'jogar' : 'criar');
fitView(); if(fresh) focusOn(DEMO_FOCUS[0], DEMO_FOCUS[1], Math.min(DEMO_FOCUS[2], cssW / 14));
renderAll();
$('#m-ver').textContent = VERSAO;
window.__alm = {
  get map(){ return map; }, get mode(){ return mode; }, get undoS(){ return undoS; }, get redoS(){ return redoS; }, get act(){ return act; },
  D, S, ui, cam, stacks, P, toW, toS, getM, visPoly, measure, lights, isLit, ser, des, tokenScreen, objShape, doorAt, pickObject, snapPos,
  setMode, setRole, setIso, rotView, sendToMesa, fetchFromMesa, fitView, focusOn, selectItem, tokenVisible
};
/* ---------------- uso sem internet: guarda os arquivos do app para abrir na mesa sem sinal ---------------- */
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
})();
