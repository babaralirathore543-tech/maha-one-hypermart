// src/data/sizeChartTemplates.ts

/**
 * Size chart templates per fashion product type.
 * Includes PREFILLED default values for standard sizes.
 * Seller/admin can override values but defaults remain available.
 */

export interface SizeChartRow {
  size: string;
  values: Record<string, string>;
}

export interface SizeChartTemplate {
  id: string;
  label: string;
  description: string;
  columns: {
    key: string;
    label: string;
    placeholder?: string;
  }[];
  unit: 'inches' | 'cm' | 'mixed' | 'none';
  sizes: string[];
  /** ✅ Prefilled default values per size */
  defaults: Record<string, Record<string, string>>;
}

export const SIZE_CHART_TEMPLATES: Record<string, SizeChartTemplate> = {
  // ==================== CLOTHING ====================
  clothing: {
    id: 'clothing',
    label: 'Clothing',
    description: 'Standard clothing size chart',
    unit: 'inches',
    columns: [
      { key: 'chest', label: 'Chest', placeholder: '36' },
      { key: 'shoulder', label: 'Shoulder', placeholder: '15' },
      { key: 'waist', label: 'Waist', placeholder: '30' },
      { key: 'hips', label: 'Hips', placeholder: '38' },
      { key: 'length', label: 'Length', placeholder: '28' },
      { key: 'sleeve', label: 'Sleeve', placeholder: '24' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    defaults: {
      XS:  { chest: '32', shoulder: '14',   waist: '24', hips: '32', length: '26', sleeve: '22' },
      S:   { chest: '34', shoulder: '14.5', waist: '26', hips: '34', length: '27', sleeve: '22.5' },
      M:   { chest: '36', shoulder: '15',   waist: '28', hips: '36', length: '28', sleeve: '23' },
      L:   { chest: '38', shoulder: '15.5', waist: '30', hips: '38', length: '29', sleeve: '23.5' },
      XL:  { chest: '40', shoulder: '16',   waist: '32', hips: '40', length: '30', sleeve: '24' },
      XXL: { chest: '42', shoulder: '16.5', waist: '34', hips: '42', length: '31', sleeve: '24.5' },
    },
  },

  // ==================== FOOTWEAR ====================
  footwear: {
    id: 'footwear',
    label: 'Footwear',
    description: 'Standard footwear size chart',
    unit: 'cm',
    columns: [
      { key: 'footLength', label: 'Foot Length', placeholder: '24' },
      { key: 'uk', label: 'UK', placeholder: '6' },
      { key: 'us', label: 'US', placeholder: '7' },
      { key: 'eu', label: 'EU', placeholder: '40' },
    ],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    defaults: {
      '36': { footLength: '23',   uk: '3',  us: '5',  eu: '36' },
      '37': { footLength: '23.5', uk: '4',  us: '6',  eu: '37' },
      '38': { footLength: '24',   uk: '5',  us: '7',  eu: '38' },
      '39': { footLength: '24.5', uk: '6',  us: '8',  eu: '39' },
      '40': { footLength: '25',   uk: '7',  us: '9',  eu: '40' },
      '41': { footLength: '25.5', uk: '8',  us: '10', eu: '41' },
      '42': { footLength: '26',   uk: '9',  us: '11', eu: '42' },
      '43': { footLength: '26.5', uk: '10', us: '12', eu: '43' },
      '44': { footLength: '27',   uk: '11', us: '13', eu: '44' },
    },
  },

  // ==================== BAGS ====================
  bags: {
    id: 'bags',
    label: 'Bags',
    description: 'Bag dimensions size chart',
    unit: 'inches',
    columns: [
      { key: 'length', label: 'Length', placeholder: '12' },
      { key: 'width', label: 'Width', placeholder: '8' },
      { key: 'height', label: 'Height', placeholder: '10' },
      { key: 'strapLength', label: 'Strap', placeholder: '40' },
    ],
    sizes: ['Small', 'Medium', 'Large', 'Extra Large'],
    defaults: {
      'Small':       { length: '8',  width: '5',  height: '7',  strapLength: '40' },
      'Medium':      { length: '10', width: '6',  height: '9',  strapLength: '42' },
      'Large':       { length: '12', width: '8',  height: '11', strapLength: '44' },
      'Extra Large': { length: '15', width: '10', height: '13', strapLength: '46' },
    },
  },

  // ==================== ACCESSORIES ====================
  accessories: {
    id: 'accessories',
    label: 'Accessories',
    description: 'Accessories size chart',
    unit: 'mixed',
    columns: [
      { key: 'length', label: 'Length', placeholder: '8' },
      { key: 'width', label: 'Width', placeholder: '2' },
      { key: 'adjustable', label: 'Adjustable', placeholder: 'Yes/No' },
    ],
    sizes: ['One Size', 'Adjustable', 'Small', 'Medium', 'Large'],
    defaults: {
      'One Size':   { length: '8', width: '2',    adjustable: 'Yes' },
      'Adjustable': { length: '8', width: '2',    adjustable: 'Yes' },
      'Small':      { length: '6', width: '1.5',  adjustable: 'No' },
      'Medium':     { length: '7', width: '1.75', adjustable: 'No' },
      'Large':      { length: '8', width: '2',    adjustable: 'No' },
    },
  },
};

/**
 * Get a template by product type.
 */
export const getSizeChartTemplate = (
  productType: string
): SizeChartTemplate => {
  const key = productType?.toLowerCase()?.trim();
  return SIZE_CHART_TEMPLATES[key] || SIZE_CHART_TEMPLATES.clothing;
};

/**
 * Create a size chart prefilled with default values.
 */
export const createDefaultSizeChart = (
  template: SizeChartTemplate
): { templateId: string; unit: string; rows: SizeChartRow[]; imageUrl?: string } => ({
  templateId: template.id,
  unit: template.unit,
  imageUrl: '',
  rows: template.sizes.map((size) => ({
    size,
    values: template.columns.reduce((acc, col) => {
      acc[col.key] = template.defaults?.[size]?.[col.key] || '';
      return acc;
    }, {} as Record<string, string>),
  })),
});

/**
 * @deprecated Use createDefaultSizeChart instead.
 * Kept for backward compatibility.
 */
export const createEmptySizeChart = (
  template: SizeChartTemplate
): { templateId: string; unit: string; rows: SizeChartRow[] } => ({
  templateId: template.id,
  unit: template.unit,
  rows: template.sizes.map((size) => ({
    size,
    values: template.columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {} as Record<string, string>),
  })),
});