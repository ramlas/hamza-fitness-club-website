/* assets/booking.js
   Multi-concern booking • PKR display • 30-min free slots 6–9 pm (Fri closed)
   Uses a single calendar icon to open the native date picker.
*/

/* ---------- Helpers ---------- */
const PKR = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  });
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
  /* ---------- Elements ---------- */
  const form       = $('#bookingForm');
  const dateInput  = $('#date');
  const timeSelect = $('#time');
  const refreshBtn = $('#refreshSlots');
  const errorBox   = $('#formErrors');
  
  const sConcerns = $('#sConcerns'); // summary list
  const sDate  = $('#sDate');
  const sTime  = $('#sTime');
  const sPrice = $('#sPrice');
  
  /* ---------- Concerns (multi-check) ---------- */
  function chosenConcerns() {
    return $$('input[name="concerns"]', form).filter(i => i.checked).map(i => i.value);
  }
  
  /* ---------- Time Slots: 30-min, 6–9 pm (Fri closed) ---------- */
  // returns array of "HH:MM" start times. Last start = 20:30.
  function genHalfHourSlots(isoDate) {
    if (!isoDate) return [];
    const d = new Date(isoDate + 'T00:00:00');
    const day = d.getUTCDay();      // 0 Sun .. 5 Fri .. 6 Sat (UTC to avoid TZ surprises)
    if (day === 5) return [];       // Friday closed
  
    const starts = [];
    for (let h = 18; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        starts.push(String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'));
      }
    }
    // 21:00 would end at 21:30 -> beyond 9pm, so stop at 20:30
    return starts; // ["18:00","18:30","19:00","19:30","20:00","20:30"]
  }
  
  function toDisplayRange(startHHMM) {
    const [h, m] = startHHMM.split(':').map(Number);
    const endMins = h * 60 + m + 30;
    const endH = Math.floor(endMins / 60), endMin = endMins % 60;
  
    const fmt = (H, M) => {
      const hour12 = ((H + 11) % 12) + 1;
      const ampm = H >= 12 ? 'pm' : 'am';
      return `${hour12}:${String(M).padStart(2,'0')} ${ampm}`;
    };
    return `${fmt(h, m)} – ${fmt(endH, endMin)} (Free)`;
  }
  
  function populateSlots() {
    const iso = dateInput?.value || '';
    const slots = genHalfHourSlots(iso);
  
    if (!timeSelect) return;
  
    timeSelect.innerHTML = '';
    if (!slots.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No slots available (Friday closed)';
      timeSelect.appendChild(opt);
      timeSelect.setAttribute('disabled', 'true');
      timeSelect.setCustomValidity('No slots available for this date.');
    } else {
      timeSelect.removeAttribute('disabled');
      timeSelect.setCustomValidity('');
  
      const ph = document.createElement('option');
      ph.value = '';
      ph.textContent = 'Select a 30-min slot';
      ph.disabled = true;
      ph.selected = true;
      timeSelect.appendChild(ph);
  
      slots.forEach(start => {
        const opt = document.createElement('option');
        opt.value = start; // "18:30"
        opt.textContent = toDisplayRange(start);
        timeSelect.appendChild(opt);
      });
    }
  
    // reflect in summary
    sTime && (sTime.textContent = timeSelect.value ? timeSelect.selectedOptions[0].textContent : '—');
  }
  
  /* ---------- Summary ---------- */
  function updateSummary() {
    // concerns list
    if (sConcerns) {
      const list = chosenConcerns();
      sConcerns.innerHTML = '';
      if (!list.length) {
        const li = document.createElement('li');
        li.className = 'text-gray-400';
        li.textContent = '—';
        sConcerns.appendChild(li);
      } else {
        list.forEach(val => {
          const li = document.createElement('li');
          li.textContent = val;
          sConcerns.appendChild(li);
        });
      }
    }
  
    sDate && (sDate.textContent = dateInput?.value || '—');
    sTime && (sTime.textContent = timeSelect?.value ? timeSelect.selectedOptions[0].textContent : '—');
  
    // fee (always free consult)
    sPrice && (sPrice.textContent = 'Free');
  }
  
  /* ---------- Validation ---------- */
  function validate() {
    errorBox && (errorBox.textContent = '');
  
    if (!chosenConcerns().length) {
      errorBox && (errorBox.textContent = 'Please select at least one goal/concern.');
      return false;
    }
    if (!dateInput?.value) {
      errorBox && (errorBox.textContent = 'Please choose a date.');
      return false;
    }
    if (!timeSelect?.value) {
      errorBox && (errorBox.textContent = 'Please choose a 30-minute slot between 6–9 pm.');
      return false;
    }
  
    // contact fields
    const required = ['name','phone','email'];
    for (const n of required) {
      const el = $(`[name="${n}"]`, form);
      if (!el || !el.value.trim()) {
        errorBox && (errorBox.textContent = 'Please complete your contact details.');
        el?.focus();
        return false;
      }
    }
  
    const agree = $('#agree', form);
    if (!agree?.checked) {
      errorBox && (errorBox.textContent = 'Please agree to the cancellation policy and terms.');
      return false;
    }
  
    return true;
  }
  
  /* ---------- Events ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    // min date = today
    if (dateInput) {
      const today = new Date();
      today.setHours(0,0,0,0);
      dateInput.min = today.toISOString().slice(0,10);
    }
    populateSlots();
    updateSummary();
  });
  
  // open native date picker with the single calendar icon
  (function () {
    const btn = $('#openDate');
    if (!btn || !dateInput) return;
    btn.addEventListener('click', () => {
      if (typeof dateInput.showPicker === 'function') {
        dateInput.showPicker();
      } else {
        dateInput.focus();
        dateInput.click?.();
      }
    });
  })();
  
  // block Friday & refresh slots on date change
  dateInput?.addEventListener('change', () => {
    if (dateInput.value) {
      const d = new Date(dateInput.value + 'T00:00:00');
      if (d.getUTCDay() === 5) { // Friday
        alert('Sorry, we are closed on Fridays. Please pick another date.');
        dateInput.value = '';
      }
    }
    populateSlots();
    updateSummary();
  });
  
  // manual refresh (optional)
  refreshBtn?.addEventListener('click', () => {
    populateSlots();
    updateSummary();
  });
  
  // update summary on time change & any input
  timeSelect?.addEventListener('change', updateSummary);
  form?.addEventListener('input', updateSummary);
  
  // submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const concerns = chosenConcerns().join(', ') || '—';
    const msg = `Thanks! Your appointment request has been received.
  • Concerns: ${concerns}
  • Date: ${sDate ? sDate.textContent : '—'}
  • Time: ${sTime ? sTime.textContent : '—'}
  • Fee: ${sPrice ? sPrice.textContent : '₨ 0'}
  
  We’ll confirm by email.`;
    alert(msg);
  
    form.reset();
    populateSlots();
    updateSummary();
  });
  
  /* ---------- Mobile nav toggle (header) ---------- */
  (function mobileNav(){
    const btn   = document.querySelector('[data-nav-toggle]');
    const panel = document.getElementById('mobile-menu');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden', isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  })();
  
  /* ---------- Highlight today in footer hours ---------- */
  (function markToday(){
    const rows = document.querySelectorAll('#hours [data-day]');
    if (!rows.length) return;
    const today = new Date().getDay(); // 0..6 local
    rows.forEach(row => {
      if (Number(row.getAttribute('data-day')) === today) {
        row.querySelector('dt')?.classList.add('text-white','font-semibold');
        row.querySelector('dd')?.classList.add('text-white');
      }
    });
  })();
  