import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import { ToastProvider } from './contexts/toastContext';
import { CommandPaletteProvider, useCommandPalette } from './contexts/commandPaletteContext';
import { ShortcutsHelpProvider, useShortcutsHelp } from './contexts/shortcutsHelpContext';

// Importação das Páginas
import Home from './pages/home';
import ActivateAdmin from './pages/ActivateAdmin';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';
import QuizSelectionPage from './pages/QuizSelectionPage'; 
import QuizPlayer from './pages/QuizPlayer'; 
import Biblioteca from './pages/Biblioteca';  
import LabSelectionPage from './pages/labs/LabSelectionPage';
import SqlInjectionLab1 from './pages/labs/SqlInjectionLab1';
import SqlInjectionLab2 from './pages/labs/SqlInjectionLab2';
import SqlInjectionLab3 from './pages/labs/SqlInjectionLab3';
import BruteForceLab1 from './pages/labs/BruteForceLab1';
import BruteForceLab2 from './pages/labs/BruteForceLab2';
import BruteForceLab3 from './pages/labs/BruteForceLab3';
import XSSLab1 from './pages/labs/XSSLab1';  
import XSSLab2 from './pages/labs/XSSLab2'; 
import XSSLab3 from './pages/labs/XSSLab3';
import FormViewer from './pages/FormViewer';
import ExercisePage from './pages/exercises/ExercisePage';
import ExerciseCategoryIndexPage from './pages/exercises/ExerciseCategoryIndexPage';
import LabCategoryIndexPage from './pages/labs/LabCategoryIndexPage';
import AdminQuestions from './pages/admin/AdminQuestions';
import BookDetails from './pages/BookDetails';
import AdminMaterials from './pages/admin/AdminMaterials';
import AdminAdmins from './pages/admin/AdminAdmins';
import Simulados from './pages/simulados';
import CreateModule from './pages/admin/CreateModule';
import SimuladoPlayer from './pages/SimuladoPlayer';
import ManualPage from './pages/ManualPage';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';

// Rodapé e Navegação
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import ChatPage from './pages/ChatPage';
import CommandPalette from './components/CommandPalette';
import GlobalShortcuts from './components/GlobalShortcuts';
import ShortcutsHelp from './components/ShortcutsHelp';
import OnboardingTour from './components/OnboardingTour';

// ===================================================================
// COMPONENTE PARA PROTEGER ROTAS
// ===================================================================
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostra uma tela de carregamento enquanto verifica a autenticação
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0d1117', color: 'white' }}>Carregando...</div>;
  }

  // Se não estiver carregando, decide se mostra a página ou redireciona
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ===================================================================
// COMPONENTE PARA PROTEGER ROTAS ADMINISTRATIVAS (autenticado + is_admin)
// ===================================================================
interface UserWithRole {
  is_admin?: boolean;
}

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0d1117', color: 'white' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isAdmin = (user as unknown as UserWithRole)?.is_admin === true;
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

// ===================================================================
// COMPONENTE PARA PÁGINAS SÓ-DESLOGADO (login, registro, etc.)
// Evita que um usuário já autenticado veja a Sidebar sobreposta ao
// formulário de login/registro ao navegar manualmente para essas rotas.
// ===================================================================
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0d1117', color: 'white' }}>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};
const quizformsburp1 = "https://forms.gle/SYUA6qkz8tFiv3tC8"
const quizformsburp2 = "https://forms.gle/eD1amS8RyNQpqNag7"
const quizformsburp3 = "https://forms.gle/hVHYnHGnHixtckfm8"
const quizformsburp4 = "https://forms.gle/6K7qfkp9LyjFgdG37"
const quizformsburp5 = "https://forms.gle/7bvv1px1Duh5bLKb8"
const quizformsburp6 = "https://forms.gle/UKtVz6XZ7C2ydNVb6"
const quizformsburp7 = "https://forms.gle/g5eaRGAojtjMrqcK9"
const quizformsburp8 = "https://forms.gle/7p75hyGuQZ2NQLzZ8"

