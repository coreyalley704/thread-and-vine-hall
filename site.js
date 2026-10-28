(function(){
  var KR = window.KR || {};
  var placeholder = !KR.confirmed;

  /* ---------- rates & settings: fill every [data-r] ---------- */
  function get(path){
    if(/^\d+(\.\d+)?$/.test(path)) return Number(path);
    return path.split('.').reduce(function(o,k){return o==null?undefined:o[k]}, KR);
  }
  function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
  document.querySelectorAll('[data-r]').forEach(function(el){
    var key = el.getAttribute('data-r'), np = false;
    if(key.indexOf('np:')===0){ np = true; key = key.slice(3); }
    var parts = key.split('*'), val = 1, isNum = true, str = null;
    parts.forEach(function(p){
      var v = get(p.trim());
      if(typeof v === 'number') val *= v; else { isNum = false; str = v; }
    });
    var out;
    if(isNum){ if(np) val = val * (1 - (KR.nonprofitDiscount||0)); out = money(val); }
    else out = (str==null ? 'Custom quote' : String(str));
    el.textContent = out;
    el.classList.toggle('ph', /^contact\./.test(key) ? /\[/.test(out) : placeholder);
  });
  document.querySelectorAll('[data-tel]').forEach(function(a){
    if(KR.contact && KR.contact.phoneLink) a.href = 'tel:' + KR.contact.phoneLink; else a.removeAttribute('href');
  });
  document.querySelectorAll('[data-maps]').forEach(function(a){ if(KR.contact) a.href = KR.contact.mapsUrl; });

  /* ---------- draft highlights toggle ---------- */
  var hide = document.getElementById('hidePh');
  if(hide) hide.addEventListener('click', function(){
    var on = document.body.classList.toggle('clean');
    hide.textContent = on ? 'Show highlights' : 'Hide highlights';
  });

  /* ---------- conversion tracking (Plausible or GA4, if installed) ---------- */
  function track(name){
    try{ if(window.plausible) window.plausible(name); if(window.gtag) window.gtag('event', name); }catch(e){}
  }
  document.querySelectorAll('[data-tour]').forEach(function(a){ a.addEventListener('click', function(){ track('Tour click'); }); });

  /* ---------- the inquiry form (one form, reused on every page) ---------- */
  var TYPES = ['Wedding','Corporate','Concert','Nonprofit','Church','Celebration','Other'];
  var ROOMS = ['The Loom','The No. 6 Lounge','The Spinning Room','The Bobbin','The Thread Room','Not sure yet'];
  var HEARD = ['Google search','Instagram or Facebook','A friend or past guest','Wedding website (The Knot, WeddingWire)','Walked by Gibson Mill','Other'];
  var n = 0;

  function formHTML(id, preset){
    var opt = function(list, sel){ return list.map(function(t){ return '<option'+(t===sel?' selected':'')+'>'+t+'</option>'; }).join(''); };
    return '' +
    '<form class="inq" name="inquiry" novalidate data-id="'+id+'">' +
      '<input type="hidden" name="form-name" value="inquiry">' +
      '<p hidden><label>Leave blank <input name="bot-field"></label></p>' +
      f('name','Your name','<input id="'+id+'-name" name="name" autocomplete="name" required>') +
      f('email','Email','<input id="'+id+'-email" name="email" type="email" autocomplete="email" required>') +
      f('type','Event type','<select id="'+id+'-type" name="eventType" required><option value="">Choose one</option>'+opt(TYPES,preset)+'</select>') +
      f('guests','Guest count','<input id="'+id+'-guests" name="guests" type="number" inputmode="numeric" min="1" max="600" required>') +
      f('date','Preferred date','<input id="'+id+'-date" name="date" type="date" required>', 'full') +
      '<details class="more"><summary>Add details (optional)</summary><div class="grid">' +
        f('phone','Phone','<input id="'+id+'-phone" name="phone" type="tel" autocomplete="tel">') +
        f('org','Organization','<input id="'+id+'-org" name="organization" autocomplete="organization">') +
        f('backup','Backup date','<input id="'+id+'-backup" name="backupDate" type="date">') +
        f('heard','How did you hear about us?','<select id="'+id+'-heard" name="heard"><option value="">Choose one</option>'+opt(HEARD)+'</select>') +
        '<fieldset class="f full"><legend>Rooms you’re interested in</legend><div class="checks">' +
          ROOMS.map(function(r,i){ return '<label><input type="checkbox" name="rooms" value="'+r+'" id="'+id+'-room'+i+'"> '+r+'</label>'; }).join('') +
        '</div></fieldset>' +
        '<fieldset class="f full"><legend>Is this for a 501(c)(3) nonprofit or church?</legend><div class="checks">' +
          '<label><input type="radio" name="nonprofit" value="Yes" id="'+id+'-npy"'+(preset==='Nonprofit'||preset==='Church'?' checked':'')+'> Yes</label>' +
          '<label><input type="radio" name="nonprofit" value="No" id="'+id+'-npn"> No</label>' +
        '</div></fieldset>' +
        '<div class="f full" data-ein'+(preset==='Nonprofit'||preset==='Church'?'':' hidden')+'><label for="'+id+'-ein">EIN</label><input id="'+id+'-ein" name="ein" inputmode="numeric" placeholder="12-3456789"></div>' +
        f('msg','Tell us about your event','<textarea id="'+id+'-msg" name="message"></textarea>','full') +
      '</div></details>' +
      '<div class="form-foot"><button class="btn" type="submit">Check Availability</button><p>We reply within 24 hours.</p></div>' +
    '</form>' +
    '<div class="thanks" hidden tabindex="-1"><span class="label">Received</span><h3>Thanks! We’ll be in touch within 24 hours to talk dates and set up a tour.</h3><p class="note" hidden data-preview-note>Preview only: this draft site isn’t connected yet, so nothing was sent.</p></div>';

    function f(key,label,control,cls){
      return '<div class="f'+(cls?' '+cls:'')+'"><label for="'+id+'-'+key+'">'+label+'</label>'+control+'<span class="err" id="'+id+'-'+key+'-err"></span></div>';
    }
  }

  document.querySelectorAll('[data-inquiry]').forEach(function(host){
    var id = 'q' + (++n), preset = host.getAttribute('data-inquiry') || '';
    host.innerHTML = formHTML(id, preset);
    var form = host.querySelector('form'), thanks = host.querySelector('.thanks');
    var date = form.querySelector('[name=date]'), backup = form.querySelector('[name=backupDate]');
    var today = new Date().toISOString().slice(0,10); date.min = today; backup.min = today;
    form.querySelectorAll('[name=nonprofit]').forEach(function(r){
      r.addEventListener('change', function(){ form.querySelector('[data-ein]').hidden = form.querySelector('[name=nonprofit]:checked').value !== 'Yes'; });
    });
    function err(k,msg){ var e = document.getElementById(id+'-'+k+'-err'); if(e) e.textContent = msg||''; }

    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var d = new FormData(form), ok = true;
      ['name','email','type','guests','date'].forEach(function(k){ err(k,''); });
      if(String(d.get('bot-field')||'')) return;
      if(!String(d.get('name')).trim()){ err('name','Add your name.'); ok=false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.get('email')))){ err('email','Enter an email like name@example.com.'); ok=false; }
      if(!d.get('eventType')){ err('type','Choose the closest fit.'); ok=false; }
      var g = parseInt(d.get('guests'),10);
      if(!g || g<1){ err('guests','Add an estimate. It can change.'); ok=false; }
      else if(g>600){ err('guests','Our largest room holds 600. Tell us more in the details and we’ll talk options.'); ok=false; }
      if(!d.get('date')){ err('date','Pick a date, even a rough one.'); ok=false; }
      else if(new Date(d.get('date')+'T12:00').getDay()===0 && d.get('eventType')!=='Church'){
        err('date','Sundays are reserved for our host church. Try a Saturday or weekday.'); ok=false;
      }
      if(!ok){ var first = form.querySelector('.err:not(:empty)'); if(first) first.parentElement.querySelector('input,select').focus(); return; }

      function done(previewed){
        form.hidden = true; thanks.hidden = false;
        thanks.querySelector('[data-preview-note]').hidden = !previewed;
        thanks.focus(); track('Inquiry');
      }
      var fail = function(){ form.querySelector('.form-foot p').textContent = 'Something went wrong sending that. Please email us directly.'; };
      if((KR.form||{}).mode === 'formsubmit' && KR.contact && /@/.test(KR.contact.email)){
        var o = {}; d.forEach(function(v,k){ if(k!=='bot-field' && k!=='form-name') o[k]=v; });
        o._subject = 'New inquiry: ' + (o.eventType||'Event') + ' on ' + (o.date||'') + ' (' + (o.guests||'?') + ' guests)';
        o._template = 'table'; o._captcha = 'false'; o._replyto = o.email;
        fetch('https://formsubmit.co/ajax/' + KR.contact.email, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(o)})
          .then(function(r){ if(!r.ok) throw 0; done(false); }).catch(fail);
      } else if((KR.form||{}).mode === 'netlify'){
        var body = new URLSearchParams();
        d.forEach(function(v,k){ body.append(k, v); });
        fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:body.toString()})
          .then(function(r){ if(!r.ok) throw 0; done(false); })
          .catch(function(){ err('date',''); form.querySelector('.form-foot p').textContent = 'Something went wrong sending that. Please email us directly.'; });
      } else done(true);
    });
  });
})();

