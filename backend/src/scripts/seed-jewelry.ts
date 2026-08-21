import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows";

// Top-level jewelry categories surfaced in storefront search suggestions
// and category navigation. Idempotent: only missing handles are created.
const JEWELRY_CATEGORIES = [
  { name: "Engagement Rings", handle: "engagement-rings" },
  { name: "Wedding Bands", handle: "wedding-bands" },
  { name: "Necklaces", handle: "necklaces" },
  { name: "Earrings", handle: "earrings" },
  { name: "Bracelets", handle: "bracelets" },
  { name: "Pendants", handle: "pendants" },
  { name: "Diamonds", handle: "diamonds" },
];

// Demo data from Medusa's base seed (seed.ts). We delete these on every
// jewelry-seed run so a jewelry store never ships apparel categories/products.
const APPAREL_CATEGORY_HANDLES = ["shirts", "sweatshirts", "pants", "merch"];
const APPAREL_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];

// Seed images live in the storefront's /public/seed/ folder so they resolve
// against the storefront's own origin in every environment (dev, prod) with
// no env var or CDN. Swap these for real product photos when available.
const DIAMOND_IMAGE_BY_SHAPE: Record<string, string> = {
  Round:    "/seed/jewelry-round.png",
  Oval:     "/seed/jewelry-oval.png",
  Cushion:  "/seed/jewelry-cushion.png",
  Princess: "/seed/jewelry-princess.png",
  Pear:     "/seed/jewelry-pear.png",
  Emerald:  "/seed/jewelry-emerald.png",
};

// Single source of truth for every seeded product's canonical thumbnail.
// The reconciliation step uses this map to update in-place — so changing
// any URL here makes prod pick it up on the next boot, zero manual work.
const SEEDED_PRODUCT_THUMBNAILS: Record<string, string> = {
  // Ring settings
  "solitaire-prong-setting":        "/seed/jewelry-setting.png",
  "pave-halo-setting":              "/seed/jewelry-setting.png",
  "three-stone-setting":            "/seed/jewelry-setting.png",
  // Engagement ring (pre-set)
  "lumiere-solitaire-1ct":          "/seed/jewelry-engagement.png",
  // Diamonds — keyed via DIAMOND_IMAGE_BY_SHAPE for one-image-per-shape variety
  "diamond-0-50ct-round-f-vs1":     DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-0-75ct-round-g-vs2":     DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-1-00ct-round-f-vs1":     DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-1-25ct-round-g-si1":     DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-1-50ct-round-e-vvs2":    DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-2-00ct-round-d-vvs1":    DIAMOND_IMAGE_BY_SHAPE.Round,
  "diamond-1-00ct-oval-g-vs2":      DIAMOND_IMAGE_BY_SHAPE.Oval,
  "diamond-1-20ct-oval-f-si1":      DIAMOND_IMAGE_BY_SHAPE.Oval,
  "diamond-1-00ct-cushion-h-vs1":   DIAMOND_IMAGE_BY_SHAPE.Cushion,
  "diamond-1-50ct-princess-g-vs2":  DIAMOND_IMAGE_BY_SHAPE.Princess,
  "diamond-0-90ct-pear-f-vs1":      DIAMOND_IMAGE_BY_SHAPE.Pear,
  "diamond-1-10ct-emerald-g-vvs2":  DIAMOND_IMAGE_BY_SHAPE.Emerald,
};

