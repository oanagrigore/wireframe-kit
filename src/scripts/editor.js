// Wireframe Kit editor. Sections are rendered at build time from the Astro components
// in src/components/sections and shipped as <template> elements; this script clones them.
const WF_CSS = document.getElementById('wfcss').textContent;
const FONTS = {
  'Plus Jakarta Sans':'"Plus Jakarta Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif',
  'Geist':'"Geist",system-ui,sans-serif','Inter':'"Inter",system-ui,sans-serif','DM Sans':'"DM Sans",system-ui,sans-serif',
  'Manrope':'"Manrope",system-ui,sans-serif','Bricolage Grotesque':'"Bricolage Grotesque",system-ui,sans-serif',
  'IBM Plex Sans':'"IBM Plex Sans",system-ui,sans-serif','Fraunces':'"Fraunces",Georgia,serif',
  'Instrument Serif':'"Instrument Serif",Georgia,serif','Newsreader':'"Newsreader",Georgia,serif','System UI':'system-ui,-apple-system,"Segoe UI",sans-serif'
};
const DEFAULTS = {
  bg:'#ffffff',fg:'#09090b',primary:'#18181b',pfg:'#fafafa',muted:'#f4f4f5',mutedFg:'#71717a',border:'#e4e4e7',card:'#ffffff',
  radius:8,bw:1,btnShape:'radius',shadow:'none',
  sectionY:96,container:1280,gutter:32,gutterM:16,gap:24,cardPad:24,
  fh:'Geist',fb:'Geist',base:16,scale:1.25,hw:600,tr:-0.02,lh:1.6,
  imgRatio:'16 / 9',imgStyle:'hatch',gray:false
};
const PRESETS = {
  'Zinc':{bg:'#ffffff',fg:'#09090b',primary:'#18181b',pfg:'#fafafa',muted:'#f4f4f5',mutedFg:'#71717a',border:'#e4e4e7',card:'#ffffff',radius:8,bw:1,btnShape:'radius',shadow:'none',fh:'Geist',fb:'Geist',hw:600,tr:-0.02},
  'Blueprint':{bg:'#f7f9fc',fg:'#0b1530',primary:'#2747d6',pfg:'#ffffff',muted:'#e9eef8',mutedFg:'#56627e',border:'#d3dcec',card:'#ffffff',radius:6,bw:1,btnShape:'radius',shadow:'sm',fh:'IBM Plex Sans',fb:'IBM Plex Sans',hw:600,tr:-0.015},
  'Soft':{bg:'#fbfaf7',fg:'#1f1d1a',primary:'#3f6b4f',pfg:'#f6f4ee',muted:'#f0ede5',mutedFg:'#6d685e',border:'#e3ded2',card:'#ffffff',radius:18,bw:1,btnShape:'pill',shadow:'md',fh:'Fraunces',fb:'DM Sans',hw:500,tr:-0.02},
  'Night':{bg:'#0c0d10',fg:'#ececf1',primary:'#ececf1',pfg:'#0c0d10',muted:'#17181d',mutedFg:'#8b8d98',border:'#26272e',card:'#121318',radius:10,bw:1,btnShape:'radius',shadow:'none',fh:'Geist',fb:'Geist',hw:600,tr:-0.025},
  'Sharp':{bg:'#ffffff',fg:'#000000',primary:'#000000',pfg:'#ffffff',muted:'#f1f1f1',mutedFg:'#4d4d4d',border:'#000000',card:'#ffffff',radius:0,bw:2,btnShape:'square',shadow:'none',fh:'Bricolage Grotesque',fb:'Inter',hw:700,tr:-0.035},
  'Editorial':{bg:'#fdfcfa',fg:'#16140f',primary:'#16140f',pfg:'#fdfcfa',muted:'#f3f1ec',mutedFg:'#6b665c',border:'#e2ded5',card:'#fdfcfa',radius:2,bw:1,btnShape:'square',shadow:'none',fh:'Instrument Serif',fb:'Inter',hw:400,tr:-0.01}
};
const CONTROLS = [
  {group:'Colors',items:[
    {k:'bg',t:'color',l:'Background'},{k:'fg',t:'color',l:'Foreground'},{k:'primary',t:'color',l:'Primary'},
    {k:'pfg',t:'color',l:'On primary'},{k:'muted',t:'color',l:'Muted'},{k:'mutedFg',t:'color',l:'Muted text'},
    {k:'border',t:'color',l:'Border'},{k:'card',t:'color',l:'Card'}]},
  {group:'Shape',items:[
    {k:'radius',t:'range',l:'Radius',min:0,max:32,step:1,u:'px'},
    {k:'bw',t:'range',l:'Border width',min:0,max:3,step:.5,u:'px'},
    {k:'btnShape',t:'select',l:'Buttons',opts:{radius:'Follow radius',half:'Half of radius',pill:'Pill',square:'Square'}},
    {k:'shadow',t:'select',l:'Card shadow',opts:{none:'None',sm:'Subtle',md:'Medium',lg:'Large'}}]},
  {group:'Spacing',items:[
    {k:'sectionY',t:'range',l:'Section Y',min:24,max:200,step:4,u:'px'},
    {k:'container',t:'range',l:'Max width',min:720,max:1600,step:20,u:'px'},
    {k:'gutter',t:'range',l:'Gutter',min:16,max:80,step:4,u:'px'},
    {k:'gutterM',t:'range',l:'Gutter mobile',min:8,max:32,step:2,u:'px'},
    {k:'gap',t:'range',l:'Grid gap',min:8,max:64,step:2,u:'px'},
    {k:'cardPad',t:'range',l:'Card padding',min:12,max:48,step:2,u:'px'}]},
  {group:'Typography',items:[
    {k:'fh',t:'select',l:'Heading font',opts:Object.fromEntries(Object.keys(FONTS).map(f=>[f,f]))},
    {k:'fb',t:'select',l:'Body font',opts:Object.fromEntries(Object.keys(FONTS).map(f=>[f,f]))},
    {k:'base',t:'range',l:'Base size',min:14,max:20,step:1,u:'px'},
    {k:'scale',t:'range',l:'Type scale',min:1.1,max:1.5,step:.025,u:'×'},
    {k:'hw',t:'range',l:'Heading weight',min:300,max:800,step:100,u:''},
    {k:'tr',t:'range',l:'Heading track',min:-0.06,max:0.02,step:.005,u:'em'},
    {k:'lh',t:'range',l:'Line height',min:1.3,max:1.9,step:.05,u:''}]},
  {group:'Placeholders',items:[
    {k:'imgRatio',t:'select',l:'Image ratio',opts:{'16 / 9':'16:9','4 / 3':'4:3','3 / 2':'3:2','1 / 1':'1:1','4 / 5':'4:5'}},
    {k:'imgStyle',t:'select',l:'Image style',opts:{hatch:'Hatched',cross:'Crossed box',solid:'Solid'}},
    {k:'gray',t:'check',l:'Grayscale preview'}]}
];

