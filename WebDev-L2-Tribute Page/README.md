# Dr. A.P.J. Abdul Kalam · Tribute Page

> *"The Missile Man of India Who Ignited a Nation's Dreams and Empowered Millions of Young Minds."*

A visually engaging, modern, and fully responsive tribute page dedicated to **Dr. Avul Pakir Jainulabdeen Abdul Kalam** (1931–2015)—renowned aerospace scientist, pioneer of India's indigenous space launch vehicle and guided missile systems, and the 11th President of India, fondly remembered as *"The People's President"*.

---

## Feature Checklist & Requirement Mapping

| Feature Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Page title with subject's name and one-line tagline** | Completed | Header `<h1 id="title">` with "Dr. A.P.J. Abdul Kalam" and prominent tagline `<p class="hero-tagline">`. Document `<title>` tag matches. |
| **Prominent royalty-free image** | Completed | High-res portrait stored locally at `images/kalam-portrait.jpg` with graceful fallback to Wikimedia Commons. Styled inside `#img-div` with caption in `#img-caption`. |
| **Biography / tribute section (at least 3–4 original paragraphs)** | Completed | 4 comprehensive, original written paragraphs covering: (1) Early Life & Resilience in Rameswaram, (2) Space & Defense Architecture (SLV-III & IGMDP), (3) The People's Presidency, and (4) His Pedagogical Legacy & Final Farewell. |
| **Timeline or key achievements section** | Completed | Both a 6-card "Pillars of Impact" grid and an interactive chronological timeline with filter tabs (*Early Life*, *Space & Defense*, *Presidency*, *Legacy*). |
| **Quote block styled distinctly** | Completed | Distinct section `#quotes` featuring large decorative quotation glyphs, glowing backdrop, and an interactive 5-quote carousel with dot indicators and next/previous controls. |
| **At least 2 different background colours used** | Completed | Multiple distinct section color zones: Hero (Midnight Navy), Biography (Warm Crisp Light), Achievements (Tinted Slate), Quotes (Electric Jewel Gradient), and Footer (Obsidian Dark). |
| **At least 2 font styles explored** | Completed | Headings & Display: `Cinzel` / `Playfair Display` (Serif). Body & UI: `Plus Jakarta Sans` / `Inter` (Sans-Serif). Quotes: `Cormorant Garamond` (Italic Serif). |
| **Responsive layout** | Completed | Fluid layout utilizing CSS Grid, Flexbox, `clamp()` fluid typography, responsive image rules (`max-width: 100%`, `height: auto`), and breakpoints for mobile (<480px), tablet (<768px), and desktop. |
| **freeCodeCamp Structural Conventions** | Completed | Includes `#main`, `#title`, `#img-div`, `#image`, `#img-caption`, `#tribute-info`, and `#tribute-link` with `target="_blank"`. |

---

## Interactive Enhancements

- **Dark / Light Mode Toggle**: Seamless theme switcher using CSS custom properties with automatic system preference detection and `localStorage` persistence.
- **Reading Scroll Progress**: Dynamic progress bar anchored at the top of the viewport.
- **Active Navigation Highlighting**: Uses `IntersectionObserver` to highlight the current section in the sticky glassmorphic navbar.
- **Interactive Quote Carousel**: Auto-rotates through 5 iconic quotes with pause-on-hover, navigation arrows, and dot indicators.
- **Milestone Category Filter**: Filter timeline milestones by era with smooth CSS fade transitions.
- **Print Stylesheet**: Dedicated `@media print` rules for clean, distraction-free document printing.

---

## Sources & Image Credits

1. **Biographical Research**:
   - [Wikipedia: A. P. J. Abdul Kalam](https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam)
   - [Encyclopædia Britannica: A.P.J. Abdul Kalam](https://www.britannica.com/biography/A-P-J-Abdul-Kalam)
2. **Royalty-Free Imagery**:
   - [Wikimedia Commons Portrait of Dr. Kalam](https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam.jpg) — Public Domain / Government of India Open Data Archive.

---

## How to View

Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari):

```bash
# On Windows PowerShell:
Start-Process "C:\Users\kalya\.gemini\antigravity\scratch\tribute-page\index.html"
```
