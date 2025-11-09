// app/page.tsx
'use client';

import { useEffect } from 'react';
import HeroSection from './components/landing/HeroSection';
import ImpactStats from './components/landing/ImpactStats';
import PathSelector from './components/landing/PathSelector';
import HowItWorks from './components/landing/HowItWorks';
import DataSources from './components/landing/DataSources';
import Testimonials from './components/landing/Testimonials';
import FinalCTA from './components/landing/FinalCTA';
import './landing.module.css';

export default function LandingPage() {
  useEffect(() => {
    // Add global landing page styles
    document.body.style.overflowX = 'hidden';
    document.body.style.backgroundColor = '#0B1220';
    
    return () => {
      document.body.style.overflowX = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="landing-page">
      <HeroSection />
      <ImpactStats />
      <PathSelector />
      <HowItWorks />
      <DataSources />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}