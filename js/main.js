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

$("#year").textContent = new Date().getFullYear();
if (CONFIG.availability){const a=$("#availability");a.textContent=CONFIG.availability;a.hidden=false}
document.querySelectorAll("[data-linkedin]").forEach(a=>{
  if(CONFIG.linkedin){a.href=CONFIG.linkedin}else{a.hidden=true}
});

// Mobile menu
const burger=$(".burger"),menu=$("#menu");
const setMenu=o=>{menu.classList.toggle("open",o);burger.setAttribute("aria-expanded",o)};
burger.addEventListener("click",()=>setMenu(!menu.classList.contains("open")));
menu.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

// Case study dialog
const dlg=$("#case");
document.querySelectorAll("[data-case]").forEach(b=>b.addEventListener("click",()=>{
  const [t,d]=CASES[b.dataset.case];
  $("#case-body").innerHTML=`<h3 id="case-title">${esc(t)}</h3><p>${esc(d)}</p>`+
    FIELDS.map(f=>`<h4>${esc(f)}</h4><p class="todo">To complete with real project details.</p>`).join("")+
    `<h4>Links</h4><p class="todo">Demo, repository and docs: add only if they exist.</p>`;
  dlg.showModal();
}));
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});

// Contact form: no backend, so it opens the visitor's email client.
const form=$("#form"),status=$("#status");
form.addEventListener("submit",e=>{
  e.preventDefault();
  let ok=true;
  [...form.elements].forEach(f=>{if(f.name){const bad=!f.value.trim()||(f.type==="email"&&!f.validity.valid);f.setAttribute("aria-invalid",bad);if(bad)ok=false}});
  if(!ok){status.textContent="Please fill in every field with a valid email address.";return}
  const d=Object.fromEntries(new FormData(form));
  location.href=`mailto:${CONFIG.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.msg+"\n\n"+d.name+" ("+d.email+")")}`;
  status.textContent="Your email app should open with the message ready to send. If not, write to "+CONFIG.email+".";
});


document.documentElement.classList.add("js");

// Barre de lecture
const bar=document.createElement("div");bar.className="progress";document.body.prepend(bar);
addEventListener("scroll",()=>{
  const h=document.documentElement;
  bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%";
},{passive:true});

// Apparition au scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.15});
document.querySelectorAll(".wrap:not(.hero),.steps,.cases li").forEach(el=>{
  el.classList.add("reveal");io.observe(el);
});

// Lien actif du menu
const links=[...document.querySelectorAll("#menu a[href^='#']:not(.btn)")];
const so=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));
}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("main section[id]").forEach(s=>so.observe(s));