const TYPES = {
  nav:{l:'Navbar',v:{simple:'Simple',split:'Links left',centered:'Centered logo',stacked:'Stacked',floating:'Floating bar',minimal:'Minimal menu'}},
  hero:{l:'Hero',v:{split:'Split','split-reverse':'Split, image left',centered:'Centered','image-below':'Image below',video:'Video',cover:'Cover image',statement:'Statement',form:'Email capture'}},
  logos:{l:'Logo cloud',v:{row:'Row',inline:'Caption left',boxed:'Boxed grid',divided:'Divided grid'}},
  features:{l:'Features',v:{'grid-3':'3-column cards','grid-2':'2-column cards','icons-4':'4 icons, no cards',bento:'Bento',list:'Icon list',zigzag:'Alternating rows',steps:'Steps',tabs:'Tabs'}},
  split:{l:'Feature split',v:{'image-left':'Image left','image-right':'Image right',framed:'Framed image','with-stats':'With stats',stacked:'Text above image'}},
  stats:{l:'Stats',v:{header:'Header + stats',row:'Stats only',split:'Header left',cards:'Cards',big:'Big numbers'}},
  cards:{l:'Case studies',v:{'grid-3':'3 cards','grid-2':'2 cards',featured:'Featured + list',list:'Rows',carousel:'Carousel'}},
  testimonials:{l:'Testimonials',v:{grid:'Grid',single:'Single quote',split:'Quote + image',wall:'Wall',logos:'With logos'}},
  pricing:{l:'Pricing',v:{'tiers-3':'3 tiers',toggle:'3 tiers + billing toggle','tiers-2':'2 tiers',single:'Single plan',table:'Comparison table'}},
  faq:{l:'FAQ',v:{'two-col':'Two column',accordion:'Accordion','accordion-split':'Accordion + contact',grid:'Grid'}},
  cta:{l:'Call to action',v:{band:'Band',centered:'Centered',split:'Split with image',newsletter:'Newsletter',cover:'Cover image',inline:'Inline bar'}},
  footer:{l:'Footer',v:{columns:'Columns',simple:'Simple',centered:'Centered',newsletter:'Newsletter',big:'Big wordmark'}}
};
const TONES = {base:'Base',muted:'Muted',primary:'Primary'};
const DEFAULT_SECTIONS = [
  ['nav','simple'],['hero','split'],['logos','row'],['features','grid-3'],['split','image-left'],
  ['stats','header'],['cards','grid-3'],['testimonials','grid'],['pricing','tiers-3'],['faq','two-col'],['cta','band'],['footer','columns']
].map(([type,variant])=>({id:uid(),type,variant,tone:'base'}));

function uid(){return Math.random().toString(36).slice(2,9)}
function load(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
function save(){try{localStorage.setItem('wfk-settings',JSON.stringify(S));localStorage.setItem('wfk-sections',JSON.stringify(SEC))}catch(e){}}

let S = Object.assign({},DEFAULTS,load('wfk-settings',{}));
let SEC = load('wfk-sections',null) || DEFAULT_SECTIONS;


const TEMPLATES = new Map([...document.querySelectorAll('template[data-wf]')].map(t => [t.dataset.wf, t]));
/* ---------- editable copy ----------
   Every piece of text in a section is one "unit", numbered in document order.
   Edits are saved per section and per layout: s.copy[variant][unitIndex] = text. */
const NOT_COPY = 'button, svg, .sec-tools';
const hasOwnText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
function textUnits(root){
  // Mixed content (e.g. "€29<small> / month</small>") gets its loose text wrapped,
  // so every unit is an element with text and no child elements.
  for (const el of [root, ...root.querySelectorAll('*')]) {
    if (el.closest(NOT_COPY) || !el.children.length || !hasOwnText(el)) continue;
    for (const n of [...el.childNodes]) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const sp = document.createElement('span'); sp.className = 'wf-t'; n.replaceWith(sp); sp.append(n);
    }
  }
  return [root, ...root.querySelectorAll('*')].filter(el => !el.closest(NOT_COPY) && !el.children.length && hasOwnText(el));
}
const CE_MODE = (() => { const d = document.createElement('div'); try { d.contentEditable = 'plaintext-only'; return 'plaintext-only'; } catch { return 'true'; } })();
const editedCopy = s => (s.copy && s.copy[s.variant]) || null;
function sectionEl(s, editable = false){
  const tpl = TEMPLATES.get(s.type + ':' + s.variant) || TEMPLATES.get(s.type + ':' + Object.keys(TYPES[s.type].v)[0]);
  const el = tpl.content.firstElementChild.cloneNode(true);
  if (s.tone && s.tone !== 'base') el.classList.add('tone-' + s.tone);
  const copy = editedCopy(s);
  textUnits(el).forEach((u, i) => {
    if (copy && copy[i] != null) u.textContent = copy[i];
    if (editable) { u.dataset.e = i; u.setAttribute('contenteditable', CE_MODE); u.spellcheck = true; }
  });
  return el;
}
function sectionHTML(s, editable = false){ return sectionEl(s, editable).outerHTML; }
function cleanForExport(root){
  root.querySelectorAll('.sec-tools').forEach(n => n.remove());
  root.querySelectorAll('[data-e]').forEach(n => { n.removeAttribute('data-e'); n.removeAttribute('contenteditable'); n.removeAttribute('spellcheck'); });
  return root;
}

