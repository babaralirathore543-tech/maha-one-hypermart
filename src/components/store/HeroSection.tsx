// src/components/store/HeroSection.tsx
import React from 'react';
import { StoreData } from '../../hooks/useStoreConfig';

interface Props {
  store: StoreData;
}

const HeroSection = ({ store }: Props) => {
  return (
    <section
      className="py-20 px-4 text-center text-white"
      style={{
        background: `linear-gradient(135deg, ${store.colors.primary}, ${store.colors.secondary})`,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{store.hero.heading}</h1>
        <p className="text-lg sm:text-xl opacity-90 mb-6">{store.hero.subtitle}</p>
        <p className="text-sm opacity-75 italic mb-8">"{store.tagline}"</p>
        <button
          className="px-8 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
          style={{ background: store.colors.background, color: store.colors.primary }}
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;