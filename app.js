(function(){
  document.querySelectorAll('[data-include="header"]').forEach(el=>{ el.outerHTML = document.querySelector('.header')?.outerHTML || '' });
  document.querySelectorAll('[data-include="footer"]').forEach(el=>{ el.outerHTML = document.querySelector('.footer')?.outerHTML || '' });
})();

const burger = document.getElementById('burger');
if (burger){ burger.addEventListener('click',()=> document.getElementById('nav').classList.toggle('open')) }

async function loadJSON(url){ const r = await fetch(url); return r.json(); }
function money(n){ if(typeof n!=="number" || isNaN(n)) return '—'; return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n) }

async function hydrateGrids(){
  const grids = document.querySelectorAll('.grid[data-source]');
  if(!grids.length) return;
  const dataUrl = grids[0].getAttribute('data-source');
  const products = await loadJSON(dataUrl);
  const url = new URL(location.href);
  const q = Object.fromEntries(url.searchParams);
  const group = q.group || null; const cat = q.cat || null; const tag = q.tag || null;

  const active = products.filter(p=>{
    if(group && p.group!==group) return false;
    if(cat && !p.categories.includes(cat)) return false;
    if(tag && !p.tags.includes(tag)) return false;
    return true; });

  grids.forEach(grid=>{
    let list = [...active];
    const filterRaw = grid.getAttribute('data-filter');
    if(filterRaw){ const f = JSON.parse(filterRaw); list = list.filter(p=>!f.tag||p.tags.includes(f.tag)) }
    grid.innerHTML = list.slice(0,8).map(cardHTML).join('') || '<p class="muted">No items.</p>';
  });
}

function cardHTML(p){
  return `<article class="card">
    <a class="media" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"/></a>
    <div class="body">
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="muted">${p.badge||''} ${p.size||''}</div>
      <div class="price-row"><span class="price">${money(p.price)}</span> ${p.inStock?'<span class="badge">In stock</span>':'<span class="badge">Out of stock</span>'}</div>
    </div>
  </article>`
}

async function hydrateCollections(){
  const el = document.getElementById('grid-collections');
  if(!el) return;
  const data = await loadJSON(el.getAttribute('data-source'));
  let view = [...data];
  const url = new URL(location.href); const q = Object.fromEntries(url.searchParams);
  if(q.group) view = view.filter(p=>p.group===q.group);
  if(q.cat) view = view.filter(p=>p.categories.includes(q.cat));
  if(q.tag) view = view.filter(p=>p.tags.includes(q.tag));

  const cats = [...new Set(data.flatMap(p=>p.categories))];
  document.getElementById('facet-category').innerHTML = cats.map(c=>`<button class="chip" data-cat="${c}">${label(c)}</button>`).join('');
  const tags = [...new Set(data.flatMap(p=>p.tags))];
  document.getElementById('facet-tags').innerHTML = tags.map(t=>`<button class="chip" data-tag="${t}">${label(t)}</button>`).join('');

  document.querySelectorAll('[data-cat]').forEach(b=> b.addEventListener('click',()=>toggleURL('cat', b.dataset.cat)));
  document.querySelectorAll('[data-tag]').forEach(b=> b.addEventListener('click',()=>toggleURL('tag', b.dataset.tag)));
  document.getElementById('availability').addEventListener('change',e=>{ toggleURL('stock', e.target.value) });
  document.getElementById('sort').addEventListener('change',e=>{ toggleURL('sort', e.target.value) });

  if(q.stock==='in') view = view.filter(p=>p.inStock);
  if(q.stock==='out') view = view.filter(p=>!p.inStock);
  if(q['price-min']) view = view.filter(p=>p.price>=+q['price-min']);
  if(q['price-max']) view = view.filter(p=>p.price<=+q['price-max']);

  if(q.sort==='price-asc') view.sort((a,b)=> (a.price||0)-(b.price||0));
  if(q.sort==='price-desc') view.sort((a,b)=> (b.price||0)-(a.price||0));
  if(q.sort==='new') view.sort((a,b)=> (b.added||0)-(a.added||0) );

  document.getElementById('collectionTitle').textContent = buildTitle(q);

  el.innerHTML = view.map(cardHTML).join('');
}

function label(slug){ return slug.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ') }
function toggleURL(key, val){ const u = new URL(location.href); if(val===null){u.searchParams.delete(key)} else {u.searchParams.set(key,val)}; location.href = u.toString(); }
function buildTitle(q){
  if(q.cat) return `${label(q.cat)} — Products`;
  if(q.group) return `${label(q.group)} — Collections`;
  if(q.tag==='new') return 'New Launches';
  if(q.tag==='bestseller') return 'Best Sellers';
  return 'Collections';
}

async function hydrateProduct(){
  const url = new URL(location.href); const id = url.searchParams.get('id');
  if(!id) return;
  const data = await loadJSON('data/products.json');
  const p = data.find(x=>String(x.id)===String(id));
  if(!p) return;
  document.getElementById('pTitle').textContent = `Makwell — ${p.name}`;
  renderGallery(p);
  document.getElementById('pName').textContent = p.name;
  document.getElementById('pMeta').textContent = `${label(p.group)} • ${p.size||''}`;
  document.getElementById('pPrice').textContent = (money(p.price)!=='—' ? money(p.price) : 'Price on request');
  document.getElementById('pStock').textContent = p.inStock?'In stock':'Out of stock';
  document.getElementById('pSpecs').innerHTML = (p.specs||[]).map(s=>`<li>${s}</li>`).join('');
  const btn = document.getElementById('addToCart');
  if(btn){ btn.addEventListener('click',()=> addToCart(p)); }
  const all = await loadJSON('data/products.json');
  renderRelated(p, all);
}

function addToCart(p){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const idx = cart.findIndex(i=>i.id===p.id);
  if(idx>-1) cart[idx].qty += 1; else cart.push({id:p.id,name:p.name,price:p.price,qty:1});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  const n = cart.reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cartCount'); if(el) el.textContent = n;
}

const search = document.getElementById('search');
if(search){
  search.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const u = new URL('collections.html', location.href); u.searchParams.set('q', search.value.trim()); location.href = u } });
}

updateCartCount();
hydrateGrids();
hydrateCollections();
hydrateProduct();
initTabs();

// ---- Enhanced Product UI (gallery, tabs, related) ----
function initTabs(){
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.tabpane');
  if(!tabs.length) return;
  tabs.forEach(btn=>btn.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    panes.forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
  }));
}

function renderGallery(p){
  // Accept optional p.gallery: [img1, img2, ...]; fallback to p.image
  const imgs = (p.gallery && p.gallery.length ? p.gallery : [p.image]);
  const stage = document.getElementById('pImage');
  const thumbs = document.getElementById('pThumbs');
  if(!stage || !thumbs) return;
  stage.src = imgs[0];
  stage.alt = p.name;
  thumbs.innerHTML = imgs.map((src,i)=>`<img ${i===0?'class="active"':''} data-src="${src}" src="${src}" alt="thumb ${i+1}">`).join('');
  thumbs.querySelectorAll('img').forEach(img=> img.addEventListener('click',()=>{
    thumbs.querySelectorAll('img').forEach(t=>t.classList.remove('active'));
    img.classList.add('active');
    stage.src = img.dataset.src;
  }));
}

async function renderRelated(current, all){
  const rel = all.filter(x=> x.group===current.group && x.id!==current.id).slice(0,3);
  const host = document.getElementById('relatedGrid');
  if(!host) return;
  host.innerHTML = rel.map(cardHTML).join('') || '<p class="muted">No related items.</p>';
}
