// src/config/productConfig.ts
import {
  Shirt,
  Nut,
  Candy,
  Cake,
  Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type FieldType =
  | 'text' | 'number' | 'textarea' | 'select' | 'checkbox'
  | 'tags' | 'image' | 'images' | 'colorImages'
  | 'sizes' | 'sizeChart'
  | 'weightVariants' | 'nested';

export interface ProductField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  section?: string;
  helperText?: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  iconComponent: LucideIcon;
  color: string;
  gradient: string;
  skuPrefix: string;
  firestoreCategory: string;
  sections: string[];
  fields: ProductField[];
}

// ============================================================
// COMMON FIELDS
// ============================================================
const commonBasicFields: ProductField[] = [
  { name: 'name', label: 'Product Name', type: 'text', required: true, section: 'basic' },
  { name: 'brand', label: 'Brand', type: 'text', section: 'basic' },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'draft', 'out-of-stock'], section: 'basic' },
];

const commonPricingFields: ProductField[] = [
  { name: 'price', label: 'Price (Rs.)', type: 'number', required: true, min: 0, section: 'pricing' },
  { name: 'oldPrice', label: 'Old Price (Rs.)', type: 'number', min: 0, section: 'pricing' },
  { name: 'costPrice', label: 'Cost Price (Rs.)', type: 'number', min: 0, section: 'pricing' },
];

const commonInventoryFields: ProductField[] = [
  { name: 'stock', label: 'Stock Quantity', type: 'number', required: true, min: 0, section: 'inventory' },
  { name: 'lowStockAlert', label: 'Low Stock Alert', type: 'number', section: 'inventory' },
];

const commonImageFields: ProductField[] = [
  {
    name: 'image',
    label: 'Main Image',
    type: 'image',
    required: true,
    section: 'images',
    helperText: 'This is the primary image shown in product listings',
  },
  {
    name: 'images',
    label: 'Additional Images',
    type: 'images',
    section: 'images',
    helperText: 'Gallery images (unlimited)',
  },
];

const commonDescriptionFields: ProductField[] = [
  { name: 'shortDescription', label: 'Short Description', type: 'text', section: 'description' },
  { name: 'description', label: 'Full Description', type: 'textarea', section: 'description' },
];

const commonLabelFields: ProductField[] = [
  { name: 'isNew', label: 'New Arrival', type: 'checkbox', section: 'labels' },
  { name: 'isFeatured', label: 'Featured Product', type: 'checkbox', section: 'labels' },
  { name: 'isBestSeller', label: 'Best Seller', type: 'checkbox', section: 'labels' },
  { name: 'isOnSale', label: 'On Sale', type: 'checkbox', section: 'labels' },
];

// ✅ Shared field objects
const colorImagesField: ProductField = {
  name: 'colorImages',
  label: 'Colour Images',
  type: 'colorImages',
  section: 'images',
  helperText: 'Add images for specific colour variants (Red, Blue, etc.)',
};

const sizesField: ProductField = {
  name: 'sizes',
  label: 'Available Sizes',
  type: 'sizes',
  section: 'sizes',
  helperText: 'Select the sizes available for this product',
};

const sizeChartField: ProductField = {
  name: 'sizeChart',
  label: 'Size Chart',
  type: 'sizeChart',
  section: 'sizes',
  helperText: 'Fill in the measurements for each size',
};

// ============================================================
// FASHION SPECIFIC
// ============================================================
const fashionCategoryFields: ProductField[] = [
  { name: 'gender', label: 'For', type: 'select', options: ['Men', 'Women', 'Kids', 'Unisex'], required: true, section: 'category' },
  { name: 'productType', label: 'Product Type', type: 'select', options: ['Clothing', 'Footwear', 'Bags', 'Accessories'], required: true, section: 'category' },
  { name: 'subCategory', label: 'Sub Category', type: 'select', options: ['Unstitched', 'Ready to Wear', 'Sarees', 'Abayas', 'Nightwear', 'Heels', 'Flats', 'Slippers', 'Sandals', 'Khussa', 'Sneakers', 'Hand Bags', 'Shoulder Bags', 'Tote Bags', 'Crossbody Bags', 'Clutches', 'Wallets', 'Jewellery', 'Watches', 'Sunglasses', 'Scarves & Hijabs', 'Hair Accessories'], section: 'category' },
  { name: 'style', label: 'Style', type: 'text', section: 'category' },
  { name: 'material', label: 'Material', type: 'text', section: 'description' },
  { name: 'careInstructions', label: 'Care Instructions', type: 'text', section: 'description' },
];

