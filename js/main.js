/* ==========================================================
   ORCHARD TABLE — shared site scripts (v2)
   No content-hiding logic. Everything is progressive.
   ========================================================== */

const OWNER_PHONE = "6366466599";
const OWNER_WA = "916366466599";
const OWNER_EMAIL = "farmtotable99@gmail.com";

/* ---------- Success toast ---------- */
let toastTimer;
function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------- Mobile nav ---------- */
function closeNav() {
  const links = document.querySelector(".nav-links");
  if (links) links.classList.remove("open");
  document.body.classList.remove("nav-open");
}
document.addEventListener("click", (e) => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  if (toggle.contains(e.target)) {
    links.classList.toggle("open");
    document.body.classList.toggle("nav-open", links.classList.contains("open"));
  } else if (e.target.closest(".nav-close")) {
    closeNav();
  } else if (links.classList.contains("open") && !links.contains(e.target)) {
    closeNav();
  }
});
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", closeNav);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

/* ---------- Menu filters (menu page) ---------- */
document.querySelectorAll(".menu-filter-bar").forEach((bar) => {
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".menu-filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".menu-filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".menu-cat").forEach((sec) => {
      const show = filter === "all" || sec.dataset.cat === filter;
      sec.style.display = show ? "" : "none";
    });
  });
});

/* ---------- Lightbox ---------- */
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(src) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const count = document.getElementById("lightbox-count");
  if (!lb || !img) return;
  const idx = lightboxImages.indexOf(src);
  lightboxIndex = idx === -1 ? 0 : idx;
  img.src = src;
  if (count && lightboxImages.length > 1) {
    count.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  }
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("open");
  document.body.style.overflow = "";
}

function shiftLightbox(dir) {
  if (lightboxImages.length <= 1) return;
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById("lightbox-img");
  const count = document.getElementById("lightbox-count");
  img.src = lightboxImages[lightboxIndex];
  if (count) count.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function bindGalleryClick() {
  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => {
      const group = el.dataset.lightbox;
      const items = Array.from(document.querySelectorAll(`[data-lightbox="${group}"]`))
        .filter((i) => i.offsetParent !== null);
      lightboxImages = items.map((i) => i.dataset.src || i.src);
      openLightbox(el.dataset.src || el.src);
    });
  });
}
bindGalleryClick();

/* Keyboard controls */
document.addEventListener("keydown", (e) => {
  const lb = document.getElementById("lightbox");
  if (!lb || !lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") shiftLightbox(1);
  if (e.key === "ArrowLeft") shiftLightbox(-1);
});

/* ---------- Gallery filters ---------- */
document.querySelectorAll(".filter-bar").forEach((bar) => {
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach((item) => {
      const show = filter === "all" || item.dataset.category === filter;
      item.style.display = show ? "block" : "none";
    });
  });
});

/* ---------- Reservation ---------- */
function buildReservationMessage() {
  const name = document.getElementById("name");
  const mobile = document.getElementById("mobile");
  if (!name || !name.value.trim() || !mobile || !mobile.value.trim()) {
    alert("Please fill in your name and mobile.");
    return null;
  }
  const g = (id) => (document.getElementById(id) || {}).value || "";
  return {
    name: name.value.trim(),
    mobile: mobile.value.trim(),
    date: g("resDate"),
    time: g("resTime"),
    guests: g("guests") || "1-2 People",
  };
}

function sendViaWhatsApp() {
  const r = buildReservationMessage();
  if (!r) return;
  const text = encodeURIComponent(
    `*New Reservation Request*\n*Name:* ${r.name}\n*Mobile:* ${r.mobile}\n*Date:* ${r.date}\n*Time:* ${r.time}\n*Guests:* ${r.guests}`
  );
  window.open(`https://wa.me/${OWNER_WA}?text=${text}`, "_blank");
  showToast("Opening WhatsApp with your reservation details...");
}

function sendViaEmail() {
  const r = buildReservationMessage();
  if (!r) return;
  const body = encodeURIComponent(
    `Name: ${r.name}\nMobile: ${r.mobile}\nDate: ${r.date}\nTime: ${r.time}\nGuests: ${r.guests}`
  );
  window.location.href = `mailto:${OWNER_EMAIL}?subject=New Reservation&body=${body}`;
  showToast("Opening your email app with reservation details...");
}

