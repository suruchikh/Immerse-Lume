import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const JWT_SECRET = process.env.JWT_SECRET || 'immerse-lume-luxury-secret-key-2026';

// Paths for persistent data and uploads
// On Vercel serverless, root directory is read-only, so fallback to /tmp if write fails or in VERCEL env
const isVercel = !!process.env.VERCEL;
const LOCAL_DATA_DIR = path.resolve(__dirname, '../data');
const TMP_DATA_DIR = '/tmp';
const DATA_DIR = isVercel ? TMP_DATA_DIR : LOCAL_DATA_DIR;
const DB_FILE = path.resolve(DATA_DIR, 'database.json');
const UPLOADS_DIR = isVercel ? path.resolve('/tmp/uploads') : path.resolve(__dirname, '../public/uploads');

// Ensure directories exist safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create DATA_DIR, using fallback memory/tmp', e);
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create UPLOADS_DIR', e);
}

// Initial seed data
export const initialData = {
  adminUser: {
    id: 'admin_1',
    username: 'admin',
    email: 'admin@immerselume.com',
    passwordHash: bcrypt.hashSync('ImmerseLume2026!', 10),
    role: 'super_admin'
  },
  products: [
    {
      id: 'prod_1',
      slug: 'atelier-jar-screw-jar',
      name: 'Atelier Jar — Screw Jar',
      category: 'Glass Candles',
      subCategory: 'Classic Glass Vessels',
      shortDescription: 'Hand-poured natural soy wax housed in a luxurious glass jar with an elegant screw lid.',
      fullDescription: 'The Atelier Jar is the quintessential expression of Immerse Lume craftsmanship. Poured by hand with pure soy wax and blended with botanical fragrance oils, this 210g candle provides an even, clean burn for up to 40 hours. The tactile screw lid preserves fragrance intensity between uses and doubles as a heat-resistant pedestal.',
      images: [
        '/assets/images/product_atelier_screw_jar_1793372739090.jpg',
        '/assets/images/hero_luxury_candle_interior_1793372721571.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'White Garland', 'Orchid Pod'],
      colours: ['Red', 'Green', 'Light Blue', 'Pink', 'Purple', 'Yellow Orange'],
      weight: '210 g',
      vessel: 'Glass jar with screw lid',
      wicks: 1,
      burnTime: 'Approximately 40 hours',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax',
      dimensions: 'Standard Atelier format',
      careInstructions: [
        'Trim cotton wick to 5mm before every lighting.',
        'Allow the wax pool to reach the glass edge on the first burn (approx 2-3 hours).',
        'Do not burn continuously for longer than 4 hours.',
        'Place on a stable, heat-resistant surface away from drafts.'
      ],
      featured: true,
      published: true,
      order: 1
    },
    {
      id: 'prod_2',
      slug: 'cascade-jar-line-jar',
      name: 'Cascade Jar — Line Jar',
      category: 'Glass Candles',
      subCategory: 'Fluted Glass Vessels',
      shortDescription: 'Refined vertical linear fluted glass casting delicate shadow plays as it burns.',
      fullDescription: 'The Cascade Jar captures architectural modernism through elegant vertical ribbing. When lit, the luminous flame projects soothing linear patterns across interior surfaces. Blended with artisanal botanicals and natural soy wax for 30 hours of continuous sensory elevation.',
      images: [
        '/assets/images/product_cascade_line_jar_1793372741134.jpg',
        '/assets/images/hero_luxury_candle_interior_1793372721571.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'White Garland'],
      colours: ['Red', 'Green', 'Dark Blue'],
      weight: '150 g',
      vessel: 'Glass jar with lines',
      wicks: 1,
      burnTime: 'Approximately 30 hours',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax',
      dimensions: 'Standard Cascade format',
      careInstructions: [
        'Trim wick to 5mm before each use.',
        'Burn on heat-safe surfaces.',
        'Keep wax pool free of wick trimmings and foreign materials.'
      ],
      featured: true,
      published: true,
      order: 2
    },
    {
      id: 'prod_3',
      slug: 'stardust-jar-sparkle-jar',
      name: 'Stardust Jar — Sparkle Jar',
      category: 'Glass Candles',
      subCategory: 'Metallic & Shimmer Glass',
      shortDescription: 'Sparkle glass candle that shimmers with celestial luminescence when lit.',
      fullDescription: 'Designed for celebrations and enchanting evenings, the Stardust Jar features an ethereal sparkle glass finish. The candlelight gently reflects off microscopic golden and metallic pigments, creating a warm, ambient warmth that transforms any living space into a tranquil sanctuary.',
      images: [
        '/assets/images/product_stardust_sparkle_jar_1793372741046.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'Orchid Pod'],
      colours: ['Sparkle Pink', 'Copper', 'Silver'],
      weight: '128 g',
      vessel: 'Sparkle glass jar',
      wicks: 1,
      burnTime: 'Approximately 25 hours',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax',
      dimensions: 'Standard Stardust format',
      careInstructions: [
        'Allow wax to melt completely across top surface.',
        'Wipe the exterior gently with a dry microfibre cloth.',
        'Extinguish with a candle snuffer to prevent smoke.'
      ],
      featured: true,
      published: true,
      order: 3
    },
    {
      id: 'prod_4',
      slug: 'lustre-bowl-small-urli',
      name: 'Lustre Bowl — Small Urli',
      category: 'Metal Candles',
      subCategory: 'Artisanal Metal Urli',
      shortDescription: 'Traditional hammered metal urli re-imagined as an opulent artisanal scented candle.',
      fullDescription: 'Paying homage to timeless Indian metalworking traditions, the Lustre Bowl is handcrafted in lustrous polished metals. Filled with golden soy wax and steeped in pure fragrance extracts, this statement urli candle serves as an exquisite centrepiece for meaningful rituals and serene living spaces.',
      images: [
        '/assets/images/product_lustre_bowl_urli_1793372740834.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'White Garland'],
      colours: ['Golden', 'Silver'],
      weight: '90 g',
      vessel: 'Metal urli container',
      wicks: 1,
      burnTime: 'Approximately 18 hours',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax',
      dimensions: 'Standard Urli format',
      careInstructions: [
        'Vessel becomes warm during use; handle with care.',
        'Place upon the included felt base or a coaster.',
        'Re-use the solid metal bowl after candle life.'
      ],
      featured: true,
      published: true,
      order: 4
    },
    {
      id: 'prod_5',
      slug: 'mandala-tin',
      name: 'Mandala Tin',
      category: 'Mandala Candles',
      subCategory: 'Embossed Metal Tins',
      shortDescription: 'Ornately embossed mandala tins with matching decorative lids in three intricate motifs.',
      fullDescription: 'The Mandala Tin is a celebration of sacred geometry and intricate Indian decorative artistry. Available in three captivating designs, each tin is sealed with an airtight lid, making it portable and travel-friendly while safeguarding the delicate natural essential oils inside.',
      images: [
        '/assets/images/product_mandala_tin_candle_1793372741180.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'White Garland', 'Orchid Pod'],
      colours: ['Red', 'Blue', 'Pink'],
      weight: '100 g',
      vessel: 'Mandala tin jar with lid',
      wicks: 1,
      burnTime: 'Approximately 18 hours',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax',
      dimensions: 'Standard Mandala format',
      careInstructions: [
        'Secure lid when not in use to preserve fragrance freshness.',
        'Never burn unattended.',
        'Repurpose tin as a jewellery or trinket keepsake.'
      ],
      featured: true,
      published: true,
      order: 5
    },
    {
      id: 'prod_6',
      slug: 'aroma-reed-diffuser',
      name: 'Aroma Reed Diffuser',
      category: 'Diffusers',
      subCategory: 'Continuous Room Diffusion',
      shortDescription: 'Apothecary amber bottle with natural rattan reeds delivering effortless, continuous scent.',
      fullDescription: 'For spaces that deserve an understated, constant fragrance presence without an open flame. Formulated with an alcohol-free, slow-evaporating diffuser base and saturated with our signature concentrated oils. Includes 8 porous rattan reeds.',
      images: [
        '/assets/images/collection_reed_diffusers_1793372755402.jpg'
      ],
      fragrances: ['Crimson Canopy', 'White Garland', 'Orchid Pod'],
      colours: ['Amber Glass', 'Frosted White'],
      weight: '150 ml',
      vessel: 'Apothecary glass bottle with natural reeds',
      wicks: 0,
      burnTime: 'Diffusion lasts 8-12 weeks',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Alcohol-free botanical oil blend',
      dimensions: 'Standard Diffuser bottle',
      careInstructions: [
        'Flip reeds once a week for renewed fragrance vibrancy.',
        'Place in high-airflow areas for broad scent throw.'
      ],
      featured: true,
      published: true,
      order: 6
    },
    {
      id: 'prod_7',
      slug: 'pure-fragrance-dropper-oil',
      name: 'Pure Fragrance Dropper Oil',
      category: 'Diffuser Oils',
      subCategory: 'Concentrated Essence',
      shortDescription: 'Pure botanical fragrance concentrate with precision glass dropper for ultrasonic diffusers.',
      fullDescription: 'Our purest distillation of signature Immerse Lume accords. A few drops into an ultrasonic mist diffuser or oil burner immediately infuses large living areas with soothing, transportive aroma.',
      images: [
        '/assets/images/collection_reed_diffusers_1793372755402.jpg'
      ],
      fragrances: ['Crimson Canopy', 'Petals in the Hearth', 'White Garland', 'Orchid Pod'],
      colours: ['Amber Bottle with Glass Dropper'],
      weight: '30 ml',
      vessel: 'Amber dropper bottle',
      wicks: 0,
      burnTime: 'Over 200 drops',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Pure essential oil concentrate',
      dimensions: '30 ml dropper',
      careInstructions: [
        'Add 5-8 drops to water in ultrasonic diffusers.',
        'Store in a cool place away from direct sunlight.'
      ],
      featured: false,
      published: true,
      order: 7
    },
    {
      id: 'prod_8',
      slug: 'bespoke-signature-gift-box',
      name: 'Bespoke Signature Gift Box',
      category: 'Gift Sets',
      subCategory: 'Luxury Gift Packaging',
      shortDescription: 'Couture ivory presentation box adorned with gold foil embossing and raw silk ribbons.',
      fullDescription: 'Crafted for weddings, corporate gifting, and intimate milestone celebrations. The Bespoke Signature Gift Box presents a curated duet or quartet of Immerse Lume candles and diffusers, enveloped in weighted tissue and sealed with our insignia wax seal.',
      images: [
        '/assets/images/collection_gift_sets_1793372756741.jpg'
      ],
      fragrances: ['Crimson Canopy & White Garland Duet', 'Complete Quartet Collection'],
      colours: ['Champagne Ivory & Gold'],
      weight: 'Curated Ensemble',
      vessel: 'Rigid gold-embossed presentation box',
      wicks: 2,
      burnTime: 'Varies by curated items',
      usage: 'Indoor use',
      countryOfOrigin: 'India',
      waxType: 'Natural soy wax & pure oils',
      dimensions: 'Custom gifting box',
      careInstructions: [
        'Includes dedicated candle care handbook and bespoke gift card.'
      ],
      featured: true,
      published: true,
      order: 8
    }
  ],
  collections: [
    {
      id: 'col_1',
      slug: 'glass-candles',
      name: 'Glass Candles',
      parentCategory: 'Candles',
      description: 'Luminous mouth-blown and textured glass vessels with screw lids and delicate fluted linear details.',
      image: '/assets/images/product_atelier_screw_jar_1793372739090.jpg',
      order: 1,
      published: true
    },
    {
      id: 'col_2',
      slug: 'metal-candles',
      name: 'Metal Candles',
      parentCategory: 'Candles',
      description: 'Handcrafted metallic urlis in polished gold and silver, celebrating timeless heritage metalwork.',
      image: '/assets/images/product_lustre_bowl_urli_1793372740834.jpg',
      order: 2,
      published: true
    },
    {
      id: 'col_3',
      slug: 'mandala-candles',
      name: 'Mandala Candles',
      parentCategory: 'Candles',
      description: 'Intricately embossed travel tins showcasing sacred mandala motifs and vibrant jewel hues.',
      image: '/assets/images/product_mandala_tin_candle_1793372741180.jpg',
      order: 3,
      published: true
    },
    {
      id: 'col_4',
      slug: 'diffusers',
      name: 'Diffusers',
      parentCategory: 'Diffusers',
      description: 'Slow-releasing room diffusers with natural porous reeds for flame-free continuous ambiance.',
      image: '/assets/images/collection_reed_diffusers_1793372755402.jpg',
      order: 4,
      published: true
    },
    {
      id: 'col_5',
      slug: 'diffuser-oils',
      name: 'Diffuser Oils',
      parentCategory: 'Diffuser Oils',
      description: 'Pure concentrated fragrance distillations formulated for oil burners and ultrasonic nebulisers.',
      image: '/assets/images/collection_reed_diffusers_1793372755402.jpg',
      order: 5,
      published: true
    },
    {
      id: 'col_6',
      slug: 'gift-sets',
      name: 'Gift Sets',
      parentCategory: 'Gift Sets',
      description: 'Exquisite gifting presentations with gold foil embossing, bespoke ribbons, and curated fragrance pairings.',
      image: '/assets/images/collection_gift_sets_1793372756741.jpg',
      order: 6,
      published: true
    }
  ],
  fragrances: [
    {
      id: 'frag_1',
      slug: 'crimson-canopy',
      name: 'Crimson Canopy',
      subTitle: 'Saffron Sandal',
      tagline: 'The warmth of spice. The richness of wood.',
      description: 'A luxurious fragrance that captures the golden intensity of saffron resting over creamy sandalwood. Soft floral nuances add refinement, while amber and musk create a warm, lingering finish.',
      image: '/assets/images/fragrance_crimson_canopy_1793372721733.jpg',
      notes: {
        top: 'Saffron, Cardamom',
        heart: 'Sandalwood, Soft Rose',
        base: 'Amber, Musk'
      },
      published: true
    },
    {
      id: 'frag_2',
      slug: 'petals-in-the-hearth',
      name: 'Petals in the Hearth',
      subTitle: 'Rose & Oudh',
      tagline: 'Where delicate florals meet smoky warmth.',
      description: 'Inspired by crimson rose petals resting beside a glowing fireplace, this evocative fragrance brings together the romantic softness of rose and the deep, resinous character of oudh.',
      image: '/assets/images/fragrance_rose_oudh_1793372722523.jpg',
      notes: {
        floral: 'Romantic Rose',
        woody: 'Rich Oudh',
        overall: 'Warm, deep and sophisticated'
      },
      published: true
    },
    {
      id: 'frag_3',
      slug: 'white-garland',
      name: 'White Garland',
      subTitle: 'Arabian Jasmine',
      tagline: 'A garland of flowers, captured in fragrance.',
      description: 'Inspired by traditional mogra garlands and the beauty of floral adornment, White Garland celebrates the luminous elegance of Arabian jasmine sambac. Dewy green notes and sheer neroli lend a fresh, delicate quality.',
      image: '/assets/images/fragrance_white_garland_1793372723195.jpg',
      notes: {
        top: 'Dewy Greens',
        heart: 'Arabian Jasmine Sambac',
        base: 'Sheer Neroli'
      },
      published: true
    },
    {
      id: 'frag_4',
      slug: 'orchid-pod',
      name: 'Orchid Pod',
      subTitle: 'Warm Vanilla',
      tagline: 'The irresistible warmth of golden vanilla.',
      description: 'An indulgent fragrance built around sun-cured vanilla, golden tonka and dark amber. Smooth and enveloping, it creates a comforting sense of warmth.',
      image: '/assets/images/fragrance_orchid_vanilla_1793372723557.jpg',
      notes: {
        top: 'Sun-Cured Vanilla',
        heart: 'Golden Tonka',
        base: 'Dark Amber'
      },
      published: true
    }
  ],
  sections: [
    {
      id: 'sec_hero',
      page: 'home',
      sectionKey: 'hero',
      title: 'The Art of Living in the Moment',
      subTitle: 'Immerse Lume Luxury Fragrance',
      content: 'Discover the art of fragrance, thoughtfully crafted to transform everyday spaces into extraordinary experiences.',
      mediaUrl: '/assets/images/hero_luxury_candle_interior_1793372721571.jpg',
      mediaType: 'image',
      buttonText: 'Explore Collections',
      buttonLink: '/collections',
      secondaryButtonText: 'Discover Our Story',
      secondaryButtonLink: '/story',
      layout: 'full',
      visible: true,
      order: 1
    },
    {
      id: 'sec_philosophy',
      page: 'home',
      sectionKey: 'philosophy',
      title: 'Our Philosophy',
      subTitle: 'Elevate Every Moment',
      content: 'At Immerse Lume, we believe that fragrance has the power to transform a space, evoke emotions and turn everyday rituals into cherished experiences. Inspired by the beauty of nature, the warmth of meaningful moments and the timeless appeal of elegant design, we create scented candles that bring together captivating fragrances and beautiful glass vessels.',
      secondaryContent: 'Our philosophy is simple: create fragrances that inspire you to pause, breathe and immerse yourself in the present.',
      mediaUrl: '/assets/images/product_atelier_screw_jar_1793372739090.jpg',
      mediaType: 'image',
      buttonText: 'Read Our Story',
      buttonLink: '/story',
      layout: 'split-right',
      visible: true,
      order: 2
    },
    {
      id: 'sec_lifestyle',
      page: 'home',
      sectionKey: 'lifestyle',
      title: 'Create Moments Worth Remembering',
      subTitle: 'Lifestyle Editorial',
      content: 'Whether welcoming guests into your home, winding down at twilight, or gifting someone an unforgettable gesture of affection, Immerse Lume creates an atmospheric sanctuary of warmth and tranquility.',
      mediaUrl: '/assets/images/hero_luxury_candle_interior_1793372721571.jpg',
      mediaType: 'image',
      buttonText: 'Explore Fragrance Notes',
      buttonLink: '/fragrances',
      layout: 'split-left',
      visible: true,
      order: 3
    },
    {
      id: 'sec_statement',
      page: 'home',
      sectionKey: 'statement',
      title: 'Immerse Yourself in the Extraordinary.',
      subTitle: 'Immerse Lume',
      content: 'Handcrafted natural soy wax candles and botanical diffusers created with quiet sophistication and artistic purpose.',
      buttonText: 'Contact for Enquiries',
      buttonLink: '/contact',
      layout: 'centered',
      visible: true,
      order: 4
    }
  ],
  globalSettings: {
    siteName: 'Immerse Lume',
    tagline: 'Elevate Every Moment.',
    announcementBar: {
      text: 'Complimentary bespoke gift presentation on all celebratory orders · Handcrafted in India',
      visible: true,
      link: '/gifting'
    },
    logoText: 'IMMERSE LUME',
    logoImage: '',
    contactEmail: 'concierge@immerselume.com',
    contactPhone: '+91 98200 12345',
    contactAddress: 'Studio Immerse Lume, Mumbai & New Delhi, India',
    instagramUrl: 'https://instagram.com/immerselume',
    footerCopyright: '© 2026 Immerse Lume. All rights reserved.',
    footerDescription: 'Luxury home fragrance house creating scented candles, diffusers, and sensory vessels inspired by the art of living in the moment.',
    seo: {
      metaTitle: 'Immerse Lume | Luxury Home Fragrance — Elevate Every Moment',
      metaDescription: 'Discover luxury scented candles, glass vessels, reed diffusers, and signature fragrances crafted from natural soy wax.',
      keywords: 'luxury candles, home fragrance, soy wax candles, reed diffusers, artisan glass vessels, Immerse Lume',
      ogImage: '/assets/images/hero_luxury_candle_interior_1793372721571.jpg'
    }
  },
  designSettings: {
    primaryColor: '#1C1B1A',
    accentColor: '#C29B38',
    bgColor: '#FDFBF7',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
    borderRadius: '4px'
  },
  mediaItems: [
    {
      id: 'med_1',
      name: 'hero_luxury_candle_interior.jpg',
      url: '/assets/images/hero_luxury_candle_interior_1793372721571.jpg',
      type: 'image',
      folder: 'Editorial',
      size: '1.2 MB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_2',
      name: 'fragrance_crimson_canopy.jpg',
      url: '/assets/images/fragrance_crimson_canopy_1793372721733.jpg',
      type: 'image',
      folder: 'Fragrances',
      size: '890 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_3',
      name: 'fragrance_rose_oudh.jpg',
      url: '/assets/images/fragrance_rose_oudh_1793372722523.jpg',
      type: 'image',
      folder: 'Fragrances',
      size: '920 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_4',
      name: 'fragrance_white_garland.jpg',
      url: '/assets/images/fragrance_white_garland_1793372723195.jpg',
      type: 'image',
      folder: 'Fragrances',
      size: '840 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_5',
      name: 'fragrance_orchid_vanilla.jpg',
      url: '/assets/images/fragrance_orchid_vanilla_1793372723557.jpg',
      type: 'image',
      folder: 'Fragrances',
      size: '980 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_6',
      name: 'product_atelier_screw_jar.jpg',
      url: '/assets/images/product_atelier_screw_jar_1793372739090.jpg',
      type: 'image',
      folder: 'Products',
      size: '760 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_7',
      name: 'product_cascade_line_jar.jpg',
      url: '/assets/images/product_cascade_line_jar_1793372741134.jpg',
      type: 'image',
      folder: 'Products',
      size: '810 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_8',
      name: 'product_stardust_sparkle_jar.jpg',
      url: '/assets/images/product_stardust_sparkle_jar_1793372741046.jpg',
      type: 'image',
      folder: 'Products',
      size: '890 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_9',
      name: 'product_lustre_bowl_urli.jpg',
      url: '/assets/images/product_lustre_bowl_urli_1793372740834.jpg',
      type: 'image',
      folder: 'Products',
      size: '730 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_10',
      name: 'product_mandala_tin_candle.jpg',
      url: '/assets/images/product_mandala_tin_candle_1793372741180.jpg',
      type: 'image',
      folder: 'Products',
      size: '850 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_11',
      name: 'collection_reed_diffusers.jpg',
      url: '/assets/images/collection_reed_diffusers_1793372755402.jpg',
      type: 'image',
      folder: 'Collections',
      size: '900 KB',
      createdAt: new Date().toISOString()
    },
    {
      id: 'med_12',
      name: 'collection_gift_sets.jpg',
      url: '/assets/images/collection_gift_sets_1793372756741.jpg',
      type: 'image',
      folder: 'Gifting',
      size: '940 KB',
      createdAt: new Date().toISOString()
    }
  ],
  enquiries: [
    {
      id: 'enq_1',
      name: 'Aria Montgomery',
      email: 'aria.m@lifestyle-studio.com',
      phone: '+91 99887 65432',
      subject: 'Custom Corporate Gifting for Annual Gala',
      message: 'We are organizing an end-of-year executive retreat in Udaipur and would like to order 120 custom Bespoke Signature Gift Boxes featuring the Crimson Canopy and White Garland fragrances.',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'new'
    }
  ]
};

// Resilient database load with in-memory fallback
let inMemoryDb: any = null;

function loadDatabase() {
  if (inMemoryDb) return inMemoryDb;
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      inMemoryDb = { ...initialData, ...parsed };
      return inMemoryDb;
    }
  } catch (err) {
    console.warn('Could not read from DB_FILE, falling back to initial data', err);
  }

  inMemoryDb = { ...initialData };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    // Expected on read-only environments
  }
  return inMemoryDb;
}

function saveDatabase(data: any) {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // If writing to DB_FILE fails, attempt /tmp fallback
    try {
      fs.writeFileSync('/tmp/database.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Memory persistence retained
    }
  }
}

export const db = loadDatabase();

export const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS & Preflight handling for Vercel and custom domains
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Static uploads & images serving
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets/images', express.static(path.resolve(__dirname, '../public/assets/images')));
app.use('/src/assets/images', express.static(path.resolve(__dirname, '../public/assets/images')));

// Authentication Middleware
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

// ---------------- REST API ROUTES ----------------

// Auth endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.adminUser;
  const inputIdentifier = String(username).trim().toLowerCase();
  const currentUsername = (admin.username || '').toLowerCase();
  const currentEmail = (admin.email || '').toLowerCase();

  if (inputIdentifier !== currentUsername && inputIdentifier !== currentEmail) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    token,
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
});

