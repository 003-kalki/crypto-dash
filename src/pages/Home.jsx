import { useState } from "react";
import AuthModal from "../components/auth/AuthModal";
import HeroSection from "../components/home/HeroSection";
import Navbar from "../components/layout/Navbar";

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <HeroSection onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};

export default Home;
