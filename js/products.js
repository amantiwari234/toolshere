/**
 * Aman Fashion - Product Catalogue Mock Data
 * High-definition e-commerce mock dataset inspired by The Souled Store
 */

const PRODUCTS = [
    {
        id: "af-101",
        title: "Tokyo 2049: Cyberpunk Oversized T-Shirt",
        category: "oversized-tees",
        gender: "men",
        tag: "OFFICIAL MERCH",
        tagType: "merch",
        rating: 4.9,
        reviewsCount: 1840,
        price: 799,
        originalPrice: 1499,
        discount: "47% OFF",
        vipPrice: 649,
        image: "assets/images/prod_oversized_tee.jpg",
        thumbnails: [
            "assets/images/prod_oversized_tee.jpg",
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Jet Black", "Charcoal"],
        badge: "BESTSELLER",
        fabric: "100% Heavyweight Terry Cotton (240 GSM)",
        fit: "Loose & Dropped Shoulder Oversized Fit",
        description: "Step into the neon-drenched future with our Tokyo 2049 graphic drop. Crafted with ultra-dense 240 GSM combed cotton, premium HD puff screen printing that resists fading even after 50+ washes."
    },
    {
        id: "af-102",
        title: "Naruto: Akatsuki Cloud Premium Hoodie",
        category: "hoodies",
        gender: "men",
        tag: "ANIME COLLAB",
        tagType: "anime",
        rating: 4.8,
        reviewsCount: 2310,
        price: 1399,
        originalPrice: 2499,
        discount: "44% OFF",
        vipPrice: 1199,
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Midnight Black", "Crimson Red"],
        badge: "OFFICIAL MERCH",
        fabric: "380 GSM Brushed Fleece Cotton blend",
        fit: "Relaxed Boxy Silhouette with Double Layer Hood",
        description: "Channel rogue shinobi energy with the iconic red cloud embroidery and high-density Japanese kanji puff prints. Comes with fleece-lined warmth and custom Aman Fashion drawstrings."
    },
    {
        id: "af-103",
        title: "Tactical 6-Pocket Utility Cargo Pants",
        category: "cargos",
        gender: "men",
        tag: "STREETWEAR",
        tagType: "trending",
        rating: 4.7,
        reviewsCount: 940,
        price: 1299,
        originalPrice: 2299,
        discount: "43% OFF",
        vipPrice: 1099,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Military Olive", "Tactical Black"],
        badge: "TRENDING",
        fabric: "Ripstop Cotton Stretch Twill (280 GSM)",
        fit: "Relaxed Straight-Leg Fit with Ankle Cinchers",
        description: "Built for urban exploration. Features 6 deep cargo utility pockets, reinforced double knee stitching, heavy-duty YKK metal zippers, and adjustable bungee toggles at hem."
    },
    {
        id: "af-104",
        title: "Urban Samurai: Dragon Katana Oversized Tee",
        category: "oversized-tees",
        gender: "men",
        tag: "ANIME COLLAB",
        tagType: "anime",
        rating: 4.9,
        reviewsCount: 3120,
        price: 849,
        originalPrice: 1599,
        discount: "47% OFF",
        vipPrice: 699,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Pure White", "Washed Charcoal"],
        badge: "TOP RATED",
        fabric: "100% Combed Ringspun Cotton (220 GSM)",
        fit: "Drop-Shoulder Boxy Fit",
        description: "Dynamic ink-wash brush stroke dragon illustration with chrome silver metallic detailing. Ultra soft bio-washed handfeel for all-day streetwear comfort."
    },
    {
        id: "af-105",
        title: "Sunset Boulevard: Cuban Collar Resort Shirt",
        category: "shirts",
        gender: "men",
        tag: "SUMMER DROP",
        tagType: "trending",
        rating: 4.6,
        reviewsCount: 680,
        price: 999,
        originalPrice: 1799,
        discount: "44% OFF",
        vipPrice: 849,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Sage Green Abstract", "Terracotta Ochre"],
        badge: "HOT SELLER",
        fabric: "100% Rayon Viscose Linen Blend",
        fit: "Relaxed Camp Collar Fit",
        description: "Breezy tropical and retro abstract prints with wooden buttons and relaxed notched open collar. Drapes effortlessly for vacation, brunch, or casual evenings."
    },
    {
        id: "af-106",
        title: "Marvel: The Dark Knight Gotham Oversized Tee",
        category: "oversized-tees",
        gender: "men",
        tag: "OFFICIAL MERCH",
        tagType: "merch",
        rating: 4.9,
        reviewsCount: 4210,
        price: 899,
        originalPrice: 1699,
        discount: "47% OFF",
        vipPrice: 749,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Washed Acid Black", "Navy Mist"],
        badge: "OFFICIAL MERCH",
        fabric: "100% Acid Washed Vintage Cotton (240 GSM)",
        fit: "Streetwear Oversized Fit",
        description: "Vintage distressed wash aesthetic featuring gritty Batman Gotham City blueprint artwork. Official licensed collab design exclusively for Aman Fashion."
    },
    {
        id: "af-107",
        title: "Aero-Glide Retro High-Top Street Sneakers",
        category: "sneakers",
        gender: "unisex",
        tag: "FOOTWEAR",
        tagType: "trending",
        rating: 4.8,
        reviewsCount: 1120,
        price: 2199,
        originalPrice: 3999,
        discount: "45% OFF",
        vipPrice: 1899,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
        colors: ["Panda Monochrome", "Chicago Red & White"],
        badge: "NEW DROP",
        fabric: "Microfiber Vegan Leather with Vulcanized Rubber Sole",
        fit: "True to Size High Ankle Support",
        description: "Classic court nostalgia reimagined for street royalty. Cloudfoam cushioning insole and anti-skid rubber herringbone tread for non-stop comfort."
    },
    {
        id: "af-108",
        title: "Lavandula Dream: Cropped Oversized Hoodie",
        category: "hoodies",
        gender: "women",
        tag: "WOMEN'S EDIT",
        tagType: "women",
        rating: 4.8,
        reviewsCount: 1530,
        price: 1199,
        originalPrice: 2199,
        discount: "45% OFF",
        vipPrice: 999,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Lavender Mist", "Vanilla Cream"],
        badge: "BESTSELLER",
        fabric: "320 GSM French Terry Soft Fleece",
        fit: "Relaxed Dropped Crop Fit with Raw Hem",
        description: "Subtle pastel aesthetics combined with urban comfort. Raw edge cropped cut with oversized sleeves and brushed fleece interior."
    },
    {
        id: "af-109",
        title: "Cyberpunk 2077: Neon Rebel Women's Boxy Tee",
        category: "oversized-tees",
        gender: "women",
        tag: "OFFICIAL MERCH",
        tagType: "merch",
        rating: 4.9,
        reviewsCount: 890,
        price: 749,
        originalPrice: 1399,
        discount: "46% OFF",
        vipPrice: 629,
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Neon Magenta", "Pitch Black"],
        badge: "TRENDING",
        fabric: "100% Super Combed Cotton (220 GSM)",
        fit: "Korean Boxy Streetwear Silhouette",
        description: "Daring holographic neon screenprint crafted for festival and street looks. Bio-silicon enzyme washed for a cloud-like touch."
    },
    {
        id: "af-110",
        title: "Wide-Leg Parachute Streetwear Cargo Joggers",
        category: "cargos",
        gender: "women",
        tag: "STREETWEAR",
        tagType: "trending",
        rating: 4.7,
        reviewsCount: 740,
        price: 1199,
        originalPrice: 2099,
        discount: "43% OFF",
        vipPrice: 999,
        image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["26", "28", "30", "32"],
        colors: ["Sand Khaki", "Onyx Black"],
        badge: "POPULAR",
        fabric: "Water-resistant matte nylon parachute fabric",
        fit: "Ultra Baggy Balloon Leg with Ankle Drawstrings",
        description: "The viral Y2K parachute pant designed with deep utility bellows pockets and elasticized toggle waist. Pair with cropped tees or baby tees for instant drip."
    },
    {
        id: "af-111",
        title: "Minimalist Essential Waffle Knit Henley Polo",
        category: "shirts",
        gender: "men",
        tag: "SOLIDS & TEXTURES",
        tagType: "trending",
        rating: 4.8,
        reviewsCount: 1450,
        price: 899,
        originalPrice: 1599,
        discount: "44% OFF",
        vipPrice: 749,
        image: "https://images.unsplash.com/photo-1625910513413-5a2a62883391?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1625910513413-5a2a62883391?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Oatmeal Beige", "Slate Grey", "Forest Green"],
        badge: "BESTSELLER",
        fabric: "Heavyweight Waffle Knit Cotton (260 GSM)",
        fit: "Tailored Smart-Casual Fit",
        description: "Rich waffle micro-texture with ribbed cuffs and vintage tortoise shell buttons. Classy enough for dinner, comfortable enough for lounging."
    },
    {
        id: "af-112",
        title: "Dragon Ball Z: Super Saiyan Aura Graphic Hoodie",
        category: "hoodies",
        gender: "men",
        tag: "ANIME COLLAB",
        tagType: "anime",
        rating: 4.9,
        reviewsCount: 3890,
        price: 1449,
        originalPrice: 2599,
        discount: "44% OFF",
        vipPrice: 1249,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
        thumbnails: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Electric Gold & Black", "Midnight Blue"],
        badge: "OFFICIAL MERCH",
        fabric: "Premium 360 GSM Fleece French Terry",
        fit: "Heavyweight Boxy Drop-Shoulder",
        description: "Goku powering up with metallic golden energy aura details printed across back and chest. Officially licensed collaboration piece."
    }
];

