// src/components/store/AboutSection.tsx
import React from 'react';
import { StoreData } from '../../hooks/useStoreConfig';

interface Props {
  store: StoreData;
}

const AboutSection = ({ store }: Props) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4" style={{ color: store.colors.primary }}>
        About Us
      </h2>
      <p className="text-gray-600 leading-relaxed">{store.about}</p>
    </section>
  );
};

export default AboutSection;