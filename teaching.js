// Teaching section
const TEACHING = {
  where: "school",
  audience: "Beginners",
  topics: ["Data"],
  link: ""
};

// Standalone lesson. Edit the TEACHING block above to show where/audience/topics/link.
(function(){
const start=()=>{ try{
  const el=document.getElementById("clinic"); if(!el) return;
  const h=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  const facts=document.getElementById("teach-facts"), chips=[];
  if(TEACHING.where) chips.push(`<span class="chip"><b>Where</b>${h(TEACHING.where)}</span>`);
  if(TEACHING.audience) chips.push(`<span class="chip"><b>Audience</b>${h(TEACHING.audience)}</span>`);
  (TEACHING.topics||[]).forEach(x=>chips.push(`<span class="chip">${h(x)}</span>`));
  if(/^https:\/\//.test(TEACHING.link||"")) chips.push(`<a class="btn ghost small" href="${h(TEACHING.link)}" target="_blank" rel="noopener">See more</a>`);
  if(facts&&chips.length){facts.innerHTML=chips.join("");facts.hidden=false}

  const COLS=["id","city","amount","date"];
  const ROWS=[
    {id:1,city:"casablanca",amount:120,date:"2026-03-02"},
    {id:2,city:" Casablanca",amount:120,date:"2026-03-02"},
    {id:3,city:"RABAT",amount:null,date:"2026-03-04"},
    {id:4,city:"rabat",amount:80,date:"04/03/2026"},
    {id:5,city:"Marrakech",amount:95,date:"2026-03-05"}
  ];
  const FIX=["Normalize text","Remove duplicates","Standardize dates","Handle missing values"];
  const NOTES=[
    "Raw data. Five rows, nothing crashes, and that is exactly the problem. Group by city and the chart already lies: red bars are categories that should not exist.",
    "Same city, three spellings, one invisible leading space. Machines compare strings, not meaning. Normalize first: every later step depends on it.",
    "Now the duplicate shows itself. It was invisible before step 1, so the order of operations matters as much as the operations.",
    "Is 04/03 the 4th of March or the 3rd of April? The neighbouring rows suggest day-first. I would still confirm with the data owner.",
    "A missing amount is not a zero. I filled it with the median to show the effect. In a real project I would ask why it is missing, then document the choice."
  ];
  const CODE=[
    'df = pd.read_csv("orders.csv")',
    'df["city"] = df["city"].str.strip().str.title()',
    'df = df.drop_duplicates()',
    'df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)',
    'df["amount"] = df["amount"].fillna(df["amount"].median())'
  ];
  const norm=c=>{c=c.trim().toLowerCase();return c.charAt(0).toUpperCase()+c.slice(1)};

  function stateAt(n){
    let rows=ROWS.map(r=>({...r,fx:[],gone:false}));
    if(n>=1) rows.forEach(r=>{const v=norm(r.city);if(v!==r.city&&n===1)r.fx.push("city");r.city=v});
    if(n>=2){
      const seen=new Set();
      rows.forEach(r=>{const k=[r.city,r.amount,r.date].join("|");if(seen.has(k))r.gone=true;else seen.add(k)});
      if(n>2) rows=rows.filter(r=>!r.gone);
    }
    if(n>=3) rows.forEach(r=>{
      const m=/^(\d\d)\/(\d\d)\/(\d{4})$/.exec(r.date);
      if(m){r.date=m[3]+"-"+m[2]+"-"+m[1];if(n===3)r.fx.push("date")}
    });
    if(n>=4){
      const v=rows.filter(r=>r.amount!=null).map(r=>r.amount).sort((a,b)=>a-b);
      const med=v[Math.floor(v.length/2)];
      rows.forEach(r=>{if(r.amount==null){r.amount=med;if(n===4)r.fx.push("amount")}});
    }
    return rows;
  }

  const tbl=document.getElementById("cl-table"), note=document.getElementById("cl-note"),
        chart=document.getElementById("cl-chart"), code=document.getElementById("cl-code"),
        count=document.getElementById("cl-count"), prev=document.getElementById("cl-prev"),
        next=document.getElementById("cl-next"), dots=document.getElementById("cl-dots");
  let step=0, timer=null;
  const stop=()=>{clearInterval(timer);timer=null};

  dots.innerHTML=NOTES.map((_,i)=>`<button type="button" aria-label="Step ${i+1}"></button>`).join("");
  const dotEls=[...dots.children];
  dotEls.forEach((d,i)=>d.addEventListener("click",()=>go(i)));

  function render(n){
    const rows=stateAt(n);
    tbl.innerHTML='<table><thead><tr>'+COLS.map(c=>`<th>${c}</th>`).join("")+'</tr></thead><tbody>'+
      rows.map(r=>`<tr class="${r.gone?"gone":""}">`+COLS.map(c=>{
        let v=r[c],cls=r.fx.includes(c)?"chg":"";
        if(c==="amount"&&v==null){cls+=" nul";v="null"}
        else if(c==="city"&&/^\s/.test(v)) v='<i class="ws" title="leading space">␣</i>'+h(v.trim());
        else v=h(v);
        return `<td class="${cls}">${v}</td>`;
      }).join("")+'</tr>').join("")+'</tbody></table>';
    count.textContent=rows.filter(r=>!r.gone).length+" rows";

    const sums=new Map();
    rows.filter(r=>!r.gone).forEach(r=>sums.set(r.city,(sums.get(r.city)||0)+(r.amount||0)));
    chart.innerHTML=[...sums].map(([k,v])=>{
      const lbl=/^\s/.test(k)?"␣"+k.trim():k, bad=k!==norm(k);
      return `<div class="bar${bad?" bad":""}"><span>${h(lbl)}</span><i style="--w:${Math.min(100,v/250*100)}%"></i><em>${v}</em></div>`;
    }).join("");

    const lines=[...CODE.slice(0,n+1),'df.groupby("city")["amount"].sum()'];
    code.innerHTML=lines.map((l,i)=>`<span class="ln${i===n&&n>0?" new":""}">${h(l)}</span>`).join("");
  }

  function go(n){
    step=n; render(n);
    note.textContent=NOTES[n];
    note.classList.remove("swap"); void note.offsetWidth; note.classList.add("swap");
    dotEls.forEach((d,i)=>{d.classList.toggle("done",i<n);d.setAttribute("aria-current",i===n)});
    prev.disabled=n===0;
    next.textContent=n<4?`Fix ${n+1}/4 · ${FIX[n]}`:"Start over";
  }
  prev.addEventListener("click",()=>go(Math.max(0,step-1)));
  next.addEventListener("click",()=>go(step<4?step+1:0));
  el.addEventListener("pointerdown",stop);
  el.addEventListener("keydown",stop);
  go(0);

  if(!matchMedia("(prefers-reduced-motion:reduce)").matches && "IntersectionObserver" in window){
    const io2=new IntersectionObserver(es=>{
      if(es[0].isIntersecting){
        io2.disconnect();
        timer=setInterval(()=>{if(step>=4)return stop();go(step+1)},2800);
      }
    },{threshold:.3});
    io2.observe(el);
  }
}catch(e){
  console.error("[teaching] lesson failed:",e);
  const n=document.getElementById("cl-note"); if(n) n.textContent="The lesson could not load. Open the console (F12) to see why.";
}};
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