/* ---------- icons ---------- */
const I = {
  up:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 13V3M4 7l4-4 4 4"/></svg>',
  down:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3v10M4 9l4 4 4-4"/></svg>',
  variant:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="5" height="10" rx="1"/><rect x="9" y="3" width="5" height="4" rx="1"/><rect x="9" y="9" width="5" height="4" rx="1"/></svg>',
  tone:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11A5.5 5.5 0 0 0 8 2.5z" fill="currentColor"/></svg>',
  dup:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 10.5V4a1 1 0 0 1 1-1h6.5"/></svg>',
  text:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3.5 8a4.5 4.5 0 1 0 1.3-3.2M3.5 3v2.6h2.6"/></svg>',
  del:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/></svg>'
};

/* ---------- render ---------- */
const wf = document.getElementById('wf'), frame = document.getElementById('frame');
const px = n => Math.round(n)+'px';

function applyVars(){
  const st = wf.style, s = S;
  const set = (k,v)=>st.setProperty(k,v);
  set('--bg',s.bg);set('--fg',s.fg);set('--primary',s.primary);set('--pfg',s.pfg);
  set('--muted',s.muted);set('--muted-fg',s.mutedFg);set('--border',s.border);set('--card',s.card);
  set('--r',s.radius+'px');set('--bw',s.bw+'px');
  set('--btn-r',s.btnShape==='pill'?'999px':s.btnShape==='square'?'0px':s.btnShape==='half'?Math.round(s.radius/2)+'px':s.radius+'px');
  set('--shadow',{none:'none',sm:'0 1px 2px rgba(0,0,0,.06),0 1px 3px rgba(0,0,0,.08)',md:'0 2px 4px rgba(0,0,0,.04),0 6px 18px rgba(0,0,0,.08)',lg:'0 4px 8px rgba(0,0,0,.05),0 18px 48px rgba(0,0,0,.14)'}[s.shadow]);
  set('--sec-y',s.sectionY+'px');set('--sec-y-m',px(s.sectionY*.6));
  set('--container',s.container+'px');set('--gutter',s.gutter+'px');set('--gutter-m',s.gutterM+'px');
  set('--gap',s.gap+'px');set('--card-pad',s.cardPad+'px');
  set('--fh',FONTS[s.fh]);set('--fb',FONTS[s.fb]);
  set('--base',s.base+'px');set('--lh',s.lh);set('--hw',s.hw);set('--tr',s.tr+'em');
  const b=s.base,k=s.scale;
  set('--h1',px(b*k**6));set('--h2',px(b*k**4));set('--h3',px(b*k**1.25));set('--lead',px(b*k**.6));
  set('--h1m',px(b*k**4));set('--h2m',px(b*k**3));
  set('--img-ratio',s.imgRatio);
  wf.className = 'wf img-'+s.imgStyle;
  frame.classList.toggle('gray',!!s.gray);
  frame.style.background = s.bg;
  scheduleA11y();
}

function renderSections(){
  wf.innerHTML = SEC.map((s,i)=>{
    const html = sectionHTML(s, true);
    const edited = !!(editedCopy(s) && Object.keys(editedCopy(s)).length);
    const tools = `<div class="sec-tools"><span class="tag">${TYPES[s.type].l} · ${TYPES[s.type].v[s.variant]}</span>
      <button class="ib" data-act="up" data-i="${i}" ${i===0?'disabled':''} title="Move up" aria-label="Move up">${I.up}</button>
      <button class="ib" data-act="down" data-i="${i}" ${i===SEC.length-1?'disabled':''} title="Move down" aria-label="Move down">${I.down}</button>
      <button class="ib" data-act="pick" data-i="${i}" title="Choose layout (${Object.keys(TYPES[s.type].v).length})" aria-label="Choose layout">${I.variant}</button>
      <button class="ib" data-act="tone" data-i="${i}" title="Background: ${TONES[s.tone]}" aria-label="Change background">${I.tone}</button>
      <button class="ib" data-act="dup" data-i="${i}" title="Duplicate" aria-label="Duplicate">${I.dup}</button>
      <button class="ib" data-act="text" data-i="${i}" ${edited?'':'disabled'} title="Restore the original text" aria-label="Restore the original text">${I.text}</button>
      <button class="ib" data-act="del" data-i="${i}" title="Remove" aria-label="Remove">${I.del}</button></div>`;
    return html.replace(/(<(section|header|footer)[^>]*>)/, `$1${tools}`);
  }).join('') || `<div style="padding:80px 24px;text-align:center;color:var(--muted-fg)">No sections yet. Add one from the Sections tab.</div>`;
  renderSectionList();
  scheduleA11y();
}

