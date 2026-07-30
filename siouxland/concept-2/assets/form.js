/* Siouxland Orthodontics — request-an-exam form.
   Shared by every page that carries #consult. One file so the webhook URL is
   pasted in exactly one place.

   SETUP ORDER MATTERS (GHL wipes field mappings if you save the trigger before
   fetching a sample):
     1. paste WEBHOOK_URL below and publish the site
     2. submit a test form  ->  name field must contain "_test", e.g. "Jules_test",
        and the email + phone must be unique for every single test, or GHL matches
        the submission onto an old contact and the new test looks like it vanished
     3. in GHL, open Automation > Admin > Website > Elementor Form Webhook and
        click "Fetch Sample"
     4. map the inbound fields to GHL contact fields
     5. THEN save the trigger

   Fields we send:
     full_name, email, phone, office, notes           (visible)
     source, medium, campaign, content                (UTMs, case-sensitive)
     gclid, fbclid, wbraid, gbraid                    (ad click IDs)
     page, page_url                                   (which page the lead came from)
*/
(function () {
  'use strict';

  var WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/qccdtXoeoF3KU13kYsn1/webhook-trigger/rQKdDLwoCO3xO14u4HR3';
  var THANKS_URL  = 'thank-you.html';
  var PHONE       = '(712) 276-2766';

  /* Attribution. UTMs arrive on the URL as utm_source etc; click IDs arrive bare.
     We stash whatever we see in localStorage so a visitor who lands on an ad page
     and converts three pages later still carries the campaign with them. */
  var TRACK = ['source', 'medium', 'campaign', 'content', 'gclid', 'fbclid', 'wbraid', 'gbraid'];
  var STORE = 'sxl_attribution';

  function stored() {
    try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { return {}; }
  }

  function captureFromUrl() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    var keep = stored(), found = false;
    TRACK.forEach(function (k) {
      var v = q.get(k) || q.get('utm_' + k) || '';
      if (v) { keep[k] = v; found = true; }
    });
    if (found) { try { localStorage.setItem(STORE, JSON.stringify(keep)); } catch (e) {} }
  }

  function fillHidden(form) {
    var attr = stored();
    TRACK.forEach(function (k) {
      var el = form.querySelector('[name="' + k + '"]');
      if (el && !el.value) { el.value = attr[k] || ''; }
    });
    var page = form.querySelector('[name="page"]');
    var url  = form.querySelector('[name="page_url"]');
    if (page) { page.value = location.pathname.split('/').pop() || 'index.html'; }
    if (url)  { url.value = location.href; }
  }

  function serialize(form) {
    var out = [];
    new FormData(form).forEach(function (v, k) {
      out.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return out.join('&');
  }

  /* urlencoded rather than JSON on purpose: it is a CORS-simple content type, so the
     browser skips the preflight that GHL's hook endpoint does not answer. */
  function post(body) {
    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).catch(function () {
      return fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {
    captureFromUrl();

    var form = document.getElementById('consult');
    if (!form) { return; }
    fillHidden(form);

    var loadedAt = Date.now();
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    var note = form.querySelector('.form-note');

    function fail(msg) {
      if (btn) { btn.disabled = false; btn.textContent = label; }
      if (note) {
        note.innerHTML = msg + ' Or call us at <a href="tel:+17122762766" ' +
          'style="font-weight:700;color:var(--coral)">' + PHONE + '</a>.';
        note.style.color = '#A42C42';
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = form.querySelector('[name="full_name"]');
      var email = form.querySelector('[name="email"]');
      if (!name.value.trim())  { name.focus();  return fail('Please add your name.'); }
      if (!email.checkValidity()) { email.focus(); return fail('Please check your email address.'); }

      /* Bots fill the offscreen field and submit instantly. People do neither. */
      var trap = form.querySelector('[name="company"]');
      if ((trap && trap.value) || Date.now() - loadedAt < 2500) {
        location.href = THANKS_URL;
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fillHidden(form);

      if (window.dataLayer) {
        window.dataLayer.push({ event: 'form_submit', form_name: 'request_exam' });
      }

      if (!WEBHOOK_URL) {          // pre-launch: nothing to post to yet
        location.href = THANKS_URL;
        return;
      }

      post(serialize(form))
        .then(function () { location.href = THANKS_URL; })
        .catch(function () { fail('Something went wrong sending that.'); });
    });
  });
})();
