
async function loadProduct(){
  const id=new URLSearchParams(location.search).get('id');
  const host=document.getElementById('productHost');
  if(!id){ host.textContent='No product selected.'; return; }
  try{
    const res=await fetch('data/products.json'); 
    const items=await res.json();
    const p=items.find(x=>String(x.id)===String(id));
    if(!p){ host.textContent='Product not found.'; return; }
    document.title = p.title + ' — Makwell';
    const specs=(p.specs||[]).map(s=>`<li>${s}</li>`).join('');
    const tags=(p.tags||[]).map(t=>`<span class="badge">${t}</span>`).join(' ');
    const cat=p.category||'';
    document.getElementById('crumbs').innerHTML = `<a href='index.html'>Home</a> › <a href='products.html'>Products</a> › <span>${p.title}</span>`;
    host.innerHTML = `
      <div class="product">
        <div class="stage"><img src="${p.image}" alt="${p.title}" style="width:100%;border-radius:12px" onerror="this.onerror=null;this.src='assets/no-image.svg'"></div>
        <div>
          <h1>${p.title}</h1>
          <p class="muted">${cat} • ${p.series||''} ${p.os?('• '+p.os):''}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">${tags}</div>
          <h3>Specifications</h3>
          <ul>${specs}</ul>
          <div class="hl">
            <a class="btn" href="register.html">Register / Service</a>
            <a class="btn ghost" href="products.html">Back to products</a>
          </div>
        </div>
      </div>`;
    const ld={ "@context":"https://schema.org", "@type":"Product","name":p.title,"brand":{"@type":"Brand","name":"Makwell"},"image":p.image,"category":cat,"description":(p.specs||[]).join(", ")};
    const s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(ld); document.head.appendChild(s);
  }catch(e){
    host.textContent='Error loading product.';
  }
}
document.addEventListener('DOMContentLoaded', loadProduct);
