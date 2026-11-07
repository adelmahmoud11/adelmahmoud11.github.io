const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
menuBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

/* Journey timeline: newest first (2026 -> 2017) */
(function reverseTimeline(){
  const timeline=document.querySelector('.timeline');
  if(!timeline) return;
  const items=Array.from(timeline.querySelectorAll(':scope > .timeline-item'));
  if(items.length<2) return;

  const yearOf=item=>{
    const badge=item.querySelector(':scope > span');
    const fromBadge=badge && badge.textContent.match(/(?:19|20)\d{2}/);
    if(fromBadge) return parseInt(fromBadge[0],10);
    const fromText=item.textContent.match(/(?:19|20)\d{2}/);
    return fromText ? parseInt(fromText[0],10) : null;
  };

  const years=items.map(yearOf);
  const allHaveYears=years.every(y=>y!==null);

  let ordered;
  if(allHaveYears){
    // sort by year, descending (stable for equal years)
    ordered=items
      .map((el,i)=>({el,y:years[i],i}))
      .sort((a,b)=>b.y-a.y||a.i-b.i)
      .map(o=>o.el);
  }else{
    // no years found: simply reverse the current order
    ordered=items.slice().reverse();
  }

  ordered.forEach(el=>timeline.appendChild(el));

  // if badges are sequence numbers (01, 02...), renumber to match the new order
  ordered.forEach((el,i)=>{
    const badge=el.querySelector(':scope > span');
    if(badge && /^\s*\d{2}\s*$/.test(badge.textContent)){
      badge.textContent=String(i+1).padStart(2,'0');
    }
  });
})();
