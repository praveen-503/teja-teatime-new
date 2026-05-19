import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Tea Time database seed...');

  // ──────────────────────────────────────────
  // TABLES (1-20)
  // ──────────────────────────────────────────
  console.log('Creating tables...');
  const tableData = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    label: `Table ${i + 1}`,
    isActive: true,
  }));

  for (const t of tableData) {
    await prisma.table.upsert({
      where: { number: t.number },
      update: {},
      create: t,
    });
  }
  console.log('✅ 20 tables created');

  // ──────────────────────────────────────────
  // CATEGORIES
  // ──────────────────────────────────────────
  console.log('Creating categories...');

  const categories = [
    {
      name: 'Tea',
      slug: 'tea',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80',
      sortOrder: 1,
    },
    {
      name: 'Coffee',
      slug: 'coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
      sortOrder: 2,
    },
    {
      name: 'Snacks',
      slug: 'snacks',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
      sortOrder: 3,
    },
    {
      name: 'Cold Drinks',
      slug: 'cold-drinks',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
      sortOrder: 4,
    },
    {
      name: 'Desserts',
      slug: 'desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
      sortOrder: 5,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log('✅ 5 categories created');

  // ──────────────────────────────────────────
  // PRODUCTS — Full Indian Menu
  // ──────────────────────────────────────────
  console.log('Creating products...');

  const defaultTeaAddons = JSON.stringify([
    { name: 'Extra Ginger', price: 5 },
    { name: 'Extra Milk', price: 5 },
    { name: 'Honey', price: 10 },
  ]);

  const defaultSnackAddons = JSON.stringify([
    { name: 'Extra Chutney', price: 5 },
    { name: 'Ketchup', price: 5 },
  ]);

  const products = [
    // ── TEA ──────────────────────────────────
    {
      categorySlug: 'tea',
      name: 'Masala Tea',
      slug: 'masala-tea',
      description: 'Rich aromatic tea brewed with a blend of spices — ginger, cardamom, cinnamon and cloves. A classic Indian morning favourite.',
      price: 20,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80',
      rating: 4.8,
      reviewCount: 342,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: ['Mild', 'Medium', 'Strong'],
      addons: defaultTeaAddons,
    },
    {
      categorySlug: 'tea',
      name: 'Ginger Tea',
      slug: 'ginger-tea',
      description: 'Freshly grated ginger steeped in hot water with tea leaves and milk. Perfect for cold days and sore throats.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
      rating: 4.7,
      reviewCount: 218,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: ['Mild', 'Medium', 'Strong'],
      addons: defaultTeaAddons,
    },
    {
      categorySlug: 'tea',
      name: 'Green Tea',
      slug: 'green-tea',
      description: 'Premium Japanese-style green tea leaves steeped to perfection. Light, refreshing, and full of antioxidants.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80',
      rating: 4.5,
      reviewCount: 156,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Lemon Slice', price: 5 }, { name: 'Honey', price: 10 }]),
    },
    {
      categorySlug: 'tea',
      name: 'Lemon Tea',
      slug: 'lemon-tea',
      description: 'Tangy lemon squeezed fresh into hot black tea. A refreshing citrus twist on your everyday chai.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400&q=80',
      rating: 4.4,
      reviewCount: 98,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Extra Lemon', price: 5 }, { name: 'Honey', price: 10 }]),
    },
    {
      categorySlug: 'tea',
      name: 'Irani Chai',
      slug: 'irani-chai',
      description: 'Hyderabadi style creamy Irani chai — simmered milk with a strong tea decoction, served in a kulhad. House specialty.',
      price: 35,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80',
      rating: 4.9,
      reviewCount: 487,
      isVeg: true,
      sugarLevels: ['Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Biscuit', price: 10 }, { name: 'Extra Cream', price: 15 }]),
    },
    {
      categorySlug: 'tea',
      name: 'Elaichi Tea',
      slug: 'elaichi-tea',
      description: 'Fragrant cardamom-infused tea, brewed slowly to bring out the natural sweetness. A delicate and soothing cup.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80',
      rating: 4.6,
      reviewCount: 203,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: defaultTeaAddons,
    },
    {
      categorySlug: 'tea',
      name: 'Black Tea',
      slug: 'black-tea',
      description: 'Bold and robust Assam black tea served without milk. Clean, strong, and deeply satisfying for true tea lovers.',
      price: 20,
      image: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&q=80',
      rating: 4.3,
      reviewCount: 87,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Lemon Slice', price: 5 }]),
    },
    {
      categorySlug: 'tea',
      name: 'Milk Tea',
      slug: 'milk-tea',
      description: 'The classic Indian cutting chai — full-fat milk simmered with strong tea leaves for a creamy, velvety experience.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80',
      rating: 4.7,
      reviewCount: 529,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: defaultTeaAddons,
    },

    // ── SNACKS ───────────────────────────────
    {
      categorySlug: 'snacks',
      name: 'Samosa',
      slug: 'samosa',
      description: 'Crispy golden pastry stuffed with spiced potatoes and peas. Served hot with green chutney and tamarind sauce.',
      price: 25,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
      rating: 4.8,
      reviewCount: 612,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: ['Mild', 'Medium', 'Spicy'],
      addons: defaultSnackAddons,
    },
    {
      categorySlug: 'snacks',
      name: 'Veg Puff',
      slug: 'veg-puff',
      description: 'Flaky puff pastry filled with a savoury spiced vegetable filling. Freshly baked and served warm.',
      price: 30,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
      rating: 4.5,
      reviewCount: 298,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: ['Mild', 'Medium', 'Spicy'],
      addons: defaultSnackAddons,
    },
    {
      categorySlug: 'snacks',
      name: 'Onion Pakoda',
      slug: 'onion-pakoda',
      description: 'Crunchy batter-fried onion fritters seasoned with green chillies, coriander and chaat masala. Perfect monsoon snack.',
      price: 40,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80',
      rating: 4.7,
      reviewCount: 445,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: ['Mild', 'Medium', 'Spicy'],
      addons: JSON.stringify([{ name: 'Extra Chutney', price: 5 }, { name: 'Schezwan Sauce', price: 10 }]),
    },
    {
      categorySlug: 'snacks',
      name: 'Mirchi Bajji',
      slug: 'mirchi-bajji',
      description: 'Large green chillies dipped in spiced gram flour batter and deep fried to a golden crisp. South Indian street food classic.',
      price: 35,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
      rating: 4.6,
      reviewCount: 312,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: ['Medium', 'Spicy', 'Extra Spicy'],
      addons: defaultSnackAddons,
    },
    {
      categorySlug: 'snacks',
      name: 'Veg Sandwich',
      slug: 'veg-sandwich',
      description: 'Loaded grilled sandwich with fresh vegetables, cheese, and our signature green chutney on toasted multigrain bread.',
      price: 60,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
      rating: 4.4,
      reviewCount: 187,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: ['Mild', 'Medium'],
      addons: JSON.stringify([{ name: 'Extra Cheese', price: 15 }, { name: 'Butter', price: 10 }]),
    },
    {
      categorySlug: 'snacks',
      name: 'Bun Maska',
      slug: 'bun-maska',
      description: 'Irani bakery-style soft bun slathered generously with fresh cream butter. The iconic Hyderabadi Irani cafe classic.',
      price: 45,
      image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&q=80',
      rating: 4.9,
      reviewCount: 523,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Extra Butter', price: 10 }, { name: 'Jam', price: 15 }]),
    },

    // ── COLD DRINKS ──────────────────────────
    {
      categorySlug: 'cold-drinks',
      name: 'Cold Coffee',
      slug: 'cold-coffee',
      description: 'Chilled blended coffee with milk and ice cream. Rich, creamy and perfectly sweetened. A summer must-have.',
      price: 80,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
      rating: 4.7,
      reviewCount: 389,
      isVeg: true,
      sugarLevels: ['Less Sugar', 'Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Vanilla Ice Cream', price: 25 }, { name: 'Chocolate Syrup', price: 15 }]),
    },
    {
      categorySlug: 'cold-drinks',
      name: 'Chocolate Shake',
      slug: 'chocolate-shake',
      description: 'Thick indulgent chocolate milkshake blended with premium chocolate ice cream and topped with whipped cream.',
      price: 120,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80',
      rating: 4.8,
      reviewCount: 267,
      isVeg: true,
      sugarLevels: ['Normal', 'Extra Sugar'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Extra Scoop', price: 30 }, { name: 'Oreo Crumble', price: 20 }]),
    },
    {
      categorySlug: 'cold-drinks',
      name: 'Mango Milkshake',
      slug: 'mango-milkshake',
      description: 'Fresh Alphonso mango pulp blended with chilled full-fat milk. Seasonal, natural and absolutely delicious.',
      price: 100,
      image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
      rating: 4.9,
      reviewCount: 412,
      isVeg: true,
      sugarLevels: ['No Sugar', 'Less Sugar', 'Normal'],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Mango Pulp Extra', price: 20 }, { name: 'Ice Cream', price: 25 }]),
    },

    // ── DESSERTS ─────────────────────────────
    {
      categorySlug: 'desserts',
      name: 'Brownie',
      slug: 'brownie',
      description: 'Warm dense fudge brownie baked fresh daily. Served with a scoop of vanilla ice cream and chocolate drizzle.',
      price: 90,
      image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=80',
      rating: 4.8,
      reviewCount: 334,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Vanilla Ice Cream', price: 30 }, { name: 'Extra Chocolate Sauce', price: 15 }]),
    },
    {
      categorySlug: 'desserts',
      name: 'Cheesecake',
      slug: 'cheesecake',
      description: 'Creamy New York style baked cheesecake on a buttery graham cracker base. Served chilled with fresh berry compote.',
      price: 140,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
      rating: 4.9,
      reviewCount: 198,
      isVeg: true,
      sugarLevels: [],
      spiceLevels: [],
      addons: JSON.stringify([{ name: 'Extra Berry Compote', price: 20 }, { name: 'Whipped Cream', price: 15 }]),
    },
  ];

  for (const p of products) {
    const { categorySlug, ...productData } = p;
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) {
      console.warn(`Category not found for slug: ${categorySlug}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId,
        addons: productData.addons as any,
      },
    });
  }
  console.log(`✅ ${products.length} products created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log(`   Tables:     20`);
  console.log(`   Categories: 5`);
  console.log(`   Products:   ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
