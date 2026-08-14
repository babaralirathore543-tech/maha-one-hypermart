import React, { useState } from 'react';
import ImageUploader from '../ImageUploader';

const AdminProductForm = () => {
  const [images, setImages] = useState<string[]>([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleImageUpload = (url: string) => {
    setImages([...images, url]);
    console.log('✅ Image uploaded:', url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Product create karein
    const product = {
      ...productData,
      images: images
    };
    
    // Backend par send karein
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(product)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={productData.name}
        onChange={(e) => setProductData({...productData, name: e.target.value})}
      />
      
      <input
        type="number"
        placeholder="Price"
        value={productData.price}
        onChange={(e) => setProductData({...productData, price: e.target.value})}
      />
      
      {/* ✅ Image Upload */}
      <ImageUploader 
        folder="products"
        onUploadComplete={handleImageUpload}
        onProgress={(progress) => console.log('Upload progress:', progress)}
      />
      
      {/* ✅ Uploaded Images Preview */}
      <div className="flex gap-2 mt-2">
        {images.map((url, index) => (
          <img 
            key={index}
            src={url}
            alt={`Product ${index}`}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
      </div>
      
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AdminProductForm;