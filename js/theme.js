
(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('theme')||'light';
  root.setAttribute('data-theme', saved);
  document.addEventListener('click', (e)=>{
    const t=e.target.closest('[data-theme-toggle]'); if(!t) return;
    const cur=root.getAttribute('data-theme')||'light';
    const next=cur==='light'?'dark':'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();
