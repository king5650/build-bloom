# Products Page Migration Guide: Hard-Coded to Database

You can now add all hard-coded products to the Django admin dashboard. The products page is now connected to the API and will display both API items and hard-coded items (as a fallback).

## Quick Start: Add Products via Django Admin

### 1. Access Django Admin
- Go to: **http://localhost:8000/admin/**
- Login with your Django superuser credentials
- Click **Products** in the left menu

### 2. Field Mapping: From Code to Admin

Use this mapping to enter the hard-coded products into the admin panel:

| Hard-Coded Field | Admin Field | Example Value | Notes |
|---|---|---|---|
| `id` | SKU (sku) | `airless-pro` | Unique identifier, use as SKU |
| `name.fr` | Name (FR) | `Station airless portative` | French name |
| `name.en` | Name (EN) | `Portable airless sprayer` | English name |
| `family` | Category | `Construction equipment` | Free text; use English labels for consistency |
| `price` | Price | `850000` | FCFA amount (no decimal) |
| `unit` | (N/A - not in model) | — | Not stored; calculated on frontend |
| `hex` | (N/A - not in model) | — | Not stored; hard-coded display only |
| `spec` | Description (EN) | `180 bar, reversible tip...` | English specs |
| — | Description (FR) | `180 bar, buse réversible...` | French translation of specs |
| `stock` | Stock Quantity | `4` | Number in stock |
| — | Photo | (upload image) | Optional: upload product photo |
| — | Is Active | ✓ Checked | Leave checked for visible products |

## Complete Product Data to Add

### Construction Equipment

#### 1. Portable Airless Sprayer
- **SKU:** `airless-pro`
- **Name (FR):** Station airless portative
- **Name (EN):** Portable airless sprayer
- **Category:** Construction equipment
- **Price:** 850000
- **Stock:** 4
- **Description (FR):** 180 bar, buse réversible, flexible 15 m. Façades et grandes surfaces.
- **Description (EN):** 180 bar, reversible tip, 15 m hose. Facades and large surfaces.

#### 2. Steel Scaffolding Bay
- **SKU:** `scaffold-bay`
- **Name (FR):** Travée d'échafaudage acier
- **Name (EN):** Steel scaffolding bay
- **Category:** Construction equipment
- **Price:** 195000
- **Stock:** 22
- **Description (FR):** 2 m × 1,80 m, plancher bois, garde-corps et plinthes inclus.
- **Description (EN):** 2 m × 1.80 m, timber deck, guardrail and toe boards included.

#### 3. Render Mixer 1600 W
- **SKU:** `mixer-1600`
- **Name (FR):** Malaxeur d'enduit 1600 W
- **Name (EN):** Render mixer 1600 W
- **Category:** Construction equipment
- **Price:** 145000
- **Stock:** 9
- **Description (FR):** Deux vitesses, fouet Ø 140 mm, mortiers et enduits.
- **Description (EN):** Two speeds, Ø 140 mm paddle, mortars and renders.

#### 4. Laser Level + Moisture Meter
- **SKU:** `laser-level`
- **Name (FR):** Niveau laser + hygromètre
- **Name (EN):** Laser level + moisture meter
- **Category:** Construction equipment
- **Price:** 120000
- **Stock:** 12
- **Description (FR):** ±1 mm / 10 m, mesure d'humidité des supports avant peinture.
- **Description (EN):** ±1 mm / 10 m, substrate moisture reading before painting.

#### 5. Extraction Drywall Sander
- **SKU:** `sander-hepa`
- **Name (FR):** Ponceuse girafe aspirée
- **Name (EN):** Extraction drywall sander
- **Category:** Construction equipment
- **Price:** 320000
- **Stock:** 6
- **Description (FR):** Ø 225 mm, aspirateur HEPA, chantiers occupés.
- **Description (EN):** Ø 225 mm, HEPA vacuum, occupied sites.

### Decoration Equipment

#### 6. Stainless Trowel & Float Kit
- **SKU:** `render-trowel-set`
- **Name (FR):** Kit taloches & lisseuses inox
- **Name (EN):** Stainless trowel & float kit
- **Category:** Decoration equipment
- **Price:** 65000
- **Stock:** 30
- **Description (FR):** Béton ciré, chaux, stucs : angles arrondis, acier souple.
- **Description (EN):** Polished concrete, lime, stucco: rounded corners, flexible steel.

