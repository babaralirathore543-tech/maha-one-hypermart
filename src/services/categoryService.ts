// src/services/categoryService.ts
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '../config/firebase';

// ============================================================
// TYPES
// ============================================================
export interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  icon: string;
  order: number;
  isActive: boolean;
  attributeTemplateId: string;
  createdAt?: any;
  updatedAt?: any;
}

export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'tags'
  | 'image'
  | 'images'
  | 'colorImages'
  | 'sizes'
  | 'sizeChart'
  | 'color'
  | 'date'
  | 'email'
  | 'url';

export interface AttributeField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  autoGenerate?: boolean;
  helperText?: string;
}

export interface AttributeSection {
  id: string;
  title: string;
  fields: AttributeField[];
}

export interface AttributeTemplate {
  id: string;
  name: string;
  description: string;
  sections: AttributeSection[];
  createdAt?: any;
  updatedAt?: any;
}

// ============================================================
// CATEGORY OPERATIONS
// ============================================================

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const getAllCategoriesAdmin = async (): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const getCategoryBySlug = async (
  slug: string
): Promise<Category | null> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Category;
  } catch (error) {
    console.error('❌ Error fetching category:', error);
    return null;
  }
};

export const getCategoryChildren = async (
  parentId: string
): Promise<Category[]> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('parentId', '==', parentId),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    console.error('❌ Error fetching children:', error);
    return [];
  }
};

export const getCategoryTree = async (): Promise<Category[]> => {
  const all = await getAllCategories();
  return buildTree(all);
};

function buildTree(categories: Category[]): any[] {
  const map = new Map<string, any>();
  const roots: any[] = [];

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach(cat => {
    const node = map.get(cat.id);
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export const getCategoryById = async (
  categoryId: string
): Promise<Category | null> => {
  try {
    const snap = await getDoc(doc(db, 'categories', categoryId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Category;
  } catch (error) {
    console.error('❌ Error fetching category by id:', error);
    return null;
  }
};

export const subscribeToCategories = (
  callback: (categories: Category[]) => void
) => {
  const q = query(
    collection(db, 'categories'),
    orderBy('order', 'asc')
  );
  return onSnapshot(q, (snap) => {
    const categories = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    callback(categories);
  });
};

export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string | null> => {
  try {
    const docRef = doc(collection(db, 'categories'));
    await setDoc(docRef, {
      ...category,
      id: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return null;
  }
};

export const updateCategory = async (
  categoryId: string,
  updates: Partial<Category>
): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'categories', categoryId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('❌ Error updating category:', error);
    return false;
  }
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    return true;
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return false;
  }
};

export const deactivateCategory = async (categoryId: string): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'categories', categoryId), {
      isActive: false,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('❌ Error deactivating category:', error);
    return false;
  }
};

// ============================================================
// ATTRIBUTE TEMPLATE OPERATIONS
// ============================================================

export const getAttributeTemplate = async (
  templateId: string
): Promise<AttributeTemplate | null> => {
  try {
    const snap = await getDoc(doc(db, 'attributeTemplates', templateId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as AttributeTemplate;
  } catch (error) {
    console.error('❌ Error fetching template:', error);
    return null;
  }
};

export const getAllTemplates = async (): Promise<AttributeTemplate[]> => {
  try {
    const snap = await getDocs(collection(db, 'attributeTemplates'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttributeTemplate));
  } catch (error) {
    console.error('❌ Error fetching templates:', error);
    return [];
  }
};

export const saveAttributeTemplate = async (
  template: AttributeTemplate
): Promise<boolean> => {
  try {
    await setDoc(
      doc(db, 'attributeTemplates', template.id),
      {
        ...template,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('❌ Error saving template:', error);
    return false;
  }
};

export const deleteAttributeTemplate = async (
  templateId: string
): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'attributeTemplates', templateId));
    return true;
  } catch (error) {
    console.error('❌ Error deleting template:', error);
    return false;
  }
};

// ============================================================
// HELPERS
// ============================================================

export const buildCategoryPath = async (
  categoryId: string
): Promise<string[]> => {
  const path: string[] = [];
  let currentId: string | null = categoryId;

  let depth = 0;
  while (currentId && depth < 10) {
    const cat: Category | null = await getCategoryById(currentId);
    if (!cat) break;
    path.unshift(cat.id);
    currentId = cat.parentId;
    depth++;
  }

  return path;
};

export const getCategoryBreadcrumb = async (
  categoryId: string
): Promise<Category[]> => {
  const path: Category[] = [];
  let currentId: string | null = categoryId;

  let depth = 0;
  while (currentId && depth < 10) {
    const cat: Category | null = await getCategoryById(currentId);
    if (!cat) break;
    path.unshift(cat);
    currentId = cat.parentId;
    depth++;
  }

  return path;
};

export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const isSlugAvailable = async (
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('slug', '==', slug)
    );
    const snap = await getDocs(q);
    if (snap.empty) return true;
    if (excludeId && snap.docs[0].id === excludeId) return true;
    return false;
  } catch (error) {
    console.error('❌ Error checking slug:', error);
    return false;
  }
};