app.get('/api/auth/me', authenticateAdmin, (req: Request, res: Response) => {
  const admin = db.adminUser;
  return res.json({
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
});

app.post('/api/auth/change-credentials', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newUsername, newEmail, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to update credentials' });
  }

  if (!newUsername && !newEmail && !newPassword) {
    return res.status(400).json({ error: 'Please provide at least one credential to update (username, email, or password)' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, db.adminUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password does not match' });
  }

  if (newUsername) {
    const trimmed = String(newUsername).trim();
    if (trimmed.length < 3) {
      return res.status(400).json({ error: 'New username must be at least 3 characters long' });
    }
    db.adminUser.username = trimmed;
  }

  if (newEmail) {
    const trimmed = String(newEmail).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    db.adminUser.email = trimmed;
  }

  if (newPassword) {
    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }
    db.adminUser.passwordHash = bcrypt.hashSync(newPassword, 10);
  }

  saveDatabase(db);

  const token = jwt.sign(
    { id: db.adminUser.id, username: db.adminUser.username, role: db.adminUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Admin credentials successfully updated',
    token,
    user: {
      id: db.adminUser.id,
      username: db.adminUser.username,
      email: db.adminUser.email,
      role: db.adminUser.role
    }
  });
});

app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, db.adminUser.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Current password does not match' });
  }

  db.adminUser.passwordHash = bcrypt.hashSync(newPassword, 10);
  saveDatabase(db);

  const token = jwt.sign(
    { id: db.adminUser.id, username: db.adminUser.username, role: db.adminUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Password successfully updated',
    token,
    user: {
      id: db.adminUser.id,
      username: db.adminUser.username,
      email: db.adminUser.email,
      role: db.adminUser.role
    }
  });
});

