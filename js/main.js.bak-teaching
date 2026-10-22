// Site configuration: edit these values only.
const CONFIG = {
  linkedin: "",          // e.g. "https://www.linkedin.com/in/your-handle"
  availability: "",      // e.g. "Open to opportunities from January 2027". Leave empty to hide.
  email: "rdiawane2001@gmail.com"
};
const FIELDS = ["Overview","Business Problem","Technical Constraints","Proposed Approach","Architecture","Implementation","Engineering Decisions","Testing & Reliability","Results & Limitations","Future Improvements"];
const CASES = {
  a: ["Intelligent Business Workflow","AI automation of a business process: intake, processing, generation, human validation."],
  b: ["AI Assistant & RAG","An assistant answering from a knowledge base: ingestion, chunking, retrieval, generation, verification."],
  c: ["API Integration & Deployment","A backend connecting components: endpoints, database, Docker configuration, health checks, tests."]
};
const $ = s => document.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const root = document.documentElement;
root.classList.add("js");

$("#year").textContent = new Date().getFullYear();
if (CONFIG.availability){const a=$("#availability");a.textContent=CONFIG.availability;a.hidden=false}
document.querySelectorAll("[data-linkedin]").forEach(a=>{
  if(CONFIG.linkedin){a.href=CONFIG.linkedin}else{a.hidden=true}
});

// ---------- Thème clair / sombre ----------
const themeBtn = $("#theme");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const THEME_COLORS = {light:"#F7F3EA", dark:"#14120f"};
const mq = matchMedia("(prefers-color-scheme:dark)");
const storedTheme = () => { try { return localStorage.getItem("theme") } catch(e) { return null } };

function applyTheme(t){
  root.dataset.theme = t;
  if(themeMeta) themeMeta.content = THEME_COLORS[t];
  if(themeBtn){
    themeBtn.setAttribute("aria-pressed", t === "dark");
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}
applyTheme(storedTheme() || (mq.matches ? "dark" : "light"));
// Tant que la visiteuse n'a pas choisi, on suit le système
mq.addEventListener("change", e => { if(!storedTheme()) applyTheme(e.matches ? "dark" : "light") });

themeBtn?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const commit = () => { applyTheme(next); try{ localStorage.setItem("theme", next) }catch(e){} };

  if(!document.startViewTransition || matchMedia("(prefers-reduced-motion:reduce)").matches) return commit();

  const r = themeBtn.getBoundingClientRect(),
        x = r.left + r.width/2, y = r.top + r.height/2,
        end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(commit).ready.then(() =>
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" }
    )
  ).catch(() => {});
});

// ---------- Menu mobile ----------
const burger=$(".burger"),menu=$("#menu");
const setMenu=o=>{menu.classList.toggle("open",o);burger.setAttribute("aria-expanded",o)};
burger.addEventListener("click",()=>setMenu(!menu.classList.contains("open")));
menu.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

// ---------- Modale études de cas ----------
const dlg=$("#case");
document.querySelectorAll("[data-case]").forEach(b=>b.addEventListener("click",()=>{
  const [t,d]=CASES[b.dataset.case];
  $("#case-body").innerHTML=`<h3 id="case-title">${esc(t)}</h3><p>${esc(d)}</p>`+
    FIELDS.map(f=>`<h4>${esc(f)}</h4><p class="todo">To complete with real project details.</p>`).join("")+
    `<h4>Links</h4><p class="todo">Demo, repository and docs: add only if they exist.</p>`;
  dlg.showModal();
}));
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
dlg.querySelectorAll(".close").forEach(b=>b.addEventListener("click",()=>dlg.close()));