/* ---------- draft bar only while rates are unconfirmed ---------- */
(function(){
  var KR = window.KR || {};
  if(KR.confirmed){ var d=document.querySelector('.draft'); if(d) d.hidden = true; document.body.classList.add('clean'); }
})();

/* ---------- "Is my date open?" checker ---------- */
(function(){
  var KR = window.KR || {};
  var booked = KR.booked || [], held = KR.held || [];
  document.querySelectorAll('[data-datecheck]').forEach(function(box){
    var input = box.querySelector('input[type=date]'), go = box.querySelector('[data-dc-go]'), out = box.querySelector('.dc-result');
    var today = new Date(); today.setHours(0,0,0,0);
    input.min = today.toISOString().slice(0,10);
    function say(cls, html){ out.className = 'dc-result ' + cls; out.innerHTML = html; }
    function check(){
      var v = input.value;
      if(!v){ say('warn','Pick a date first.'); return; }
      var d = new Date(v + 'T12:00'), day = d.getDay();
      var nice = d.toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric', year:'numeric'});
      if(d < today){ say('warn', 'That date has already passed. Try a future date.'); return; }
      if(day === 0){ say('no', '<b>' + nice + '</b> is a Sunday. Sunday mornings are reserved for our host church. Church groups can ask about Sunday afternoons and evenings.'); return; }
      if(booked.indexOf(v) > -1){ say('no', '<b>' + nice + '</b> is booked. ' + (day===6 ? 'The Friday before is often open, and Fridays can run later.' : 'Try a nearby date.')); return; }
      if(held.indexOf(v) > -1){ say('warn', '<b>' + nice + '</b> is on hold for someone else. Send an inquiry and we’ll tell you if it frees up.'); return; }
      say('yes', '<b>' + nice + '</b> looks open. <a href="#inquire" data-dc-claim>Send your details to hold it →</a><span class="dc-small">We confirm every date within 24 hours.</span>');
      var claim = out.querySelector('[data-dc-claim]');
      claim.addEventListener('click', function(){
        var f = document.querySelector('#inquire form [name=date]'); if(f){ f.value = v; }
        try{ if(window.plausible) window.plausible('Date check: open'); }catch(e){}
      });
    }
    go.addEventListener('click', check);
    input.addEventListener('change', check);
  });
})();