function act(a,i){
  const s = SEC[i]; if(!s) return;
  if(a==='pick'){openPicker('edit',i);return}
  if(a==='up'&&i>0)[SEC[i-1],SEC[i]]=[SEC[i],SEC[i-1]];
  if(a==='down'&&i<SEC.length-1)[SEC[i+1],SEC[i]]=[SEC[i],SEC[i+1]];
  if(a==='variant'){const vs=Object.keys(TYPES[s.type].v);s.variant=vs[(vs.indexOf(s.variant)+1)%vs.length]}
  if(a==='tone'){const ts=Object.keys(TONES);s.tone=ts[(ts.indexOf(s.tone)+1)%ts.length]}
  if(a==='dup')SEC.splice(i+1,0,{...s,id:uid(),copy:JSON.parse(JSON.stringify(s.copy||{}))});
  if(a==='text'){if(s.copy)delete s.copy[s.variant];toast('Original text restored')}
  if(a==='del')SEC.splice(i,1);
  renderSections();save();
}
wf.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(b){e.preventDefault();act(b.dataset.act,+b.dataset.i);return}
  if(e.target.closest('a'))e.preventDefault();
  // An open accordion question is edited on click; a closed one opens first.
  const sum=e.target.closest('summary');
  if(sum&&sum.parentElement.open&&e.target.closest('[data-e]'))e.preventDefault();
});
let copySaveT;
function sectionIndexOf(el){return [...wf.children].indexOf(el.closest('.wf-sec'))}
wf.addEventListener('input',e=>{
  const u=e.target.closest&&e.target.closest('[data-e]'); if(!u) return;
  const i=sectionIndexOf(u), s=SEC[i]; if(!s) return;
  s.copy=s.copy||{}; const c=s.copy[s.variant]=s.copy[s.variant]||{};
  c[u.dataset.e]=u.textContent;
  const tool=wf.children[i].querySelector('.sec-tools [data-act="text"]'); if(tool)tool.disabled=false;
  clearTimeout(copySaveT); copySaveT=setTimeout(()=>{save();renderSectionList()},400);
  scheduleA11y();
});
wf.addEventListener('keydown',e=>{
  const u=e.target.closest&&e.target.closest('[data-e]'); if(!u) return;
  if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();u.blur();return}
  if(e.key===' '&&u.closest('summary')){e.preventDefault();document.execCommand('insertText',false,' ')}
});
wf.addEventListener('keyup',e=>{if(e.key===' '&&e.target.closest&&e.target.closest('summary [data-e], summary[data-e]'))e.preventDefault()});
wf.addEventListener('paste',e=>{
  const u=e.target.closest&&e.target.closest('[data-e]'); if(!u) return;
  e.preventDefault();
  document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain').replace(/\s+/g,' ').trim());
});

/* ---------- theme panel ---------- */
const paneTheme = document.getElementById('pane-theme');
function fmt(c,v){return c.u==='×'?(+v).toFixed(3).replace(/0+$/,'')+'×':c.u==='em'?(+v).toFixed(3)+'em':c.u==='px'?v+'px'+(c.k==='radius'?'':''):String(v)}
function buildTheme(){
  let h = `<div class="group"><h3>Presets</h3><div class="presets">${Object.entries(PRESETS).map(([n,p])=>`<button class="preset" data-preset="${n}"><span class="sw"><span style="background:${p.bg}"></span><span style="background:${p.fg}"></span><span style="background:${p.primary}"></span><span style="background:${p.muted}"></span></span>${n}</button>`).join('')}</div></div>`;
  for(const g of CONTROLS){
    h += `<div class="group"><h3>${g.group}</h3>`;
    for(const c of g.items){
      const id='c-'+c.k;
      if(c.t==='color') h+=`<div class="crow"><label for="${id}t">${c.l}</label><input type="color" id="${id}" data-k="${c.k}" value="${S[c.k]}" aria-label="${c.l} swatch"><input type="text" id="${id}t" data-hex="${c.k}" value="${S[c.k]}" maxlength="7"></div>`;
      else if(c.t==='range') h+=`<div class="row"><label for="${id}">${c.l}</label><input type="range" id="${id}" data-k="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${S[c.k]}"><output id="${id}o">${fmt(c,S[c.k])}</output></div>`;
      else if(c.t==='select') h+=`<div class="row"><label for="${id}">${c.l}</label><select id="${id}" data-k="${c.k}">${Object.entries(c.opts).map(([v,l])=>`<option value="${v}"${S[c.k]==v?' selected':''}>${l}</option>`).join('')}</select></div>`;
      else if(c.t==='check') h+=`<label class="check"><input type="checkbox" id="${id}" data-k="${c.k}"${S[c.k]?' checked':''}>${c.l}</label>`;
    }
    h += `</div>`;
  }
  h += `<div class="group"><button class="btn" id="resetTheme">Reset theme</button><p class="hint">Settings are saved in this browser. Export tokens to paste into a shadcn <code>globals.css</code> or an Astro layout.</p></div>`;
  paneTheme.innerHTML = h;
}
const ALL = CONTROLS.flatMap(g=>g.items);
paneTheme.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.hex){const v=t.value.trim();if(/^#[0-9a-f]{6}$/i.test(v)){S[t.dataset.hex]=v.toLowerCase();document.getElementById('c-'+t.dataset.hex).value=v;applyVars();save()}return}
  const k=t.dataset.k; if(!k) return;
  const c=ALL.find(x=>x.k===k);
  S[k] = c.t==='range'?+t.value : c.t==='check'?t.checked : t.value;
  if(c.t==='range')document.getElementById('c-'+k+'o').textContent=fmt(c,S[k]);
  if(c.t==='color')document.getElementById('c-'+k+'t').value=t.value;
  applyVars();save();
});
paneTheme.addEventListener('click',e=>{
  const p=e.target.closest('[data-preset]');
  if(p){Object.assign(S,PRESETS[p.dataset.preset]);buildTheme();applyVars();save();toast(p.dataset.preset+' applied');return}
  if(e.target.id==='resetTheme'){S={...DEFAULTS};buildTheme();applyVars();save();toast('Theme reset')}
});