// ---------- Formulaire (ouvre le client mail) ----------
const form=$("#form"),formStatus=$("#status");
formStatus.setAttribute("role","status");
form.addEventListener("submit",e=>{
  e.preventDefault();
  let ok=true;
  [...form.elements].forEach(f=>{if(f.name){const bad=!f.value.trim()||(f.type==="email"&&!f.validity.valid);f.setAttribute("aria-invalid",bad);if(bad)ok=false}});
  if(!ok){formStatus.textContent="Please fill in every field with a valid email address.";return}
  const d=Object.fromEntries(new FormData(form));
  location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.msg+"\n\n"+d.name+" ("+d.email+")")}`;
  formStatus.textContent="Your email app should open with the message ready to send. If not, write to "+CONFIG.email+".";
});

// ---------- Barre de lecture ----------
const bar=document.createElement("div");
bar.className="progress";bar.setAttribute("aria-hidden","true");document.body.prepend(bar);
let ticking=false;
const updateBar=()=>{
  const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
  bar.style.transform=`scaleX(${max>0?h.scrollTop/max:0})`;ticking=false;
};
addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(updateBar)}},{passive:true});
updateBar();

// ---------- Apparition au scroll ----------
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.15});
document.querySelectorAll(".wrap:not(.hero),.steps,.cases li").forEach(el=>{
  el.classList.add("reveal");io.observe(el);
});

// ---------- Lien actif du menu ----------
const links=[...document.querySelectorAll("#menu a[href^='#']:not(.btn)")];
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section[id]").forEach(s=>so.observe(s));

// ---------- Projecteur sur les cartes ----------
if(matchMedia("(hover:hover)").matches){
  document.querySelectorAll(".grid4 article").forEach(el =>
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    })
  );
}

/* TYPO-FORM:JS:START */
(()=>{
  document.querySelectorAll(".grid4,.stack,.lab,.principles,.contact").forEach(g=>
    [...g.children].forEach((c,i)=>c.style.setProperty("--i",i)));
  const msg=document.getElementById("f-msg"),count=document.querySelector(".contact .count");
  if(msg&&count){const u=()=>{count.textContent=msg.value.length+" / "+msg.maxLength};msg.addEventListener("input",u);u()}
  const st=document.getElementById("status");
  if(st)new MutationObserver(()=>{st.dataset.state=/^Please/.test(st.textContent)?"error":"ok"})
    .observe(st,{childList:true,characterData:true,subtree:true});
})();
/* TYPO-FORM:JS:END */

/* TEACH:JS:START */
// Teaching: fill in what you want to show. Empty values stay hidden.
const TEACHING = {
  where: "",      // e.g. "University / bootcamp / company name"
  audience: "",   // e.g. "Beginners and career changers"
  topics: [],     // e.g. ["SQL", "Python & pandas", "Data governance"]
  link: ""        // e.g. "https://..." (syllabus, profile, course page)
};
(()=>{
  const el=document.getElementById("clinic"); if(!el) return;
  const h=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  // Faits optionnels
  const facts=document.getElementById("teach-facts"), chips=[];
  if(TEACHING.where) chips.push(`<span class="chip"><b>Where</b>${h(TEACHING.where)}</span>`);
  if(TEACHING.audience) chips.push(`<span class="chip"><b>Audience</b>${h(TEACHING.audience)}</span>`);
  (TEACHING.topics||[]).forEach(x=>chips.push(`<span class="chip">${h(x)}</span>`));
  if(/^https:\/\//.test(TEACHING.link||"")) chips.push(`<a class="btn ghost small" href="${h(TEACHING.link)}" target="_blank" rel="noopener">See more</a>`);
  if(facts&&chips.length){facts.innerHTML=chips.join("");facts.hidden=false}

  // Données et leçon
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

  // Lecture automatique à l'arrivée dans l'écran, jusqu'au premier clic
  if(!matchMedia("(prefers-reduced-motion:reduce)").matches && "IntersectionObserver" in window){
    const io2=new IntersectionObserver(es=>{
      if(es[0].isIntersecting){
        io2.disconnect();
        timer=setInterval(()=>{if(step>=4)return stop();go(step+1)},2800);
      }
    },{threshold:.3});
    io2.observe(el);
  }
})();
/* TEACH:JS:END */
