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