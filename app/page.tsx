"use client"

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Integrations from '@/components/Integrations';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Hero />
      <Features />
      <Integrations />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;