/* ---------- Bakery order ---------- */
function sendBakeryWhatsApp() {
  const order = document.getElementById("bakeryOrder");
  if (!order || !order.value.trim()) {
    alert("Please type your order or inquiry first.");
    return;
  }
  const text = encodeURIComponent(`*Healthy Bakery Order/Inquiry*\n${order.value.trim()}`);
  window.open(`https://wa.me/${OWNER_WA}?text=${text}`, "_blank");
  showToast("Opening WhatsApp with your order...");
}

/* ---------- Contact form ---------- */
function buildContactMessage() {
  const name = document.getElementById("cName");
  const msg = document.getElementById("cMsg");
  if (!name || !name.value.trim() || !msg || !msg.value.trim()) {
    alert("Please fill in your name and message.");
    return null;
  }
  const g = (id) => (document.getElementById(id) || {}).value || "";
  return {
    name: name.value.trim(),
    mobile: g("cMobile"),
    email: g("cEmail"),
    msg: msg.value.trim(),
  };
}

function sendContactWhatsApp() {
  const c = buildContactMessage();
  if (!c) return;
  const text = encodeURIComponent(
    `*Contact Inquiry*\n*Name:* ${c.name}\n*Mobile:* ${c.mobile}\n*Email:* ${c.email}\n*Message:* ${c.msg}`
  );
  window.open(`https://wa.me/${OWNER_WA}?text=${text}`, "_blank");
  showToast("Opening WhatsApp with your message...");
}

function sendContactEmail() {
  const c = buildContactMessage();
  if (!c) return;
  const body = encodeURIComponent(
    `Name: ${c.name}\nMobile: ${c.mobile}\nEmail: ${c.email}\n\n${c.msg}`
  );
  window.location.href = `mailto:${OWNER_EMAIL}?subject=Contact Inquiry from ${c.name}&body=${body}`;
  showToast("Opening your email app with your message...");
}

/* ---------- Init date field ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const d = document.getElementById("resDate");
  if (!d) return;
  const now = new Date();
  const localToday =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  d.value = localToday;
  d.min = localToday;
});

/* ---------- Book a Class modal ---------- */
function openClassModal() {
  const modal = document.getElementById("class-modal");
  if (!modal) return;
  const form = document.getElementById("class-form");
  const success = document.getElementById("class-success");
  if (form) form.hidden = false;
  if (success) success.hidden = true;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const name = document.getElementById("cb-name");
  if (name) setTimeout(() => name.focus(), 100);
}

function closeClassModal() {
  const modal = document.getElementById("class-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function submitClassBooking(e) {
  e.preventDefault();
  const name = document.getElementById("cb-name");
  const mobile = document.getElementById("cb-mobile");
  const email = document.getElementById("cb-email");
  if (!name || !name.value.trim()) {
    alert("Please enter your name.");
    name.focus();
    return;
  }
  const digits = mobile.value.replace(/[^\d]/g, "");
  if (digits.length < 10) {
    alert("Please enter a valid 10-digit mobile number.");
    mobile.focus();
    return;
  }
  const emailVal = email.value.trim();
  if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    alert("Please enter a valid email or leave it blank.");
    email.focus();
    return;
  }
  const lines = [
    "*New Cooking Class Booking*",
    `*Name:* ${name.value.trim()}`,
    `*Mobile:* ${mobile.value.trim()}`,
  ];
  if (emailVal) lines.push(`*Email:* ${emailVal}`);
  const text = encodeURIComponent(lines.join("\n"));
  window.location.href = `https://wa.me/${OWNER_WA}?text=${text}`;
  const form = document.getElementById("class-form");
  const success = document.getElementById("class-success");
  if (form) form.hidden = true;
  if (success) success.hidden = false;
  showToast("Opening WhatsApp with your booking details...");
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById("class-modal");
  if (!modal || !modal.classList.contains("open")) return;
  if (e.target === modal) closeClassModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeClassModal();
});