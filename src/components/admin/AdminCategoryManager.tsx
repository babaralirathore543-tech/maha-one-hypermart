// src/components/admin/AdminCategoryManager.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Layers,
  FileText,
  Hash,
  Type,
  Image as ImageIcon,
  ListChecks,
  Hash as HashIcon,
  Tag,
  Palette,
  Ruler,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from '../../config/firebase';

// ============================================================
// TYPES
// ============================================================
interface Category {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  icon: string;
  order: number;
  isActive: boolean;
  attributeTemplateId: string;
  createdAt?: any;
  // Computed
  children?: Category[];
  productCount?: number;
}

interface AttributeField {
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

type FieldType =
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
  | 'date';

interface AttributeSection {
  id: string;
  title: string;
  fields: AttributeField[];
}

interface AttributeTemplate {
  id: string;
  name: string;
  description: string;
  sections: AttributeSection[];
  createdAt?: any;
  updatedAt?: any;
}

// ============================================================
// FIELD TYPE OPTIONS (for template editor)
// ============================================================
const FIELD_TYPES: Array<{ value: FieldType; label: string; icon: any }> = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'number', label: 'Number', icon: HashIcon },
  { value: 'textarea', label: 'Long Text', icon: FileText },
  { value: 'select', label: 'Dropdown', icon: ListChecks },
  { value: 'checkbox', label: 'Checkbox', icon: CheckCircle },
  { value: 'tags', label: 'Tags', icon: Tag },
  { value: 'image', label: 'Single Image', icon: ImageIcon },
  { value: 'images', label: 'Multiple Images', icon: Layers },
  { value: 'colorImages', label: 'Color Images', icon: Palette },
  { value: 'sizes', label: 'Sizes', icon: Ruler },
  { value: 'sizeChart', label: 'Size Chart', icon: Ruler },
  { value: 'color', label: 'Color Picker', icon: Palette },
  { value: 'date', label: 'Date', icon: Hash },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
