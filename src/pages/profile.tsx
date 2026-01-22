import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { supabase } from '../lib/supabase'; // Ajuste se seu import for diferente
import HexagonBackground from '../components/hexagonobg';
import { jsPDF } from 'jspdf';
import { 
  User, ShieldCheck, BookBookmark, Gear, 
  Trophy, DownloadSimple, Camera, FloppyDisk, 
  Cpu, TerminalWindow 
} from '@phosphor-icons/react';
import './profile.css';

// Tipos
interface UserStats {
  completedLabs: number;
  completedBooks: number;
  passedExams: number;
  totalXp: number;
  rank: string;
}

interface ExamAttempt {
  id: string;
  score: number;
  total_questions: number;
  module: { title: string; cover_url: string };
  completed_at: string;
}

interface CompletedBook {
  id: string;
  book: { title: string; cover_url: string };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'library' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Dados do Usuário
  const [stats, setStats] = useState<UserStats>({ completedLabs: 0, completedBooks: 0, passedExams: 0, totalXp: 0, rank: 'Neophyte' });
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [readBooks, setReadBooks] = useState<CompletedBook[]>([]);
  
  // Edição de Perfil
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Configurações Visuais (Lê do localStorage)
  const [terminalMode, setTerminalMode] = useState(() => {
    return localStorage.getItem('lock-theme') === 'terminal';
  });

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditAvatar(user.avatar_url || '');
      fetchUserData();
    }
  }, [user]);

  // Salva preferência de tema
  useEffect(() => {
    localStorage.setItem('lock-theme', terminalMode ? 'terminal' : 'cyberpunk');
  }, [terminalMode]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      // 1. Buscar Livros Lidos
      const { data: booksData } = await supabase
        .from('user_library')
        .select('id, book:books(title, cover_url)')
        .eq('user_id', user.id)
        .eq('status', 'Lido');

      // 2. Buscar Tentativas de Simulado (Aprovados > 70%)
      const { data: examsData } = await supabase
        .from('user_exam_attempts')
        .select('id, score, total_questions, completed_at, module:exam_modules(title, cover_url)')
        .eq('user_id', user.id);

      // Filtra apenas aprovados
      const passedExams = examsData?.filter(e => (e.score / e.total_questions) >= 0.7) || [];
      
      // 3. Calcular Stats e Rank
      const booksCount = booksData?.length || 0;
      const examsCount = passedExams.length;
      const totalXp = (booksCount * 50) + (examsCount * 500); 
      
      let rank = "Script Kiddie";
      if (totalXp > 500) rank = "White Hat";
      if (totalXp > 1500) rank = "Grey Hat";
      if (totalXp > 3000) rank = "Elite Hacker";
      if (totalXp > 5000) rank = "Cyber God";

      setReadBooks(booksData as any || []);
      setAttempts(passedExams as any);
      setStats({
        completedLabs: 0,
        completedBooks: booksCount,
        passedExams: examsCount,
        totalXp,
        rank
      });

    } catch (error) {
      console.error("Erro ao carregar perfil", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
        const { error } = await supabase
            .from('users')
            .update({ name: editName, avatar_url: editAvatar })
            .eq('id', user?.id);
        
        if (error) throw error;
        alert("Perfil atualizado! Recarregue a página para ver as mudanças no menu.");
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar. Verifique se você tem permissão.");
    } finally {
        setIsSaving(false);
    }
  };

  // --- GERADOR DE CERTIFICADO PDF ---
  const generateCertificate = (examTitle: string, dateStr: string) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
    });

    // Fundo Escuro
    doc.setFillColor(20, 20, 25);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Borda Dourada
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(3);
    doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);

    // Título LOCK
    doc.setTextColor(0, 240, 255); // Cyan Neon
    doc.setFontSize(40);
    doc.text("LOCK CERTIFICATION", doc.internal.pageSize.width / 2, 80, { align: 'center' });

    // Texto Principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Certificamos que", doc.internal.pageSize.width / 2, 140, { align: 'center' });

    // Nome do Aluno
    doc.setTextColor(255, 215, 0); // Dourado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.text(user?.name || "Aluno LOCK", doc.internal.pageSize.width / 2, 180, { align: 'center' });

    // Descrição
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Concluiu com êxito o simulado prático de:`, doc.internal.pageSize.width / 2, 220, { align: 'center' });

    // Nome do Exame
    doc.setTextColor(0, 240, 255);
    doc.setFontSize(24);
    doc.text(examTitle, doc.internal.pageSize.width / 2, 250, { align: 'center' });

    // Data e Assinatura
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    const date = new Date(dateStr).toLocaleDateString();
    doc.text(`Data de Conclusão: ${date}`, 60, 350);
    doc.text("LOCK - Laboratório Online de Cibersegurança", doc.internal.pageSize.width - 60, 350, { align: 'right' });

    // Salvar
    doc.save(`Certificado_LOCK_${examTitle.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) return <div className="loading-screen">Decriptando identidade...</div>;

  return (
    <div className={`profile-container ${terminalMode ? 'terminal-mode' : ''}`}>
      <HexagonBackground />
      
      <div className="profile-layout">
        
        {/* === SIDEBAR (Esquerda) === */}
        <aside className="profile-sidebar">
            <div className="profile-card-main">
                <div className="avatar-wrapper">
                    <img 
                        src={editAvatar || `https://api.dicebear.com/8.x/initials/svg?seed=${editName}`} 
                        alt="Avatar" 
                        className="user-avatar-large"
                    />
                    <div className="rank-badge">{stats.rank}</div>
                </div>
                <h2>{editName}</h2>
                <p className="user-email">{user?.email}</p>
                
                <div className="xp-bar-container">
                    <div className="xp-info">
                        <span>XP</span>
                        <span>{stats.totalXp} / 5000</span>
                    </div>
                    <div className="xp-track">
                        <div className="xp-fill" style={{width: `${Math.min(100, (stats.totalXp/5000)*100)}%`}}></div>
                    </div>
                </div>
            </div>

            <nav className="profile-nav">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                    <User size={20} /> Visão Geral
                </button>
                <button className={activeTab === 'certificates' ? 'active' : ''} onClick={() => setActiveTab('certificates')}>
                    <Trophy size={20} /> Certificados
                </button>
                <button className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>
                    <BookBookmark size={20} /> Histórico de Leitura
                </button>
                <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                    <Gear size={20} /> Configurações
                </button>
            </nav>
        </aside>

        {/* === CONTEÚDO PRINCIPAL (Direita) === */}
        <main className="profile-content">
            
            {/* ABA: VISÃO GERAL */}
            {activeTab === 'overview' && (
                <div className="tab-pane fade-in">
                    <h1>Dashboard Pessoal</h1>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="icon-box blue"><ShieldCheck size={32} /></div>
                            <div><h3>{stats.passedExams}</h3><p>Certificações</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-box green"><BookBookmark size={32} /></div>
                            <div><h3>{stats.completedBooks}</h3><p>Livros Lidos</p></div>
                        </div>
                        <div className="stat-card">
                            <div className="icon-box purple"><Cpu size={32} /></div>
                            <div><h3>{stats.completedLabs}</h3><p>Labs Pwned</p></div>
                        </div>
                    </div>

                    <div className="recent-activity">
                        <h2><TerminalWindow size={24} /> Log de Atividades</h2>
                        <div className="terminal-log">
                            <p><span className="log-time">[SYSTEM]</span> Usuário autenticado.</p>
                            {attempts.length > 0 ? (
                                attempts.map(att => (
                                    <p key={att.id}><span className="log-time">[{new Date(att.completed_at).toLocaleDateString()}]</span> Aprovado em: {att.module.title}.</p>
                                ))
                            ) : (
                                <p><span className="log-time">[INFO]</span> Nenhuma atividade recente de simulado.</p>
                            )}
                            <p><span className="log-cursor">_</span></p>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA: CERTIFICADOS */}
            {activeTab === 'certificates' && (
                <div className="tab-pane fade-in">
                    <h1>Seus Certificados</h1>
                    {attempts.length === 0 ? (
                        <div className="empty-state-profile">
                            <ShieldCheck size={48} color="#444" />
                            <p>Você ainda não passou em nenhum simulado com nota acima de 70%.</p>
                        </div>
                    ) : (
                        <div className="certificates-grid">
                            {attempts.map(attempt => (
                                <div key={attempt.id} className="certificate-card">
                                    <div className="cert-badge"><Trophy weight="fill" /></div>
                                    <img src={attempt.module.cover_url} alt="Logo" className="cert-bg" />
                                    <div className="cert-info">
                                        <h3>{attempt.module.title}</h3>
                                        <p>Aprovado em {new Date(attempt.completed_at).toLocaleDateString()}</p>
                                        <button onClick={() => generateCertificate(attempt.module.title, attempt.completed_at)}>
                                            <DownloadSimple size={18} /> Baixar Certificado
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ABA: HISTÓRICO DE LEITURA */}
            {activeTab === 'library' && (
                <div className="tab-pane fade-in">
                    <h1>Livros Concluídos</h1>
                    <div className="library-history-list">
                        {readBooks.length > 0 ? readBooks.map((item) => (
                            <div key={item.id} className="history-item">
                                <img src={item.book.cover_url} alt="Capa" />
                                <div>
                                    <h4>{item.book.title}</h4>
                                    <span className="status-tag">Lido</span>
                                </div>
                            </div>
                        )) : <p className="text-muted">Nenhum livro marcado como lido ainda.</p>}
                    </div>
                </div>
            )}

            {/* ABA: CONFIGURAÇÕES */}
            {activeTab === 'settings' && (
                <div className="tab-pane fade-in">
                    <h1>Editar Perfil & Interface</h1>
                    
                    <div className="settings-section">
                        <h3>Dados Pessoais</h3>
                        <div className="input-group-profile">
                            <label>Nome de Exibição</label>
                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                        </div>
                        <div className="input-group-profile">
                            <label>URL do Avatar</label>
                            <input type="text" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3>Interface</h3>
                        <div className="toggle-option">
                            <div>
                                <h4>Modo Terminal (Hacker Font)</h4>
                                <p>Altera a fonte de todo o perfil para estilo monoespaçado.</p>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={terminalMode} onChange={() => setTerminalMode(!terminalMode)} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <button className="save-btn" onClick={handleUpdateProfile} disabled={isSaving}>
                        <FloppyDisk size={20} /> {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};

export default Profile;