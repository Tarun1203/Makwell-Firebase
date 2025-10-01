# 🎨 Makwell CSS Guide

This folder contains all CSS stylesheets for the Makwell website.  
Each major page has its own stylesheet, plus one **shared global file**.

---

## ✅ Files Included

### 1. Global
- **shared.css**  
  Core design system and variables.  
  - Color themes (light & dark)  
  - Typography, buttons, cards, grid layout  
  - Header, footer, containers  
  - Form styles  

⚠️ Always load this before any page-specific CSS.

---

### 2. Page-Specific

- **index.css**  
  Homepage custom styles (hero section, highlights).

- **products.css**  
  Product catalog grid, product cards, thumbnails.

- **product.css**  
  Single product page (PDP).  
  - Layout for image + specs  
  - Breadcrumb navigation  

- **shop.css**  
  Shop online landing (buckets for Best Sellers, On Sale, Featured).

- **about.css**  
  About page layout (two-column key visuals, mission/vision blocks).

- **contact.css**  
  Contact & feedback form layouts.  
  - WhatsApp/Email blocks  
  - Two-column responsive grid  

- **login.css**  
  Login form (centered card, inputs, buttons).

- **register.css**  
  Product registration / service request form.  
  - Wider form layout with multiple rows  
  - Optimized for Google Sheets / API submission  

---

## 🛠 How to Use
1. Every HTML page imports `css/shared.css` + its own page CSS.  
   Example (`index.html`):
   ```html
   <link rel="stylesheet" href="css/shared.css"/>
   <link rel="stylesheet" href="css/index.css"/>
