/* assets/booking.js - UPDATED WITH API INTEGRATION */
/* Multi-concern booking • 30-min free slots 6–9 pm (Fri closed) */

/* ---------- Helpers ---------- */
const PKR = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Elements ---------- */
const form = $("#bookingForm");
const dateInput = $("#date");
const timeSelect = $("#time");
const refreshBtn = $("#refreshSlots");
const errorBox = $("#formErrors");

const sConcerns = $("#sConcerns"); // summary list
const sDate = $("#sDate");
const sTime = $("#sTime");
const sPrice = $("#sPrice");

/* ---------- Concerns (multi-check) ---------- */
function chosenConcerns() {
  return $$('input[name="concerns"]', form)
    .filter((i) => i.checked)
    .map((i) => i.value);
}

/* ---------- Time Slots: 30-min, 6–9 pm (Fri closed) ---------- */
// returns array of "HH:MM" start times. Last start = 20:30.
function genHalfHourSlots(isoDate) {
  if (!isoDate) return [];
  const d = new Date(isoDate + "T00:00:00");
  const day = d.getUTCDay(); // 0 Sun .. 5 Fri .. 6 Sat (UTC to avoid TZ surprises)
  if (day === 5) return []; // Friday closed

  const starts = [];
  for (let h = 18; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      starts.push(
        String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")
      );
    }
  }
  // 21:00 would end at 21:30 -> beyond 9pm, so stop at 20:30
  return starts; // ["18:00","18:30","19:00","19:30","20:00","20:30"]
}

function toDisplayRange(startHHMM) {
  const [h, m] = startHHMM.split(":").map(Number);
  const endMins = h * 60 + m + 30;
  const endH = Math.floor(endMins / 60),
    endMin = endMins % 60;

  const fmt = (H, M) => {
    const hour12 = ((H + 11) % 12) + 1;
    const ampm = H >= 12 ? "pm" : "am";
    return `${hour12}:${String(M).padStart(2, "0")} ${ampm}`;
  };
  return `${fmt(h, m)} – ${fmt(endH, endMin)} (Free)`;
}

function populateSlots() {
  const iso = dateInput?.value || "";
  const slots = genHalfHourSlots(iso);

  if (!timeSelect) return;

  timeSelect.innerHTML = "";
  if (!slots.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No slots available (Friday closed)";
    timeSelect.appendChild(opt);
    timeSelect.setAttribute("disabled", "true");
    timeSelect.setCustomValidity("No slots available for this date.");
  } else {
    timeSelect.removeAttribute("disabled");
    timeSelect.setCustomValidity("");

    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = "Select a 30-min slot";
    ph.disabled = true;
    ph.selected = true;
    timeSelect.appendChild(ph);

    slots.forEach((start) => {
      const opt = document.createElement("option");
      opt.value = start; // "18:30"
      opt.textContent = toDisplayRange(start);
      timeSelect.appendChild(opt);
    });
  }

  // reflect in summary
  sTime &&
    (sTime.textContent = timeSelect.value
      ? timeSelect.selectedOptions[0].textContent
      : "—");
}

/* ---------- Summary ---------- */
function updateSummary() {
  // concerns list
  if (sConcerns) {
    const list = chosenConcerns();
    sConcerns.innerHTML = "";
    if (!list.length) {
      const li = document.createElement("li");
      li.className = "text-gray-400";
      li.textContent = "—";
      sConcerns.appendChild(li);
    } else {
      list.forEach((val) => {
        const li = document.createElement("li");
        li.textContent = val;
        sConcerns.appendChild(li);
      });
    }
  }

  sDate && (sDate.textContent = dateInput?.value || "—");
  sTime &&
    (sTime.textContent = timeSelect?.value
      ? timeSelect.selectedOptions[0].textContent
      : "—");

  // fee (always free consult)
  sPrice && (sPrice.textContent = "Free");
}

/* ---------- Validation ---------- */
function validate() {
  errorBox && (errorBox.textContent = "");

  if (!chosenConcerns().length) {
    errorBox &&
      (errorBox.textContent = "Please select at least one goal/concern.");
    return false;
  }
  if (!dateInput?.value) {
    errorBox && (errorBox.textContent = "Please choose a date.");
    return false;
  }
  if (!timeSelect?.value) {
    errorBox &&
      (errorBox.textContent = "Please choose a 30-minute slot between 6–9 pm.");
    return false;
  }

  // contact fields
  const required = ["name", "phone", "email"];
  for (const n of required) {
    const el = $(`[name="${n}"]`, form);
    if (!el || !el.value.trim()) {
      errorBox &&
        (errorBox.textContent = "Please complete your contact details.");
      el?.focus();
      return false;
    }
  }

  const agree = $("#agree", form);
  if (!agree?.checked) {
    errorBox &&
      (errorBox.textContent =
        "Please agree to the cancellation policy and terms.");
    return false;
  }

  return true;
}

