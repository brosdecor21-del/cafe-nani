import React, { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import ExperienceSection from '../components/home/ExperienceSection';
import ReviewsSection from '../components/home/ReviewsSection';
import BeansPreview from '../components/home/BeansPreview';
import ContactPreview from '../components/home/ContactPreview';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HomePage = () => {
  // Seed data on first load
  useEffect(() => {
    const seedData = async () => {
      try {
        await axios.post(`${API}/seed`);
      } catch (error) {
        // Ignore if already seeded
      }
    };
    seedData();
  }, []);

  return (
    <div className="min-h-screen" data-testid="home-page">
      <Header />
      <main>
        <HeroSection />
        <ExperienceSection />
        <BeansPreview />
        <ReviewsSection />
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
