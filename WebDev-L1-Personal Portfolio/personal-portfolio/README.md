# Personal Portfolio Website (Digital Résumé)

A modern, responsive personal portfolio website crafted with **HTML5**, **CSS3**, and **vanilla JavaScript**. Features a sleek developer aesthetic, dark/light theme switching, smooth scrolling navigation, project showcases, a technical skills grid, and an interactive contact form.

---

## 🌟 Features & Checklist

- [x] **Profile / Hero Section**:
  - Name, role title (*"Full-Stack Developer & UI/UX Enthusiast"*), and availability badge (`🟢 Available for New Projects & Roles`).
  - Professional avatar illustration placeholder with animated glow ring and floating micro-badges.
  - Call-to-action buttons (*View Projects*, *Get in Touch*, and *Résumé*).
  - Quick-connect social icons (GitHub, LinkedIn, Twitter/X, Email).
- [x] **About Me Section**:
  - 2–3 polished sentences covering professional background, technical values, and interests.
  - 3 highlight metric cards (*3+ Years Experience*, *20+ Projects Completed*, *100% Responsive Quality*).
  - Core interest & expertise pills (*Component-Driven UI*, *WCAG 2.1 Accessible*, *Core Web Vitals*).
- [x] **Skills Section**:
  - Visual grid organized into 3 clear categories:
    1. **Frontend Engineering**: HTML5 / Semantics, CSS3 / Flexbox & Grid, JavaScript (ES6+), TypeScript, React & Hooks, Responsive Design.
    2. **Backend & APIs**: Node.js, Express.js, RESTful Services, PostgreSQL & SQLite, OAuth & JWT, Python Basics.
    3. **Workflow & Design**: Git & GitHub, VS Code / DevTools, Figma Prototyping, Web Performance, Bash & CLI, ARIA & Screen Readers.
  - Proficiency indicators (*Advanced*, *Proficient*, *Familiar*).
- [x] **Projects Section**:
  - 3 rich project cards (exceeding the 2-card minimum):
    1. **DevFlow** — Agile Kanban Collaboration Platform (React, Node.js, WebSockets, PostgreSQL).
    2. **PulseMetrics** — SaaS Analytics Suite (TypeScript, Chart.js, Tailwind CSS, REST API).
    3. **OmniShop** — Headless E-Commerce Store (HTML5/CSS3, Vanilla JS, Stripe API, LocalStorage).
  - Each card includes a stylized mockup browser banner, tech stack tags, problem/solution description, GitHub repository link, and live demo link.
- [x] **Contact Section**:
  - Direct contact cards (Email with one-click copy button, location, and response time badge).
  - Interactive Contact Form with real-time validation and animated submission feedback.
  - Social profile links (GitHub, LinkedIn, Twitter/X).
- [x] **Smooth Scroll Navigation**:
  - Sticky glassmorphic navbar (`backdrop-filter: blur(16px)`).
  - Active section scroll-spy indicator.
  - Collapsible mobile hamburger drawer menu.
  - Floating back-to-top button.
- [x] **Consistent Branding & Typography**:
  - Google Fonts (`Plus Jakarta Sans` for body copy, `Outfit` for headings, `Fira Code` for badges).
  - High-contrast color palette, subtle gradients, and glassmorphism.
  - Dark & Light mode toggle with user preference stored in `localStorage`.
- [x] **Fully Responsive**:
  - Optimized across desktop, tablet, and mobile devices down to 320px screen width.

---

## 📁 File Structure

```
personal-portfolio/
├── index.html              # Main HTML5 semantic structure
├── css/
│   └── style.css           # Modern CSS3 styling, design system, themes, and responsiveness
├── js/
│   └── main.js             # Theme switcher, scroll spy, mobile drawer, form validation
├── assets/
│   └── images/
│       └── avatar.svg      # Modern developer avatar placeholder
└── README.md               # Documentation and customization guide
```

---

## 🚀 How to View the Website

You can open the portfolio in any modern browser:

### Option A: Open directly in your browser
Double-click `index.html` or right-click `index.html` -> **Open with** -> **Google Chrome** (or Edge, Firefox, Brave, Safari).

### Option B: Local Server (Optional)
If you have any local HTTP server (like VS Code Live Server or Python):
```bash
# In your terminal inside this folder:
python -m http.server 8000
# Then visit http://localhost:8000
```

---

## ✏️ How to Customize with Your Own Information

All sections in `index.html` contain clear `<!-- CUSTOMIZE: ... -->` comments:

1. **Your Name & Role**:
   - In `index.html`, search for `Alex Rivera` and replace with your name.
   - Edit the `<title>` tag and `<p class="hero-subtitle">` with your desired title (e.g. *Frontend Engineer*).
2. **Profile Photo**:
   - Replace `assets/images/avatar.svg` or place your photo in `assets/images/` and change `src="assets/images/avatar.svg"` to `src="assets/images/your-photo.jpg"`.
3. **About Me**:
   - Update the `<p class="about-lead">` and `<p class="about-body">` text with your personal background and current interests.
4. **Skills**:
   - Add, edit, or remove `<div class="skill-item">` blocks in the `skills-pill-grid` to match your exact tech stack.
5. **Projects**:
   - Update the project titles, descriptions, tech tags, and the `href` attributes for your GitHub repositories and live deployments.
6. **Contact Info & Social Media**:
   - Replace `alex.rivera@example.com` with your email.
   - Update GitHub, LinkedIn, and Twitter profile URLs with your real links.
7. **Résumé**:
   - Drop your resume PDF into the folder (e.g. `assets/resume.pdf`) and change the `href` of `#resume-download-btn` in `index.html` to point to `assets/resume.pdf`.