// Products endpoints
app.get('/api/products', (req: Request, res: Response) => {
  const includeUnpublished = req.query.admin === 'true';
  const list = includeUnpublished ? db.products : db.products.filter((p: any) => p.published);
  const sorted = [...list].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  return res.json(sorted);
});

app.get('/api/products/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const product = db.products.find((p: any) => p.slug === slugOrId || p.id === slugOrId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', authenticateAdmin, (req: Request, res: Response) => {
  const productData = req.body;
  if (!productData.name || !productData.category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const id = `prod_${Date.now()}`;
  const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct = {
    ...productData,
    id,
    slug,
    order: db.products.length + 1,
    published: productData.published !== undefined ? productData.published : true,
    images: productData.images || []
  };

  db.products.push(newProduct);
  saveDatabase(db);
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = { ...db.products[index], ...req.body, id };
  saveDatabase(db);
  return res.json(db.products[index]);
});

app.delete('/api/products/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLen = db.products.length;
  db.products = db.products.filter((p: any) => p.id !== id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveDatabase(db);
  return res.json({ success: true, message: 'Product deleted' });
});

app.post('/api/products/:id/duplicate', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const source = db.products.find((p: any) => p.id === id);
  if (!source) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newId = `prod_${Date.now()}`;
  const duplicate = {
    ...source,
    id: newId,
    name: `${source.name} (Copy)`,
    slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
    published: false,
    order: db.products.length + 1
  };

  db.products.push(duplicate);
  saveDatabase(db);
  return res.status(201).json(duplicate);
});

