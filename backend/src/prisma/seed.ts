import { PrismaClient, Role, PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Varsha Ayurveda database...');

  // 1. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Varsha Ayurveda",
      phone: "9907303284",
      whatsappNumber: "919907303284",
      email: "info@varshaayurveda.in",
      address: "Berasia Road, Bhopal, Madhya Pradesh, India",
      instagramUrl: "https://instagram.com/varshaayurveda",
      facebookUrl: "https://facebook.com/varshaayurveda",
      shippingCharge: 50,
      freeShippingThreshold: 500,
      codEnabled: true,
      razorpayEnabled: true,
      announcementText: "Natural Ayurvedic Wellness Products | Order Online | WhatsApp Support",
      heroTagline: "Natural Wellness, Rooted in Ayurveda",
      heroSubtitle: "Discover thoughtfully crafted Ayurvedic and herbal products designed to support your everyday wellness routine.",
      footerText: "Bringing the goodness of Ayurveda to your daily life with natural and herbal wellness products."
    }
  });
  console.log('✔ Site settings seeded');

  // 2. Admin & Customer Users
  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@varshaayurveda.in' },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.ADMIN
    },
    create: {
      name: 'Varsha Ayurveda Admin',
      email: 'admin@varshaayurveda.in',
      phone: '9907303284',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {
      passwordHash: customerPasswordHash
    },
    create: {
      name: 'Rahul Sharma',
      email: 'customer@gmail.com',
      phone: '9876543210',
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      isActive: true
    }
  });
  console.log(`✔ Users seeded (Admin: ${admin.email}, Customer: ${customer.email})`);

  // 3. Categories
  const categoriesData = [
    { name: "Ayurvedic Wellness", slug: "ayurvedic-wellness", description: "Comprehensive Ayurvedic wellness & preventive health formulations", image: "/images/cat-ayurvedic-wellness.svg", sortOrder: 1 },
    { name: "Herbal Powders", slug: "herbal-powders", description: "Traditional micronized herbal powders and churnas for nutrition", image: "/images/cat-herbal-powders.jpg", sortOrder: 2 },
    { name: "Capsules", slug: "capsules", description: "Concentrated standardized botanical herbal extracts in convenient vegetarian capsules", image: "/images/cat-capsules.jpg", sortOrder: 3 },
    { name: "Daily Wellness", slug: "daily-wellness", description: "Essential herbal regimens for gut harmony, energy, and detox", image: "/images/cat-daily-wellness.jpg", sortOrder: 4 },
    { name: "Energy & Stamina", slug: "energy-stamina", description: "Potent Rasayana herbs formulated to optimize stamina, vigor, and vitality", image: "/images/cat-energy-stamina.svg", sortOrder: 5 },
    { name: "Other Products", slug: "other-products", description: "Specialized complementary Ayurvedic preparations and topicals", image: "/images/cat-other-products.svg", sortOrder: 6 }
  ];

  const categoryMap = new Map<string, number>();
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat
    });
    categoryMap.set(cat.name, createdCat.id);
  }
  console.log('✔ Categories seeded');

  // 4. Products
  const productsData = [
    {
      name: "DRL Strong Mushroom Powder",
      slug: "drl-strong-mushroom-powder",
      shortDescription: "Ayurvedic powder for daily energy and nutrition support.",
      description: "A perfect blend of Ayurvedic herbs, Mushrooms & Natural Nutrition to support healthy weight gain and overall wellness. Formulated with bioactive adaptogens to boost metabolic vigor, immune strength, and physical endurance.",
      price: 360,
      compareAtPrice: 450,
      stock: 85,
      sku: "VA-DRL-001",
      categoryName: "Herbal Powders",
      featured: true,
      active: true,
      ingredients: "Mushroom Extract (Agaricus Bisporus), Ashwagandha (Withania Somnifera), Shatavari (Asparagus Racemosus), Safed Musli, Vidarikand, Pipali",
      benefits: "Promotes healthy, sustained weight gain; Enhances cellular stamina & endurance; Stimulates balanced appetite; Restores vitality after fatigue",
      usage: "Mix 1 scoop (5-10g) in lukewarm milk or water twice daily after breakfast and dinner.",
      weight: "200g Powder",
      images: [
        { url: "/images/mushroom-powder.png", altText: "DRL Strong Mushroom Powder Front View", isPrimary: true, order: 0 }
      ]
    },
    {
      name: "Pilo CARE Capsule",
      slug: "pilo-care-capsule",
      shortDescription: "Ayurvedic wellness support for daily comfort.",
      description: "Ayurvedic wellness support for daily comfort. Helps in reducing discomfort and supports healthy digestion. Formulated with cooling and soothing Ayurvedic herbs that target vascular and digestive integrity.",
      price: 320,
      compareAtPrice: 400,
      stock: 120,
      sku: "VA-PIL-002",
      categoryName: "Capsules",
      featured: true,
      active: true,
      ingredients: "Nagkesar (Mesua ferrea), Triphala (Amalaki, Haritaki, Bibhitaki), Shuddha Guggulu, Neem Leaf Powder, Suran (Amorphophallus Campanulatus)",
      benefits: "Soothes burning and rectal irritation; Promotes smooth and regular bowel elimination; Reduces vascular congestion naturally; Non-habit forming",
      usage: "Take 1-2 capsules twice daily with lukewarm water before or after meals.",
      weight: "60 Veg Capsules",
      images: [
        { url: "/images/pilo-care.png", altText: "Pilo CARE Capsule Box & Bottle", isPrimary: true, order: 0 }
      ]
    },
    {
      name: "Strong Stone Remover",
      slug: "strong-stone-remover",
      shortDescription: "Ayurvedic support for kidney & urinary wellness.",
      description: "Ayurvedic support for kidney & urinary wellness. Helps maintain a healthy urinary tract, facilitates renal detoxification, and provides relief from burning sensations during urination.",
      price: 505,
      compareAtPrice: 630,
      stock: 50,
      sku: "VA-STR-003",
      categoryName: "Ayurvedic Wellness",
      featured: true,
      active: true,
      ingredients: "Pashanbhed (Bergenia ligulata), Gokshura (Tribulus terrestris), Varun Bark (Crataeva nurvala), Kulthi Extract, Punarnava (Boerhavia diffusa)",
      benefits: "Supports kidney flush and urinary tract clearing; Calms burning micturition and abdominal discomfort; Aids in natural electrolyte and fluid balance",
      usage: "Take 10-15ml with an equal quantity of water twice daily, or 1 capsule twice daily with plenty of water.",
      weight: "200ml Syrup / 60 Tablets",
      images: [
        { url: "/images/stone-remover.png", altText: "Strong Stone Remover Tonic Pack", isPrimary: true, order: 0 }
      ]
    },
    {
      name: "DRL Musli + Shilajit Powder",
      slug: "drl-musli-shilajit-powder",
      shortDescription: "Natural energy, stamina & vitality support.",
      description: "Natural energy, stamina & vitality support. Formulated with purified Himalayan Shilajit and Grade-A Safed Musli for maximum endurance, vigor, and revitalized daily stamina.",
      price: 495,
      compareAtPrice: 660,
      stock: 75,
      sku: "VA-MSL-004",
      categoryName: "Energy & Stamina",
      featured: true,
      active: true,
      ingredients: "Shuddha Himalayan Shilajit (80% Fulvic Acid), Safed Musli (Chlorophytum Borivilianum), Kaunch Beej (Mucuna Pruriens), Gokshura, Akarkara",
      benefits: "Boosts physical strength and male/female vitality; Accelerates recovery after strenuous activity; Fortifies nervous system and mental drive",
      usage: "Consume 3-5g with warm milk sweetened with honey or jaggery before bed.",
      weight: "100g Powder",
      images: [
        { url: "/images/musli-shilajit.png", altText: "DRL Musli + Shilajit Powder Pack", isPrimary: true, order: 0 }
      ]
    }
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categoryName) || null;
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: prod.name,
          shortDescription: prod.shortDescription,
          description: prod.description,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          stock: prod.stock,
          sku: prod.sku,
          categoryId,
          featured: prod.featured,
          active: prod.active,
          ingredients: prod.ingredients,
          benefits: prod.benefits,
          usage: prod.usage,
          weight: prod.weight
        }
      });
    } else {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: prod.slug,
          shortDescription: prod.shortDescription,
          description: prod.description,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          stock: prod.stock,
          sku: prod.sku,
          categoryId,
          featured: prod.featured,
          active: prod.active,
          ingredients: prod.ingredients,
          benefits: prod.benefits,
          usage: prod.usage,
          weight: prod.weight,
          images: {
            create: prod.images.map(img => ({
              url: img.url,
              altText: img.altText,
              isPrimary: img.isPrimary,
              order: img.order
            }))
          }
        }
      });
    }
  }
  console.log('✔ Products seeded');

  // 5. Blogs
  const blogsData = [
    {
      title: "Ayurveda and Everyday Wellness",
      slug: "ayurveda-and-everyday-wellness",
      excerpt: "Discover how ancient Ayurvedic practices can transform your daily wellness routine with natural remedies.",
      content: `Ayurveda, often translated as the "Science of Life", is an ancient Indian healing modality that treats the root cause of imbalance rather than merely suppressing symptoms.\n\nIn our modern fast-paced world, daily stress, irregular sleep patterns, and processed foods aggravate our biological humors (Doshas: Vata, Pitta, and Kapha). By integrating simple, conscious habits—such as waking with the sunrise, practicing mindful eating, drinking warm herbal infusions, and using natural herbal tonics—we create steady equilibrium in body and mind.\n\nAt Varsha Ayurveda, each preparation is crafted to gently support your innate healing intelligence.`,
      featuredImage: "/images/blog-wellness.png",
      author: "Dr. Varsha Sharma, BAMS",
      published: true
    },
    {
      title: "Understanding Herbal Ingredients",
      slug: "understanding-herbal-ingredients",
      excerpt: "Learn about the powerful herbs behind our formulations and their traditional healing properties.",
      content: `Behind every potent Ayurvedic remedy lies a symphony of botanical ingredients, harmonized through ancient classical principles.\n\n1. Ashwagandha (Withania somnifera): Renowned as the premier adaptogen, it calms the nervous system while building deep physical endurance.\n2. Safed Musli: Known as 'White Gold', it restores vital bodily tissues and nourishes energy reserves.\n3. Shuddha Shilajit: Rich in minerals and fulvic acid, it enhances cellular ATP production and nutrient absorption.\n4. Triphala: The balanced synergy of Amalaki, Bibhitaki, and Haritaki gently detoxifies the gut and supports ocular and circulatory health.\n\nAuthentic sourcing and gentle extraction ensure the Prana (vital essence) of these sacred herbs remains intact.`,
      featuredImage: "/images/blog-herbal.png",
      author: "Acharya Devrat",
      published: true
    },
    {
      title: "Building a Healthy Daily Routine",
      slug: "building-a-healthy-daily-routine",
      excerpt: "Simple steps to incorporate Ayurvedic wisdom into your modern daily life for lasting health benefits.",
      content: `In Ayurveda, Dinacharya refers to a daily routine aligned with cosmic and natural cycles. When your daily activities mirror nature's rhythms, optimal health follows effortlessly.\n\nKey pillars of Dinacharya:\n- Brahma Muhurta: Waking up approximately 45 minutes before sunrise to absorb the serene Vata energy.\n- Ushapan: Drinking 1-2 glasses of warm water to awaken the gastrointestinal tract.\n- Abhyanga: Self-massage with warm herbal oils to nourish skin, joints, and circulation.\n- Ahara: Eating your heaviest meal when the sun is highest (around 12-1 PM), when digestive fire (Agni) is at its peak.\n\nAdopting even two of these practices can dramatically enhance your vitality and longevity.`,
      featuredImage: "/images/blog-routine.png",
      author: "Varsha Ayurveda Wellness Team",
      published: true
    }
  ];

  for (const b of blogsData) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: b,
      create: b
    });
  }
  console.log('✔ Blogs seeded');

  // 6. Sample Initial Orders (1 COD and 1 Razorpay)
  const existingOrder = await prisma.order.findFirst();
  if (!existingOrder) {
    const mushroomProduct = await prisma.product.findFirst({ where: { slug: 'drl-strong-mushroom-powder' } });
    if (mushroomProduct) {
      await prisma.order.create({
        data: {
          orderNumber: "VA-2026-1001",
          customerId: customer.id,
          customerName: "Rahul Sharma",
          customerEmail: "customer@gmail.com",
          customerPhone: "9876543210",
          shippingAddress: "Flat 402, Green Valley Apartments, Arera Colony",
          city: "Bhopal",
          state: "Madhya Pradesh",
          pincode: "462016",
          subtotal: 720,
          shippingCharge: 0,
          discount: 0,
          totalAmount: 720,
          paymentMethod: PaymentMethod.COD_WHATSAPP,
          paymentStatus: PaymentStatus.COD_PENDING,
          orderStatus: OrderStatus.PENDING,
          notes: "Please deliver between 2 PM and 6 PM",
          items: {
            create: [
              {
                productId: mushroomProduct.id,
                productName: mushroomProduct.name,
                quantity: 2,
                price: mushroomProduct.price,
                total: 720
              }
            ]
          }
        }
      });
      console.log('✔ Sample initial order seeded');
    }
  }

  // 7. Sample Contact Message
  const existingMessage = await prisma.contactMessage.findFirst();
  if (!existingMessage) {
    await prisma.contactMessage.create({
      data: {
        name: "Vikram Malhotra",
        email: "vikram@example.com",
        phone: "9823456789",
        message: "Hello, could you advise whether the DRL Musli + Shilajit Powder is suitable for regular post-workout recovery?",
        status: "NEW"
      }
    });
    console.log('✔ Sample contact message seeded');
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