// ============================================================
// DRY FRUITS SPECIFIC
// ============================================================
const dryFruitsCategoryFields: ProductField[] = [
  { name: 'subCategory', label: 'Category', type: 'select', options: ['almonds', 'cashews', 'pistachios', 'walnuts', 'raisins', 'dates', 'apricots', 'figs', 'prunes', 'mixed', 'seeds', 'coconut'], required: true, section: 'category' },
  { name: 'productType', label: 'Product Type', type: 'select', options: ['Raw', 'Roasted', 'Salted', 'Unsalted', 'Organic', 'Premium'], section: 'category' },
  { name: 'origin', label: 'Origin', type: 'select', options: ['Pakistan', 'India', 'USA', 'Iran', 'Turkey', 'Afghanistan'], section: 'category' },
  { name: 'weight', label: 'Weight', type: 'text', section: 'description' },
  { name: 'weightUnit', label: 'Weight Unit', type: 'select', options: ['g', 'kg', 'pcs', 'pack'], section: 'description' },
  { name: 'packaging', label: 'Packaging', type: 'text', section: 'description' },
  { name: 'shelfLife', label: 'Shelf Life', type: 'text', section: 'description' },
  { name: 'storageInstructions', label: 'Storage Instructions', type: 'text', section: 'description' },
  { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'textarea', section: 'description' },
  { name: 'benefits', label: 'Health Benefits', type: 'tags', section: 'benefits' },
  { name: 'isOrganic', label: 'Organic', type: 'checkbox', section: 'labels' },
  { name: 'isPremium', label: 'Premium', type: 'checkbox', section: 'labels' },
];

// ============================================================
// SWEETS SPECIFIC
// ============================================================
const sweetsCategoryFields: ProductField[] = [
  { name: 'subCategory', label: 'Category', type: 'select', options: ['chocolates', 'candy', 'toffees', 'wafer', 'biscuits', 'cakes', 'brownies', 'ice-cream', 'puddings', 'jams', 'nuts', 'gourmet'], required: true, section: 'category' },
  { name: 'productType', label: 'Product Type', type: 'select', options: ['Premium', 'Classic', 'Gourmet', 'Artisan', 'Organic', 'Sugar Free', 'Gluten Free', 'Vegan'], section: 'category' },
  { name: 'flavor', label: 'Flavor', type: 'select', options: ['Chocolate', 'Dark Chocolate', 'Milk Chocolate', 'White Chocolate', 'Caramel', 'Vanilla', 'Strawberry', 'Mango', 'Orange', 'Lemon', 'Mint', 'Coconut', 'Almond', 'Hazelnut', 'Pistachio', 'Walnut', 'Coffee', 'Mocha', 'Cappuccino', 'Red Velvet', 'Cheesecake', 'Tiramisu', 'Matcha', 'Rose', 'Salted Caramel'], section: 'category' },
  { name: 'weight', label: 'Weight', type: 'text', section: 'description' },
  { name: 'weightUnit', label: 'Weight Unit', type: 'select', options: ['g', 'kg', 'lb', 'oz', 'pcs', 'pack'], section: 'description' },
  { name: 'ingredients', label: 'Ingredients', type: 'tags', section: 'description' },
  { name: 'packaging', label: 'Packaging', type: 'text', section: 'description' },
  { name: 'shelfLife', label: 'Shelf Life', type: 'select', options: ['1 Month', '2 Months', '3 Months', '4 Months', '6 Months', '8 Months', '10 Months', '12 Months', '15 Months', '18 Months', '24 Months', '36 Months'], section: 'description' },
  { name: 'storageInstructions', label: 'Storage Instructions', type: 'text', section: 'description' },
  { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'textarea', section: 'description' },
  { name: 'dietaryInfo', label: 'Dietary Info', type: 'tags', section: 'benefits' },
  { name: 'benefits', label: 'Benefits', type: 'tags', section: 'benefits' },
  { name: 'isOrganic', label: 'Organic', type: 'checkbox', section: 'labels' },
  { name: 'isGlutenFree', label: 'Gluten Free', type: 'checkbox', section: 'labels' },
  { name: 'isVegan', label: 'Vegan', type: 'checkbox', section: 'labels' },
  { name: 'isSugarFree', label: 'Sugar Free', type: 'checkbox', section: 'labels' },
];

