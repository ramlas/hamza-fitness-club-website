<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pricing | Hamza Fitness Club</title>
  <meta name="description" content="Explore Hamza Fitness Club membership plans — affordable pricing for premium fitness, wellness, and personal training." />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>

  <!-- Tailwind (CDN) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Global theme/styles -->
  <link rel="stylesheet" href="assets/hfc.css" />
</head>

<body class="min-h-full bg-[color:var(--brand-dark)] text-white pt-16">

<!-- components/header.html -->
<header id="header" class="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
    <!-- Brand -->
    <a href="/index.html#hero-index" class="flex items-center gap-3">
      <img src="/images/hfc-logo.jpg" alt="Hamza Fitness Club Logo" class="w-10 h-10 object-contain rounded-md" />
      <span class="font-extrabold text-white tracking-wider uppercase">Hamza Fitness Club</span>
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:block" aria-label="Primary">
      <ul class="flex items-center gap-8 uppercase tracking-wide text-sm font-bold">
        <li>
          <a href="/index.html#hero-index" class="hover:text-[color:var(--brand-red)] transition">Home</a>
        </li>
        <li>
          <a href="/aboutus.html" class="hover:text-[color:var(--brand-red)] transition">About Us</a>
        </li>

        <!-- CLASSES dropdown -->
        <li class="relative group">
          <button class="flex items-center gap-2 hover:text-[color:var(--brand-red)] uppercase"
                  aria-haspopup="true" aria-expanded="false" aria-controls="menu-classes">
            CLASSES <span class="text-lg leading-none">▾</span>
          </button>

          <div id="menu-classes" data-menu
               class="absolute left-0 mt-4 bg-neutral-900 border border-white/10 w-52 shadow-lg
                      invisible opacity-0 translate-y-1 transition duration-250 ease-out
                      group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
            <a href="/classes.html"  class="block px-4 py-3 hover:bg-[color:var(--brand-red)] hover:text-white">Detail Class</a>
            <a href="/pricing.html" class="block px-4 py-3 hover:bg-[color:var(--brand-red)] hover:text-white">Pricing Plan</a>
          </div>
        </li>

        <li>
          <a href="/pricing.html#footer" class="hover:text-[color:var(--brand-red)] transition">Contact Us</a>
        </li>

        <!-- TRAINERS (direct link) -->
        <li>
          <a href="/trainers.html" class="hover:text-[color:var(--brand-red)] transition">Trainers</a>
        </li>
      </ul>
    </nav>

    <!-- Mobile Menu Button -->
    <button data-nav-toggle class="md:hidden p-2 text-xl leading-none text-white" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">☰</button>

    <!-- CTA -->
    <a href="booking.html" class="hidden md:inline-flex btn-red px-5 py-2 text-sm uppercase font-extrabold">
      Book Free Appointment
    </a>
  </div>

  <!-- Mobile Menu -->
  <div id="mobile-menu" data-nav-panel class="md:hidden hidden border-t border-white/10 bg-neutral-900">
    <ul class="px-6 py-3 space-y-2 uppercase tracking-wide text-sm">
      <li><a href="/index.html#hero-index" class="block py-2">Home</a></li>
      <li><a href="/aboutus.html"        class="block py-2">About Us</a></li>
      <li><a href="/classes.html"          class="block py-2">Classes</a></li>
      <li><a href="/pricing.html#footer"    class="block py-2">Contact Us</a></li>
      <li><a href="/trainers.html"         class="block py-2">Trainers</a></li>
      <li><a href="/booking.html"    class="inline-flex btn-red px-5 py-2 text-sm uppercase">Book Free Appointment</a></li>
    </ul>
  </div>
</header>

