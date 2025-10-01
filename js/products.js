
async function loadProducts(){
  const host=document.getElementById('productList'); if(!host) return;
  try{
    const res=await fetch('data/products.json'); 
    const items=await res.json();
    host.innerHTML = items.map(p=>`
      <article class="card">
        <div class="media">
          <img src="${p.image}" alt="${p.title}" onerror="this.onerror=null;this.src='assets/no-image.svg'">
        </div>
        <h3>${p.title}</h3>
        <div class="muted">${p.category} • ${p.series||''}</div>
        <div class="hl"><a class="btn" href="product.html?id=${p.id}">View Details</a></div>
      </article>
    `).join('');
  }catch(e){
    host.innerHTML = '<p>Failed to load products.</p>';
  }
}
document.addEventListener('DOMContentLoaded', loadProducts);
