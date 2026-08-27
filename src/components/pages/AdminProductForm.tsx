// src/components/pages/AdminProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaPlus, 
  FaSpinner, FaArrowLeft,
  FaLink, FaCloudUploadAlt,
  FaChevronRight, FaCircle
} from 'react-icons/fa';
import { db, storage } from '../../config/firebase';
import { 
  collection, addDoc, getDoc, doc, updateDoc,
  query, where, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ Product Interface - Final Structure
interface ProductFormData {
  name: string;
  brand: string;
  sku: string;
  category: string;
  gender: string;
  productType: string;
  subCategory: string;
  style: string;
  price: number;
  oldPrice: number;
  discount: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  image: string;
  images: string[];
  colorImages: { [key: string]: string[] };
  sizes: string[];
  colors: string[];
  shortDescription: string;
  description: string;
  material: string;
  careInstructions: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  status: 'active' | 'draft' | 'out-of-stock';
  rating: number;
  reviewCount: number;
}

// ✅ Type Definitions for Category Data
interface SubCategoryItem {
  label: string;
  styles: string[];
}

interface ProductTypeItem {
  label: string;
  sizes?: string[];
  subCategories: {
    [key: string]: SubCategoryItem;
  };
}

interface GenderItem {
  label: string;
  icon: string;
  productTypes: {
    [key: string]: ProductTypeItem;
  };
}

interface CategoryItem {
  label: string;
  icon: string;
  prefix: string;
  genders: {
    [key: string]: GenderItem;
  };
}

interface CategoryData {
  [key: string]: CategoryItem;
}

// ✅ COMPLETE CATEGORY DATA WITH SIZES
const categoryData: CategoryData = {
  'fashion': {
    label: 'Fashion',
    icon: '👗',
    prefix: 'MOF',
    genders: {
      'women': {
        label: 'Women',
        icon: '👩',
        productTypes: {
          'clothing': {
            label: '👗 Clothing',
            sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Free Size'],
            subCategories: {
              'unstitched': { 
                label: 'Unstitched', 
                styles: ['2 Piece', '3 Piece', 'Lawn', 'Formal', 'Casual', 'Party Wear', 'Luxury Pret', 'Embroidered'] 
              },
              'ready-to-wear': { 
                label: 'Ready to Wear', 
                styles: ['Casual Wear', 'Formal Wear', 'Party Wear', 'Luxury Pret'] 
              },
              'sarees': { 
                label: 'Sarees', 
                styles: ['Silk Saree', 'Net Saree', 'Cotton Saree', 'Embroidered Saree', 'Wedding Saree', 'Party Wear Saree'] 
              },
              'abayas': { 
                label: 'Abayas & Modest Wear', 
                styles: ['Classic Abaya', 'Embroidered Abaya', 'Open Abaya', 'Closed Abaya', 'Khimar'] 
              },
              'nightwear': { 
                label: 'Nightwear', 
                styles: ['Cotton Nightwear', 'Silk Nightwear', 'Satin Nightwear', 'Pajama Sets'] 
              }
            }
          },
          'footwear': {
            label: '👠 Footwear',
            sizes: ['5(US)', '5.5(US)', '6(US)', '6.5(US)', '7(US)', '7.5(US)', '8(US)', '8.5(US)', '9(US)', '9.5(US)', '10(US)'],
            subCategories: {
              'heels': { 
                label: 'Heels', 
                styles: ['High Heels', 'Block Heels', 'Wedges', 'Kitten Heels', 'Platform Heels', 'Stilettos'] 
              },
              'flats': { 
                label: 'Flats', 
                styles: ['Ballerinas', 'Loafers', 'Flat Sandals'] 
              },
              'slippers': { 
                label: 'Slippers', 
                styles: ['Flip Flops', 'Slide Slippers', 'House Slippers'] 
              },
              'sandals': { 
                label: 'Sandals', 
                styles: ['Strappy Sandals', 'Gladiator Sandals', 'Casual Sandals', 'Formal Sandals'] 
              },
              'khussa': { 
                label: 'Khussa', 
                styles: ['Traditional Khussa', 'Embroidered Khussa', 'Casual Khussa'] 
              },
              'sneakers': { 
                label: 'Sneakers', 
                styles: ['Casual Sneakers', 'Sports Sneakers', 'Fashion Sneakers', 'Platform Sneakers'] 
              }
            }
          },
          'bags': {
            label: '👜 Bags',
            sizes: ['One Size'],
            subCategories: {
              'hand-bags': { 
                label: 'Hand Bags', 
                styles: ['Tote Bag', 'Shoulder Bag', 'Crossbody Bag', 'Clutch'] 
              },
              'shoulder-bags': { 
                label: 'Shoulder Bags', 
                styles: ['Casual Shoulder', 'Formal Shoulder', 'Party Shoulder'] 
              },
              'tote-bags': { 
                label: 'Tote Bags', 
                styles: ['Leather Tote', 'Fabric Tote', 'Canvas Tote'] 
              },
              'crossbody-bags': { 
                label: 'Crossbody Bags', 
                styles: ['Leather Crossbody', 'Fabric Crossbody', 'Mini Crossbody'] 
              },
              'clutches': { 
                label: 'Clutches', 
                styles: ['Classic Clutch', 'Embroidered Clutch', 'Beaded Clutch', 'Box Clutch'] 
              },
              'wallets': { 
                label: 'Wallets', 
                styles: ['Leather Wallet', 'Fabric Wallet', 'Card Holder', 'Coin Purse'] 
              }
            }
          },
          'accessories': {
            label: '💎 Accessories',
            sizes: ['One Size'],
            subCategories: {
              'jewellery': { 
                label: 'Jewellery', 
                styles: ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Jewellery Sets'] 
              },
              'watches': { 
                label: 'Watches', 
                styles: ['Analog Watch', 'Digital Watch', 'Smart Watch', 'Fashion Watch'] 
              },
              'sunglasses': { 
                label: 'Sunglasses', 
                styles: ['Aviator', 'Wayfarer', 'Cat Eye', 'Round', 'Oversized'] 
              },
              'scarves-hijabs': { 
                label: 'Scarves & Hijabs', 
                styles: ['Silk Scarf', 'Cotton Hijab', 'Chiffon Hijab', 'Wool Scarf', 'Printed Scarf'] 
              },
              'hair-accessories': { 
                label: 'Hair Accessories', 
                styles: ['Hair Clips', 'Hair Bands', 'Hair Ties', 'Headbands', 'Scrunchies'] 
              }
            }
          }
        }
      },
      'men': {
        label: 'Men',
        icon: '👨',
        productTypes: {
          'clothing': {
            label: '👔 Clothing',
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Free Size'],
            subCategories: {
              'unstitched': { label: 'Unstitched', styles: ['Shalwar Kameez', 'Kurta Fabric', 'Waistcoat', 'Sherwani', 'Embroidered Fabric'] },
              'shirts': { label: 'Shirts', styles: ['Formal Shirt', 'Casual Shirt', 'Party Shirt'] },
              't-shirts': { label: 'T-Shirts', styles: ['Casual T-Shirt', 'Polo T-Shirt', 'Graphic T-Shirt'] },
              'jeans': { label: 'Jeans', styles: ['Slim Fit', 'Regular Fit', 'Straight Fit', 'Skinny Fit'] },
              'kurta': { label: 'Kurta', styles: ['Simple Kurta', 'Embroidered Kurta', 'Wedding Kurta'] },
              'trousers': { label: 'Trousers', styles: ['Formal Trousers', 'Casual Trousers', 'Chino'] },
              'suits': { label: 'Suits & Blazers', styles: ['Formal Suit', 'Party Suit', 'Wedding Suit'] }
            }
          },
          'footwear': {
            label: '👞 Footwear',
            sizes: ['6(US)', '6.5(US)', '7(US)', '7.5(US)', '8(US)', '8.5(US)', '9(US)', '9.5(US)', '10(US)', '10.5(US)', '11(US)', '11.5(US)', '12(US)'],
            subCategories: {
              'formal-shoes': { label: 'Formal Shoes', styles: ['Oxford', 'Derby', 'Loafers', 'Monk Strap'] },
              'casual-shoes': { label: 'Casual Shoes', styles: ['Sneakers', 'Slip-ons', 'Boat Shoes'] },
              'sandals': { label: 'Sandals', styles: ['Leather Sandals', 'Casual Sandals', 'Formal Sandals'] },
              'slippers': { label: 'Slippers', styles: ['House Slippers', 'Flip Flops'] }
            }
          },
          'bags': {
            label: '💼 Bags',
            sizes: ['One Size'],
            subCategories: {
              'backpacks': { label: 'Backpacks', styles: ['Casual Backpack', 'Office Backpack', 'Travel Backpack'] },
              'messenger-bags': { label: 'Messenger Bags', styles: ['Leather Messenger', 'Canvas Messenger'] },
              'briefcases': { label: 'Briefcases', styles: ['Leather Briefcase', 'Fabric Briefcase'] },
              'wallets': { label: 'Wallets', styles: ['Leather Wallet', 'Slim Wallet', 'Card Holder'] }
            }
          },
          'accessories': {
            label: '⌚ Accessories',
            sizes: ['One Size'],
            subCategories: {
              'watches': { label: 'Watches', styles: ['Analog', 'Digital', 'Smart', 'Fashion'] },
              'sunglasses': { label: 'Sunglasses', styles: ['Aviator', 'Wayfarer', 'Round'] },
              'belts': { label: 'Belts', styles: ['Leather Belt', 'Fabric Belt', 'Formal Belt'] },
              'ties': { label: 'Ties', styles: ['Silk Tie', 'Knit Tie', 'Pattern Tie'] }
            }
          }
        }
      },
      'kids': {
        label: 'Kids',
        icon: '🧒',
        productTypes: {
          'boys': {
            label: '👦 Boys',
            sizes: ['XS(4-5)', 'S(6-7)', 'M(8-10)', 'L(12-14)', 'XL(16)'],
            subCategories: {
              'shirts': { label: 'Shirts', styles: ['Formal', 'Casual', 'Party'] },
              't-shirts': { label: 'T-Shirts', styles: ['Casual', 'Graphic', 'Polo'] },
              'jeans': { label: 'Jeans', styles: ['Slim', 'Regular'] },
              'kurta': { label: 'Kurta', styles: ['Simple', 'Embroidered'] },
              'trousers': { label: 'Trousers', styles: ['Formal', 'Casual'] }
            }
          },
          'girls': {
            label: '👧 Girls',
            sizes: ['XS(4-5)', 'S(6-7)', 'M(8-10)', 'L(12-14)', 'XL(16)'],
            subCategories: {
              'dresses': { label: 'Dresses', styles: ['Party Dress', 'Casual Dress', 'Wedding Dress'] },
              'frocks': { label: 'Frocks', styles: ['Casual Frocks', 'Party Frocks', 'Wedding Frocks'] },
              'kurti': { label: 'Kurti', styles: ['Casual Kurti', 'Party Kurti'] },
              'lawn': { label: 'Lawn', styles: ['Casual Lawn', 'Party Lawn'] }
            }
          },
          'baby': {
            label: '👶 Baby',
            sizes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'],
            subCategories: {
              'onesies': { label: 'Onesies', styles: ['Cotton Onesies', 'Organic Onesies'] },
              'sleepwear': { label: 'Sleepwear', styles: ['Cotton Sleepwear', 'Warm Sleepwear'] },
              'sets': { label: 'Sets', styles: ['Casual Sets', 'Party Sets'] }
            }
          },
          'footwear': {
            label: '👟 Footwear',
            sizes: ['10(US)', '10.5(US)', '11(US)', '11.5(US)', '12(US)', '12.5(US)', '13(US)', '13.5(US)', '1(US)', '1.5(US)', '2(US)', '2.5(US)', '3(US)'],
            subCategories: {
              'shoes': { label: 'Shoes', styles: ['Casual Shoes', 'School Shoes', 'Sports Shoes'] },
              'sandals': { label: 'Sandals', styles: ['Casual Sandals', 'Party Sandals'] },
              'slippers': { label: 'Slippers', styles: ['House Slippers', 'Casual Slippers'] }
            }
          },
          'accessories': {
            label: '🎀 Accessories',
            sizes: ['One Size'],
            subCategories: {
              'bags': { label: 'Bags', styles: ['Backpack', 'Tote', 'Crossbody'] },
              'hats': { label: 'Hats', styles: ['Summer Hat', 'Winter Hat'] },
              'hair-accessories': { label: 'Hair Accessories', styles: ['Clips', 'Bands', 'Ties'] }
            }
          }
        }
      },
      'unisex': {
        label: 'Unisex',
        icon: '👤',
        productTypes: {
          'accessories': {
            label: '🎒 Accessories',
            sizes: ['One Size'],
            subCategories: {
              'bags': { label: 'Bags', styles: ['Backpacks', 'Totes', 'Crossbody', 'Duffel'] },
              'watches': { label: 'Watches', styles: ['Analog', 'Digital', 'Smart'] },
              'sunglasses': { label: 'Sunglasses', styles: ['Aviator', 'Wayfarer', 'Round', 'Square'] },
              'hats': { label: 'Hats', styles: ['Caps', 'Beanies', 'Bucket Hats'] }
            }
          }
        }
      }
    }
  }
};

// ✅ Colour Options
const colourOptions = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink',
  'Purple', 'Orange', 'Brown', 'Grey', 'Navy', 'Teal', 'Maroon',
  'Olive', 'Cream', 'Beige', 'Gold', 'Silver', 'Rose Gold',
  'Turquoise', 'Lavender', 'Mint', 'Coral', 'Peach', 'Tan',
  'Charcoal', 'Burgundy', 'Mustard', 'Emerald', 'Ruby'
];