const AdminCategoryManager = () => {
  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<AttributeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI
  const [activeTab, setActiveTab] = useState<'categories' | 'templates'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<AttributeTemplate | null>(null);

  // ============================================================
  // LOAD DATA
  // ============================================================
  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const catsSnap = await getDocs(
        query(collection(db, 'categories'), orderBy('order', 'asc'))
      );
      const cats: Category[] = catsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as Category));

      // Count products per category
      const productsSnap = await getDocs(collection(db, 'products'));
      const productCounts: Record<string, number> = {};
      productsSnap.forEach((d) => {
        const data = d.data();
        const catId = data.categoryId || data.categorySlug || data.category;
        if (catId) productCounts[catId] = (productCounts[catId] || 0) + 1;
      });
      cats.forEach((c) => {
        c.productCount = productCounts[c.id] || productCounts[c.slug] || 0;
      });

      setCategories(cats);

      // Load templates
      const tmplSnap = await getDocs(collection(db, 'attributeTemplates'));
      const tmpls: AttributeTemplate[] = tmplSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      } as AttributeTemplate));
      setTemplates(tmpls);
    } catch (err: any) {
      console.error('❌ Load error:', err);
      toast.error('Failed to load: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================================================
  // BUILD TREE
  // ============================================================
  const categoryTree = useMemo(() => {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    // Filter by search
    const filtered = searchTerm
      ? categories.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.slug.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : categories;

    filtered.forEach((c) => map.set(c.id, { ...c, children: [] }));

    filtered.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [categories, searchTerm]);

  // ============================================================
  // TOGGLE EXPAND
  // ============================================================
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ============================================================
  // CATEGORY CRUD
  // ============================================================
  const handleSaveCategory = async (data: Partial<Category>) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast.success('✅ Category updated!');
      } else {
        const newRef = doc(collection(db, 'categories'));
        await setDoc(newRef, {
          ...data,
          id: newRef.id,
          isActive: data.isActive !== false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success('✅ Category created!');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      loadData();
    } catch (err: any) {
      console.error('❌ Save error:', err);
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    // Check children
    const hasChildren = categories.some((c) => c.parentId === cat.id);
    if (hasChildren) {
      toast.error('❌ Cannot delete: This category has sub-categories');
      return;
    }

    if (cat.productCount && cat.productCount > 0) {
      if (!confirm(`⚠️ This category has ${cat.productCount} products. Delete anyway?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete "${cat.name}"?`)) return;
    }

    try {
      await deleteDoc(doc(db, 'categories', cat.id));
      toast.success('🗑️ Category deleted');
      loadData();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await updateDoc(doc(db, 'categories', cat.id), {
        isActive: !cat.isActive,
        updatedAt: serverTimestamp(),
      });
      toast.success(cat.isActive ? '🚫 Deactivated' : '✅ Activated');
      loadData();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    }
  };

  // ============================================================
  // TEMPLATE CRUD
  // ============================================================
  const handleSaveTemplate = async (template: AttributeTemplate) => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'attributeTemplates', template.id),
        {
          ...template,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success('✅ Template saved!');
      setShowTemplateModal(false);
      setEditingTemplate(null);
      loadData();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (template: AttributeTemplate) => {
    // Check if any category uses it
    const inUse = categories.filter((c) => c.attributeTemplateId === template.id);
    if (inUse.length > 0) {
      toast.error(
        `❌ In use by ${inUse.length} category(s): ${inUse.map((c) => c.name).join(', ')}`
      );
      return;
    }
    if (!confirm(`Delete template "${template.name}"?`)) return;

    try {
      await deleteDoc(doc(db, 'attributeTemplates', template.id));
      toast.success('🗑️ Template deleted');
      loadData();
    } catch (err: any) {
      toast.error('Failed: ' + err.message);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-3xl text-[#0F766E]" />
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FolderTree className="text-[#0F766E]" />
            Category Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage categories, hierarchy, and attribute templates
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setEditingCategory(null);
              setShowCategoryModal(true);
            } else {
              setEditingTemplate({
                id: '',
                name: '',
                description: '',
                sections: [],
              });
              setShowTemplateModal(true);
            }
          }}
          className="bg-[#0F766E] text-white px-4 py-2.5 rounded-lg hover:bg-[#065F46] transition flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          {activeTab === 'categories' ? 'Add Category' : 'Add Template'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Categories</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {categories.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Root Categories</p>
          <p className="text-2xl font-bold text-[#0F766E] mt-1">
            {categories.filter((c) => !c.parentId).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Sub-categories</p>
          <p className="text-2xl font-bold text-[#D4AF37] mt-1">
            {categories.filter((c) => c.parentId).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Templates</p>
          <p className="text-2xl font-bold text-purple-500 mt-1">{templates.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === 'categories'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <FolderTree className="inline mr-2" size={14} />
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              activeTab === 'templates'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <FileText className="inline mr-2" size={14} />
            Attribute Templates ({templates.length})
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CATEGORIES TAB                                              */}
      {/* ============================================================ */}
      {activeTab === 'categories' && (
        <>
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 border border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>

          {/* Tree */}
          {categoryTree.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
              <FolderTree className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Try a different search' : 'Click "Add Category" to start'}
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {categoryTree.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    category={cat}
                    level={0}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                    onEdit={() => {
                      setEditingCategory(cat);
                      setShowCategoryModal(true);
                    }}
                    onDelete={() => handleDeleteCategory(cat)}
                    onToggleActive={() => handleToggleActive(cat)}
                    templateName={
                      templates.find((t) => t.id === cat.attributeTemplateId)?.name ||
                      cat.attributeTemplateId
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* TEMPLATES TAB                                               */}
      {/* ============================================================ */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
              <FileText className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                No templates yet
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Templates define what fields appear for products
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <FileText className="text-[#D4AF37]" size={18} />
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: <code className="bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded">{template.id}</code>
                    </p>
                    {template.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        {template.sections?.length || 0} sections
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        {template.sections?.reduce((sum, s) => sum + s.fields.length, 0) || 0} fields
                      </span>
                      {categories.filter((c) => c.attributeTemplateId === template.id).length > 0 && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                          Used by {categories.filter((c) => c.attributeTemplateId === template.id).length} categories
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowTemplateModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* CATEGORY MODAL                                              */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showCategoryModal && (
          <CategoryModal
            category={editingCategory}
            categories={categories}
            templates={templates}
            onSave={handleSaveCategory}
            onClose={() => {
              setShowCategoryModal(false);
              setEditingCategory(null);
            }}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* TEMPLATE MODAL                                              */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showTemplateModal && editingTemplate && (
          <TemplateModal
            template={editingTemplate}
            onSave={handleSaveTemplate}
            onClose={() => {
              setShowTemplateModal(false);
              setEditingTemplate(null);
            }}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// CATEGORY ROW (recursive tree)
// ============================================================
interface CategoryRowProps {
  category: Category;
  level: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  templateName: string;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  level,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleActive,
  templateName,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);

  return (
    <>
      <div
        className={`flex items-center gap-2 p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition ${
          !category.isActive ? 'opacity-50' : ''
        }`}
        style={{ paddingLeft: `${12 + level * 24}px` }}
      >
        {/* Expand toggle */}
        <button
          onClick={() => hasChildren && onToggleExpand(category.id)}
          className={`p-1 rounded transition ${
            hasChildren ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : 'opacity-0 pointer-events-none'
          }`}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Icon */}
        <span className="text-2xl shrink-0">{category.icon || '📦'}</span>

        {/* Name + slug */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-800 dark:text-white truncate">
              {category.name}
            </span>
            {!category.isActive && (
              <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded-full">
                Inactive
              </span>
            )}
            {category.productCount !== undefined && category.productCount > 0 && (
              <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full">
                {category.productCount} products
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            <code>/category/{category.slug}</code>
            {templateName && <> • {templateName}</>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleActive}
            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
            title={category.isActive ? 'Deactivate' : 'Activate'}
          >
            {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <>
          {category.children!.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onEdit={() => {
                // Passed via parent
              }}
              onDelete={() => {}}
              onToggleActive={() => {}}
              templateName=""
            />
          ))}
        </>
      )}
    </>
  );
};

// ============================================================
// CATEGORY MODAL
// ============================================================
interface CategoryModalProps {
  category: Category | null;
  categories: Category[];
  templates: AttributeTemplate[];
  onSave: (data: Partial<Category>) => void;
  onClose: () => void;
  saving: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  categories,
  templates,
  onSave,
  onClose,
  saving,
}) => {
  const isEdit = !!category;

  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || '📦',
    parentId: category?.parentId || '',
    order: category?.order || 0,
    isActive: category?.isActive !== false,
    attributeTemplateId: category?.attributeTemplateId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && form.name && !form.slug) {
      const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setForm((prev) => ({ ...prev, slug }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, isEdit]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.slug.trim()) e.slug = 'Slug required';
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = 'Slug must be lowercase, numbers, and hyphens only';
    if (!form.attributeTemplateId) e.attributeTemplateId = 'Template required';

    // Check slug uniqueness
    const duplicate = categories.find(
      (c) => c.slug === form.slug && c.id !== category?.id
    );
    if (duplicate) e.slug = 'Slug already exists';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...form,
      parentId: form.parentId || null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {isEdit ? '✏️ Edit Category' : '➕ Add Category'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Electronics"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              placeholder="e.g. electronics"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none font-mono text-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              URL: <code>/category/{form.slug || 'slug'}</code>
            </p>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="📦"
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-2xl text-center"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Paste an emoji or type one. Preview: {form.icon || '📦'}
            </p>
          </div>

          {/* Parent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Category
            </label>
            <select
              value={form.parentId}
              onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            >
              <option value="">None (Root Category)</option>
              {categories
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              Select a parent to create a sub-category
            </p>
          </div>

          {/* Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Attribute Template <span className="text-red-500">*</span>
            </label>
            <select
              value={form.attributeTemplateId}
              onChange={(e) => setForm({ ...form, attributeTemplateId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            >
              <option value="">Select template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.sections?.length || 0} sections)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              Determines what fields appear in the product form for this category
            </p>
            {errors.attributeTemplateId && (
              <p className="text-xs text-red-500 mt-1">{errors.attributeTemplateId}</p>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              min="0"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded accent-[#0F766E]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Active (visible on site)
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#065F46] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// TEMPLATE MODAL — Full editor
// ============================================================
interface TemplateModalProps {
  template: AttributeTemplate;
  onSave: (template: AttributeTemplate) => void;
  onClose: () => void;
  saving: boolean;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  template,
  onSave,
  onClose,
  saving,
}) => {
  const isEdit = !!template.id && template.sections.length > 0;

  const [data, setData] = useState<AttributeTemplate>({
    id: template.id || '',
    name: template.name || '',
    description: template.description || '',
    sections: template.sections || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-slug template id
  useEffect(() => {
    if (!isEdit && data.name && !data.id) {
      const id = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_');
      setData((prev) => ({ ...prev, id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.name, isEdit]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = 'Name required';
    if (!data.id.trim()) e.id = 'Template ID required';
    if (!/^[a-z0-9_]+$/.test(data.id)) e.id = 'ID must be lowercase, numbers, underscores';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Section operations
  const addSection = () => {
    setData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section_${Date.now()}`,
          title: 'New Section',
          fields: [],
        },
      ],
    }));
  };

  const updateSection = (index: number, updates: Partial<AttributeSection>) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? { ...s, ...updates } : s
      ),
    }));
  };

  const deleteSection = (index: number) => {
    if (!confirm('Delete this section and all its fields?')) return;
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  // Field operations
  const addField = (sectionIndex: number) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              fields: [
                ...s.fields,
                {
                  key: `field_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                },
              ],
            }
          : s
      ),
    }));
  };

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    updates: Partial<AttributeField>
  ) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              fields: s.fields.map((f, j) =>
                j === fieldIndex ? { ...f, ...updates } : f
              ),
            }
          : s
      ),
    }));
  };

  const deleteField = (sectionIndex: number, fieldIndex: number) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              fields: s.fields.filter((_, j) => j !== fieldIndex),
            }
          : s
      ),
    }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {isEdit ? '✏️ Edit Template' : '➕ Create Template'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 flex-1">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="e.g. Mobile Phone Template"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.id}
                onChange={(e) =>
                  setData({
                    ...data,
                    id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                  })
                }
                disabled={isEdit}
                placeholder="e.g. mobile_phone"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none font-mono text-sm disabled:bg-gray-100 dark:disabled:bg-gray-700"
              />
              {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
              {isEdit && (
                <p className="text-[10px] text-gray-400 mt-1">
                  ID cannot be changed (used by existing categories)
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Short description of this template"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Sections & Fields
              </h4>
              <button
                type="button"
                onClick={addSection}
                className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-1"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {data.sections.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <FileText className="text-3xl text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No sections yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Add sections like "Basic Info", "Specifications", "Pricing"
                </p>
              </div>
            ) : (
              data.sections.map((section, si) => (
                <div
                  key={section.id}
                  className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(si, { title: e.target.value })}
                      placeholder="Section title"
                      className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => deleteSection(si)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                      title="Delete section"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-2">
                    {section.fields.map((field, fi) => (
                      <FieldRow
                        key={field.key}
                        field={field}
                        onUpdate={(updates) => updateField(si, fi, updates)}
                        onDelete={() => deleteField(si, fi)}
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => addField(si)}
                      className="w-full text-sm text-[#0F766E] hover:bg-[#0F766E]/5 py-2 rounded-lg border-2 border-dashed border-[#0F766E]/30 hover:border-[#0F766E]/60 transition flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-[#0F766E] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#065F46] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Template
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// FIELD ROW
// ============================================================
interface FieldRowProps {
  field: AttributeField;
  onUpdate: (updates: Partial<AttributeField>) => void;
  onDelete: () => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ field, onUpdate, onDelete }) => {
  const [showOptions, setShowOptions] = useState(field.type === 'select');
  const FieldIcon = FIELD_TYPES.find((ft) => ft.value === field.type)?.icon || Type;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end">
        {/* Key */}
        <div className="col-span-1">
          <label className="block text-[10px] text-gray-500 mb-0.5">Key</label>
          <input
            type="text"
            value={field.key}
            onChange={(e) =>
              onUpdate({
                key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
              })
            }
            className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:ring-1 focus:ring-[#0F766E] outline-none font-mono"
            placeholder="e.g. brand"
          />
        </div>

        {/* Label */}
        <div className="col-span-1">
          <label className="block text-[10px] text-gray-500 mb-0.5">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:ring-1 focus:ring-[#0F766E] outline-none"
            placeholder="e.g. Brand"
          />
        </div>

        {/* Type */}
        <div className="col-span-1">
          <label className="block text-[10px] text-gray-500 mb-0.5">Type</label>
          <select
            value={field.type}
            onChange={(e) => {
              const newType = e.target.value as FieldType;
              onUpdate({ type: newType });
              setShowOptions(newType === 'select');
            }}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded focus:ring-1 focus:ring-[#0F766E] outline-none"
          >
            {FIELD_TYPES.map((ft) => (
              <option key={ft.value} value={ft.value}>
                {ft.label}
              </option>
            ))}
          </select>
        </div>

        {/* Delete */}
        <div className="col-span-1 flex items-center gap-1">
          <label className="flex items-center gap-1 text-[10px] text-gray-500 flex-1">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="w-3 h-3 rounded"
            />
            Required
          </label>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Placeholder */}
      {(field.type === 'text' || field.type === 'number' || field.type === 'textarea') && (
        <div className="mt-2">
          <input
            type="text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded outline-none"
            placeholder="Placeholder (optional)"
          />
        </div>
      )}

      {/* Options for select */}
      {showOptions && field.type === 'select' && (
        <div className="mt-2">
          <label className="block text-[10px] text-gray-500 mb-0.5">
            Options (one per line)
          </label>
          <textarea
            value={(field.options || []).join('\n')}
            onChange={(e) =>
              onUpdate({
                options: e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            rows={3}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded outline-none resize-y font-mono"
            placeholder={'Option 1\nOption 2\nOption 3'}
          />
        </div>
      )}
    </div>
  );
};

export default AdminCategoryManager;