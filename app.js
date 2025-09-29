// Simple include: copy header/footer from index.html
async function loadIncludes(){
  const slots = document.querySelectorAll('[data-include]');
  if(!slots.length) return;
  try{
    const res = await fetch('index.html', {cache:'no-store'});
    const html = await res.text();
    const tpl = document.createElement('div'); tpl.innerHTML = html;
    const headerHTML = tpl.querySelector('.header')?.outerHTML || '';
    const footerHTML = tpl.querySelector('.footer')?.outerHTML || '';
    slots.forEach(slot=>{
      const part = slot.getAttribute('data-include');
      if(part==='header') slot.outerHTML = headerHTML;
      if(part==='footer') slot.outerHTML = footerHTML;
    });
  }catch(e){ console.warn('Include failed', e); }
}

async function loadJSON(url){ const r = await fetch(url); return r.json(); }
function money(n){ if(typeof n!=='number' || isNaN(n)) return 'Price on request'; return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n) }
function label(slug){ return String(slug).split('-').map(w=>w[0]?.toUpperCase()+w.slice(1)).join(' ') }

function cardHTML(p){
  return `<article class="card">
    <a class="media" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"/></a>
    <div class="body">
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="muted">${p.badge||''} ${p.size||''}</div>
      <div class="price-row"><span class="price">${money(p.price)}</span> ${p.inStock?'<span class="badge">In stock</span>':'<span class="badge">Out of stock</span>'}</div>
    </div>
    <label class="muted" style="padding:8px 12px;display:flex;gap:6px;align-items:center;"><input type="checkbox" data-compare="${p.id}"> Compare</label>
  </article>`
}

function getCompare(){ try{return JSON.parse(localStorage.getItem('compare')||'[]')}catch(e){return[]} }
function setCompare(list){ localStorage.setItem('compare', JSON.stringify(list.slice(0,4))); }

async function hydrateCollections(){
  const el = document.getElementById('grid-collections');
  if(!el) return;
  const data = await loadJSON(el.getAttribute('data-source'));
  let view = [...data];
  const url = new URL(location.href); const q = Object.fromEntries(url.searchParams);
  if(q.cat) view = view.filter(p=> (p.categories||[]).includes(q.cat));
  document.getElementById('collectionTitle').textContent = q.cat ? label(q.cat) : 'Collections';
  el.innerHTML = view.map(cardHTML).join('') || '<p class="muted">No items.</p>';
  updateCompareButton();
}

function updateCompareButton(){
  const btn = document.getElementById('compareBtnTop');
  if(!btn) return;
  const n = (getCompare && getCompare().length) || 0;
  btn.textContent = `Compare (${n})`;
}

document.addEventListener('change', (e)=>{
  const id = e.target && e.target.getAttribute('data-compare');
  if(!id) return;
  let list = getCompare();
  if(e.target.checked){ if(!list.includes(id)) list.push(id); } else { list = list.filter(x=>x!==id); }
  setCompare(list); updateCompareButton();
});

async function hydrateProduct(){
  const url = new URL(location.href); const id = url.searchParams.get('id');
  if(!id) return;
  const data = await loadJSON('data/products.json');
  const p = data.find(x=> String(x.id)===String(id));
  if(!p) return;
  document.getElementById('pTitle').textContent = `Makwell — ${p.name}`;
  renderBreadcrumbs(p); injectJSONLD(p);
  const imgs = (p.gallery && p.gallery.length ? p.gallery : [p.image]).filter(Boolean);
  const stage = document.getElementById('pImage'); const thumbs = document.getElementById('pThumbs');
  stage.src = imgs[0]; stage.alt = p.name;
  thumbs.innerHTML = imgs.map((src,i)=>`<img ${i===0?'class="active"':''} data-src="${src}" src="${src}" alt="thumb">`).join('');
  thumbs.querySelectorAll('img').forEach(img=> img.addEventListener('click',()=>{ thumbs.querySelectorAll('img').forEach(t=>t.classList.remove('active')); img.classList.add('active'); stage.src = img.dataset.src; }));
  document.getElementById('pName').textContent = p.name;
  document.getElementById('pMeta').textContent = `${label((p.categories||[])[0]||'')} • ${p.size||''}`;
  document.getElementById('pPrice').textContent = money(p.price);
  document.getElementById('pStock').textContent = p.inStock?'In stock':'Out of stock';
  document.getElementById('pSpecs').innerHTML = (p.specs||[]).map(s=>`<li>${s}</li>`).join('');
}