const CATEGORIES = [
    { id: "all", name: "All Products", icon: "🔥", count: 12 },
    { id: "oversized-tees", name: "Oversized T-Shirts", icon: "👕", count: 4 },
    { id: "hoodies", name: "Hoodies & Jackets", icon: "🧥", count: 3 },
    { id: "cargos", name: "Cargos & Bottoms", icon: "👖", count: 2 },
    { id: "shirts", name: "Shirts & Polos", icon: "👔", count: 2 },
    { id: "sneakers", name: "Sneakers", icon: "👟", count: 1 }
];

const STORIES = [
    { title: "Oversized Tees", filter: "oversized-tees", image: "assets/images/prod_oversized_tee.jpg" },
    { title: "Anime Drop", filter: "anime", image: "assets/images/hero_anime.jpg" },
    { title: "Cargos & Pants", filter: "cargos", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80" },
    { title: "Hoodies & Fleeces", filter: "hoodies", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80" },
    { title: "Resort Shirts", filter: "shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80" },
    { title: "Sneakers", filter: "sneakers", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80" },
    { title: "Under ₹799", filter: "under799", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80" }
];

const COUPONS = {
    "AMAN10": { type: "percent", value: 10, minOrder: 999, description: "Flat 10% OFF on orders over ₹999" },
    "WELCOME100": { type: "flat", value: 100, minOrder: 799, description: "₹100 Flat OFF for your first order" },
    "VIP20": { type: "percent", value: 20, minOrder: 1499, description: "Exclusive VIP Flat 20% OFF over ₹1499" }
};

// Shared Live Products Store
function getLiveProducts() {
    const stored = localStorage.getItem('aman_products');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch(e) {}
    }
    localStorage.setItem('aman_products', JSON.stringify(PRODUCTS));
    return PRODUCTS;
}

function saveLiveProducts(prods) {
    localStorage.setItem('aman_products', JSON.stringify(prods));
}