#### 7. Stencils & Pattern Rollers
- **SKU:** `stencil-kit`
- **Name (FR):** Pochoirs & rouleaux à motifs
- **Name (EN):** Stencils & pattern rollers
- **Category:** Decoration equipment
- **Price:** 42000
- **Stock:** 25
- **Description (FR):** Douze motifs géométriques, murs d'accent et bandeaux.
- **Description (EN):** Twelve geometric patterns, accent walls and bands.

#### 8. Polystyrene Mouldings & Cornices
- **SKU:** `moulding-set`
- **Name (FR):** Moulures & corniches polystyrène
- **Name (EN):** Polystyrene mouldings & cornices
- **Category:** Decoration equipment
- **Price:** 28000
- **Stock:** 60
- **Description (FR):** Prêtes à peindre, collage sans clou, profils droits et sculptés.
- **Description (EN):** Paint-ready, nail-free bonding, plain and carved profiles.

### Consumables

#### 9. Pro Brush & Roller Pack
- **SKU:** `brush-roller-pack`
- **Name (FR):** Pack brosses & rouleaux pro
- **Name (EN):** Pro brush & roller pack
- **Category:** Consumables
- **Price:** 18500
- **Stock:** 80
- **Description (FR):** Manchons anti-gouttes 180/250 mm, brosses à réchampir.
- **Description (EN):** Non-drip sleeves 180/250 mm, cutting-in brushes.

#### 10. Site Protection Kit
- **SKU:** `masking-kit`
- **Name (FR):** Kit de protection chantier
- **Name (EN):** Site protection kit
- **Category:** Consumables
- **Price:** 12000
- **Stock:** 100
- **Description (FR):** Bâches, adhésif de masquage précision, films de sol.
- **Description (EN):** Dust sheets, precision masking tape, floor films.

## Admin Workflow Steps

### Method 1: One-by-One in Admin UI (Recommended for Learning)

1. Open **http://localhost:8000/admin/products/product/add/**
2. Fill in each field using the data above
3. Click **Save** or **Save and add another**
4. Repeat for each product

### Method 2: Bulk Import via CSV (Faster for Many Items)

If the admin supports CSV import, you can:
1. Prepare a CSV with columns: `sku, name_en, name_fr, description_en, description_fr, category, price, stock_quantity, is_active`
2. Use Django bulk actions or import tools

### Method 3: Django Management Command (For Developers)

Create a data migration script:
```bash
python manage.py shell

from products.models import Product

products_data = [
    {"sku": "airless-pro", "name_en": "Portable airless sprayer", "name_fr": "Station airless portative", ...},
    # ... add all 10 products
]

for data in products_data:
    Product.objects.update_or_create(sku=data['sku'], defaults=data)
```

## Frontend Behavior After Adding Products

### Dynamic Categories
- New product categories will automatically appear as filter buttons
- Filter buttons are extracted from `category` field values
- No code changes needed

### Hard-Coded Products (Fallback)
- The 10 hard-coded products remain as a fallback
- They will appear alongside admin products
- Hard-coded items show a hex color box; admin items show photos
- To hide hard-coded products, comment them out in `src/data/products.ts`

### Shopping Cart
- Both API and hard-coded products can be added to cart
- IDs are used to track items (API: numeric ID, hard-coded: string ID)

## Verification

After adding products to admin:

### 1. Check API Response
```powershell
try { 
  $data = (Invoke-WebRequest -UseBasicParsing 'http://localhost:8000/api/products/').Content | ConvertFrom-Json
  Write-Host "Products: $($data.Count)"
} catch { Write-Host "Error: $_" }
```

### 2. Check Frontend
- Visit **http://localhost:8080/products**
- Verify products load
- Test category filtering
- Test cart functionality

## Notes

- **Category Format:** Use consistent, human-readable categories like "Construction equipment", "Decoration equipment", "Consumables"
- **Price:** Enter whole FCFA amounts (e.g., `850000`, not `850000.0`)
- **Stock:** Use positive integers; hard-coded items use string IDs
- **Photos:** Optional but recommended for admin products
- **Descriptions:** Bilingual (French/English) fields stored separately

## Next Steps

After migrating products:
1. Remove hard-coded products from `src/data/products.ts` (optional)
2. Test all filtering and cart functionality
3. Add product photos via Cloudinary in admin
4. Set prices and stock quantities from your current rates