/* ---------- sections panel ---------- */
const paneSec = document.getElementById('pane-sections');
function renderSectionList(){
  paneSec.innerHTML = `<div class="group"><h3>Add section</h3><div class="addrow"><select id="addType" aria-label="Section type">${Object.entries(TYPES).map(([k,t])=>`<option value="${k}">${t.l}</option>`).join('')}</select><button class="btn pri" id="addBtn">Choose layout</button></div><p class="hint">Pick a layout to add it above the footer. Click any text in the preview to rewrite it; your text is kept per layout, so you can switch layouts and come back. Hover a section for quick controls.</p></div>
  <div class="group"><h3>Page · ${SEC.length} sections</h3><div class="slist">${SEC.map((s,i)=>`<div class="sitem">
    <div class="name">${TYPES[s.type].l}<span>#${i+1}${editedCopy(s)&&Object.keys(editedCopy(s)).length?' · text edited':''}</span></div>
    <div class="ctl"><button class="ib" data-act="pick" data-i="${i}" aria-label="Browse layouts" title="Browse layouts">${I.variant}</button><button class="ib" data-act="up" data-i="${i}" ${i===0?'disabled':''} aria-label="Move up">${I.up}</button><button class="ib" data-act="down" data-i="${i}" ${i===SEC.length-1?'disabled':''} aria-label="Move down">${I.down}</button><button class="ib" data-act="dup" data-i="${i}" aria-label="Duplicate">${I.dup}</button><button class="ib" data-act="del" data-i="${i}" aria-label="Remove">${I.del}</button></div>
    <div class="sel"><select id="v-${s.id}" data-set="variant" data-i="${i}" aria-label="Layout">${Object.entries(TYPES[s.type].v).map(([v,l])=>`<option value="${v}"${s.variant===v?' selected':''}>${l}</option>`).join('')}</select><select id="t-${s.id}" data-set="tone" data-i="${i}" aria-label="Background">${Object.entries(TONES).map(([v,l])=>`<option value="${v}"${s.tone===v?' selected':''}>${l} bg</option>`).join('')}</select></div>
  </div>`).join('')}</div></div>
  <div class="group"><button class="btn" id="resetPage">Reset to starter page</button></div>`;
}
paneSec.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(b){act(b.dataset.act,+b.dataset.i);return}
  if(e.target.id==='addBtn'){openPicker('add',document.getElementById('addType').value)}
  if(e.target.id==='resetPage'){SEC=DEFAULT_SECTIONS.map(s=>({...s,id:uid()}));renderSections();save();toast('Starter page restored')}
});
paneSec.addEventListener('change',e=>{
  const t=e.target; if(!t.dataset.set) return;
  SEC[+t.dataset.i][t.dataset.set]=t.value; renderSections(); save();
});

/* ---------- layout picker ---------- */
const picker=document.getElementById('picker'),pGrid=document.getElementById('pGrid');
let PICK=null;
function insertSection(type,variant){
  const item={id:uid(),type,variant,tone:'base'};
  const fi=SEC.findIndex(s=>s.type==='footer');
  if(type==='nav')SEC.unshift(item); else if(type!=='footer'&&fi>-1)SEC.splice(fi,0,item); else SEC.push(item);
  renderSections();save();toast(TYPES[type].l+' added');
  wf.querySelectorAll('.wf-sec')[SEC.indexOf(item)]?.scrollIntoView({behavior:'smooth',block:'center'});
}
function openPicker(mode,arg){
  const type = mode==='edit'?SEC[arg].type:arg;
  const cur = mode==='edit'?SEC[arg].variant:null;
  const tone = mode==='edit'?SEC[arg].tone:'base';
  PICK={mode,arg,type};
  const vs=Object.entries(TYPES[type].v);
  document.getElementById('pTitle').textContent=(mode==='add'?'Add ':'')+TYPES[type].l+' layouts';
  document.getElementById('pSub').textContent=vs.length+' options';
  const style=(wf.getAttribute('style')||'').replace(/"/g,'&quot;');
  pGrid.innerHTML=vs.map(([v,l])=>`<button class="pcard" data-v="${v}" aria-pressed="${v===cur}"><div class="pthumb" inert style="background:${S.bg}${S.gray?';filter:grayscale(1)':''}"><div class="${wf.className}" style="${style}">${sectionHTML({type,variant:v,tone})}</div></div><span class="pl">${l}${v===cur?'<em>Current</em>':''}</span></button>`).join('');
  picker.hidden=false;
  sizeThumbs();
  (pGrid.querySelector('[aria-pressed="true"]')||pGrid.querySelector('.pcard'))?.focus();
}
function sizeThumbs(){
  pGrid.querySelectorAll('.pthumb').forEach(t=>{
    const inner=t.firstElementChild,s=t.clientWidth/1280,h=inner.offsetHeight*s;
    inner.style.transform=`translateY(${Math.max(0,(t.clientHeight-h)/2)}px) scale(${s})`;
  });
}
pGrid.addEventListener('click',e=>{
  const c=e.target.closest('.pcard'); if(!c||!PICK) return;
  const v=c.dataset.v;
  if(PICK.mode==='edit'){SEC[PICK.arg].variant=v;renderSections();save();toast(TYPES[PICK.type].v[v])}
  else insertSection(PICK.type,v);
  picker.hidden=true;
});
document.getElementById('pClose').onclick=()=>picker.hidden=true;
picker.addEventListener('click',e=>{if(e.target===picker)picker.hidden=true});
window.addEventListener('resize',()=>{if(!picker.hidden)sizeThumbs()});
document.fonts?.ready.then(()=>{if(!picker.hidden)sizeThumbs()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')picker.hidden=true});

/* ---------- tabs + viewport ---------- */
function showTab(name){
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',x.dataset.tab===name));
  ['theme','sections','a11y'].forEach(t=>document.getElementById('pane-'+t).hidden=t!==name);
}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
document.querySelectorAll('.seg button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  frame.dataset.vp=b.dataset.vp;
  setTimeout(scheduleA11y,300);
}));

/* ---------- accessibility (WCAG 2.2 contrast) ---------- */
function parseColor(s){
  if(!s) return null; s=s.trim();
  if(s==='transparent') return [0,0,0,0];
  if(s[0]==='#'){let h=s.slice(1);if(h.length===3)h=h.replace(/./g,c=>c+c);const n=parseInt(h.slice(0,6),16);return [n>>16&255,n>>8&255,n&255,h.length===8?parseInt(h.slice(6),16)/255:1]}
  let m=s.match(/^rgba?\(([^)]+)\)$/);
  if(m){const p=m[1].split(/[\s,\/]+/).filter(Boolean);const a=p[3]===undefined?1:p[3].endsWith('%')?parseFloat(p[3])/100:parseFloat(p[3]);return [+p[0],+p[1],+p[2],a]}
  m=s.match(/^color\(srgb\s+([^)]+)\)$/);
  if(m){const p=m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat);return [p[0]*255,p[1]*255,p[2]*255,p[3]===undefined?1:p[3]]}
  return null;
}
const blend=(top,bot)=>{const a=top[3];return [top[0]*a+bot[0]*(1-a),top[1]*a+bot[1]*(1-a),top[2]*a+bot[2]*(1-a),1]};
const lum=c=>{const f=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const toHex=c=>'#'+c.slice(0,3).map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const mixRGB=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,1];