// Collections endpoints
app.get('/api/collections', (req: Request, res: Response) => {
  const includeUnpublished = req.query.admin === 'true';
  const list = includeUnpublished ? db.collections : db.collections.filter((c: any) => c.published);
  const sorted = [...list].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  return res.json(sorted);
});

app.post('/api/collections', authenticateAdmin, (req: Request, res: Response) => {
  const { name, parentCategory, description, image, published } = req.body;
  if (!name || !parentCategory) {
    return res.status(400).json({ error: 'Name and parentCategory are required' });
  }

  const id = `col_${Date.now()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCol = {
    id,
    slug,
    name,
    parentCategory,
    description: description || '',
    image: image || '',
    published: published !== undefined ? published : true,
    order: db.collections.length + 1
  };

  db.collections.push(newCol);
  saveDatabase(db);
  return res.status(201).json(newCol);
});

app.put('/api/collections/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.collections.findIndex((c: any) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  db.collections[index] = { ...db.collections[index], ...req.body, id };
  saveDatabase(db);
  return res.json(db.collections[index]);
});

app.delete('/api/collections/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.collections = db.collections.filter((c: any) => c.id !== id);
  saveDatabase(db);
  return res.json({ success: true, message: 'Collection deleted' });
});

// Fragrances endpoints
app.get('/api/fragrances', (req: Request, res: Response) => {
  const includeUnpublished = req.query.admin === 'true';
  const list = includeUnpublished ? db.fragrances : db.fragrances.filter((f: any) => f.published);
  return res.json(list);
});

app.post('/api/fragrances', authenticateAdmin, (req: Request, res: Response) => {
  const { name, subTitle, tagline, description, image, notes, published } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Fragrance name is required' });
  }

  const id = `frag_${Date.now()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newFrag = {
    id,
    slug,
    name,
    subTitle: subTitle || '',
    tagline: tagline || '',
    description: description || '',
    image: image || '',
    notes: notes || {},
    published: published !== undefined ? published : true
  };

  db.fragrances.push(newFrag);
  saveDatabase(db);
  return res.status(201).json(newFrag);
});

app.put('/api/fragrances/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.fragrances.findIndex((f: any) => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Fragrance not found' });
  }

  db.fragrances[index] = { ...db.fragrances[index], ...req.body, id };
  saveDatabase(db);
  return res.json(db.fragrances[index]);
});