export default async function seedJewelryData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const productModuleService = container.resolve(Modules.PRODUCT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const inventoryModuleService = container.resolve(Modules.INVENTORY);
  const stockLocationModuleService = container.resolve(
    Modules.STOCK_LOCATION
  );

  // ── 1. Resolve dependencies ──────────────────────────────────────────────
  logger.info("[seed-jewelry] Resolving sales channel...");
  const [defaultSalesChannel] =
    await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });

  if (!defaultSalesChannel) {
    throw new Error(
      "Default Sales Channel not found. Run the base seed (seed.ts) first."
    );
  }

  logger.info("[seed-jewelry] Resolving shipping profile...");
  const shippingProfiles =
    await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  const shippingProfile = shippingProfiles[0];
  if (!shippingProfile) {
    throw new Error(
      "Default Shipping Profile not found. Run the base seed first."
    );
  }

  logger.info("[seed-jewelry] Resolving stock location...");
  const [stockLocation] =
    await stockLocationModuleService.listStockLocations({});
  if (!stockLocation) {
    throw new Error("Stock Location not found. Run the base seed first.");
  }

  // ── 2a. Ensure jewelry categories exist (idempotent) ────────────────────
  logger.info("[seed-jewelry] Ensuring jewelry categories...");
  const existingJewelryCats = await productModuleService.listProductCategories({
    handle: JEWELRY_CATEGORIES.map((c) => c.handle),
  });
  const existingHandles = new Set(existingJewelryCats.map((c) => c.handle));
  const missingCats = JEWELRY_CATEGORIES.filter(
    (c) => !existingHandles.has(c.handle)
  );
  if (missingCats.length > 0) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCats.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
        })),
      },
    });
    logger.info(
      `[seed-jewelry] Created ${missingCats.length} jewelry categories: ${missingCats
        .map((c) => c.handle)
        .join(", ")}`
    );
  } else {
    logger.info("[seed-jewelry] All jewelry categories already present.");
  }

  // ── 2b. Remove apparel demo data from base seed (idempotent) ─────────────
  logger.info("[seed-jewelry] Removing apparel demo data...");
  const apparelCats = await productModuleService.listProductCategories({
    handle: APPAREL_CATEGORY_HANDLES,
  });
  const apparelProducts = await productModuleService.listProducts({
    handle: APPAREL_PRODUCT_HANDLES,
  });
  if (apparelProducts.length > 0) {
    await productModuleService.deleteProducts(apparelProducts.map((p) => p.id));
    logger.info(
      `[seed-jewelry] Removed ${apparelProducts.length} apparel demo products.`
    );
  }
  if (apparelCats.length > 0) {
    await productModuleService.deleteProductCategories(
      apparelCats.map((c) => c.id)
    );
    logger.info(
      `[seed-jewelry] Removed ${apparelCats.length} apparel categories.`
    );
  }

  // ── 2c. Reconcile seeded product thumbnails (idempotent) ─────────────────
  // Re-applies SEEDED_PRODUCT_THUMBNAILS to any existing seeded products so a
  // future seed-jewelry release that changes image URLs auto-updates prod
  // on the next boot — no SQL, no admin clicks, no rebuild of the catalog.
  logger.info("[seed-jewelry] Reconciling seeded product thumbnails...");
  const seededHandles = Object.keys(SEEDED_PRODUCT_THUMBNAILS);
  const existingSeeded = await productModuleService.listProducts({
    handle: seededHandles,
  });
  const thumbUpdates = existingSeeded.flatMap((p) => {
    const expected = p.handle ? SEEDED_PRODUCT_THUMBNAILS[p.handle] : undefined;
    if (!expected || p.thumbnail === expected) return [];
    return [{ id: p.id, thumbnail: expected }];
  });
  if (thumbUpdates.length > 0) {
    await Promise.all(
      thumbUpdates.map((u) =>
        productModuleService.updateProducts(u.id, { thumbnail: u.thumbnail })
      )
    );
    logger.info(
      `[seed-jewelry] Updated thumbnails on ${thumbUpdates.length} seeded products.`
    );
  } else if (existingSeeded.length > 0) {
    logger.info("[seed-jewelry] All seeded-product thumbnails already current.");
  }

  // ── 2d. Skip remaining product seed if jewelry collections already exist
  logger.info("[seed-jewelry] Checking existing collections...");
  const existingCollections = await productModuleService.listProductCollections(
    { handle: ["settings", "engagement-rings", "diamonds"] }
  );
  if (existingCollections.length > 0) {
    logger.info(
      `[seed-jewelry] Collections already exist (${existingCollections
        .map((c) => c.handle)
        .join(", ")}). Skipping product seed.`
    );
    return;
  }

  // ── 3. Create collections ────────────────────────────────────────────────
  logger.info("[seed-jewelry] Creating collections...");
  const { result: collectionsResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        { title: "Settings", handle: "settings" },
        { title: "Engagement Rings", handle: "engagement-rings" },
        { title: "Diamonds", handle: "diamonds" },
      ],
    },
  });

  const settingsCollection = collectionsResult.find(
    (c) => c.handle === "settings"
  )!;
  const engagementCollection = collectionsResult.find(
    (c) => c.handle === "engagement-rings"
  )!;
  const diamondsCollection = collectionsResult.find(
    (c) => c.handle === "diamonds"
  )!;

  logger.info(
    `[seed-jewelry] Created collections: ${collectionsResult
      .map((c) => c.handle)
      .join(", ")}`
  );

  // ── 4. Seed Ring Settings ────────────────────────────────────────────────
  logger.info("[seed-jewelry] Seeding ring settings...");

  const settingsProducts = [
    {
      title: "Solitaire Prong Setting",
      handle: "solitaire-prong-setting",
      description:
        "A timeless 6-prong solitaire setting that elevates any center stone. Crafted for maximum light exposure and security.",
      collection_id: settingsCollection.id,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
        },
      ],
      metadata: {
        diamonds_collection_id: diamondsCollection.id,
        setting_type: "solitaire",
        prong_style: "6-prong",
        center_stone_shape: "round,oval,cushion",
      },
      options: [
        { title: "Metal", values: ["14K Yellow Gold", "14K White Gold", "Platinum"] },
        { title: "Ring Size", values: ["5", "5.5", "6", "6.5", "7", "7.5", "8"] },
      ],
      variants: buildSettingVariants(
        "SOLIT-PRONG",
        ["14K Yellow Gold", "14K White Gold", "Platinum"],
        ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
        { "14K Yellow Gold": 95000, "14K White Gold": 98000, Platinum: 135000 }
      ),
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Pavé Halo Setting",
      handle: "pave-halo-setting",
      description:
        "A dazzling micro-pavé halo surrounds your center stone with a brilliant constellation of diamonds. Maximum sparkle, unmatched elegance.",
      collection_id: settingsCollection.id,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
        },
      ],
      metadata: {
        diamonds_collection_id: diamondsCollection.id,
        setting_type: "halo",
        prong_style: "mikro-pave",
        center_stone_shape: "round,oval,cushion,princess",
      },
      options: [
        { title: "Metal", values: ["14K Yellow Gold", "14K White Gold", "Platinum"] },
        { title: "Ring Size", values: ["5", "5.5", "6", "6.5", "7", "7.5", "8"] },
      ],
      variants: buildSettingVariants(
        "HALO-PAVE",
        ["14K Yellow Gold", "14K White Gold", "Platinum"],
        ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
        { "14K Yellow Gold": 115000, "14K White Gold": 120000, Platinum: 160000 }
      ),
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
    {
      title: "Classic Three-Stone Setting",
      handle: "three-stone-setting",
      description:
        "Past, present, and future — our three-stone setting beautifully frames your center diamond with two perfectly matched side stones.",
      collection_id: settingsCollection.id,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
        },
      ],
      metadata: {
        diamonds_collection_id: diamondsCollection.id,
        setting_type: "three-stone",
        prong_style: "4-prong",
        center_stone_shape: "round,oval,pear",
      },
      options: [
        { title: "Metal", values: ["14K Yellow Gold", "14K White Gold", "Platinum"] },
        { title: "Ring Size", values: ["5", "5.5", "6", "6.5", "7", "7.5", "8"] },
      ],
      variants: buildSettingVariants(
        "THREE-STONE",
        ["14K Yellow Gold", "14K White Gold", "Platinum"],
        ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
        { "14K Yellow Gold": 125000, "14K White Gold": 130000, Platinum: 175000 }
      ),
      sales_channels: [{ id: defaultSalesChannel.id }],
    },
  ];

  const { result: settingsResult } = await createProductsWorkflow(
    container
  ).run({ input: { products: settingsProducts as any } });

  logger.info(
    `[seed-jewelry] Created ${settingsResult.length} ring settings.`
  );

  // ── 5. Seed Engagement Ring (pre-set, BYOR-optional) ─────────────────────
  logger.info("[seed-jewelry] Seeding engagement rings...");

  const { result: engagementResult } = await createProductsWorkflow(
    container
  ).run({
    input: {
      products: [
        {
          title: "Lumière Solitaire — 1ct Round Diamond",
          handle: "lumiere-solitaire-1ct",
          description:
            "A pre-set 1.0ct GIA-certified round brilliant diamond in our signature platinum 6-prong solitaire. The perfect ready-to-ship engagement ring.",
          collection_id: engagementCollection.id,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
            },
            {
              url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
            },
          ],
          metadata: {
            diamonds_collection_id: diamondsCollection.id,
            carat: "1.00",
            cut: "Excellent",
            color: "F",
            clarity: "VS1",
            certification: "GIA",
            certificate_number: "2457432190",
          },
          options: [
            {
              title: "Ring Size",
              values: ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
            },
          ],
          variants: ["5", "5.5", "6", "6.5", "7", "7.5", "8"].map((size) => ({
            title: `Size ${size}`,
            sku: `LUMIERE-1CT-${size.replace(".", "-")}`,
            options: { "Ring Size": size },
            prices: [{ amount: 498000, currency_code: "usd" }],
          })),
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ] as any,
    },
  });

  logger.info(
    `[seed-jewelry] Created ${engagementResult.length} engagement ring(s).`
  );

  // ── 6. Seed Diamonds ─────────────────────────────────────────────────────
  logger.info("[seed-jewelry] Seeding diamonds...");

  const diamondSpecs = [
    {
      title: "0.50ct Round Brilliant — F/VS1",
      handle: "diamond-0-50ct-round-f-vs1",
      carat: "0.50",
      shape: "Round",
      cut: "Excellent",
      color: "F",
      clarity: "VS1",
      cert: "GIA",
      price: 230000,
      sku: "DIA-0.50-RD-F-VS1",
    },
    {
      title: "0.75ct Round Brilliant — G/VS2",
      handle: "diamond-0-75ct-round-g-vs2",
      carat: "0.75",
      shape: "Round",
      cut: "Excellent",
      color: "G",
      clarity: "VS2",
      cert: "GIA",
      price: 340000,
      sku: "DIA-0.75-RD-G-VS2",
    },
    {
      title: "1.00ct Round Brilliant — F/VS1",
      handle: "diamond-1-00ct-round-f-vs1",
      carat: "1.00",
      shape: "Round",
      cut: "Excellent",
      color: "F",
      clarity: "VS1",
      cert: "GIA",
      price: 520000,
      sku: "DIA-1.00-RD-F-VS1",
    },
    {
      title: "1.25ct Round Brilliant — G/SI1",
      handle: "diamond-1-25ct-round-g-si1",
      carat: "1.25",
      shape: "Round",
      cut: "Very Good",
      color: "G",
      clarity: "SI1",
      cert: "GIA",
      price: 580000,
      sku: "DIA-1.25-RD-G-SI1",
    },
    {
      title: "1.50ct Round Brilliant — E/VVS2",
      handle: "diamond-1-50ct-round-e-vvs2",
      carat: "1.50",
      shape: "Round",
      cut: "Excellent",
      color: "E",
      clarity: "VVS2",
      cert: "GIA",
      price: 890000,
      sku: "DIA-1.50-RD-E-VVS2",
    },
    {
      title: "2.00ct Round Brilliant — D/VVS1",
      handle: "diamond-2-00ct-round-d-vvs1",
      carat: "2.00",
      shape: "Round",
      cut: "Excellent",
      color: "D",
      clarity: "VVS1",
      cert: "GIA",
      price: 1980000,
      sku: "DIA-2.00-RD-D-VVS1",
    },
    {
      title: "1.00ct Oval Brilliant — G/VS2",
      handle: "diamond-1-00ct-oval-g-vs2",
      carat: "1.00",
      shape: "Oval",
      cut: "Excellent",
      color: "G",
      clarity: "VS2",
      cert: "IGI",
      price: 430000,
      sku: "DIA-1.00-OV-G-VS2",
    },
    {
      title: "1.20ct Oval Brilliant — F/SI1",
      handle: "diamond-1-20ct-oval-f-si1",
      carat: "1.20",
      shape: "Oval",
      cut: "Very Good",
      color: "F",
      clarity: "SI1",
      cert: "IGI",
      price: 510000,
      sku: "DIA-1.20-OV-F-SI1",
    },
    {
      title: "1.00ct Cushion Brilliant — H/VS1",
      handle: "diamond-1-00ct-cushion-h-vs1",
      carat: "1.00",
      shape: "Cushion",
      cut: "Very Good",
      color: "H",
      clarity: "VS1",
      cert: "GIA",
      price: 395000,
      sku: "DIA-1.00-CU-H-VS1",
    },
    {
      title: "1.50ct Princess Cut — G/VS2",
      handle: "diamond-1-50ct-princess-g-vs2",
      carat: "1.50",
      shape: "Princess",
      cut: "Excellent",
      color: "G",
      clarity: "VS2",
      cert: "GIA",
      price: 720000,
      sku: "DIA-1.50-PR-G-VS2",
    },
    {
      title: "0.90ct Pear Shape — F/VS1",
      handle: "diamond-0-90ct-pear-f-vs1",
      carat: "0.90",
      shape: "Pear",
      cut: "Excellent",
      color: "F",
      clarity: "VS1",
      cert: "GIA",
      price: 410000,
      sku: "DIA-0.90-PE-F-VS1",
    },
    {
      title: "1.10ct Emerald Cut — G/VVS2",
      handle: "diamond-1-10ct-emerald-g-vvs2",
      carat: "1.10",
      shape: "Emerald",
      cut: "Excellent",
      color: "G",
      clarity: "VVS2",
      cert: "GIA",
      price: 680000,
      sku: "DIA-1.10-EM-G-VVS2",
    },
  ];

  const diamondProductInputs = diamondSpecs.map((d) => ({
    title: d.title,
    handle: d.handle,
    description: `${d.carat}ct ${d.shape} brilliant cut diamond. ${d.cut} cut, ${d.color} color, ${d.clarity} clarity. ${d.cert} certified.`,
    collection_id: diamondsCollection.id,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    images: [
      {
        url:
          DIAMOND_IMAGE_BY_SHAPE[d.shape] ??
          DIAMOND_IMAGE_BY_SHAPE.Round,
      },
    ],
    metadata: {
      carat: d.carat,
      shape: d.shape,
      cut: d.cut,
      color: d.color,
      clarity: d.clarity,
      certification: d.cert,
      product_type: "diamond",
    },
    options: [{ title: "Certification", values: [d.cert] }],
    variants: [
      {
        title: `${d.carat}ct ${d.shape}`,
        sku: d.sku,
        options: { Certification: d.cert },
        prices: [{ amount: d.price, currency_code: "usd" }],
      },
    ],
    sales_channels: [{ id: defaultSalesChannel.id }],
  }));

  const { result: diamondsResult } = await createProductsWorkflow(
    container
  ).run({ input: { products: diamondProductInputs as any } });

  logger.info(
    `[seed-jewelry] Created ${diamondsResult.length} diamond products.`
  );

  // ── 7. Add inventory for all created products ────────────────────────────
  logger.info("[seed-jewelry] Adding inventory levels...");

  const allProducts = [
    ...settingsResult,
    ...engagementResult,
    ...diamondsResult,
  ];

  const inventoryItems = await inventoryModuleService.listInventoryItems({});
  const skuToInventoryItem = new Map(
    inventoryItems.map((item) => [item.sku, item])
  );

  const inventoryLevels: {
    inventory_item_id: string;
    location_id: string;
    stocked_quantity: number;
  }[] = [];

  for (const product of allProducts) {
    for (const variant of product.variants ?? []) {
      const inventoryItem = skuToInventoryItem.get(variant.sku ?? "");
      if (inventoryItem) {
        inventoryLevels.push({
          inventory_item_id: inventoryItem.id,
          location_id: stockLocation.id,
          stocked_quantity: 10,
        });
      }
    }
  }

  if (inventoryLevels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
  }

  logger.info("[seed-jewelry] ✓ Jewelry seed complete!");
  logger.info(
    `  Collections: settings, engagement-rings, diamonds`
  );
  logger.info(`  Settings: ${settingsResult.length} products`);
  logger.info(`  Engagement Rings: ${engagementResult.length} products`);
  logger.info(`  Diamonds: ${diamondsResult.length} products`);
  logger.info(
    `  Inventory levels added for ${inventoryLevels.length} variants`
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildSettingVariants(
  skuPrefix: string,
  metals: string[],
  sizes: string[],
  metalPrices: Record<string, number>
) {
  const variants: object[] = [];
  for (const metal of metals) {
    for (const size of sizes) {
      const metalSlug = metal.replace(/\s+/g, "-").replace(/\//g, "-");
      variants.push({
        title: `${metal} / Size ${size}`,
        sku: `${skuPrefix}-${metalSlug}-${size.replace(".", "-")}`,
        options: { Metal: metal, "Ring Size": size },
        prices: [
          {
            amount: metalPrices[metal] ?? 100000,
            currency_code: "usd",
          },
        ],
      });
    }
  }
  return variants;
}
