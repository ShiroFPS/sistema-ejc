import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import './styles/globals.css';

// Lazy load para otimização
const InscricaoParticipante = React.lazy(() => import('./pages/InscricaoParticipante'));
const InscricaoTrabalhador = React.lazy(() => import('./pages/InscricaoTrabalhador'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Inscricoes = React.lazy(() => import('./pages/admin/Inscricoes'));
const InscricaoDetalhes = React.lazy(() => import('./pages/admin/InscricaoDetalhes'));
const Configuracoes = React.lazy(() => import('./pages/admin/Configuracoes'));
const EditarTrabalhador = React.lazy(() => import('./pages/admin/EditarTrabalhador'));
const TrabalhadorPorFuncao = React.lazy(() => import('./pages/admin/TrabalhadorPorFuncao'));

// Componente de proteção de rota
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <React.Suspense fallback={
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: 'var(--color-text-secondary)'
                }}>
                    Carregando...
                </div>
            }>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/inscricao/participante" element={<InscricaoParticipante />} />
                    <Route path="/inscricao/trabalhador" element={<InscricaoTrabalhador />} />

                    {/* Rotas Administrativas */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/inscricoes" element={
                        <ProtectedRoute>
                            <Inscricoes />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/inscricoes/:id" element={
                        <ProtectedRoute>
                            <InscricaoDetalhes />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/configuracoes" element={
                        <ProtectedRoute>
                            <Configuracoes />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/trabalhadores/editar/:id" element={
                        <ProtectedRoute>
                            <EditarTrabalhador />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/trabalhadores/funcoes" element={
                        <ProtectedRoute>
                            <TrabalhadorPorFuncao />
                        </ProtectedRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </React.Suspense>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--color-text-primary)',
                    },
                }}
            />
        </BrowserRouter>
    );
}

export default App;