// ============================================================
// CAKES SPECIFIC
// ============================================================
const cakesCategoryFields: ProductField[] = [
  { name: 'department', label: 'Department', type: 'select', options: ['cakes', 'bakery', 'savory-snacks', 'specials'], required: true, section: 'category' },
  { name: 'productType', label: 'Product Type', type: 'select', options: ['Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 'Customized Cakes', 'Bento Cakes', 'Cupcakes', 'Cheesecakes', 'Pastry Cakes', 'Bread', 'Buns & Rolls', 'Croissants', 'Donuts', 'Cookies & Biscuits', 'Brownies', 'Muffins', 'Pastries', 'Pizza', 'Patties', 'Sandwiches', 'Burgers', 'Rolls', 'Samosas', 'Gift Boxes', 'Ramadan Specials', 'Eid Specials', 'Valentine Specials'], required: true, section: 'category' },
  { name: 'style', label: 'Style/Variant', type: 'text', section: 'category' },
  { name: 'orderType', label: 'Order Type', type: 'select', options: ['ready-stock', 'made-to-order', 'pre-order'], section: 'orderType' },
  { name: 'cakeDetails.flavor', label: 'Flavor', type: 'select', options: ['Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet', 'Blueberry', 'Caramel', 'Pistachio', 'Mango', 'Lemon', 'Orange', 'Coffee', 'Matcha', 'Oreo', 'Cream', 'Fruit'], section: 'cakeDetails' },
  { name: 'cakeDetails.weight', label: 'Weight / Size', type: 'text', section: 'cakeDetails' },
  { name: 'cakeDetails.shape', label: 'Shape', type: 'select', options: ['Round', 'Square', 'Heart', 'Oval', 'Rectangle', 'Custom'], section: 'cakeDetails' },
  { name: 'cakeDetails.servings', label: 'Servings', type: 'text', section: 'cakeDetails' },
  { name: 'cakeDetails.eggless', label: 'Eggless', type: 'checkbox', section: 'cakeDetails' },
  { name: 'cakeDetails.customizationAvailable', label: 'Customization Available', type: 'checkbox', section: 'cakeDetails' },
  { name: 'cakeDetails.advanceOrderRequired', label: 'Advance Order Required', type: 'checkbox', section: 'cakeDetails' },
  { name: 'cakeDetails.preparationTime', label: 'Preparation Time', type: 'text', section: 'cakeDetails' },
  { name: 'cakeDetails.customMessage', label: 'Custom Message', type: 'text', section: 'cakeDetails' },
  { name: 'foodDetails.weight', label: 'Weight', type: 'text', section: 'foodDetails' },
  { name: 'foodDetails.quantity', label: 'Quantity per Pack', type: 'number', section: 'foodDetails' },
  { name: 'foodDetails.expiryDate', label: 'Expiry Date', type: 'text', section: 'foodDetails' },
  { name: 'foodDetails.storageInstructions', label: 'Storage Instructions', type: 'text', section: 'foodDetails' },
  { name: 'ingredients', label: 'Ingredients', type: 'tags', section: 'ingredients' },
  { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'text', section: 'description' },
];

// ============================================================
// CATEGORY CONFIGS
// ============================================================
export const categoryConfigs: CategoryConfig[] = [
  // ══════════════ FASHION ══════════════
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    iconComponent: Shirt,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    skuPrefix: 'MOF',
    firestoreCategory: 'fashion',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'sizes', 'description', 'labels'],
    fields: [
      ...commonBasicFields,
      ...fashionCategoryFields,
      ...commonPricingFields,
      ...commonInventoryFields,
      ...commonImageFields,
      colorImagesField,
      sizesField,
      sizeChartField,
      ...commonDescriptionFields,
      ...commonLabelFields,
    ],
  },

  // ══════════════ DRY FRUITS ══════════════
  {
    id: 'dryfruits',
    name: 'Dry Fruits',
    icon: '🌱',
    iconComponent: Nut,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    skuPrefix: 'MDF',
    firestoreCategory: 'dryfruits',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'description', 'benefits', 'labels'],
    fields: [
      ...commonBasicFields,
      ...dryFruitsCategoryFields,
      ...commonPricingFields,
      ...commonInventoryFields,
      ...commonImageFields,
      ...commonDescriptionFields,
      ...commonLabelFields,
    ],
  },

  // ══════════════ SWEETS ══════════════
  {
    id: 'sweets',
    name: 'Sweets',
    icon: '🍬',
    iconComponent: Candy,
    color: 'pink',
    gradient: 'from-pink-500 to-rose-500',
    skuPrefix: 'MSS',
    firestoreCategory: 'sweets',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'description', 'benefits', 'labels'],
    fields: [
      ...commonBasicFields,
      ...sweetsCategoryFields,
      ...commonPricingFields,
      ...commonInventoryFields,
      ...commonImageFields,
      ...commonDescriptionFields,
      ...commonLabelFields,
    ],
  },

  // ══════════════ CAKES ══════════════
  {
    id: 'cakes',
    name: 'Cakes & Bakery',
    icon: '🎂',
    iconComponent: Cake,
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    skuPrefix: 'MOB',
    firestoreCategory: 'cakes',
    sections: ['basic', 'category', 'orderType', 'pricing', 'inventory', 'cakeDetails', 'foodDetails', 'images', 'ingredients', 'description', 'labels'],
    fields: [
      ...commonBasicFields,
      ...cakesCategoryFields,
      ...commonPricingFields,
      ...commonInventoryFields,
      ...commonImageFields,
      ...commonDescriptionFields,
      ...commonLabelFields,
    ],
  },

  // ══════════════ HERBAL ══════════════
  {
    id: 'herbal',
    name: 'Herbal',
    icon: '🌿',
    iconComponent: Leaf,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    skuPrefix: 'MHB',
    firestoreCategory: 'herbal',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'description', 'benefits', 'labels'],
    fields: [
      ...commonBasicFields,
      { name: 'subCategory', label: 'Category', type: 'select', options: ['herbal-tea', 'herbal-powder', 'herbal-oil', 'herbal-capsules', 'herbal-soap', 'herbal-shampoo', 'herbal-cream', 'herbal-honey', 'herbal-juice', 'herbal-seeds', 'herbal-leaves', 'herbal-roots', 'herbal-flowers', 'herbal-mix'], required: true, section: 'category' },
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Raw', 'Dried', 'Powdered', 'Liquid', 'Extract', 'Organic', 'Premium', 'Handmade', 'Cold-Pressed', 'Sun-Dried', 'Wild-Crafted'], section: 'category' },
      { name: 'origin', label: 'Origin', type: 'select', options: ['Pakistan', 'India', 'China', 'Nepal', 'Sri Lanka', 'Iran', 'Turkey', 'Egypt', 'Morocco', 'Local', 'Organic Farms'], section: 'category' },
      ...commonPricingFields,
      ...commonInventoryFields,
      { name: 'weight', label: 'Weight', type: 'text', section: 'description' },
      { name: 'weightUnit', label: 'Weight Unit', type: 'select', options: ['g', 'kg', 'ml', 'L', 'pcs', 'pack'], section: 'description' },
      { name: 'packaging', label: 'Packaging', type: 'select', options: ['Plastic Pouch', 'Glass Jar', 'Paper Box', 'Tin Can', 'Gift Box', 'Vacuum Pack', 'Bulk Pack', 'Eco-friendly', 'Resealable Bag', 'Premium Tin'], section: 'description' },
      { name: 'shelfLife', label: 'Shelf Life', type: 'select', options: ['3 Months', '6 Months', '9 Months', '12 Months', '18 Months', '24 Months', '36 Months'], section: 'description' },
      { name: 'ingredients', label: 'Ingredients', type: 'textarea', section: 'description' },
      { name: 'usage', label: 'How to Use', type: 'textarea', section: 'description' },
      { name: 'warnings', label: 'Warnings / Side Effects', type: 'textarea', section: 'description' },
      { name: 'storageInstructions', label: 'Storage Instructions', type: 'text', section: 'description' },
      { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'textarea', section: 'description' },
      ...commonDescriptionFields,
      ...commonImageFields,
      { name: 'benefits', label: 'Health Benefits', type: 'tags', section: 'benefits' },
      { name: 'isOrganic', label: 'Organic', type: 'checkbox', section: 'labels' },
      { name: 'isNatural', label: 'Natural', type: 'checkbox', section: 'labels' },
      { name: 'isVegan', label: 'Vegan', type: 'checkbox', section: 'labels' },
      { name: 'isGlutenFree', label: 'Gluten Free', type: 'checkbox', section: 'labels' },
      { name: 'isHalal', label: 'Halal', type: 'checkbox', section: 'labels' },
      ...commonLabelFields,
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const categoryMap = new Map(categoryConfigs.map(c => [c.id, c]));

export const getCategoryConfig = (id: string): CategoryConfig | undefined => {
  return categoryMap.get(id);
};

export const sectionTitles: Record<string, string> = {
  basic: '📋 Basic Information',
  category: '🏷️ Category',
  orderType: '📦 Order Type',
  pricing: '💰 Pricing',
  inventory: '📦 Inventory',
  weightVariants: '⚖️ Weight Variants',
  cakeDetails: '🎂 Cake Details',
  foodDetails: '🍽️ Food Details',
  images: '🖼️ Images',
  sizes: '📏 Sizes & Measurements',
  variants: '🎨 Variants',
  ingredients: '🧾 Ingredients',
  description: '📝 Description',
  benefits: '⭐ Benefits & Dietary',
  labels: '🏷️ Labels & Tags',
};