const PAIRS = [
  {l:'Body text',fg:'fg',bg:'bg',min:4.5},
  {l:'Muted text',fg:'mutedFg',bg:'bg',min:4.5},
  {l:'Muted text on muted',fg:'mutedFg',bg:'muted',min:4.5},
  {l:'Text on cards',fg:'fg',bg:'card',min:4.5},
  {l:'Muted text on cards',fg:'mutedFg',bg:'card',min:4.5},
  {l:'Primary button',fg:'pfg',bg:'primary',min:4.5},
  {l:'Button on primary section',fg:'primary',bg:'pfg',min:4.5,fix:'pfg'},
  {l:'Secondary button outline',fg:'border',bg:'bg',min:3,advisory:true}
];
function pairResult(p){const r=contrast(parseColor(S[p.fg]),parseColor(S[p.bg]));return {r,pass:r>=p.min,aaa:r>=(p.min===3?4.5:7)}}
function fixPair(p){
  const key=p.fix||p.fg, other=key===p.fg?p.bg:p.fg;
  const base=parseColor(S[other]); let c=parseColor(S[key]);
  const target=lum(base)>.18?[0,0,0,1]:[255,255,255,1];
  let out=target;
  for(let t=.02;t<=1.0001;t+=.02){const m=mixRGB(c,target,t);if(contrast(m,base)>=p.min+.05){out=m;break}}
  S[key]=toHex(out); buildTheme(); applyVars(); save(); toast(`${p.l} fixed`);
}
function effBg(el){
  const layers=[];
  for(let x=el;x&&x!==frame;x=x.parentElement){
    const c=parseColor(getComputedStyle(x).backgroundColor);
    if(c&&c[3]>0){layers.push(c);if(c[3]>=.999)break}
  }
  let base=parseColor(S.bg)||[255,255,255,1];
  for(let i=layers.length-1;i>=0;i--)base=blend(layers[i],base);
  return base;
}
let ISSUES=[];
function scanPage(){
  const out=[],seen=new Set();
  const tw=document.createTreeWalker(wf,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  let n;
  while((n=tw.nextNode())){
    const el=n.parentElement;
    if(!el||seen.has(el)||el.closest('.sec-tools'))continue;
    seen.add(el);
    if(!el.getClientRects().length)continue;
    const cs=getComputedStyle(el); if(cs.visibility==='hidden')continue;
    const bg=effBg(el), fg=blend(parseColor(cs.color)||[0,0,0,1],bg);
    const r=contrast(fg,bg), size=parseFloat(cs.fontSize), w=parseInt(cs.fontWeight)||400;
    const large=size>=24||(size>=18.66&&w>=700), min=large?3:4.5;
    if(r<min-.005){
      const sec=el.closest('.wf-sec'), i=sec?[...wf.children].indexOf(sec):-1;
      const s=SEC[i];
      out.push({el,r,min,text:el.textContent.trim().replace(/\s+/g,' ').slice(0,48),where:s?`${TYPES[s.type].l} · ${TYPES[s.type].v[s.variant]}${s.tone!=='base'?' · '+TONES[s.tone]+' bg':''}`:'Page'});
    }
  }
  return out;
}
const paneA11y=document.getElementById('pane-a11y');
function runA11y(){
  const res=PAIRS.map(p=>({p,...pairResult(p)}));
  ISSUES=scanPage();
  const pairFails=res.filter(x=>!x.pass&&!x.p.advisory).length;
  const total=pairFails+ISSUES.length;
  const vp={desktop:'desktop',tablet:'tablet',mobile:'mobile'}[frame.dataset.vp];
  paneA11y.innerHTML=`
  <div class="group"><h3>Summary</h3>
    <div class="a11y-sum ${total?'bad':'ok'}">${total?`${total} contrast ${total===1?'issue':'issues'} to fix`:'All text passes WCAG AA contrast'}</div>
    <p class="hint">Runs on every change. Text needs 4.5:1, large text (24px, or 18.7px bold) needs 3:1, control outlines 3:1. The page scan checks the ${vp} preview.</p></div>
  <div class="group"><h3>Theme color pairs</h3>${res.map((x,i)=>`<div class="pair">
    <span class="smp" style="background:${S[x.p.bg]};color:${S[x.p.fg]};${x.p.advisory?`border:2px solid ${S[x.p.fg]}`:''}">${x.p.advisory?'':'Aa'}</span>
    <span class="nm">${x.p.l}<span>${x.r.toFixed(2)}:1 · needs ${x.p.min}:1</span></span>
    <span class="rt">${x.pass?`<span class="lvl pass">${x.aaa?'AAA':'AA'}</span>`:x.p.advisory?`<span class="lvl warn">Check</span>`:`<span class="lvl fail">Fail</span>`}${x.pass?'':`<button class="fixbtn" data-fix="${i}">Fix</button>`}</span></div>`).join('')}
    <p class="hint">Fix adjusts the text color (or the button fill on primary sections) just enough to pass. The outline check is advisory: shadcn outline buttons are identified by their label too, but a 3:1 border is safer.</p></div>
  <div class="group"><h3>Page scan · ${ISSUES.length} ${ISSUES.length===1?'issue':'issues'}</h3>
    ${ISSUES.length?`<div class="issues">${ISSUES.map((x,i)=>`<button class="issue" data-issue="${i}"><span style="min-width:0"><b>“${x.text}”</b><small>${x.where}</small></span><span class="lvl fail">${x.r.toFixed(2)}:1</span></button>`).join('')}</div><p class="hint">Select an issue to jump to it in the preview.</p>`:`<p class="hint">No text in the preview falls below its contrast minimum.</p>`}</div>`;
  const btn=document.getElementById('a11yBtn');
  btn.dataset.state=total?'bad':'ok';
  btn.querySelector('span').textContent=total?`${total} contrast ${total===1?'issue':'issues'}`:'Contrast passes';
  const cnt=document.getElementById('a11yCnt'); cnt.hidden=!total; cnt.textContent=total;
}
let a11yT; function scheduleA11y(){clearTimeout(a11yT);a11yT=setTimeout(runA11y,180)}
paneA11y.addEventListener('click',e=>{
  const f=e.target.closest('[data-fix]'); if(f){fixPair(PAIRS[+f.dataset.fix]);return}
  const it=e.target.closest('[data-issue]'); if(!it) return;
  const x=ISSUES[+it.dataset.issue]; if(!x||!x.el.isConnected) return;
  x.el.scrollIntoView({behavior:'smooth',block:'center'});
  x.el.classList.add('a11y-flash'); setTimeout(()=>x.el.classList.remove('a11y-flash'),1800);
});
document.getElementById('a11yBtn').onclick=()=>showTab('a11y');
document.fonts?.ready.then(scheduleA11y);

/* ---------- export ---------- */
function tokensCSS(){
  const s=S,b=s.base,k=s.scale,r=n=>Math.round(n);
  return `/* Wireframe Kit tokens — shadcn-compatible names.
   Paste into app/globals.css (shadcn) or src/styles/global.css (Astro). */
:root {
  --background: ${s.bg};
  --foreground: ${s.fg};
  --card: ${s.card};
  --card-foreground: ${s.fg};
  --popover: ${s.card};
  --popover-foreground: ${s.fg};
  --primary: ${s.primary};
  --primary-foreground: ${s.pfg};
  --secondary: ${s.muted};
  --secondary-foreground: ${s.fg};
  --muted: ${s.muted};
  --muted-foreground: ${s.mutedFg};
  --accent: ${s.muted};
  --accent-foreground: ${s.fg};
  --border: ${s.border};
  --input: ${s.border};
  --ring: ${s.fg};
  --radius: ${(s.radius/16).toFixed(3).replace(/\.?0+$/,'')}rem; /* ${s.radius}px */

  /* layout */
  --border-width: ${s.bw}px;
  --button-radius: ${s.btnShape==='pill'?'9999px':s.btnShape==='square'?'0px':s.btnShape==='half'?'calc(var(--radius) / 2)':'var(--radius)'};
  --section-y: ${s.sectionY}px;
  --section-y-mobile: ${r(s.sectionY*.6)}px;
  --container: ${s.container}px;
  --gutter: ${s.gutter}px;
  --gutter-mobile: ${s.gutterM}px;
  --gap: ${s.gap}px;
  --card-padding: ${s.cardPad}px;

  /* type */
  --font-heading: ${FONTS[s.fh]};
  --font-sans: ${FONTS[s.fb]};
  --text-base: ${b}px;
  --leading: ${s.lh};
  --heading-weight: ${s.hw};
  --heading-tracking: ${s.tr}em;
  --text-h1: ${r(b*k**6)}px;   /* mobile ${r(b*k**4)}px */
  --text-h2: ${r(b*k**4)}px;   /* mobile ${r(b*k**3)}px */
  --text-h3: ${r(b*k**1.25)}px;
  --text-lead: ${r(b*k**.6)}px;
}

/* Tailwind v4: expose the extras as utilities */
@theme inline {
  --font-heading: var(--font-heading);
  --font-sans: var(--font-sans);
  --spacing-section: var(--section-y);
  --spacing-gutter: var(--gutter);
  --container-site: var(--container);
}`;
}
function pageHTML(){
  const clone = wf.cloneNode(true);
  cleanForExport(clone);
  clone.removeAttribute('id');
  const vars = wf.getAttribute('style').split(';').map(x=>x.trim()).filter(Boolean).join(';\n  ');
  const fams = [...new Set([S.fh,S.fb])].filter(f=>f!=='System UI').map(f=>'family='+f.replace(/ /g,'+')+(f==='Instrument Serif'?'':':wght@300..800')).join('&');
  const body = clone.innerHTML.replace(/></g,'>\n<');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wireframe</title>
${fams?`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fams}&display=swap">\n`:''}<style>
body{margin:0}
.wf{
  ${vars}
}
${WF_CSS.trim()}
</style>
</head>
<body>
<div class="${clone.className}">
${body}
</div>
</body>
</html>`;
}
const COMPONENTS = {nav:'Navbar',hero:'Hero',logos:'LogoCloud',features:'Features',split:'FeatureSplit',stats:'Stats',cards:'CaseStudies',testimonials:'Testimonials',pricing:'Pricing',faq:'Faq',cta:'CallToAction',footer:'Footer'};
function astroPage(){
  const isEdited=s=>!!(editedCopy(s)&&Object.keys(editedCopy(s)).length);
  const used=[...new Set(SEC.filter(s=>!isEdited(s)).map(s=>COMPONENTS[s.type]))];
  const vars=wf.getAttribute('style').split(';').map(x=>x.trim()).filter(Boolean).join('; ');
  const fams=[...new Set([S.fh,S.fb])].filter(f=>f!=='System UI').map(f=>'family='+f.replace(/ /g,'+')+(f==='Instrument Serif'?'':':wght@300..800')).join('&');
  const esc=t=>t.replace(/\{/g,'&#123;').replace(/\}/g,'&#125;');
  const lines=SEC.map((s,i)=>{
    if(!isEdited(s)) return `    <${COMPONENTS[s.type]} variant="${s.variant}"${s.tone&&s.tone!=='base'?` tone="${s.tone}"`:''} />`;
    const el=cleanForExport(wf.children[i].cloneNode(true));
    const markup=esc(el.outerHTML).replace(/>\s*</g,'>\n<').split('\n').map(l=>'    '+l).join('\n');
    return `    <!-- ${TYPES[s.type].l} · ${TYPES[s.type].v[s.variant]}: your copy, inlined. Same markup as <${COMPONENTS[s.type]} variant="${s.variant}" />. -->\n${markup}`;
  });
  return `---
// src/pages/index.astro — copy src/components/sections and src/styles/wireframe.css
// from github.com/oanagrigore/wireframe-kit into your project first.
${used.length?`import { ${used.join(', ')} } from '../components/sections';\n`:''}import '../styles/wireframe.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Wireframe</title>
${fams?`    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fams}&display=swap" />\n`:''}  </head>
  <body style="margin:0">
    <div class="${wf.className}" style="${vars}">
${lines.join('\n')}
    </div>
  </body>
</html>`;
}
/* Copy deck: every line of text on the page, in order, labelled by what it is. */
function copyRole(u){
  const el=u.classList.contains('wf-t')?u.parentElement:u;
  const m=sel=>el.matches(sel)||u.matches(sel);
  if(m('h1'))return 'Headline';
  if(m('h2'))return 'Section headline';
  if(m('summary'))return 'Question';
  if(m('h3,h4'))return 'Subhead';
  if(m('.wf-eyebrow'))return 'Eyebrow';
  if(m('.wf-btn'))return 'Button';
  if(m('.wf-num'))return 'Stat';
  if(m('.wf-quote,.wf-big-quote'))return 'Quote';
  if(m('.wf-lead'))return 'Intro';
  if(m('.wf-tag,.wf-badge'))return 'Label';
  if(m('.wf-price, .wf-price *, .wf-price-s'))return 'Price';
  if(m('.wf-input'))return 'Field';
  if(m('th, th *, td'))return 'Table';
  if(m('b'))return 'Name';
  if(m('.wf-logo'))return 'Logo';
  if(m('a'))return 'Link';
  if(m('li, li *'))return 'List item';
  return 'Text';
}
function copyDeck(){
  const out=['# Page copy',''];
  [...wf.children].forEach((sec,i)=>{
    const s=SEC[i]; if(!s) return;
    out.push(`## ${i+1}. ${TYPES[s.type].l} · ${TYPES[s.type].v[s.variant]}`,'');
    sec.querySelectorAll('[data-e]').forEach(u=>{const t=u.textContent.trim(); if(t)out.push(`- **${copyRole(u)}:** ${t}`)});
    out.push('');
  });
  return out.join('\n').trim()+'\n';
}
document.getElementById('exportCopy').onclick=()=>openModal('Page copy',copyDeck(),'Every line of text on the page, in order, labelled by role. Paste it into a doc for review, or into your CMS.');
document.getElementById('exportAstro').onclick=()=>openModal('Astro page',astroPage(),'Untouched sections are Astro components with variant and tone props. Sections where you changed the text are inlined as markup with your copy. The style attribute carries your theme tokens.');
/* ---------- "More exports" menu ---------- */
const moreBtn=document.getElementById('moreBtn'),moreList=document.getElementById('moreList');
const moreItems=()=>[...moreList.querySelectorAll('.menu-item')];
function setMenu(open,focusFirst){
  moreList.hidden=!open; moreBtn.setAttribute('aria-expanded',String(open));
  if(open&&focusFirst)moreItems()[0].focus();
}
moreBtn.addEventListener('click',()=>setMenu(moreList.hidden,false));
moreBtn.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();setMenu(true,true)}});
moreList.addEventListener('click',e=>{if(e.target.closest('.menu-item'))setMenu(false)});
moreList.addEventListener('keydown',e=>{
  const items=moreItems(),i=items.indexOf(document.activeElement);
  if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus()}
  if(e.key==='ArrowUp'){e.preventDefault();items[(i-1+items.length)%items.length].focus()}
  if(e.key==='Escape'){e.preventDefault();setMenu(false);moreBtn.focus()}
});
document.addEventListener('click',e=>{if(!moreList.hidden&&!e.target.closest('#moreMenu'))setMenu(false)});
document.getElementById('moreMenu').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget)&&e.relatedTarget)setMenu(false)});
const modal=document.getElementById('modal'),mText=document.getElementById('mText');
function openModal(title,text,note){document.getElementById('mTitle').textContent=title;mText.value=text;document.getElementById('mNote').textContent=note;modal.hidden=false;mText.scrollTop=0;document.getElementById('mCopy').focus()}
document.getElementById('exportCss').onclick=()=>openModal('Design tokens',tokensCSS(),'Variable names match shadcn/ui, so components pick up colors and radius right away. Layout and type tokens are extras.');
document.getElementById('exportHtml').onclick=()=>openModal('Page HTML',pageHTML(),'A standalone, responsive page. Drop the markup into an .astro file, or split each <section> into its own component.');
document.getElementById('mClose').onclick=()=>modal.hidden=true;
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.hidden=true});
document.getElementById('mCopy').onclick=()=>{
  const fallback=()=>{mText.focus();mText.select();toast('Selected. Press Ctrl/⌘ + C to copy')};
  try{navigator.clipboard.writeText(mText.value).then(()=>toast('Copied'),fallback)}catch(e){fallback()}
};
let tt;function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,1800)}

/* ---------- boot ---------- */
buildTheme(); applyVars(); renderSections();
