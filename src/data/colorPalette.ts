// src/data/colorPalette.ts

export interface ColorVariant {
  name: string;
  hex: string;
}

export interface ColorFamily {
  name: string;
  hex: string;
  variants: ColorVariant[];
}

export const COLOR_PALETTE: ColorFamily[] = [
  // ═══════════════════════════════════════════════════════════
  // 1. REDS
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Red',
    hex: '#EF4444',
    variants: [
      { name: 'Crimson Red', hex: '#DC143C' },
      { name: 'Dark Red', hex: '#8B0000' },
      { name: 'Maroon', hex: '#800000' },
      { name: 'Rose Red', hex: '#C21E56' },
      { name: 'Scarlet', hex: '#FF2400' },
      { name: 'Ruby Red', hex: '#9B111E' },
      { name: 'Cherry Red', hex: '#D2042D' },
      { name: 'Brick Red', hex: '#CB4154' },
    ],
  },

  // 2. PINKS
  {
    name: 'Pink',
    hex: '#EC4899',
    variants: [
      { name: 'Hot Pink', hex: '#FF69B4' },
      { name: 'Baby Pink', hex: '#F4C2C2' },
      { name: 'Rose Pink', hex: '#FF66CC' },
      { name: 'Blush Pink', hex: '#FFB6C1' },
      { name: 'Magenta', hex: '#FF00FF' },
      { name: 'Fuchsia', hex: '#FF77FF' },
      { name: 'Coral Pink', hex: '#F88379' },
      { name: 'Salmon Pink', hex: '#FA8072' },
      { name: 'Dusty Rose', hex: '#DCAE96' },
      { name: 'Flamingo Pink', hex: '#FC8EAC' },
    ],
  },

  // 3. ORANGES
  {
    name: 'Orange',
    hex: '#F97316',
    variants: [
      { name: 'Bright Orange', hex: '#FF7F00' },
      { name: 'Burnt Orange', hex: '#CC5500' },
      { name: 'Peach', hex: '#FFCBA4' },
      { name: 'Apricot', hex: '#FBCEB1' },
      { name: 'Tangerine', hex: '#F28500' },
      { name: 'Pumpkin', hex: '#FF7518' },
      { name: 'Amber', hex: '#FFBF00' },
      { name: 'Coral Orange', hex: '#FF7F50' },
      { name: 'Rust', hex: '#B7410E' },
    ],
  },

  // 4. YELLOWS
  {
    name: 'Yellow',
    hex: '#EAB308',
    variants: [
      { name: 'Bright Yellow', hex: '#FFFF00' },
      { name: 'Mustard', hex: '#FFDB58' },
      { name: 'Golden Yellow', hex: '#FFD700' },
      { name: 'Lemon Yellow', hex: '#FFF44F' },
      { name: 'Canary Yellow', hex: '#FFEF00' },
      { name: 'Sunflower', hex: '#FFDA03' },
      { name: 'Butter Yellow', hex: '#F8E58C' },
      { name: 'Honey', hex: '#FFC30B' },
      { name: 'Saffron', hex: '#F4C430' },
    ],
  },

  // 5. GREENS
  {
    name: 'Green',
    hex: '#22C55E',
    variants: [
      { name: 'Emerald Green', hex: '#50C878' },
      { name: 'Olive Green', hex: '#808000' },
      { name: 'Mint Green', hex: '#98FB98' },
      { name: 'Lime Green', hex: '#32CD32' },
      { name: 'Sage Green', hex: '#9CAF88' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Army Green', hex: '#4B5320' },
      { name: 'Hunter Green', hex: '#355E3B' },
      { name: 'Sea Green', hex: '#2E8B57' },
      { name: 'Pistachio', hex: '#93C572' },
    ],
  },

  // 6. TEALS
  {
    name: 'Teal',
    hex: '#14B8A6',
    variants: [
      { name: 'Teal', hex: '#008080' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'Aqua', hex: '#00FFFF' },
      { name: 'Cyan', hex: '#00BCD4' },
      { name: 'Seafoam', hex: '#93E9BE' },
      { name: 'Mint Teal', hex: '#77DD77' },
      { name: 'Dark Teal', hex: '#005F5F' },
      { name: 'Aquamarine', hex: '#7FFFD4' },
    ],
  },

  // 7. BLUES
  {
    name: 'Blue',
    hex: '#3B82F6',
    variants: [
      { name: 'Navy Blue', hex: '#000080' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Baby Blue', hex: '#89CFF0' },
      { name: 'Teal Blue', hex: '#367588' },
      { name: 'Cobalt Blue', hex: '#0047AB' },
      { name: 'Sapphire', hex: '#0F52BA' },
      { name: 'Denim Blue', hex: '#1560BD' },
      { name: 'Powder Blue', hex: '#B0E0E6' },
      { name: 'Midnight Blue', hex: '#191970' },
      { name: 'Steel Blue', hex: '#4682B4' },
      { name: 'Ice Blue', hex: '#D6F0FF' },
    ],
  },

  // 8. PURPLES
  {
    name: 'Purple',
    hex: '#A855F7',
    variants: [
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Violet', hex: '#8F00FF' },
      { name: 'Plum', hex: '#8E4585' },
      { name: 'Deep Purple', hex: '#673AB7' },
      { name: 'Lilac', hex: '#C8A2C8' },
      { name: 'Mauve', hex: '#E0B0FF' },
      { name: 'Amethyst', hex: '#9966CC' },
      { name: 'Eggplant', hex: '#614051' },
      { name: 'Orchid', hex: '#DA70D6' },
      { name: 'Royal Purple', hex: '#7851A9' },
    ],
  },

  // 9. BROWNS
  {
    name: 'Brown',
    hex: '#A16207',
    variants: [
      { name: 'Chocolate Brown', hex: '#7B3F00' },
      { name: 'Coffee Brown', hex: '#6F4E37' },
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Chestnut', hex: '#954535' },
      { name: 'Caramel', hex: '#AF6E4D' },
      { name: 'Mocha', hex: '#967969' },
      { name: 'Walnut', hex: '#773F1A' },
      { name: 'Khaki', hex: '#C3B091' },
    ],
  },

  // 10. BLACK
  {
    name: 'Black',
    hex: '#000000',
    variants: [
      { name: 'Jet Black', hex: '#0A0A0A' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Soft Black', hex: '#1C1C1C' },
      { name: 'Matte Black', hex: '#28282B' },
    ],
  },

  // 11. GREY
  {
    name: 'Grey',
    hex: '#6B7280',
    variants: [
      { name: 'Light Grey', hex: '#D3D3D3' },
      { name: 'Dark Grey', hex: '#505050' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Ash Grey', hex: '#B2BEB5' },
      { name: 'Slate Grey', hex: '#708090' },
      { name: 'Smoke Grey', hex: '#738276' },
      { name: 'Steel Grey', hex: '#71797E' },
      { name: 'Stone Grey', hex: '#928E85' },
    ],
  },

  // 12. WHITE
  {
    name: 'White',
    hex: '#FFFFFF',
    variants: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Off White', hex: '#FAF9F6' },
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Pearl White', hex: '#FDEEF4' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Snow White', hex: '#FFFAFA' },
      { name: 'Vanilla', hex: '#F3E5AB' },
    ],
  },

  // 13. GOLD
  {
    name: 'Gold',
    hex: '#D4AF37',
    variants: [
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Yellow Gold', hex: '#FFD700' },
      { name: 'Antique Gold', hex: '#CD9B1D' },
      { name: 'Champagne Gold', hex: '#F7E7CE' },
      { name: 'Bronze', hex: '#CD7F32' },
      { name: 'Copper', hex: '#B87333' },
      { name: 'Brass', hex: '#B5A642' },
    ],
  },

  // 14. SILVER
  {
    name: 'Silver',
    hex: '#C0C0C0',
    variants: [
      { name: 'Platinum', hex: '#E5E4E2' },
      { name: 'Pewter', hex: '#8E9AAF' },
      { name: 'Chrome', hex: '#DBE2E9' },
      { name: 'Gunmetal', hex: '#2C3539' },
    ],
  },

  // 15. PEACH
  {
    name: 'Peach',
    hex: '#FFCBA4',
    variants: [
      { name: 'Soft Peach', hex: '#FFDAB9' },
      { name: 'Coral Peach', hex: '#F88379' },
      { name: 'Apricot Peach', hex: '#FBCEB1' },
      { name: 'Peach Pink', hex: '#FFC0CB' },
    ],
  },

  // 16. NUDE
  {
    name: 'Nude',
    hex: '#E3BC9A',
    variants: [
      { name: 'Nude Beige', hex: '#E3BC9A' },
      { name: 'Nude Pink', hex: '#E8C4B8' },
      { name: 'Sand', hex: '#C2B280' },
      { name: 'Taupe', hex: '#8B8589' },
      { name: 'Champagne Nude', hex: '#F7E7CE' },
    ],
  },

  // 17. WINE
  {
    name: 'Wine',
    hex: '#722F37',
    variants: [
      { name: 'Deep Wine', hex: '#5E2129' },
      { name: 'Merlot', hex: '#73343A' },
      { name: 'Oxblood', hex: '#4A0000' },
      { name: 'Marsala', hex: '#964F4C' },
    ],
  },

  // 18. NEON
  {
    name: 'Neon',
    hex: '#39FF14',
    variants: [
      { name: 'Neon Green', hex: '#39FF14' },
      { name: 'Neon Yellow', hex: '#FFFF33' },
      { name: 'Neon Pink', hex: '#FF10F0' },
      { name: 'Neon Orange', hex: '#FF5F1F' },
      { name: 'Neon Blue', hex: '#1B03A3' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 19. LIME
  // ═══════════════════════════════════════════════════════════
  {
    name: 'Lime',
    hex: '#84CC16',
    variants: [
      { name: 'Bright Lime', hex: '#CCFF00' },
      { name: 'Chartreuse', hex: '#7FFF00' },
      { name: 'Neon Lime', hex: '#BFFF00' },
      { name: 'Yellow Green', hex: '#9ACD32' },
      { name: 'Apple Green', hex: '#8DB600' },
    ],
  },

  // 20. MINT
  {
    name: 'Mint',
    hex: '#A7F3D0',
    variants: [
      { name: 'Fresh Mint', hex: '#A7F3D0' },
      { name: 'Cool Mint', hex: '#98FF98' },
      { name: 'Spearmint', hex: '#7BB661' },
      { name: 'Wintergreen', hex: '#568203' },
    ],
  },

  // 21. CORAL
  {
    name: 'Coral',
    hex: '#FF7F50',
    variants: [
      { name: 'Living Coral', hex: '#FF6F61' },
      { name: 'Coral Red', hex: '#FF4040' },
      { name: 'Coral Pink', hex: '#F88379' },
      { name: 'Salmon Coral', hex: '#FA8072' },
    ],
  },

  // 22. LAVENDER
  {
    name: 'Lavender',
    hex: '#E6E6FA',
    variants: [
      { name: 'Soft Lavender', hex: '#E6E6FA' },
      { name: 'French Lavender', hex: '#B57EDC' },
      { name: 'Provence Lavender', hex: '#967BB6' },
      { name: 'Lavender Blue', hex: '#CCCCFF' },
    ],
  },

  // 23. TURQUOISE
  {
    name: 'Turquoise',
    hex: '#40E0D0',
    variants: [
      { name: 'Bright Turquoise', hex: '#08E8DE' },
      { name: 'Deep Turquoise', hex: '#00CED1' },
      { name: 'Pale Turquoise', hex: '#AFEEEE' },
      { name: 'Turquoise Blue', hex: '#00FFEF' },
    ],
  },

  // 24. MAROON
  {
    name: 'Maroon',
    hex: '#800000',
    variants: [
      { name: 'Classic Maroon', hex: '#800000' },
      { name: 'Dark Maroon', hex: '#4A0000' },
      { name: 'Maroon Red', hex: '#B03060' },
      { name: 'Deep Maroon', hex: '#5E1914' },
    ],
  },

  // 25. NAVY
  {
    name: 'Navy',
    hex: '#000080',
    variants: [
      { name: 'Classic Navy', hex: '#000080' },
      { name: 'Dark Navy', hex: '#02075D' },
      { name: 'Midnight Navy', hex: '#191970' },
      { name: 'Navy Blue', hex: '#003366' },
    ],
  },

  // 26. OLIVE
  {
    name: 'Olive',
    hex: '#808000',
    variants: [
      { name: 'Classic Olive', hex: '#808000' },
      { name: 'Dark Olive', hex: '#556B2F' },
      { name: 'Olive Drab', hex: '#6B8E23' },
      { name: 'Army Olive', hex: '#4B5320' },
    ],
  },

  // 27. MUSTARD
  {
    name: 'Mustard',
    hex: '#FFDB58',
    variants: [
      { name: 'Bright Mustard', hex: '#FFDB58' },
      { name: 'Dark Mustard', hex: '#D4AF37' },
      { name: 'Old Gold', hex: '#CFB53B' },
      { name: 'Goldenrod', hex: '#DAA520' },
    ],
  },

  // 28. BURGUNDY
  {
    name: 'Burgundy',
    hex: '#800020',
    variants: [
      { name: 'Classic Burgundy', hex: '#800020' },
      { name: 'Deep Burgundy', hex: '#4A0010' },
      { name: 'Burgundy Wine', hex: '#722F37' },
      { name: 'Burgundy Red', hex: '#900020' },
    ],
  },

  // 29. TEAL BLUE
  {
    name: 'Teal Blue',
    hex: '#367588',
    variants: [
      { name: 'Classic Teal Blue', hex: '#367588' },
      { name: 'Deep Teal Blue', hex: '#005F5F' },
      { name: 'Bright Teal Blue', hex: '#00BCD4' },
      { name: 'Steel Teal', hex: '#4682B4' },
    ],
  },

  // 30. COPPER
  {
    name: 'Copper',
    hex: '#B87333',
    variants: [
      { name: 'Classic Copper', hex: '#B87333' },
      { name: 'Rose Copper', hex: '#C97C5D' },
      { name: 'Antique Copper', hex: '#9C6B47' },
      { name: 'Bright Copper', hex: '#DA8A67' },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
export const findColorFamily = (name: string): ColorFamily | undefined => {
  return COLOR_PALETTE.find((c) => c.name.toLowerCase() === name.toLowerCase());
};

export const findColorVariant = (colorName: string, variantName: string): ColorVariant | undefined => {
  const family = findColorFamily(colorName);
  return family?.variants.find((v) => v.name.toLowerCase() === variantName.toLowerCase());
};

export const getAllColorNames = (): string[] => {
  return COLOR_PALETTE.map((c) => c.name);
};