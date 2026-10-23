import React, { useState, useEffect } from 'react';
import { MinecraftBackdrop } from './components/MinecraftBackdrop';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { RegistrationWizard } from './components/RegistrationWizard';
import { StatusTracker } from './components/StatusTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RulesModal } from './components/RulesModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import { Crown, Lock } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>('ar');
  const [activeView, setActiveView] = useState<'home' | 'register' | 'track' | 'rules' | 'privacy' | 'admin'>('home');

  // Track ID query state
  const [trackQueryId, setTrackQueryId] = useState<string>('');

  // Modals
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Admin session state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // On mount, restore session if valid
  useEffect(() => {
    const savedToken = sessionStorage.getItem('wps3_admin_token');
    const savedAdmin = sessionStorage.getItem('wps3_is_admin');
    if (savedToken && savedAdmin === 'true') {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  // Update document direction and lang
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleNavigate = (view: 'home' | 'register' | 'track' | 'rules' | 'privacy' | 'admin') => {
    if (view === 'rules') {
      setShowRulesModal(true);
      return;
    }
    if (view === 'privacy') {
      setShowPrivacyModal(true);
      return;
    }
    if (view === 'admin' && (!isAdmin || !adminToken)) {
      setShowAdminLogin(true);
      return;
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTrack = (queryId?: string) => {
    if (queryId) {
      setTrackQueryId(queryId);
    }
    setActiveView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (token: string) => {
    setIsAdmin(true);
    setAdminToken(token);
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('wps3_admin_token');
    sessionStorage.removeItem('wps3_is_admin');
    setIsAdmin(false);
    setAdminToken(null);
    if (activeView === 'admin') {
      setActiveView('home');
    }
  };

  const isAr = currentLang === 'ar';

  return (
    <div className="min-h-screen bg-[#030817] text-[#F4F8FF] font-chakra relative selection:bg-[#008CFF] selection:text-white flex flex-col justify-between">
      {/* 3D Minecraft Isometric Atmospheric Backdrop */}
      <MinecraftBackdrop />

      {/* Main App Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          currentLang={currentLang}
          onToggleLang={toggleLanguage}
          onNavigate={handleNavigate}
          activeView={activeView}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => setShowAdminLogin(true)}
        />

        {/* View Router */}
        <main className="flex-1">
          {activeView === 'home' && (
            <HomeHero
              currentLang={currentLang}
              onStartRegistration={() => handleNavigate('register')}
              onTrackStatus={() => handleNavigate('track')}
              onOpenRules={() => setShowRulesModal(true)}
            />
          )}

          {activeView === 'register' && (
            <RegistrationWizard
              currentLang={currentLang}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateTrack={handleNavigateTrack}
              onOpenRules={() => setShowRulesModal(true)}
            />
          )}

          {activeView === 'track' && (
            <StatusTracker
              currentLang={currentLang}
              initialQuery={trackQueryId}
              onNavigateHome={() => handleNavigate('home')}
              onNavigateRegister={() => handleNavigate('register')}
            />
          )}

          {activeView === 'admin' && isAdmin && adminToken && (
            <AdminDashboard
              currentLang={currentLang}
              adminToken={adminToken}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Footer */}
        <Footer
          currentLang={currentLang}
          onNavigate={handleNavigate}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => setShowAdminLogin(true)}
        />
      </div>

      {/* Floating Admin Bubble */}
      {isAdmin ? (
        <aside
          aria-label="Admin floating dock"
          className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-40 flex items-center gap-2"
        >
          <button
            onClick={() => handleNavigate('admin')}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#050C1F] to-[#0A1A3A] border-2 border-[#FFC928] shadow-[0_0_20px_rgba(255,201,40,0.5)] text-white hover:scale-105 transition-all group cursor-pointer"
            title="WPS3 Admin Control Bubble"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFC928]/20 flex items-center justify-center text-[#FFC928]">
              <Crown className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-pulse" />
            </div>
            <div className="flex flex-col text-start">
              <span className="text-[10px] sm:text-[11px] font-chakra font-black text-[#FFC928] tracking-wider uppercase">
                {isAr ? 'لوحة تحكم الإدارة' : 'OWNER ADMIN'}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-[#00E5FF] tracking-wider">
                WPS3 • ONLINE
              </span>
            </div>
          </button>
        </aside>
      ) : (
        <aside
          aria-label="Admin login quick button"
          className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-30"
        >
          <button
            onClick={() => setShowAdminLogin(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#050C1F]/90 hover:bg-[#008CFF]/20 border border-[#008CFF]/40 hover:border-[#008CFF] text-[#A6C5FF] hover:text-[#008CFF] flex items-center justify-center shadow-[0_0_15px_rgba(0,140,255,0.3)] transition-all cursor-pointer group"
            title="WPS3 Admin Access"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
          </button>
        </aside>
      )}

      {/* Modals */}
      {showAdminLogin && (
        <AdminLoginModal
          currentLang={currentLang}
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showRulesModal && (
        <RulesModal
          currentLang={currentLang}
          onClose={() => setShowRulesModal(false)}
        />
      )}

      {showPrivacyModal && (
        <PrivacyModal
          currentLang={currentLang}
          onClose={() => setShowPrivacyModal(false)}
        />
      )}
    </div>
  );
}
