# ⚡ Makwell JavaScript Guide

This folder contains all JavaScript files for the Makwell website.  
Each major page has its own script, plus one **global theme toggle**.

---

## ✅ Files Included

### 1. Global
- **theme.js**  
  Handles **light/dark theme toggle**.  
  - Reads saved preference from `localStorage`.  
  - Toggles `[data-theme="light"]` / `[data-theme="dark"]`.  
  - Updates immediately on button click (`[data-theme-toggle]`).  

---

### 2. Page-Specific

- **index.js**  
  Homepage interactions (hero section, highlights).  
  _(Currently empty placeholder — extend if needed.)_

- **products.js**  
  Loads the full product catalog from `data/products.json`.  
  - Generates product cards (title, category, series).  
  - Links each card to `product.html?id=...`.  
  - Handles missing images with `assets/no-image.svg`.  

- **product.js**  
  Loads details for a **single product page (PDP)**.  
  - Reads `id` from URL query string.  
  - Fetches product info from `products.json`.  
  - Renders product specs, tags, and breadcrumbs.  
  - Injects **structured data (JSON-LD)** for SEO.  

- **shop.js**  
  Shop page interactions (buckets: Best Sellers, On Sale, Featured).  
  _(Currently placeholder for future e-commerce integration.)_

- **about.js**  
  About page interactions.  
  _(Placeholder — extend with animations or counters.)_

- **contact.js**  
  Contact form interactions.  
  _(Placeholder — extend to handle Google Sheets or API form submission.)_

- **login.js**  
  Login page scripts.  
  _(Currently static form; extend for authentication backend.)_

- **register.js**  
  Product registration & service request form.  
  - Placeholder hook for connecting with **Google Sheets Apps Script** or **WhatsApp API**.  
  - Extend here to submit form data.

---

## 🛠 How to Use
1. Every HTML page loads:
   - `js/theme.js` (always global)  
   - Its **own page-specific JS file**  

   Example (`products.html`):
   ```html
   <script src="js/theme.js"></script>
   <script src="js/products.js"></script>
