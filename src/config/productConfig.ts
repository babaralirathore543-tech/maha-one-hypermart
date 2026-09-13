// src/config/productConfig.ts

export type FieldType =
  | 'text' | 'number' | 'textarea' | 'select' | 'checkbox'
  | 'tags' | 'images' | 'colorImages' | 'weightVariants'
  | 'nested' | 'sku';

export interface ProductField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  showFor?: 'admin' | 'seller' | 'both';
  section?: string;
  helperText?: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  skuPrefix: string;
  firestoreCategory: string;
  sections: string[];            // Order of sections
  fields: ProductField[];
}

// ============================================================
// ✅ COMMON FIELDS — Har category mein
// ============================================================
const commonBasicFields: ProductField[] = [
  { name: 'name', label: 'Product Name', type: 'text', required: true, section: 'basic' },
  { name: 'brand', label: 'Brand', type: 'text', section: 'basic' },
  { name: 'sku', label: 'SKU / Code', type: 'sku', section: 'basic' },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'draft', 'out-of-stock'], section: 'basic' },
];

const commonPricingFields: ProductField[] = [
  { name: 'price', label: 'Price (Rs.)', type: 'number', required: true, min: 0, section: 'pricing' },
  { name: 'oldPrice', label: 'Old Price', type: 'number', min: 0, section: 'pricing' },
  { name: 'discount', label: 'Discount %', type: 'number', min: 0, max: 100, section: 'pricing' },
  { name: 'costPrice', label: 'Cost Price (Admin)', type: 'number', showFor: 'admin', section: 'pricing' },
];

const commonInventoryFields: ProductField[] = [
  { name: 'stock', label: 'Stock Quantity', type: 'number', required: true, min: 0, section: 'inventory' },
  { name: 'lowStockAlert', label: 'Low Stock Alert', type: 'number', section: 'inventory' },
];

const commonImageFields: ProductField[] = [
  { name: 'image', label: 'Main Image', type: 'images', required: true, section: 'images' },
  { name: 'images', label: 'Gallery Images', type: 'images', section: 'images' },
];

const commonDescriptionFields: ProductField[] = [
  { name: 'shortDescription', label: 'Short Description', type: 'text', section: 'description' },
  { name: 'description', label: 'Full Description', type: 'textarea', section: 'description' },
];

const commonLabelFields: ProductField[] = [
  { name: 'isNew', label: 'New Arrival', type: 'checkbox', section: 'labels' },
  { name: 'isFeatured', label: 'Featured Product', type: 'checkbox', showFor: 'admin', section: 'labels' },
  { name: 'isBestSeller', label: 'Best Seller', type: 'checkbox', section: 'labels' },
  { name: 'isOnSale', label: 'On Sale', type: 'checkbox', section: 'labels' },
];