app.delete('/api/fragrances/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.fragrances = db.fragrances.filter((f: any) => f.id !== id);
  saveDatabase(db);
  return res.json({ success: true, message: 'Fragrance deleted' });
});

// Page Sections endpoints
app.get('/api/sections', (req: Request, res: Response) => {
  const page = (req.query.page as string) || 'home';
  const includeHidden = req.query.admin === 'true';
  let list = db.sections.filter((s: any) => s.page === page);
  if (!includeHidden) {
    list = list.filter((s: any) => s.visible);
  }
  list.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  return res.json(list);
});

app.post('/api/sections', authenticateAdmin, (req: Request, res: Response) => {
  const sectionData = req.body;
  const id = `sec_${Date.now()}`;
  const newSec = {
    ...sectionData,
    id,
    order: db.sections.length + 1,
    visible: sectionData.visible !== undefined ? sectionData.visible : true
  };
  db.sections.push(newSec);
  saveDatabase(db);
  return res.status(201).json(newSec);
});

app.put('/api/sections/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.sections.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Section not found' });
  }

  db.sections[index] = { ...db.sections[index], ...req.body, id };
  saveDatabase(db);
  return res.json(db.sections[index]);
});

app.post('/api/sections/reorder', authenticateAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body;
  if (Array.isArray(orderedIds)) {
    orderedIds.forEach((id: string, index: number) => {
      const item = db.sections.find((s: any) => s.id === id);
      if (item) item.order = index + 1;
    });
    saveDatabase(db);
  }
  return res.json({ success: true });
});