function renderBreadcrumbs(p){
  const bc = document.getElementById('breadcrumbs'); if(!bc) return;
  const cat = (p.categories&&p.categories[0]) || 'led-tv';
  bc.innerHTML = `<li><a href="index.html">Home</a></li><li><a href="collections.html?cat=${cat}">${label(cat)}</a></li><li aria-current="page">${p.name}</li>`;
}

function injectJSONLD(p){
  const cat = (p.categories&&p.categories[0]) || 'led-tv';
  const price = (typeof p.price === 'number') ? p.price : undefined;
  const product = {"@context":"https://schema.org","@type":"Product","name":p.name,"image":[p.image].concat((p.gallery||[]).slice(0,3)).filter(Boolean),"sku":String(p.id),"brand":{"@type":"Brand","name":"Makwell"},"category":label(cat),"description":(p.specs||[]).join(", ")};
  if (price !== undefined){ product.offers = {"@type":"Offer","priceCurrency":"INR","price": String(price), "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", "url": location.href }; }
  const breadcrumbs = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item": location.origin + location.pathname.replace(/product\.html.*/,'index.html')},
    {"@type":"ListItem","position":2,"name": label(cat), "item": location.origin + location.pathname.replace(/product\.html.*/,'collections.html') + "?cat=" + cat},
    {"@type":"ListItem","position":3,"name": p.name, "item": location.href}
  ]};
  const s1=document.createElement('script'); s1.type='application/ld+json'; s1.textContent=JSON.stringify(product);
  const s2=document.createElement('script'); s2.type='application/ld+json'; s2.textContent=JSON.stringify(breadcrumbs);
  document.head.appendChild(s1); document.head.appendChild(s2);
}

// Theme + mobile nav + iframe router
function applySavedTheme(){ const saved = localStorage.getItem('theme') || 'light'; document.documentElement.setAttribute('data-theme', saved); }
function toggleTheme(){ const cur = document.documentElement.getAttribute('data-theme')||'light'; const next = (cur==='light')?'dark':'light'; document.documentElement.setAttribute('data-theme', next); localStorage.setItem('theme', next); }
function wireThemeToggle(){ const btn = document.getElementById('themeToggle'); if(btn){ btn.addEventListener('click', toggleTheme); } }
function wireMobileMenu(){ const burger=document.getElementById('burger'); const nav=document.getElementById('nav'); if(!burger||!nav) return; burger.addEventListener('click',()=> nav.classList.toggle('open')); }
function wireIframeRouter(){
  const frame=document.getElementById('mainFrame'); if(!frame) return;
  document.body.addEventListener('click',(e)=>{ const a=e.target.closest('a'); if(!a) return; const href=a.getAttribute('href')||''; const targetFrame=a.dataset.frame==='true'||a.closest('.nav'); if(targetFrame && href.endsWith('.html') && !href.startsWith('http')){ e.preventDefault(); frame.setAttribute('src', href); history.pushState({frame:href}, '', '#'+href); const nav=document.getElementById('nav'); if(nav) nav.classList.remove('open'); }});
  const hash=location.hash.replace(/^#/, ''); if(hash.endsWith('.html')) frame.setAttribute('src', hash);
  window.addEventListener('popstate',()=>{ const dest=(location.hash||'').replace(/^#/, ''); if(dest.endsWith('.html')) frame.setAttribute('src', dest); });
}

async function __boot(){ await loadIncludes(); applySavedTheme(); wireThemeToggle(); wireMobileMenu(); wireIframeRouter(); hydrateCollections(); hydrateProduct(); }
__boot();