<!-- Header interactivity -->
<script src="assets/header.js" defer></script>

  <!-- ================= HERO ================= -->
  <section class="relative h-[52vh] md:h-[64vh] flex items-center">
    <img src="images/hero-pricing.jpg" alt="Gym hero at Hamza Fitness Club" class="absolute inset-0 w-full h-full object-cover opacity-75" loading="lazy">
    <div class="absolute inset-0 bg-black/55" aria-hidden="true"></div>

    <div class="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 w-full">
      <div class="glass rounded-xl p-8 md:p-12 anim-slideIn">
        <p class="uppercase tracking-[0.25em] text-[color:var(--accent)] font-extrabold text-sm md:text-base mb-3">Pricing Plan</p>
        <h1 class="text-4xl md:text-6xl font-extrabold leading-[1.05] mb-4">Affordable Membership Plans</h1>
        <p class="hero-text-body">Transparent pricing with access to coaching, recovery tools, and classes — no surprises.</p>
      </div>
    </div>
  </section>

  <!-- =========== CHOOSE PACKAGE =========== -->
  <section class="section-pad bg-[color:var(--smoke)]">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-3 gap-10 items-center">
      <div class="lg:col-span-1 reveal fade-up">
        <p class="uppercase tracking-[0.25em] text-[color:var(--accent)] font-extrabold mb-3">Choose Package</p>
        <h2 class="text-3xl md:text-5xl font-extrabold leading-tight">Transparent Pricing for Premium Fitness & Training Access</h2>
      </div>

      <div class="lg:col-span-1 reveal zoom-in">
        <img src="images/package-photo.jpg" alt="Personal training session" class="rounded-xl w-full object-cover" loading="lazy">
      </div>

      <div class="lg:col-span-1 reveal slide-right">
        <p class="text-gray-300 mb-6">Tellus sapien viverra ullamcorper rutrum venenatis tristique vulputate. Metus nostra eleifend justo consequat vel quisque.</p>
        <ul class="space-y-4 text-gray-200">
          <li class="flex gap-3 items-start"><span class="mt-1 w-3 h-3 rounded-full bg-[color:var(--accent)]"></span> Expert Trainers & Personalized Coaching</li>
          <li class="flex gap-3 items-start"><span class="mt-1 w-3 h-3 rounded-full bg-[color:var(--accent)]"></span> Comprehensive Wellness Approach</li>
          <li class="flex gap-3 items-start"><span class="mt-1 w-3 h-3 rounded-full bg-[color:var(--accent)]"></span> Group Classes & Special Programs</li>
          <li class="flex gap-3 items-start"><span class="mt-1 w-3 h-3 rounded-full bg-[color:var(--accent)]"></span> Proven Results & Member Success Stories</li>
          <li class="flex gap-3 items-start"><span class="mt-1 w-3 h-3 rounded-full bg-[color:var(--accent)]"></span> Supportive Fitness Community</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- =========== PRICING TOGGLE + CARDS =========== -->
  <section id="plans" class="py-16 bg-[#0e0f10]" data-billing="monthly">
    <div class="max-w-7xl mx-auto px-6 lg:px-10">
      <!-- Toggle -->
      <div class="flex items-center justify-center mb-10">
        <label for="billing" class="toggle flex items-center gap-4 text-sm text-gray-300 select-none">
          <span>Monthly</span>
          <input type="checkbox" id="billing" class="peer sr-only" aria-label="Toggle yearly billing"/>
          <div class="track w-12 h-7 bg-white/10 border border-white/10">
            <span class="dot top-0.5 left-0.5 w-6 h-6 bg-[color:var(--accent)]"></span>
          </div>
          <span>Yearly <span class="ml-1 text-[color:var(--accent)] font-bold">– Save 20%</span></span>
        </label>
      </div>

      <!-- Cards -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- BASIC -->
        <article class="pricing-card reveal fade-up">
          <div class="p-6 border-b border-white/10 bg-black/25">
            <p class="uppercase tracking-widest text-sm text-gray-300">Basic Plan</p>
            <div class="mt-2">
              <div class="price-mo text-5xl font-extrabold" data-price-mo>$49</div>
              <div class="price-yr text-5xl font-extrabold" data-price-yr>$39</div>
              <p class="text-gray-400 text-sm mt-1">per month</p>
            </div>
          </div>
          <ul class="p-6 space-y-4 text-gray-300">
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Standard Gym Equipment</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Locker Room & Showers</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Fitness App Access</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Open Gym (All Day)</li>
          </ul>
          <div class="p-6 border-t border-white/10">
            <a href="#" class="btn-red w-full text-center uppercase font-extrabold tracking-wide">Get Started</a>
          </div>
        </article>

        <!-- PREMIUM (featured) -->
        <article class="pricing-card relative border-2 border-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/30 reveal fade-up delay-100">
          <div class="absolute -top-3 left-6 px-3 py-1 bg-[color:var(--accent)] text-black font-extrabold uppercase text-xs rounded">Most Popular</div>
          <div class="p-6 border-b border-white/10 bg-black/25">
            <p class="uppercase tracking-widest text-sm text-gray-300">Premium Plan</p>
            <div class="mt-2">
              <div class="price-mo text-5xl font-extrabold" data-price-mo>$99</div>
              <div class="price-yr text-5xl font-extrabold" data-price-yr>$79</div>
              <p class="text-gray-400 text-sm mt-1">per month</p>
            </div>
          </div>
          <ul class="p-6 space-y-4 text-gray-300">
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Everything in Basic</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> 4 PT Sessions / Month</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Mobility & Recovery Tools</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Small Group Classes</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Body Composition Scan</li>
          </ul>
          <div class="p-6 border-t border-white/10">
            <a href="#" class="btn-red w-full text-center uppercase font-extrabold tracking-wide">Join Premium</a>
          </div>
        </article>

        <!-- EXPERT -->
        <article class="pricing-card reveal fade-up delay-200">
          <div class="p-6 border-b border-white/10 bg-black/25">
            <p class="uppercase tracking-widest text-sm text-gray-300">Expert Plan</p>
            <div class="mt-2">
              <div class="price-mo text-5xl font-extrabold" data-price-mo>$199</div>
              <div class="price-yr text-5xl font-extrabold" data-price-yr>$159</div>
              <p class="text-gray-400 text-sm mt-1">per month</p>
            </div>
          </div>
          <ul class="p-6 space-y-4 text-gray-300">
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Unlimited PT Sessions</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Custom Nutrition Plan</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Priority Booking & Support</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Athlete Recovery Suite</li>
            <li class="flex gap-3"><span class="w-3 h-3 rounded-full bg-[color:var(--accent)] mt-2"></span> Quarterly Lab Testing</li>
          </ul>
          <div class="p-6 border-t border-white/10">
            <a href="#" class="btn-red w-full text-center uppercase font-extrabold tracking-wide">Go Expert</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ================= STATS BAND ================= -->
  <section class="py-10 bg-[color:var(--smoke)]">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal fade-up">
        <div class="text-4xl md:text-5xl font-extrabold">91K+</div>
        <p class="text-gray-400 mt-1">Project Done</p>
      </div>
      <div class="reveal fade-up delay-100">
        <div class="text-4xl md:text-5xl font-extrabold">84K+</div>
        <p class="text-gray-400 mt-1">Happy Clients</p>
      </div>
      <div class="reveal fade-up delay-200">
        <div class="text-4xl md:text-5xl font-extrabold">42+</div>
        <p class="text-gray-400 mt-1">Company Support</p>
      </div>
      <div class="reveal fade-up delay-300">
        <div class="text-4xl md:text-5xl font-extrabold">4.7</div>
        <p class="text-gray-400 mt-1">Client Reviews</p>
      </div>
    </div>
  </section>

  <!-- ================= FAQ ================= -->
  <section id="faq" class="py-16 bg-[#101113]">
    <div class="max-w-5xl mx-auto px-6 lg:px-10">
      <p class="uppercase tracking-[0.25em] text-[color:var(--accent)] font-extrabold text-center mb-2">Common Questions</p>
      <h3 class="text-center text-3xl md:text-5xl font-extrabold mb-10">Got Questions? Find Answers Here</h3>

      <div class="space-y-4">
        <details class="group pricing-card reveal fade-up">
          <summary class="cursor-pointer list-none p-5 flex items-center justify-between">
            <span class="font-bold text-lg">Can I pause my membership?</span>
            <span class="transition group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <div class="px-5 pb-5 text-gray-300 border-t border-white/10">
            Yes — you can pause up to 2 months per year with no extra fees.
          </div>
        </details>

        <details class="group pricing-card reveal fade-up delay-100">
          <summary class="cursor-pointer list-none p-5 flex items-center justify-between">
            <span class="font-bold text-lg">Do plans include group classes?</span>
            <span class="transition group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <div class="px-5 pb-5 text-gray-300 border-t border-white/10">
            Premium and Expert include unlimited classes. Basic members can buy class packs anytime.
          </div>
        </details>

        <details class="group pricing-card reveal fade-up delay-200">
          <summary class="cursor-pointer list-none p-5 flex items-center justify-between">
            <span class="font-bold text-lg">Is there a joining fee?</span>
            <span class="transition group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <div class="px-5 pb-5 text-gray-300 border-t border-white/10">
            There’s no joining fee during promotional periods; otherwise a small setup fee may apply.
          </div>
        </details>
      </div>
    </div>
  </section>

  <footer id="footer" class="bg-[color:var(--brand-dark)] border-t border-white/10 text-gray-300">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-12">
  
      <!-- Brand + Newsletter -->
      <section class="md:col-span-5">
        <div class="flex items-center gap-3 mb-4">
          <img src="images/hfc-logo.jpg" alt="Hamza Fitness Club Logo" class="w-10 h-10 object-contain rounded-md" />
          <h2 class="text-2xl font-extrabold text-white tracking-wider uppercase">Hamza Fitness Club</h2>
        </div>
        <p class="mb-5 text-gray-400 leading-relaxed">
          Hamza Fitness Club is your destination for strength, dedication, and transformation.
          Join our community today!
        </p>
  
        <form id="newsletter-form" class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-3" novalidate>
          <label for="newsletter-email" class="sr-only">Email</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            class="px-3 py-2 rounded-md bg-neutral-800 border border-white/10 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]"
          />
          <button
            type="submit"
            class="btn-red px-5 py-2 text-sm uppercase font-extrabold rounded-md justify-self-start sm:justify-self-auto"
          >
            Sign Up
          </button>
          <!-- Inline feedback (toggle via JS if you want) -->
          <p id="newsletter-msg" class="col-span-full text-[13px] text-gray-400"></p>
        </form>
      </section>
  
      <!-- Our Studio -->
      <nav class="md:col-span-2">
        <h3 class="text-white font-semibold tracking-wide uppercase text-sm mb-3 border-b-2 border-[color:var(--brand-red)] inline-block pb-1">
          Our Studio
        </h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/aboutus.html"          class="hover:text-[color:var(--brand-red)] transition">About Us</a></li>
          <li><a href="trainers.html" class="hover:text-[color:var(--brand-red)] transition">Trainers</a></li>
          <li><a href="classes.html"  class="hover:text-[color:var(--brand-red)] transition">Classes</a></li>
          <li><a href="pricing.html"  class="hover:text-[color:var(--brand-red)] transition">Pricing</a></li>
        </ul>
      </nav>
  
      <!-- Support -->
      <nav class="md:col-span-2">
        <h3 class="text-white font-semibold tracking-wide uppercase text-sm mb-3 border-b-2 border-[color:var(--brand-red)] inline-block pb-1">
          Support
        </h3>
        <ul class="space-y-2 text-sm">
          <li><a href="/booking.html" class="hover:text-[color:var(--brand-red)] transition">Book Free Appointment</a></li>
        </ul>
      </nav>
  
      <!-- Contact + Hours -->
      <section id="contact" class="md:col-span-3">
        <h3 class="text-white font-semibold tracking-wide uppercase text-sm mb-3 border-b-2 border-[color:var(--brand-red)] inline-block pb-1">
          Get in Touch
        </h3>
  
        <address class="not-italic space-y-3 text-sm">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-white/80 shrink-0" aria-hidden="true">
              <use href="assets/icons.svg#icon-map-pin"></use>
            </svg>
            <a
              href="https://maps.google.com/?q=Chowk,+Khatam-e-Nabuwat+Plaza,+Millat+Rd,+Green+Town,+Faisalabad,+38000,+Pakistan"
              target="_blank" rel="noopener"
              class="hover:text-[color:var(--brand-red)] transition"
            >
              Chowk, Khatam-e-Nabuwat Plaza, Millat Rd, Green Town, Faisalabad, 38000, Pakistan
            </a>
          </div>
  
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-white/80 shrink-0" aria-hidden="true">
              <use href="assets/icons.svg#icon-mail"></use>
            </svg>
            <a href="mailto:support@hamzafitnessclub.com" class="underline hover:text-[color:var(--brand-red)]">
              support@hamzafitnessclub.com
            </a>
          </div>
  
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-white/80 shrink-0" aria-hidden="true">
              <use href="assets/icons.svg#icon-phone"></use>
            </svg>
            <a href="tel:+923057050399" class="hover:text-[color:var(--brand-red)]">+92 305 7050399</a>
          </div>
        </address>
  
        <!-- Socials -->
        <ul class="flex items-center gap-3 mt-5">
          <li>
            <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-neutral-900 hover:bg-neutral-800 transition" aria-label="Facebook">
              <svg class="w-5 h-5" aria-hidden="true"><use href="assets/icons.svg#icon-facebook"></use></svg>
            </a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-neutral-900 hover:bg-neutral-800 transition" aria-label="Instagram">
              <svg class="w-5 h-5" aria-hidden="true"><use href="assets/icons.svg#icon-instagram"></use></svg>
            </a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-neutral-900 hover:bg-neutral-800 transition" aria-label="X (Twitter)">
              <svg class="w-5 h-5" aria-hidden="true"><use href="assets/icons.svg#icon-x"></use></svg>
            </a>
          </li>
          <li>
            <a href="#" class="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/10 bg-neutral-900 hover:bg-neutral-800 transition" aria-label="YouTube">
              <svg class="w-5 h-5" aria-hidden="true"><use href="assets/icons.svg#icon-youtube"></use></svg>
            </a>
          </li>
        </ul>
  
        <!-- Hours -->
        <div class="mt-6">
          <h4 class="font-semibold text-white mb-3 border-b border-white/10 pb-1">Hours</h4>
          <dl id="hours" class="space-y-1 text-sm leading-relaxed">
            <div class="flex justify-between items-start gap-4">
              <dt class="font-semibold text-white">Monday – Saturday</dt>
              <dd class="text-gray-300 text-right">6:15–9:15 am<br class="sm:hidden"/>4:15–10:45 pm</dd>
            </div>
        
            <div class="flex justify-between items-start gap-4">
              <dt class="font-semibold text-white">Sunday</dt>
              <dd class="text-gray-300 text-right">6:15–9:15 am<br class="sm:hidden"/>4:15–10:45 pm</dd>
            </div>
        
            <div class="flex justify-between items-start gap-4">
              <dt class="font-semibold text-white">Friday</dt>
              <dd class="text-gray-500 italic text-right">Closed</dd>
            </div>
          </dl>
        </div>
        
        
      </section>
    </div>
  
    <div class="border-t border-white/10 text-center text-sm text-gray-400 py-6">
      © 2025 <span class="text-white font-semibold">Hamza Fitness Club</span>.
      All rights reserved. Designed by
      <span class="text-[color:var(--brand-red)] font-bold">Ramla & Pakeeza</span>.
    </div>
  </footer>
  
  <script src="assets/footer.js" defer></script>
  

  <!-- Scripts -->
  <script src="assets/hfc.js" defer></script>
  <script src="assets/pricing.js" defer></script>
</body>
</html>
