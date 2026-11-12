(function(){
  /* ===== CONFIG — replace before launch ===== */
  var WHATSAPP_NUMBER = "9715XXXXXXXX";   // digits only, country code first
  var SUBMIT_ENDPOINT = "";               // Respond.io / CRM webhook. Empty = demo mode (nothing is sent).

  var codes = [["+971","UAE"],["+966","KSA"],["+974","QA"],["+965","KW"],["+973","BH"],["+968","OM"],["+44","UK"],["+91","IN"],["+92","PK"],["+7","RU"],["+49","DE"],["+33","FR"],["+86","CN"],["+1","US/CA"],["+20","EG"]];
  var groups = [
    ["unit","Unit of interest",["3-bed townhouse","4-bed townhouse","5-bed villa","Not sure"],"two"],
    ["budget","Budget",["Under AED 4M","AED 4–6M","AED 6–9M","AED 9M+"],"two"],
    ["purpose","Purpose",["Live in","Invest","Both"],"three"],
    ["pay","Handover payment (40%)",["Cash","Mortgage","Not sure"],"three"]
  ];
  var ic = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5h.01"/></svg>';
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

  var css = '.lf{display:flex;flex-direction:column;gap:16px;padding:8px 28px 28px;font-size:15px}'+
    '.lf-head{display:flex;justify-content:space-between;gap:12px;padding-top:20px}.lf-head h2{font-weight:800;font-size:21px;line-height:1.25}'+
    '.lf-x{flex:none;width:44px;height:44px;border-radius:22px;border:0;background:#F1F4F8;cursor:pointer;font-size:20px;line-height:1;color:#0F1B26}'+
    '.lf label,.lf legend{font-size:14px;font-weight:500}.lf .rq{color:#2964D9}'+
    '.lf-in{height:48px;width:100%;padding:0 14px;border-radius:10px;border:1.5px solid #7D8A9C;background:#fff;font:400 16px Inter,sans-serif;color:#0F1B26}'+
    '.lf-in[aria-invalid="true"]{border-color:#B42318}.lf-ph{display:flex;gap:8px}.lf-ph select{width:128px;flex:none}'+
    '.lf fieldset{margin:0;padding:0;border:0}.lf legend{padding:0;margin-bottom:8px}'+
    '.lf-p{display:grid;gap:8px}.lf-p.two{grid-template-columns:repeat(2,minmax(0,1fr))}.lf-p.three{grid-template-columns:repeat(3,minmax(0,1fr))}'+
    '.lf-p button{height:44px;padding:0 6px;border-radius:10px;border:1.5px solid #C9D2DE;background:#fff;color:#0F1B26;font:500 14px Inter,sans-serif;cursor:pointer}'+
    '.lf-p button[aria-pressed="true"]{background:#2964D9;border-color:#2964D9;color:#fff}.lf-p.bad button{border-color:#B42318}'+
    '.lf-err{display:none;gap:6px;align-items:center;font-size:13px;color:#B42318;margin-top:6px}.lf-err.show{display:flex}'+
    '.lf-c{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:10px;border:1.5px solid #E3E8EF;background:#FAFAFA}.lf-c.bad{border-color:#B42318}'+
    '.lf-c input{flex:none;width:22px;height:22px;margin:1px 0 0;accent-color:#2964D9}.lf-c label{font-weight:400;line-height:1.5}'+
    '.lf-sum{display:none;gap:10px;align-items:center;padding:12px 14px;border-radius:10px;background:#FDF0EF;color:#B42318;font-size:14px;font-weight:500}.lf-sum.show{display:flex}'+
    '.lf-go{width:100%;height:56px}.lf-go[disabled]{opacity:.75;cursor:progress}'+
    '.lf-spin{width:20px;height:20px;border-radius:50%;border:3px solid rgba(255,255,255,.35);border-top-color:#fff;animation:lfs .8s linear infinite}@keyframes lfs{to{transform:rotate(360deg)}}'+
    '.lf-ok{width:56px;height:56px;border-radius:28px;background:#EAF1FD;display:flex;align-items:center;justify-content:center;color:#2964D9}'+
    '@media (max-width:767px){.lf{padding:4px 20px 24px}}';
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function formHTML(){
    var h = '<form class="lf" novalidate aria-labelledby="lf-t">' +
      '<div class="lf-head"><div><h2 id="lf-t" class="mont">Get the Palm Springs report</h2><span class="muted" style="font-size:14px">Our three picks, the comparables and the payment plan. Sent to your WhatsApp.</span></div><button type="button" class="lf-x" data-close aria-label="Close">×</button></div>' +
      '<div class="lf-sum" role="alert">' + ic + '<span></span></div>' +
      '<div><label for="lf-name">Full name <span class="rq" aria-hidden="true">*</span></label><input class="lf-in" id="lf-name" name="name" autocomplete="name" aria-required="true" placeholder="e.g. Aisha Rahman" style="margin-top:6px"><span class="lf-err" data-e="name">' + ic + '<span></span></span></div>' +
      '<div><label for="lf-phone">WhatsApp number <span class="rq" aria-hidden="true">*</span></label><div class="lf-ph" style="margin-top:6px"><select class="lf-in" name="cc" aria-label="Country code">' + codes.map(function(c){ return '<option value="'+c[0]+'">'+c[1]+' '+c[0]+'</option>'; }).join("") + '</select><input class="lf-in" id="lf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" aria-required="true" placeholder="50 123 4567"></div><span class="lf-err" data-e="phone">' + ic + '<span></span></span></div>';
    groups.forEach(function(g){
      h += '<fieldset><legend>' + g[1] + ' <span class="rq" aria-hidden="true">*</span></legend><div class="lf-p ' + g[3] + '" data-g="' + g[0] + '">' +
        g[2].map(function(o){ return '<button type="button" aria-pressed="false">' + esc(o) + '</button>'; }).join("") + '</div><span class="lf-err" data-e="' + g[0] + '">' + ic + '<span></span></span></fieldset>';
    });
    h += '<div><div class="lf-c"><input type="checkbox" id="lf-ok" name="consent" aria-required="true"><label for="lf-ok">I agree to be contacted by Prop-AI on WhatsApp, phone or email about Palm Springs and related projects. <a href="#privacy">Privacy policy</a></label></div><span class="lf-err" data-e="consent">' + ic + '<span></span></span></div>' +
      '<button type="submit" class="btn btn-primary lf-go"><span>Send me the report</span></button>' +
      '<p class="fine" style="text-align:center">Free · No obligation to buy</p></form>';
    return h;
  }

  function mount(host){
    host.innerHTML = formHTML();
    var form = host.querySelector("form"), picks = {}, tried = false;
    function el(n){ return form.elements.namedItem(n); }
    host.querySelectorAll("[data-g]").forEach(function(g){
      g.querySelectorAll("button").forEach(function(b){
        b.addEventListener("click", function(){
          g.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
          b.setAttribute("aria-pressed","true"); picks[g.dataset.g] = b.textContent; if (tried) show(check());
        });
      });
    });
    function data(){ return { name: el("name").value.trim(), cc: el("cc").value, phone: el("phone").value.trim(), unit: picks.unit||"", budget: picks.budget||"", purpose: picks.purpose||"", handover_payment: picks.pay||"", consent: el("consent").checked, project: "Palm Springs by Nakheel", offer: "Prop-AI Palm Springs analysis", source: location.href }; }
    function check(){
      var d = data(), e = {};
      if (d.name.length < 2) e.name = "Please enter your full name.";
      var n = d.phone.replace(/\D/g,""); if (n.length < 7 || n.length > 12) e.phone = "Enter a valid WhatsApp number, e.g. 50 123 4567.";
      if (!d.unit) e.unit = "Choose a unit, or 'Not sure'.";
      if (!d.budget) e.budget = "Choose a budget range.";
      if (!d.purpose) e.purpose = "Tell us if you'll live in it or invest.";
      if (!d.handover_payment) e.pay = "Choose how you'd pay the 40% at handover.";
      if (!d.consent) e.consent = "Please tick the box so we can send the report.";
      return e;
    }
    function show(e){
      ["name","phone","unit","budget","purpose","pay","consent"].forEach(function(k){
        var box = host.querySelector('[data-e="'+k+'"]'); box.classList.toggle("show", !!e[k]); box.querySelector("span").textContent = e[k] || "";
        if (k === "name" || k === "phone") el(k).setAttribute("aria-invalid", e[k] ? "true" : "false");
        else if (k === "consent") host.querySelector(".lf-c").classList.toggle("bad", !!e[k]);
        else host.querySelector('[data-g="'+k+'"]').classList.toggle("bad", !!e[k]);
      });
      var c = Object.keys(e).length, s = host.querySelector(".lf-sum"); s.classList.toggle("show", c > 0);
      s.querySelector("span").textContent = c === 1 ? "Please check the highlighted field." : "Please check the " + c + " highlighted fields.";
    }
    form.addEventListener("input", function(){ if (tried) show(check()); });
    form.addEventListener("submit", function(ev){
      ev.preventDefault(); tried = true; var e = check(); show(e);
      if (Object.keys(e).length) { var f = form.querySelector('[aria-invalid="true"]'); if (f) f.focus(); return; }
      var btn = form.querySelector(".lf-go"); btn.disabled = true; btn.innerHTML = '<span class="lf-spin" aria-hidden="true"></span><span>Sending…</span>';
      var d = data();
      var send = SUBMIT_ENDPOINT ? fetch(SUBMIT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }) : new Promise(function(r){ setTimeout(r, 1200); });
      send.then(function(){
        if (window.fbq) window.fbq("track", "Lead");
        var first = d.name.split(/\s+/)[0] || "there";
        host.innerHTML = '<div class="lf" role="status" style="gap:16px;padding-top:28px"><div style="display:flex;justify-content:space-between"><span class="lf-ok"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg></span><button type="button" class="lf-x" data-close aria-label="Close">×</button></div><h2 class="mont" style="font-weight:800;font-size:24px"></h2><p>Your Palm Springs report is on its way to WhatsApp, usually within 5 minutes.</p><p class="muted">Our team will follow up with one quick question: are you booking at launch, or watching for now?</p><a class="btn btn-outline" href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener" style="width:100%">Open WhatsApp</a></div>';
        host.querySelector("h2").textContent = "Thanks, " + first + ".";
        host.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", close); });
      }).catch(function(){ btn.disabled = false; btn.innerHTML = "<span>Send me the report</span>"; var s = host.querySelector(".lf-sum"); s.classList.add("show"); s.querySelector("span").textContent = "Something went wrong. Please try again."; });
    });
    host.querySelectorAll("[data-close]").forEach(function(b){ b.addEventListener("click", close); });
  }

  var dlg = document.getElementById("dlg"), host = document.getElementById("dlg-form"), sticky = document.getElementById("sticky"), last = null, mounted = false;
  function open(){ if (!mounted) { mount(host); mounted = true; } last = document.activeElement; dlg.hidden = false; document.body.style.overflow = "hidden"; if (sticky) sticky.style.visibility = "hidden"; setTimeout(function(){ var f = host.querySelector("input,button"); if (f) f.focus(); }, 30); }
  function close(){ dlg.hidden = true; document.body.style.overflow = ""; if (sticky) sticky.style.visibility = ""; if (last) last.focus(); }
  document.querySelectorAll("[data-open]").forEach(function(b){ b.addEventListener("click", open); });
  dlg.querySelector(".bd").addEventListener("click", close);
  dlg.addEventListener("keydown", function(e){ if (e.key === "Escape") close(); });
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function(a){ a.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hi Prop-AI, I'd like your read on Palm Springs by Nakheel."); });
})();