app.delete('/api/sections/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.sections = db.sections.filter((s: any) => s.id !== id);
  saveDatabase(db);
  return res.json({ success: true, message: 'Section deleted' });
});

// Settings & Design endpoints
app.get('/api/settings', (req: Request, res: Response) => {
  return res.json({
    global: db.globalSettings,
    design: db.designSettings
  });
});

app.put('/api/settings', authenticateAdmin, (req: Request, res: Response) => {
  if (req.body.global) {
    db.globalSettings = { ...db.globalSettings, ...req.body.global };
  }
  if (req.body.design) {
    db.designSettings = { ...db.designSettings, ...req.body.design };
  }
  saveDatabase(db);
  return res.json({
    global: db.globalSettings,
    design: db.designSettings
  });
});

// Media Library endpoints
app.get('/api/media', (req: Request, res: Response) => {
  return res.json(db.mediaItems);
});

app.post('/api/media/upload', authenticateAdmin, (req: Request, res: Response) => {
  const { name, dataUrl, folder, type } = req.body;
  if (!dataUrl || !name) {
    return res.status(400).json({ error: 'Name and dataUrl are required' });
  }

  try {
    let fileUrl = dataUrl;
    if (dataUrl.startsWith('data:')) {
      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'jpg';
        const filename = `media_${Date.now()}_${name.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        try {
          fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
          fileUrl = `/uploads/${filename}`;
        } catch (e) {
          // If write fails, dataUrl can be stored directly
          fileUrl = dataUrl;
        }
      }
    }

    const newMedia = {
      id: `med_${Date.now()}`,
      name,
      url: fileUrl,
      type: type || 'image',
      folder: folder || 'General',
      size: `${Math.round((dataUrl.length * 0.75) / 1024)} KB`,
      createdAt: new Date().toISOString()
    };

    db.mediaItems.unshift(newMedia);
    saveDatabase(db);
    return res.status(201).json(newMedia);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to upload media' });
  }
});

app.delete('/api/media/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.mediaItems = db.mediaItems.filter((m: any) => m.id !== id);
  saveDatabase(db);
  return res.json({ success: true, message: 'Media item removed' });
});

// Enquiries (Contact) endpoints
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const newEnquiry = {
    id: `enq_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Brand Enquiry',
    message,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  db.enquiries.unshift(newEnquiry);
  saveDatabase(db);
  return res.status(201).json({ success: true, message: 'Thank you for your enquiry. Our concierge will be in touch shortly.' });
});

app.get('/api/enquiries', authenticateAdmin, (req: Request, res: Response) => {
  return res.json(db.enquiries);
});

app.put('/api/enquiries/:id/status', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const enquiry = db.enquiries.find((e: any) => e.id === id);
  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }
  enquiry.status = status;
  saveDatabase(db);
  return res.json(enquiry);
});

