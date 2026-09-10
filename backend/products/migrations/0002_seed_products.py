from django.db import migrations


PRODUCTS = [
    {
        "sku": "airless-pro",
        "name_fr": "Station airless portative",
        "name_en": "Portable airless sprayer",
        "category": "Construction equipment",
        "price": 850000,
        "stock_quantity": 4,
        "description_fr": "180 bar, buse reversible, flexible 15 m. Facades et grandes surfaces.",
        "description_en": "180 bar, reversible tip, 15 m hose. Facades and large surfaces.",
    },
    {
        "sku": "scaffold-bay",
        "name_fr": "Travee d'echafaudage acier",
        "name_en": "Steel scaffolding bay",
        "category": "Construction equipment",
        "price": 195000,
        "stock_quantity": 22,
        "description_fr": "2 m x 1,80 m, plancher bois, garde-corps et plinthes inclus.",
        "description_en": "2 m x 1.80 m, timber deck, guardrail and toe boards included.",
    },
    {
        "sku": "mixer-1600",
        "name_fr": "Malaxeur d'enduit 1600 W",
        "name_en": "Render mixer 1600 W",
        "category": "Construction equipment",
        "price": 145000,
        "stock_quantity": 9,
        "description_fr": "Deux vitesses, fouet de 140 mm, mortiers et enduits.",
        "description_en": "Two speeds, 140 mm paddle, mortars and renders.",
    },
    {
        "sku": "laser-level",
        "name_fr": "Niveau laser + hygrometre",
        "name_en": "Laser level + moisture meter",
        "category": "Construction equipment",
        "price": 120000,
        "stock_quantity": 12,
        "description_fr": "+/-1 mm / 10 m, mesure d'humidite des supports avant peinture.",
        "description_en": "+/-1 mm / 10 m, substrate moisture reading before painting.",
    },
    {
        "sku": "sander-hepa",
        "name_fr": "Ponceuse girafe aspiree",
        "name_en": "Extraction drywall sander",
        "category": "Construction equipment",
        "price": 320000,
        "stock_quantity": 6,
        "description_fr": "Diametre 225 mm, aspirateur HEPA, chantiers occupes.",
        "description_en": "225 mm, HEPA vacuum, occupied sites.",
    },
    {
        "sku": "render-trowel-set",
        "name_fr": "Kit taloches & lisseuses inox",
        "name_en": "Stainless trowel & float kit",
        "category": "Decoration equipment",
        "price": 65000,
        "stock_quantity": 30,
        "description_fr": "Beton cire, chaux, stucs : angles arrondis, acier souple.",
        "description_en": "Polished concrete, lime, stucco: rounded corners, flexible steel.",
    },
    {
        "sku": "stencil-kit",
        "name_fr": "Pochoirs & rouleaux a motifs",
        "name_en": "Stencils & pattern rollers",
        "category": "Decoration equipment",
        "price": 42000,
        "stock_quantity": 25,
        "description_fr": "Douze motifs geometriques, murs d'accent et bandeaux.",
        "description_en": "Twelve geometric patterns, accent walls and bands.",
    },
    {
        "sku": "moulding-set",
        "name_fr": "Moulures & corniches polystyrene",
        "name_en": "Polystyrene mouldings & cornices",
        "category": "Decoration equipment",
        "price": 28000,
        "stock_quantity": 60,
        "description_fr": "Pretes a peindre, collage sans clou, profils droits et sculptes.",
        "description_en": "Paint-ready, nail-free bonding, plain and carved profiles.",
    },
    {
        "sku": "brush-roller-pack",
        "name_fr": "Pack brosses & rouleaux pro",
        "name_en": "Pro brush & roller pack",
        "category": "Consumables",
        "price": 18500,
        "stock_quantity": 80,
        "description_fr": "Manchons anti-gouttes 180/250 mm, brosses a rechampir.",
        "description_en": "Non-drip sleeves 180/250 mm, cutting-in brushes.",
    },
    {
        "sku": "masking-kit",
        "name_fr": "Kit de protection chantier",
        "name_en": "Site protection kit",
        "category": "Consumables",
        "price": 12000,
        "stock_quantity": 100,
        "description_fr": "Baches, adhesif de masquage precision, films de sol.",
        "description_en": "Dust sheets, precision masking tape, floor films.",
    },
]


def seed_products(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    for product in PRODUCTS:
        Product.objects.update_or_create(sku=product["sku"], defaults=product)


def remove_seeded_products(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    Product.objects.filter(sku__in=[product["sku"] for product in PRODUCTS]).delete()


class Migration(migrations.Migration):
    dependencies = [("products", "0001_initial")]

    operations = [
        migrations.RunPython(seed_products, remove_seeded_products),
    ]
