// src/services/aiStoreBuilder.ts
import { storeBuilderModel } from '../config/firebase';

export interface StoreConfigInput {
  storeName: string;
  businessType: string;
  description: string;
  style: 'luxury' | 'modern' | 'minimal' | 'traditional';
  preferredColors?: string;
}

export interface StoreConfigOutput {
  theme: 'luxury' | 'modern' | 'minimal' | 'traditional';
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  hero: {
    heading: string;
    subtitle: string;
  };
  tagline: string;
  sections: string[];
  about: string;
  seo: {
    title: string;
    description: string;
  };
}

const SYSTEM_PROMPT = `You are the MAHA ONE AI Store Builder.

Return ONLY valid JSON. No markdown, no code fences, no explanation.

Exact schema:
{
  "theme": "luxury" | "modern" | "minimal" | "traditional",
  "colors": { "primary": "#hex", "secondary": "#hex", "background": "#hex" },
  "hero": { "heading": "string (max 60 chars)", "subtitle": "string (max 100 chars)" },
  "tagline": "string (max 80 chars)",
  "sections": ["categories","newArrivals","featuredProducts","bestSellers","about","reviews"],
  "about": "string (2-3 sentences, 200-300 chars)",
  "seo": { "title": "string (max 60 chars)", "description": "string (max 160 chars)" }
}

Rules:
- Colors must be valid hex codes
- Sections should be relevant to the business type
- Content should match the style and business
- Return ONLY the JSON object, nothing else`;

export async function generateStoreConfig(
  input: StoreConfigInput
): Promise<StoreConfigOutput> {
  const userPrompt = `Seller info:
- Store name: ${input.storeName}
- Business: ${input.businessType}
- Description: ${input.description}
- Style: ${input.style}
- Preferred colors: ${input.preferredColors || 'AI decides based on style'}

Generate the store configuration JSON now.`;

  const result = await storeBuilderModel.generateContent([
    { text: SYSTEM_PROMPT },
    { text: userPrompt },
  ]);

  let text = result.response.text();

  // ✅ Clean markdown fences agar AI ne daal diye
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsed = JSON.parse(text) as StoreConfigOutput;
    return parsed;
  } catch (error) {
    console.error('❌ AI returned invalid JSON:', text);
    throw new Error('AI response parse nahi ho saka. Dobara try karo.');
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}