// Supabase Status & SQL Schema Generator
app.get('/api/supabase/status', (req: Request, res: Response) => {
  const hasUrl = !!process.env.SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_KEY;

  const sqlSchema = `-- ===================================================
-- IMMERSE LUME — SUPABASE POSTGRESQL RELATIONAL SCHEMA
-- Run this in Supabase SQL Editor to initialize tables & RLS
-- ===================================================

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  short_description TEXT,
  full_description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  fragrances JSONB DEFAULT '[]'::jsonb,
  colours JSONB DEFAULT '[]'::jsonb,
  weight TEXT,
  vessel TEXT,
  wicks INT DEFAULT 1,
  burn_time TEXT,
  usage TEXT DEFAULT 'Indoor use',
  country_of_origin TEXT DEFAULT 'India',
  wax_type TEXT DEFAULT 'Natural soy wax',
  dimensions TEXT,
  care_instructions JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fragrances (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sub_title TEXT,
  tagline TEXT,
  description TEXT,
  image TEXT,
  notes JSONB DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_sections (
  id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  sub_title TEXT,
  content TEXT,
  secondary_content TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  button_text TEXT,
  button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  layout TEXT DEFAULT 'split-left',
  visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Public READ policies for published items
CREATE POLICY "Public read published products" ON products FOR SELECT USING (published = true);
CREATE POLICY "Public read published collections" ON collections FOR SELECT USING (published = true);
CREATE POLICY "Public read published fragrances" ON fragrances FOR SELECT USING (published = true);
CREATE POLICY "Public read visible sections" ON page_sections FOR SELECT USING (visible = true);

-- Public insert for customer enquiries
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Admin authenticated full access
CREATE POLICY "Admins full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access collections" ON collections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access fragrances" ON fragrances FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access page_sections" ON page_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access enquiries" ON enquiries FOR ALL TO authenticated USING (true);
`;

  return res.json({
    configured: hasUrl && hasKey,
    supabaseUrl: process.env.SUPABASE_URL || null,
    storageBucket: 'immerse-lume-media',
    schemaSql: sqlSchema,
    message: hasUrl && hasKey 
      ? 'Supabase backend is configured and active via environment credentials.'
      : 'Supabase credentials are not detected in environment variables. The application is running on its built-in persistent disk JSON database engine with full REST API support, secure bcrypt/JWT auth, and complete CRUD capabilities. You can link Supabase anytime by adding SUPABASE_URL and SUPABASE_KEY.'
  });
});