/* ---------- Events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 Booking.js initialized");

  // Check if API is available
  if (typeof API === "undefined") {
    console.warn("⚠️ API service not loaded. Using fallback mode.");
  } else {
    console.log("✅ API service available");
  }

  // min date = today
  if (dateInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.min = today.toISOString().slice(0, 10);
  }
  populateSlots();
  updateSummary();
});

// open native date picker with the single calendar icon
(function () {
  const btn = $("#openDate");
  if (!btn || !dateInput) return;
  btn.addEventListener("click", () => {
    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
    } else {
      dateInput.focus();
      dateInput.click?.();
    }
  });
})();

// block Friday & refresh slots on date change
dateInput?.addEventListener("change", () => {
  if (dateInput.value) {
    const d = new Date(dateInput.value + "T00:00:00");
    if (d.getUTCDay() === 5) {
      // Friday
      alert("Sorry, we are closed on Fridays. Please pick another date.");
      dateInput.value = "";
    }
  }
  populateSlots();
  updateSummary();
});

// manual refresh (optional)
refreshBtn?.addEventListener("click", () => {
  populateSlots();
  updateSummary();
});

// update summary on time change & any input
timeSelect?.addEventListener("change", updateSummary);
form?.addEventListener("input", updateSummary);

/* ---------- FORM SUBMISSION WITH API ---------- */
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) return;

  // Get submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn?.textContent || "Confirm Appointment";

  // Disable button to prevent double submission
  if (submitBtn) {
    submitBtn.textContent = "Booking...";
    submitBtn.disabled = true;
  }

  try {
    // Prepare form data
    const formData = {
      name: $('[name="name"]', form).value.trim(),
      email: $('[name="email"]', form).value.trim(),
      phone: $('[name="phone"]', form).value.trim(),
      date: dateInput.value,
      time: timeSelect.value,
      concerns: chosenConcerns(),
      notes: $("#notes", form).value.trim() || "",
    };

    console.log("📤 Submitting booking:", formData);

    // Check if API is available
    if (typeof API === "undefined" || !API.bookAppointment) {
      console.warn("⚠️ API not available, using fallback");
      throw new Error("API service not loaded. Please refresh the page.");
    }

    // Test backend connection first
    try {
      console.log("🏥 Testing backend connection...");
      const health = await API.checkHealth();
      console.log("✅ Backend health:", health);

      if (!health || health.status !== "OK") {
        throw new Error("Backend server is not responding properly.");
      }
    } catch (healthError) {
      console.error("❌ Backend check failed:", healthError);
      throw new Error(
        "Cannot connect to backend server. Please ensure:\n1. Node.js server is running (node server.js)\n2. Server is on http://localhost:3000"
      );
    }

    // Submit to API
    console.log("📤 Sending to API...");
    const response = await API.bookAppointment(formData);
    console.log("📥 API response:", response);

    if (response && response.success) {
      // Success message
      const concernsList = formData.concerns.join(", ") || "—";
      const msg = `✅ APPOINTMENT BOOKED SUCCESSFULLY!\n\n📅 Date: ${
        formData.date
      }\n⏰ Time: ${formData.time}\n👤 Name: ${formData.name}\n📱 Phone: ${
        formData.phone
      }\n📧 Email: ${
        formData.email
      }\n🎯 Concerns: ${concernsList}\n\nYour appointment ID: ${
        response.data?._id || "N/A"
      }\n\nWe'll confirm by email shortly.`;
      alert(msg);

      // Reset form
      form.reset();
      populateSlots();
      updateSummary();

      // Clear error
      if (errorBox) {
        errorBox.textContent = "";
      }
    } else {
      throw new Error(
        response?.error ||
          response?.message ||
          "Booking failed. Server returned an error."
      );
    }
  } catch (error) {
    console.error("❌ Booking error:", error);

    // Clear any previous errors
    if (errorBox) {
      errorBox.textContent = "";
    }

    // Determine the exact error
    let errorMsg = "";
    let showAlert = true;

    if (typeof API === "undefined") {
      errorMsg =
        "API service is not loaded. This might be because:\n\n" +
        "1. The api-service.js file is missing\n" +
        "2. There's a JavaScript error preventing it from loading\n" +
        "3. The file path is incorrect\n\n" +
        "Please check the browser console for errors (F12 → Console)";

      // Also show in form error box
      if (errorBox) {
        errorBox.textContent = "API service not loaded. Check console.";
      }
    } else if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      errorMsg =
        "Cannot connect to the server. Please ensure:\n\n" +
        "1. The backend server is running (open terminal and run: node server.js)\n" +
        "2. The server is on http://localhost:3000\n" +
        "3. Your browser is not blocking CORS requests\n\n" +
        "After starting the server, refresh this page.";
    } else if (error.message.includes("API service not loaded")) {
      errorMsg = error.message;
    } else {
      errorMsg = "Booking failed: " + error.message;
    }

    // Show alert with detailed message
    if (showAlert) {
      alert(
        `❌ ${errorMsg}\n\nFor immediate assistance, call: +92 305 7050399`
      );
    }
  } finally {
    // Re-enable button
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
});

/* ---------- Mobile nav toggle (header) ---------- */
(function mobileNav() {
  const btn = document.querySelector("[data-nav-toggle]");
  const panel = document.getElementById("mobile-menu");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const isOpen = !panel.classList.contains("hidden");
    panel.classList.toggle("hidden", isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
})();

/* ---------- Highlight today in footer hours ---------- */
(function markToday() {
  const rows = document.querySelectorAll("#hours [data-day]");
  if (!rows.length) return;
  const today = new Date().getDay(); // 0..6 local
  rows.forEach((row) => {
    if (Number(row.getAttribute("data-day")) === today) {
      row.querySelector("dt")?.classList.add("text-white", "font-semibold");
      row.querySelector("dd")?.classList.add("text-white");
    }
  });
})();

/* ---------- Quick concern button clicks ---------- */
(function initQuickButtons() {
  const quickBtns = $$(".quick-btn");
  quickBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const checkbox = btn.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        updateSummary();
      }
    });
  });
})();

// Initialize quick buttons on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initQuickButtons();
});
