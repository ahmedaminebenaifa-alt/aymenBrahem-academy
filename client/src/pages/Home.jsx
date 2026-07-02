import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import AboutSheikh from '../components/home/AboutSheikh';
import CourseTracks from '../components/home/CourseTracks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AuthSection from '../components/home/AuthSection';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSheikh />
      <CourseTracks />
      <WhyChooseUs />
      <AuthSection />
      <Footer />
    </div>
  );
}