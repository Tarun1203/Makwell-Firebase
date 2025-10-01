# 📂 Makwell Assets

This folder contains all static files used by the Makwell site:
logos, banners, product images, and fallback placeholders.

---

## ✅ Files Included

- **logo.svg**  
  Primary Makwell logo (SVG). Used in the header navigation.

- **banner.svg**  
  Hero banner shown on the homepage.

- **no-image.svg**  
  Fallback placeholder if a product image is missing.

---

## 📺 Product Images

These JPG filenames **must match the entries in `data/products.json`**:

- `MK24.jpg` → 24" LED TV (Normal)  
- `MK32S.jpg` → 32" Smart LED TV  
- `MK40S.jpg` → 40" Smart TV  
- `MK43S.jpg` → 43" Smart TV  
- `MK43Web.jpg` → 43" webOS TV  
- `MK50G.jpg` → 50" Google TV  
- `MK55G.jpg` → 55" webOS TV  
- `MK65G.jpg` → 65" webOS TV  

- `MKSSAWM7.jpg` → Semi Auto Washing Machine 7kg  
- `MKSSAWM9.jpg` → Semi Auto Washing Machine 9kg  
- `MKSSAWM11.jpg` → Semi Auto Washing Machine 11kg  

- `MKSTBZREF.jpg` → Refrigerator Stabilizer (up to 365L)  
- `MKSTBZSMT.jpg` → Smart Plus Stabilizer (up to 75" LED TV)  
- `MKSTBZMINI.jpg` → MINI Stabilizer (up to 43" LED TV)  

---

## 🔄 Replace with Real Images

Currently, the JPG files are **empty placeholders**.  
To make the site look professional:

1. Collect real product images.
2. Save them with **the exact filenames** listed above.
3. Replace the placeholder files in `assets/`.

⚠️ **Do not rename files** — the JSON and product pages depend on these exact filenames.

---

## 📌 Notes
- Always keep a `no-image.svg` as a fallback.  
- Use `.svg` for logos/graphics (scales better).  
- Use `.jpg` or `.webp` for photos (smaller file size).  
- Banner can be swapped with any high-res image (1200×400 recommended).  