// ✅ Size Options - Complete with US Sizes (No Duplicates)
const sizeOptions = [
  // 👕 Clothing Sizes
  'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  'One Size', 'Free Size',
  // 👟 Women Footwear Sizes (US)
  '5(US)', '5.5(US)', '6(US)', '6.5(US)', '7(US)', '7.5(US)', '8(US)', '8.5(US)', '9(US)', '9.5(US)', '10(US)',
  // 👞 Men Footwear Sizes (US)
  '6(US)', '6.5(US)', '7(US)', '7.5(US)', '8(US)', '8.5(US)', '9(US)', '9.5(US)', '10(US)', '10.5(US)', '11(US)', '11.5(US)', '12(US)',
  // 👶 Kids Sizes
  'XS(4-5)', 'S(6-7)', 'M(8-10)', 'L(12-14)', 'XL(16)',
  '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M',
  '10(US)', '10.5(US)', '11(US)', '11.5(US)', '12(US)', '12.5(US)', '13(US)', '13.5(US)', '1(US)', '1.5(US)', '2(US)', '2.5(US)', '3(US)'
];

// ✅ Main Categories
const mainCategories = Object.keys(categoryData);

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    sku: '',
    category: '',
    gender: '',
    productType: '',
    subCategory: '',
    style: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    costPrice: 0,
    stock: 0,
    lowStockAlert: 5,
    image: '',
    images: [],
    colorImages: {},
    sizes: [],
    colors: [],
    shortDescription: '',
    description: '',
    material: '',
    careInstructions: '',
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    status: 'active',
    rating: 0,
    reviewCount: 0
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [newColorImages, setNewColorImages] = useState<string[]>([]);
  const [newColorUrlInput, setNewColorUrlInput] = useState('');
  const [showColorUrlInput, setShowColorUrlInput] = useState(false);
  
  const [newSize, setNewSize] = useState('');
  const [usedProductIds, setUsedProductIds] = useState<string[]>([]);

  // ✅ Get current category data with proper typing
  const currentCategory = formData.category ? categoryData[formData.category] : null;
  const categoryPrefix = currentCategory?.prefix || '';

  // ✅ Get current gender data with proper typing
  const currentGender = formData.gender && currentCategory 
    ? currentCategory.genders[formData.gender] 
    : null;

  // ✅ Get current product type data with proper typing
  const currentProductType = formData.productType && currentGender
    ? currentGender.productTypes[formData.productType]
    : null;

  // ✅ Get current subcategory data with proper typing
  const currentSubCategory = formData.subCategory && currentProductType
    ? currentProductType.subCategories[formData.subCategory]
    : null;

  // ✅ Get genders for selected category
  const getGenders = () => {
    if (!formData.category || !currentCategory) return {};
    return currentCategory.genders;
  };

  // ✅ Get product types for selected gender
  const getProductTypes = () => {
    if (!formData.category || !formData.gender || !currentGender) return {};
    return currentGender.productTypes;
  };

  // ✅ Get subcategories for selected product type
  const getSubCategories = () => {
    if (!formData.category || !formData.gender || !formData.productType || !currentProductType) return {};
    return currentProductType.subCategories;
  };

  // ✅ Get styles for selected subcategory
  const getStyles = (): string[] => {
    if (!formData.category || !formData.gender || !formData.productType || !formData.subCategory || !currentSubCategory) return [];
    return currentSubCategory.styles || [];
  };

  // ✅ Get sizes for selected product type
  const getSizes = (): string[] => {
    if (!formData.category || !formData.gender || !formData.productType || !currentProductType) return [];
    return currentProductType.sizes || sizeOptions;
  };

  // ✅ Generate Product IDs
  const generateProductIds = (prefix: string) => {
    const ids: string[] = [];
    for (let i = 1; i <= 100; i++) {
      ids.push(`${prefix}-${String(i).padStart(3, '0')}`);
    }
    return ids;
  };

  // ✅ Fetch used product IDs
  const fetchUsedProductIds = async (prefix: string) => {
    try {
      const q = query(
        collection(db, 'products'),
        where('sku', '>=', `${prefix}-001`),
        where('sku', '<=', `${prefix}-100`)
      );
      const snapshot = await getDocs(q);
      const usedIds = snapshot.docs.map(doc => doc.data().sku);
      setUsedProductIds(usedIds);
    } catch (error) {
      console.error('Error fetching product IDs:', error);
    }
  };

  // ✅ When category changes, update product IDs
  useEffect(() => {
    if (formData.category && categoryPrefix) {
      fetchUsedProductIds(categoryPrefix);
      if (!formData.sku) {
        const allIds = generateProductIds(categoryPrefix);
        const available = allIds.filter(id => !usedProductIds.includes(id));
        if (available.length > 0) {
          setFormData(prev => ({ ...prev, sku: available[0] }));
        }
      }
    }
  }, [formData.category, categoryPrefix]);

  // ✅ Fetch product if edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchProduct(id);
    }
  }, [id, isEditMode]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const data = productDoc.data();
        setFormData({
          name: data.name || '',
          brand: data.brand || '',
          sku: data.sku || '',
          category: data.category || '',
          gender: data.gender || '',
          productType: data.productType || '',
          subCategory: data.subCategory || '',
          style: data.style || '',
          price: data.price || 0,
          oldPrice: data.oldPrice || 0,
          discount: data.discount || 0,
          costPrice: data.costPrice || 0,
          stock: data.stock || 0,
          lowStockAlert: data.lowStockAlert || 5,
          image: data.image || '',
          images: data.images || [],
          colorImages: data.colorImages || {},
          sizes: data.sizes || [],
          colors: data.colors || [],
          shortDescription: data.shortDescription || '',
          description: data.description || '',
          material: data.material || '',
          careInstructions: data.careInstructions || '',
          isNew: data.isNew || false,
          isFeatured: data.isFeatured || false,
          isBestSeller: data.isBestSeller || false,
          isOnSale: data.isOnSale || false,
          status: data.status || 'active',
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setImageUrlInput('');
    } catch (error) {
      console.error('Error uploading main image:', error);
      alert('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUrl = () => {
    if (!imageUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    setFormData(prev => ({ ...prev, image: imageUrlInput }));
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...urls] 
      }));
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Failed to upload gallery images');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImageUrl = () => {
    if (!imageUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, imageUrlInput] 
    }));
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const handleColorImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedColor) {
      alert('Please select a colour first');
      return;
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setNewColorImages(prev => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading colour images:', error);
      alert('Failed to upload colour images');
    } finally {
      setUploading(false);
    }
  };

  const handleColorImageUrl = () => {
    if (!newColorUrlInput.trim()) {
      alert('Please enter a valid image URL');
      return;
    }
    if (!selectedColor) {
      alert('Please select a colour first');
      return;
    }
    setNewColorImages(prev => [...prev, newColorUrlInput]);
    setNewColorUrlInput('');
    setShowColorUrlInput(false);
  };

  const addColor = () => {
    if (!selectedColor) {
      alert('Please select a colour');
      return;
    }
    if (formData.colors.includes(selectedColor)) {
      alert('This colour already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, selectedColor],
      colorImages: { ...prev.colorImages, [selectedColor]: newColorImages }
    }));
    setSelectedColor('');
    setNewColorImages([]);
    setNewColorUrlInput('');
  };

  const removeColor = (color: string) => {
    if (!confirm(`Remove colour "${color}"?`)) return;
    const newColors = formData.colors.filter(c => c !== color);
    const newColorImages = { ...formData.colorImages };
    delete newColorImages[color];
    setFormData(prev => ({
      ...prev,
      colors: newColors,
      colorImages: newColorImages
    }));
  };

  const addSize = () => {
    if (!newSize.trim()) {
      alert('Please select a size');
      return;
    }
    if (formData.sizes.includes(newSize)) {
      alert('This size already exists');
      return;
    }
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, newSize]
    }));
    setNewSize('');
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeColorImage = (color: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      colorImages: {
        ...prev.colorImages,
        [color]: prev.colorImages[color].filter((_, i) => i !== index)
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  // ✅ Handle Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: value,
      gender: '',
      productType: '',
      subCategory: '',
      style: '',
      sku: ''
    }));
  };

  // ✅ Handle Gender Change
  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      gender: value,
      productType: '',
      subCategory: '',
      style: ''
    }));
  };

  // ✅ Handle Product Type Change
  const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      productType: value,
      subCategory: '',
      style: ''
    }));
  };

  // ✅ Handle Subcategory Change
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      subCategory: value,
      style: ''
    }));
  };

  // ✅ Check if SKU is used
  const isSkuUsed = (sku: string) => {
    return usedProductIds.includes(sku);
  };

  // ✅ Get status color for SKU
  const getSkuStatus = (sku: string) => {
    if (isSkuUsed(sku)) {
      return 'bg-red-100 text-red-700 border-red-300';
    }
    return 'bg-green-100 text-green-700 border-green-300';
  };

  // ✅ Calculate discount automatically
  useEffect(() => {
    if (formData.oldPrice > formData.price) {
      const discount = Math.round(((formData.oldPrice - formData.price) / formData.oldPrice) * 100);
      setFormData(prev => ({ ...prev, discount }));
    } else {
      setFormData(prev => ({ ...prev, discount: 0 }));
    }
  }, [formData.price, formData.oldPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name) { alert('Please enter product name'); return; }
    if (!formData.price) { alert('Please enter price'); return; }
    if (!formData.category) { alert('Please select category'); return; }
    if (!formData.gender) { alert('Please select gender'); return; }
    if (!formData.productType) { alert('Please select product type'); return; }
    if (!formData.image) { alert('Please upload or add main image URL'); return; }
    if (formData.colors.length === 0) { alert('Please add at least one colour'); return; }
    if (formData.sizes.length === 0) { alert('Please add at least one size'); return; }

    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        brand: formData.brand || '',
        sku: formData.sku || '',
        category: formData.category,
        gender: formData.gender,
        productType: formData.productType,
        subCategory: formData.subCategory || '',
        style: formData.style || '',
        price: formData.price,
        oldPrice: formData.oldPrice || 0,
        discount: formData.discount || 0,
        costPrice: formData.costPrice || 0,
        stock: formData.stock || 0,
        lowStockAlert: formData.lowStockAlert || 5,
        image: formData.image,
        images: formData.images || [],
        colorImages: formData.colorImages || {},
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        material: formData.material || '',
        careInstructions: formData.careInstructions || '',
        isNew: formData.isNew || false,
        isFeatured: formData.isFeatured || false,
        isBestSeller: formData.isBestSeller || false,
        isOnSale: formData.isOnSale || false,
        status: formData.status || 'active',
        rating: formData.rating || 0,
        reviewCount: formData.reviewCount || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔵 Product Data:', productData);

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        alert('✅ Product updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'products'), productData);
        console.log('✅ Product added with ID:', docRef.id);
        alert('✅ Product added successfully!');
      }
      
      navigate('/admin/products');
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`❌ Failed to save product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F766E]"></div>
        <p className="mt-4 text-gray-500">Loading product...</p>
      </div>
    );
  }

  // ✅ Get all select options with proper typing
  const genders = getGenders();
  const productTypes = getProductTypes();
  const subCategories = getSubCategories();
  const styles = getStyles();
  const availableSizes = getSizes();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-gray-500 hover:text-gray-700 transition p-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? 'Update product details' : 'Create a new product'}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm"
        >
          <FaTimes /> Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================================
        1. BASIC INFORMATION
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., MARIA B Exclusive Heavy Embroidered Saree"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., MARIA B"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className={`flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none ${getSkuStatus(formData.sku)}`}
                >
                  <option value="">Select SKU</option>
                  {generateProductIds(categoryPrefix).map((id) => (
                    <option key={id} value={id} className={isSkuUsed(id) ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}>
                      {id} {isSkuUsed(id) ? '🔴 (Used)' : '🟢 (Available)'}
                    </option>
                  ))}
                </select>
                <span className="text-xs whitespace-nowrap">
                  {formData.sku && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSkuStatus(formData.sku)}`}>
                      <FaCircle className="text-[8px]" />
                      {isSkuUsed(formData.sku) ? 'Used' : 'Available'}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="active">🟢 Active</option>
                <option value="draft">🟡 Draft</option>
                <option value="out-of-stock">🔴 Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* ============================================================
        2. CATEGORY
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ 2. Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Category *</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              >
                <option value="">Select Category</option>
                {mainCategories.map((cat) => {
                  const catData = categoryData[cat];
                  return (
                    <option key={cat} value={cat}>
                      {catData?.icon || '📦'} {catData?.label || cat}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">For *</label>
              <select
                value={formData.gender}
                onChange={handleGenderChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              >
                <option value="">Select</option>
                {Object.keys(genders).map((key) => {
                  const gender = genders[key];
                  return (
                    <option key={key} value={key}>
                      {gender?.icon || ''} {gender?.label || key}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                value={formData.productType}
                onChange={handleProductTypeChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              >
                <option value="">Select Product Type</option>
                {Object.keys(productTypes).map((key) => {
                  const pt = productTypes[key];
                  return (
                    <option key={key} value={key}>
                      {pt?.label || key}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Subcategory</option>
                {Object.keys(subCategories).map((key) => {
                  const sc = subCategories[key];
                  return (
                    <option key={key} value={key}>
                      {sc?.label || key}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
              <select
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              >
                <option value="">Select Style</option>
                {styles.map((style: string) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Category Path Display */}
            {formData.category && (
              <div className="md:col-span-2">
                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <span className="text-xl">{categoryData[formData.category]?.icon || '📦'}</span>
                  <span className="font-medium">{categoryData[formData.category]?.label || formData.category}</span>
                  {formData.gender && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span>{genders[formData.gender]?.icon || ''} {genders[formData.gender]?.label || formData.gender}</span>
                    </>
                  )}
                  {formData.productType && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span>{productTypes[formData.productType]?.label || formData.productType}</span>
                    </>
                  )}
                  {formData.subCategory && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span>{subCategories[formData.subCategory]?.label || formData.subCategory}</span>
                    </>
                  )}
                  {formData.style && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span className="text-[#D4AF37] font-medium">{formData.style}</span>
                    </>
                  )}
                  {formData.sku && (
                    <>
                      <FaChevronRight className="text-gray-400 text-xs" />
                      <span className={`font-mono font-semibold ${isSkuUsed(formData.sku) ? 'text-red-500' : 'text-green-600'}`}>
                        {formData.sku}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
        3. PRICING
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 3. Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="6250"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old / Regular Price</label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                placeholder="7500"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Auto)</label>
              <div className="px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                {formData.discount || 0}%
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (Admin)</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        4. INVENTORY
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 4. Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="15"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input
                type="number"
                name="lowStockAlert"
                value={formData.lowStockAlert}
                onChange={handleInputChange}
                placeholder="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        5. IMAGES
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🖼️ 5. Images</h3>
          
          {/* Main Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image *</label>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
                id="mainImageUpload"
                disabled={uploading}
              />
              <label
                htmlFor="mainImageUpload"
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
              >
                {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
              >
                <FaLink /> Add URL
              </button>
            </div>
            {showUrlInput && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleMainImageUrl}
                  className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
            {formData.image && (
              <div className="relative inline-block mt-2">
                <img src={formData.image} alt="Main" className="w-24 h-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Product Images</label>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesUpload}
                className="hidden"
                id="galleryImagesUpload"
                disabled={uploading}
              />
              <label
                htmlFor="galleryImagesUpload"
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
              >
                {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {uploading ? 'Uploading...' : 'Upload Images'}
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
              >
                <FaLink /> Add URL
              </button>
            </div>
            {showUrlInput && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={handleGalleryImageUrl}
                  className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="relative">
                  <img src={img} alt={`Gallery ${index}`} className="w-20 h-20 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================
        6. VARIANTS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 6. Variants</h3>
          
          {/* Colors */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                >
                  <option value="">Select Colour</option>
                  {colourOptions.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleColorImagesUpload}
                    className="hidden"
                    id="colorImagesUpload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="colorImagesUpload"
                    className="bg-[#0F766E] text-white px-3 py-2 rounded-lg hover:bg-[#065F46] transition cursor-pointer text-sm flex items-center gap-2"
                  >
                    {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowColorUrlInput(!showColorUrlInput)}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
                  >
                    <FaLink /> Add URL
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                >
                  <FaPlus className="inline mr-1" /> Add Colour
                </button>
              </div>
              {showColorUrlInput && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="https://example.com/colour-image.jpg"
                    value={newColorUrlInput}
                    onChange={(e) => setNewColorUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleColorImageUrl}
                    className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
                  >
                    Add URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowColorUrlInput(false); setNewColorUrlInput(''); }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {newColorImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {newColorImages.map((img: string, i: number) => (
                    <img key={i} src={img} className="w-12 h-12 object-cover rounded border" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color: string) => (
                <div key={color} className="border rounded-lg p-2 bg-white shadow-sm flex items-center gap-2">
                  <div>
                    <span className="font-medium text-gray-800">{color}</span>
                    {formData.colorImages[color]?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.colorImages[color].map((img: string, index: number) => (
                          <div key={index} className="relative">
                            <img src={img} alt={`${color} ${index + 1}`} className="w-12 h-12 object-cover rounded border" />
                            <button
                              type="button"
                              onClick={() => removeColorImage(color, index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.colors.length === 0 && (
                <span className="text-sm text-gray-400">No colors added yet</span>
              )}
            </div>
          </div>

          {/* Sizes - ✅ Dynamic Sizes based on Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-3">
              <select
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none text-sm"
              >
                <option value="">Select Size</option>
                {availableSizes.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSize}
                className="bg-[#0F766E] text-white px-4 py-2 rounded-lg hover:bg-[#065F46] transition text-sm"
              >
                <FaPlus className="inline mr-1" /> Add Size
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.sizes.map((size: string) => (
                <span
                  key={size}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.sizes.length === 0 && (
                <span className="text-sm text-gray-400">No sizes added yet</span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
        7. DETAILS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 7. Product Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief product description..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Full product description..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g., Shamoz Silk, Net Fabric"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
              <input
                type="text"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleInputChange}
                placeholder="e.g., Dry clean recommended"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
        8. LABELS
        ============================================================ */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏷️ 8. Product Labels</h3>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🆕 New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              ⭐ Featured Product
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🏆 Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={formData.isOnSale}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0F766E] rounded focus:ring-[#0F766E]"
              />
              🔥 On Sale
            </label>
          </div>
        </div>

        {/* ============================================================
        9. SUBMIT
        ============================================================ */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0F766E] text-white px-6 py-2 rounded-lg hover:bg-[#065F46] transition flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;