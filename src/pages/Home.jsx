import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import FocusAreas from '../components/home/FocusAreas';
import EducationSection from '../components/home/EducationSection';
import Features from '../components/home/Features';
import GiftFuture from '../components/home/GiftFuture';
import FeaturedCampaigns from '../components/home/FeaturedCampaigns';
import { NGO_INFO } from '../utils/constants';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>{NGO_INFO.name} - {NGO_INFO.tagline}</title>
        <meta 
          name="description" 
          content={`${NGO_INFO.description} Join us in supporting infants and children with donations that make a real difference. Quality education, healthcare, and nutrition for every child.`}
        />
        <meta 
          name="keywords" 
          content="infant organisation, child donation, healthcare for children, nutrition programs, education support, quality education, sponsor a child"
        />
        <meta property="og:title" content={`${NGO_INFO.name} - ${NGO_INFO.tagline}`} />
        <meta property="og:description" content={NGO_INFO.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:image" content="/logo.jpg" />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section with Image Carousel */}
        <Hero />
        
        {/* Our Focus Areas with Carousel */}
        <FocusAreas />
        
        {/* Stats Section */}
        <Stats />
        
        {/* Education Section */}
        <EducationSection />
        
        {/* Features Section */}
        <Features />
        
        {/* Featured Campaigns */}
        <FeaturedCampaigns />
      </div>
    </>
  );
};

export default Home;