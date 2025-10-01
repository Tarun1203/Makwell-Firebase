# 📂 Makwell Assets

This folder contains all static files (images, logos, banners, placeholders) used by the Makwell website.

---

## ✅ Files Included

### Core
- **logo.svg**  
  Main Makwell logo. Used in the header navigation.
  
- **banner.svg**  
  Hero banner shown on the homepage.
  
- **no-image.svg**  
  Fallback placeholder shown when a product image is missing.

---

### 📺 Product Images

These filenames **must match entries in `data/products.json`**:

- `MK24.jpg` → 24" LED TV (Normal)  
- `MK32S.jpg` → 32" Smart LED TV  
- `MK40S.jpg` → 40" Smart TV  
- `MK43S.jpg` → 43" Smart TV  
- `MK43Web.jpg` → 43" webOS TV  
- `MK50G.jpg` → 50" Google TV  
- `MK55G.jpg` → 55" webOS TV  
- `MK65G.jpg` → 65" webOS TV  

- `MKSSAWM7.jpg` → Semi Auto Washing Machine – 7.0 kg  
- `MKSSAWM9.jpg` → Semi Auto Washing Machine – 9.0 kg  
- `MKSSAWM11.jpg` → Semi Auto Washing Machine – 11.0 kg  

- `MKSTBZREF.jpg` → Refrigerator Stabilizer (up to 365L)  
- `MKSTBZSMT.jpg` → Smart Plus Stabilizer (up to 75" LED TV)  
- `MKSTBZMINI.jpg` → MINI Stabilizer (up to 43" LED TV)  

---

## 🔄 Replacing Placeholders

Currently, these `.jpg` files are **empty placeholders**.  
To use real product images:

1. Collect real product photos.  
2. Save them with the **exact same filenames** listed above.  
3. Replace the placeholder files in this folder.  

⚠️ **Do not rename files** — the site references these exact names in `data/products.json`.

---

## 📌 Notes
- Keep `no-image.svg` as a fallback.  
- Use `.svg` for vector graphics like logos.  
- Use `.jpg` or `.webp` for product photos (smaller + optimized).  
- Banner images: recommended size **1200×400** or higher for clarity.  
