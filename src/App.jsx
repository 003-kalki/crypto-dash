import './App.css'
import { useState } from 'react'
import HeroSection from './components/Hero/HeroSection'
import AuthModal from "./components/modal/AuthModal";
import Navbar from './components/navbar/Navbar'
function App() {
  const [isAuthModalOpen,setIsAuthModalOpen] = useState(false)
  return (
    <>
        <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)}/>
        <HeroSection onOpenAuthModal={()=>setIsAuthModalOpen(true) }/>
        
         {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  )
}

export default App