// ============================================================
// ✅ CATEGORY CONFIGS
// ============================================================
export const categoryConfigs: CategoryConfig[] = [
  // ==========================================================
  // FASHION
  // ==========================================================
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    color: 'purple',
    skuPrefix: 'MOF',
    firestoreCategory: 'fashion',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'variants', 'description', 'labels'],
    fields: [
      ...commonBasicFields,
      // Category fields
      { name: 'gender', label: 'For', type: 'select', options: ['Men', 'Women', 'Kids', 'Unisex'], required: true, section: 'category' },
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Clothing', 'Footwear', 'Bags', 'Accessories'], required: true, section: 'category' },
      { name: 'subCategory', label: 'Sub Category', type: 'text', section: 'category' },
      { name: 'style', label: 'Style', type: 'text', section: 'category' },
      // Pricing
      ...commonPricingFields,
      // Inventory
      ...commonInventoryFields,
      // Images
      ...commonImageFields,
      // Variants
      { name: 'sizes', label: 'Available Sizes', type: 'tags', section: 'variants' },
      { name: 'colors', label: 'Colors', type: 'colorImages', section: 'variants' },
      // Details
      { name: 'material', label: 'Material', type: 'text', section: 'description' },
      { name: 'careInstructions', label: 'Care Instructions', type: 'text', section: 'description' },
      ...commonDescriptionFields,
      // Labels
      ...commonLabelFields,
    ],
  },

  // ==========================================================
  // DRY FRUITS
  // ==========================================================
  {
    id: 'dryfruits',
    name: 'Dry Fruits',
    icon: '🌱',
    color: 'green',
    skuPrefix: 'MDF',
    firestoreCategory: 'dryfruits',
    sections: ['basic', 'category', 'pricing', 'inventory', 'weightVariants', 'images', 'description', 'benefits', 'labels'],
    fields: [
      ...commonBasicFields,
      // Category
      { name: 'subCategory', label: 'Category', type: 'select', options: ['almonds', 'cashews', 'pistachios', 'walnuts', 'raisins', 'dates', 'apricots', 'figs', 'prunes', 'mixed', 'seeds', 'coconut'], required: true, section: 'category' },
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Raw', 'Roasted', 'Salted', 'Unsalted', 'Organic', 'Premium'], section: 'category' },
      { name: 'origin', label: 'Origin', type: 'select', options: ['Pakistan', 'India', 'USA', 'Iran', 'Turkey', 'Afghanistan'], section: 'category' },
      // Pricing
      ...commonPricingFields,
      // Inventory
      ...commonInventoryFields,
      // Weight variants
      { name: 'weightVariants', label: 'Weight Variants', type: 'weightVariants', section: 'weightVariants' },
      // Images
      ...commonImageFields,
      // Details
      { name: 'packaging', label: 'Packaging', type: 'text', section: 'description' },
      { name: 'shelfLife', label: 'Shelf Life', type: 'text', section: 'description' },
      { name: 'storageInstructions', label: 'Storage Instructions', type: 'text', section: 'description' },
      { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'textarea', section: 'description' },
      ...commonDescriptionFields,
      // Benefits
      { name: 'benefits', label: 'Health Benefits', type: 'tags', section: 'benefits' },
      { name: 'isOrganic', label: 'Organic', type: 'checkbox', section: 'labels' },
      { name: 'isPremium', label: 'Premium', type: 'checkbox', section: 'labels' },
      // Labels
      ...commonLabelFields,
    ],
  },

  // ==========================================================
  // SWEETS
  // ==========================================================
  {
    id: 'sweets',
    name: 'Sweets',
    icon: '🍬',
    color: 'pink',
    skuPrefix: 'MSS',
    firestoreCategory: 'sweets',
    sections: ['basic', 'category', 'pricing', 'inventory', 'images', 'description', 'benefits', 'labels'],
    fields: [
      ...commonBasicFields,
      // Category
      { name: 'subCategory', label: 'Category', type: 'select', options: ['chocolates', 'candy', 'toffees', 'wafer', 'biscuits', 'cakes', 'brownies', 'ice-cream', 'puddings', 'jams', 'nuts', 'gourmet'], required: true, section: 'category' },
      { name: 'productType', label: 'Product Type', type: 'select', options: ['Premium', 'Classic', 'Gourmet', 'Artisan', 'Organic', 'Sugar Free', 'Gluten Free', 'Vegan'], section: 'category' },
      { name: 'flavor', label: 'Flavor', type: 'select', options: ['Chocolate', 'Caramel', 'Vanilla', 'Strawberry', 'Mango', 'Orange', 'Mint', 'Coffee'], section: 'category' },
      // Pricing
      ...commonPricingFields,
      // Inventory
      ...commonInventoryFields,
      // Images
      ...commonImageFields,
      // Details
      { name: 'weight', label: 'Weight', type: 'text', section: 'description' },
      { name: 'weightUnit', label: 'Weight Unit', type: 'select', options: ['g', 'kg', 'pcs', 'pack'], section: 'description' },
      { name: 'ingredients', label: 'Ingredients', type: 'tags', section: 'description' },
      { name: 'packaging', label: 'Packaging', type: 'text', section: 'description' },
      { name: 'shelfLife', label: 'Shelf Life', type: 'text', section: 'description' },
      { name: 'storageInstructions', label: 'Storage Instructions', type: 'text', section: 'description' },
      { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'textarea', section: 'description' },
      ...commonDescriptionFields,
      // Dietary & Benefits
      { name: 'dietaryInfo', label: 'Dietary Info', type: 'tags', section: 'benefits' },
      { name: 'benefits', label: 'Benefits', type: 'tags', section: 'benefits' },
      { name: 'isOrganic', label: 'Organic', type: 'checkbox', section: 'labels' },
      { name: 'isGlutenFree', label: 'Gluten Free', type: 'checkbox', section: 'labels' },
      { name: 'isVegan', label: 'Vegan', type: 'checkbox', section: 'labels' },
      { name: 'isSugarFree', label: 'Sugar Free', type: 'checkbox', section: 'labels' },
      // Labels
      ...commonLabelFields,
    ],
  },

  // ==========================================================
  // CAKES & BAKERY
  // ==========================================================
  {
    id: 'cakes',
    name: 'Cakes & Bakery',
    icon: '🎂',
    color: 'orange',
    skuPrefix: 'MOB',
    firestoreCategory: 'cakes',
    sections: ['basic', 'category', 'orderType', 'pricing', 'inventory', 'cakeDetails', 'foodDetails', 'images', 'sizes', 'ingredients', 'description', 'labels'],
    fields: [
      ...commonBasicFields,
      // Category
      { name: 'department', label: 'Department', type: 'select', options: ['cakes', 'bakery', 'savory-snacks', 'specials'], required: true, section: 'category' },
      { name: 'productType', label: 'Product Type', type: 'text', required: true, section: 'category' },
      { name: 'style', label: 'Style/Variant', type: 'text', section: 'category' },
      // Order Type
      { name: 'orderType', label: 'Order Type', type: 'select', options: ['ready-stock', 'made-to-order', 'pre-order'], section: 'orderType' },
      // Pricing
      ...commonPricingFields,
      // Inventory
      ...commonInventoryFields,
      // Cake Details
      { name: 'cakeDetails.flavor', label: 'Flavor', type: 'select', options: ['Chocolate', 'Vanilla', 'Strawberry', 'Red Velvet', 'Blueberry'], section: 'cakeDetails' },
      { name: 'cakeDetails.weight', label: 'Weight', type: 'text', section: 'cakeDetails' },
      { name: 'cakeDetails.shape', label: 'Shape', type: 'select', options: ['Round', 'Square', 'Heart', 'Oval', 'Rectangle'], section: 'cakeDetails' },
      { name: 'cakeDetails.servings', label: 'Servings', type: 'text', section: 'cakeDetails' },
      { name: 'cakeDetails.eggless', label: 'Eggless', type: 'checkbox', section: 'cakeDetails' },
      { name: 'cakeDetails.customizationAvailable', label: 'Customization Available', type: 'checkbox', section: 'cakeDetails' },
      { name: 'cakeDetails.advanceOrderRequired', label: 'Advance Order Required', type: 'checkbox', section: 'cakeDetails' },
      { name: 'cakeDetails.preparationTime', label: 'Preparation Time', type: 'text', section: 'cakeDetails' },
      { name: 'cakeDetails.customMessage', label: 'Custom Message', type: 'text', section: 'cakeDetails' },
      // Food Details
      { name: 'foodDetails.weight', label: 'Weight', type: 'text', section: 'foodDetails' },
      { name: 'foodDetails.quantity', label: 'Quantity', type: 'number', section: 'foodDetails' },
      { name: 'foodDetails.expiryDate', label: 'Expiry Date', type: 'text', section: 'foodDetails' },
      { name: 'foodDetails.storageInstructions', label: 'Storage Instructions', type: 'text', section: 'foodDetails' },
      // Images
      ...commonImageFields,
      // Sizes
      { name: 'sizes', label: 'Sizes', type: 'tags', section: 'sizes' },
      // Ingredients
      { name: 'ingredients', label: 'Ingredients', type: 'tags', section: 'ingredients' },
      // Description
      { name: 'nutritionalInfo', label: 'Nutritional Info', type: 'text', section: 'description' },
      ...commonDescriptionFields,
      // Labels
      ...commonLabelFields,
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
export const getCategoryConfig = (id: string): CategoryConfig | undefined => {
  return categoryConfigs.find(c => c.id === id);
};

export const getFieldsBySection = (categoryId: string, section: string, mode: 'admin' | 'seller'): ProductField[] => {
  const config = getCategoryConfig(categoryId);
  if (!config) return [];
  
  return config.fields.filter(field => {
    if (field.section !== section) return false;
    if (!field.showFor || field.showFor === 'both') return true;
    return field.showFor === mode;
  });
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
  variants: '🎨 Variants',
  sizes: '📏 Sizes',
  ingredients: '🧾 Ingredients',
  description: '📝 Description',
  benefits: '⭐ Benefits & Dietary',
  labels: '🏷️ Labels & Tags',
};