const quizformstcp1 = "https://forms.gle/ArJpQDbmKFT1bqSBA"
const quizformstcp2 = "https://forms.gle/SvHujiP1xZUTMoN38"
const quizformstcp3 = "https://docs.google.com/forms/d/e/1FAIpQLSeTl2uEc7jj16XQravxq6mHePJ7b9kzCdVkHJRuhIsc4CO3MA/viewform?usp=sharing&ouid=116481828861022233090"
const quizformstcp4 = "https://forms.gle/mRWyNYk83Bwk4kXJ7"
const quizformstcp5 = "https://forms.gle/6SzLMEKR9ELVSxM27"
const quizformstcp6 = "https://forms.gle/MKjkB9ntxVdJMkfZ9"
const quizformstcp7 = "https://forms.gle/v1vE4jAbJuvkaNZR6"
const quizformstcp8 = "https://forms.gle/bMBJ9LxKdb45YKL6A"

const quizformsnmap1 = "https://forms.gle/8ngfJycwWGT2ey8F9"

// ===================================================================
// COMPONENTE QUE CONTÉM AS ROTAS
// ===================================================================
function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      {/* Uma rota só pras 4 variantes da home (landing/login/register/forgot) —
          são a MESMA instância de componente por baixo (só o parâmetro muda),
          então trocar de modo não remonta a página nem reinicia a animação
          da tagline. Ver Home.tsx: authMode inválido cai no NotFound. */}
      <Route path="/:authMode?" element={<PublicOnlyRoute><Home /></PublicOnlyRoute>} />
      <Route path="/activate-admin" element={<PublicOnlyRoute><ActivateAdmin /></PublicOnlyRoute>} />

      {/* Rotas Protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/biblioteca" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />
      <Route path="/biblioteca/:id" element={<PrivateRoute><BookDetails /></PrivateRoute>} />
      <Route path="/simulados" element={<PrivateRoute><Simulados /></PrivateRoute>} />
      <Route path="/simulados/:id/play" element={<PrivateRoute><SimuladoPlayer /></PrivateRoute>} />
      <Route path="/manual" element={<PrivateRoute><ManualPage /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />

      {/* Rotas do Quiz */}
      <Route path="/quizzes/:topic" element={<PrivateRoute><QuizSelectionPage /></PrivateRoute>} />
      <Route path="/quizzes/:topic/:difficulty" element={<PrivateRoute><QuizPlayer /></PrivateRoute>} />
      
      {/* Rotas dos Exercícios */}
      <Route path="/exercises" element={<PrivateRoute><ExerciseCategoryIndexPage /></PrivateRoute>} />
      <Route path="/exercises/:topic" element={<PrivateRoute><ExercisePage /></PrivateRoute>} />
      <Route
            path="/exercises/burp/1"
            element={<PrivateRoute><FormViewer src={quizformsburp1} title="Exercício de Fixação I - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/2"
            element={<PrivateRoute><FormViewer src={quizformsburp2} title="Exercício de Fixação II - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/3"
            element={<PrivateRoute><FormViewer src={quizformsburp3} title="Exercício de Fixação III - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/4"
            element={<PrivateRoute><FormViewer src={quizformsburp4} title="Exercício de Fixação IV - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/5"
            element={<PrivateRoute><FormViewer src={quizformsburp5} title="Exercício de Fixação V - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/6"
            element={<PrivateRoute><FormViewer src={quizformsburp6} title="Exercício de Fixação VI - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/7"
            element={<PrivateRoute><FormViewer src={quizformsburp7} title="Exercício de Fixação VII - Burp Suite" /></PrivateRoute>}
          />
      <Route
            path="/exercises/burp/8"
            element={<PrivateRoute><FormViewer src={quizformsburp8} title="Exercício de Fixação VIII - Burp Suite" /></PrivateRoute>}
          />
      <Route path="/exercises/tcpdump/1" element={<PrivateRoute><FormViewer src={quizformstcp1} title="Exercício de Fixação I - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/2" element={<PrivateRoute><FormViewer src={quizformstcp2} title="Exercício de Fixação II - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/3" element={<PrivateRoute><FormViewer src={quizformstcp3} title="Exercício de Fixação III - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/4" element={<PrivateRoute><FormViewer src={quizformstcp4} title="Exercício de Fixação IV - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/5" element={<PrivateRoute><FormViewer src={quizformstcp5} title="Exercício de Fixação V - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/6" element={<PrivateRoute><FormViewer src={quizformstcp6} title="Exercício de Fixação VI - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/7" element={<PrivateRoute><FormViewer src={quizformstcp7} title="Exercício de Fixação VII - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/tcpdump/8" element={<PrivateRoute><FormViewer src={quizformstcp8} title="Exercício de Fixação VIII - TCPDump" /></PrivateRoute>} />
      <Route path="/exercises/nmap/1" element={<PrivateRoute><FormViewer src={quizformsnmap1} title="Exercício de Fixação I - NMap" /></PrivateRoute>} />

      {/* Rotas dos Laboratórios */}
      <Route path="/labs" element={<PrivateRoute><LabCategoryIndexPage /></PrivateRoute>} />
      <Route path="/labs/:topic" element={<PrivateRoute><LabSelectionPage /></PrivateRoute>} />
      <Route path="/labs/sql-injection/1" element={<PrivateRoute><SqlInjectionLab1 /></PrivateRoute>} />
      <Route path="/labs/sql-injection/2" element={<PrivateRoute><SqlInjectionLab2 /></PrivateRoute>} />
      <Route path="/labs/sql-injection/3" element={<PrivateRoute><SqlInjectionLab3 /></PrivateRoute>} />
      <Route path="/labs/brute-force/1" element={<PrivateRoute><BruteForceLab1 /></PrivateRoute>} />
      <Route path="/labs/brute-force/2" element={<PrivateRoute><BruteForceLab2 /></PrivateRoute>} />
      <Route path="/labs/brute-force/3" element={<PrivateRoute><BruteForceLab3 /></PrivateRoute>} />
      <Route path="/labs/xss/1" element={<PrivateRoute><XSSLab1 /></PrivateRoute>} />
      <Route path="/labs/xss/2" element={<PrivateRoute><XSSLab2 /></PrivateRoute>} />
      <Route path="/labs/xss/3" element={<PrivateRoute><XSSLab3 /></PrivateRoute>} />

      {/* Rotas de Admin */}
      <Route path="/admin/questions" element={<AdminRoute><AdminQuestions /></AdminRoute>} />
      <Route path="/admin/materials" element={<AdminRoute><AdminMaterials /></AdminRoute>} />
      <Route path="/admin/modules" element={<AdminRoute><CreateModule /></AdminRoute>} />
      <Route path="/admin/admins" element={<AdminRoute><AdminAdmins /></AdminRoute>} />

      {/* Rota Coringa (404) */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

// ===================================================================
// SHELL: NAVEGAÇÃO GLOBAL + ROTAS + RODAPÉ
// ===================================================================
function AppShell() {
  const { isAuthenticated } = useAuth();
  const { isOpen: isHelpOpen, close: closeHelp } = useShortcutsHelp();
  const { close: closePalette } = useCommandPalette();

  // Os providers de busca/atalhos ficam montados mesmo com logout (envolvem
  // o AppShell inteiro), então o estado "aberto" sobrevive à troca de sessão
  // se não for resetado explicitamente aqui.
  useEffect(() => {
    if (!isAuthenticated) {
      closeHelp();
      closePalette();
    }
  }, [isAuthenticated, closeHelp, closePalette]);

  return (
    <div className={`app-container ${isAuthenticated ? 'with-sidebar' : ''}`}>
      {isAuthenticated && <Sidebar />}
      {isAuthenticated && <CommandPalette />}
      {isAuthenticated && <GlobalShortcuts />}
      {isAuthenticated && <ShortcutsHelp isOpen={isHelpOpen} onClose={closeHelp} />}
      {isAuthenticated && <OnboardingTour />}
      <div className="app-body">
        <main className="main-content">
          {isAuthenticated && <Breadcrumbs />}
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}

// ===================================================================
// O COMPONENTE PRINCIPAL QUE ORGANIZA TUDO
// ===================================================================
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CommandPaletteProvider>
            <ShortcutsHelpProvider>
              <AppShell />
            </ShortcutsHelpProvider>
          </CommandPaletteProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
export default App;

