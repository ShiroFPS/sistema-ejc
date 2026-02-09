import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import api from './services/api';
import Home from './pages/Home';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import Footer from './components/Footer';
import './styles/globals.css';

// Lazy load para otimização
const InscricaoParticipante = React.lazy(() => import('./pages/InscricaoParticipante'));
const InscricaoTrabalhador = React.lazy(() => import('./pages/InscricaoTrabalhador'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Inscricoes = React.lazy(() => import('./pages/admin/Inscricoes'));
const InscricaoDetalhes = React.lazy(() => import('./pages/admin/InscricaoDetalhes'));
const Configuracoes = React.lazy(() => import('./pages/admin/Configuracoes'));
const EditarTrabalhador = React.lazy(() => import('./pages/admin/EditarTrabalhador'));
const EditarParticipante = React.lazy(() => import('./pages/admin/EditarParticipante'));
const TrabalhadorPorFuncao = React.lazy(() => import('./pages/admin/TrabalhadorPorFuncao'));
const VagasEsgotadas = React.lazy(() => import('./pages/VagasEsgotadas'));
const Importar = React.lazy(() => import('./pages/admin/Importar'));
// Componente de proteção de rota melhorado
const ProtectedRoute = ({ children }) => {
    const [isValid, setIsValid] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsValid(false);
                setIsLoading(false);
                return;
            }

            try {
                await api.get('/auth/me');
                setIsValid(true);
            } catch (error) {
                console.error('Token inválido:', error);
                localStorage.removeItem('token');
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, []);

    if (isLoading) {
        return <LoadingFallback />;
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <React.Suspense fallback={<LoadingFallback />}>
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
                        <Route path="/admin/inscricoes/editar/:id" element={
                            <ProtectedRoute>
                                <EditarParticipante />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/trabalhadores/funcoes" element={
                            <ProtectedRoute>
                                <TrabalhadorPorFuncao />
                            </ProtectedRoute>
                        } />

                        <Route path="/vagas-esgotadas" element={<VagasEsgotadas />} />

                        <Route path="/admin/importar" element={
                            <ProtectedRoute>
                                <Importar />
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
                <Footer />
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
