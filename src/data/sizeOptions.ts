// src/data/sizeOptions.ts

/**
 * Size options per fashion product type.
 * When seller picks a productType, the size list switches accordingly.
 */

export interface SizeOption {
  value: string;
  label: string;
}

export const SIZE_OPTIONS: Record<string, SizeOption[]> = {
  // ==================== CLOTHING ====================
  clothing: [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' },
    { value: '4XL', label: '4XL' },
    { value: '5XL', label: '5XL' },
  ],

  // ==================== FOOTWEAR ====================
  footwear: [
    { value: '35', label: '35' },
    { value: '36', label: '36' },
    { value: '37', label: '37' },
    { value: '38', label: '38' },
    { value: '39', label: '39' },
    { value: '40', label: '40' },
    { value: '41', label: '41' },
    { value: '42', label: '42' },
    { value: '43', label: '43' },
    { value: '44', label: '44' },
    { value: '45', label: '45' },
    { value: '46', label: '46' },
    { value: '47', label: '47' },
    { value: '48', label: '48' },
  ],

  // ==================== BAGS ====================
  bags: [
    { value: 'One Size', label: 'One Size' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
    { value: 'Extra Large', label: 'Extra Large' },
    { value: 'Mini', label: 'Mini' },
    { value: 'Jumbo', label: 'Jumbo' },
  ],

  // ==================== ACCESSORIES ====================
  accessories: [
    { value: 'One Size', label: 'One Size' },
    { value: 'Free Size', label: 'Free Size' },
    { value: 'Adjustable', label: 'Adjustable' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
  ],
};

/**
 * Get size list for a product type.
 * Falls back to Clothing sizes if unknown.
 */
export const getSizesForProductType = (productType: string): SizeOption[] => {
  const key = productType?.toLowerCase()?.trim();
  return SIZE_OPTIONS[key] || SIZE_OPTIONS.clothing;
};