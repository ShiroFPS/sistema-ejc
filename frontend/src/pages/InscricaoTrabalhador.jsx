import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import styles from './InscricaoForm.module.css';

const InscricaoTrabalhador = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [fotoPreview1, setFotoPreview1] = useState(null);
    const [fotoPreview2, setFotoPreview2] = useState(null);

    useEffect(() => {
        api.get('/config').then(({ data }) => setConfig(data));
    }, []);

    const tipoInscricao = watch('tipoInscricao');
    const trabalhamOuEstudam = watch('trabalhamOuEstudam');
    const tocaInstrumento = watch('tocaInstrumento');

    const uploadFile = async (file, type) => {
        const formData = new FormData();
        formData.append('foto', file); // O backend espera o campo 'foto' em uploadFoto
        try {
            const { data } = await api.post('/upload/foto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.url;
        } catch (error) {
            toast.error(`Erro ao enviar foto`);
            return null;
        }
    };

    const handleFotoChange = (num) => (e) => {
        const file = e.target.files[0];
        if (file) {
            if (num === 1) setFotoPreview1(URL.createObjectURL(file));
            else setFotoPreview2(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let currentFotoUrl1 = null;
            let currentFotoUrl2 = null;

            if (data.foto1?.[0]) {
                currentFotoUrl1 = await uploadFile(data.foto1[0], 'foto1');
            }

            if (data.foto2?.[0]) {
                currentFotoUrl2 = await uploadFile(data.foto2[0], 'foto2');
            }

            const inscricaoData = {
                ...data,
                trabalhamOuEstudam: data.trabalhamOuEstudam === 'sim',
                tocaInstrumento: data.tocaInstrumento === 'sim',
                sabeCantar: data.sabeCantar === 'sim',
                operaEquipamentosSom: data.operaEquipamentosSom === 'sim',
                habilidadesComputador: data.habilidadesComputador === 'sim',
                trabalhosManuais: data.trabalhosManuais === 'sim',
                cpf1: data.cpf1?.replace(/\D/g, ''),
                cpf2: data.cpf2?.replace(/\D/g, ''),
                fotoUrl1: currentFotoUrl1,
                fotoUrl2: currentFotoUrl2,
            };

            await api.post('/inscricoes/trabalhadores', inscricaoData);
            toast.success('Inscrição enviada com sucesso! Aguarde aprovação.');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao enviar inscrição');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>

            <div className={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.header}
                >
                    <h1 className={styles.title}>Serviço e Doação</h1>
                    <p className={styles.subtitle}>INSCRIÇÃO ENCONTREIROS - XXIX EJC</p>
                    {config && (
                        <div className={styles.info}>
                            Vagas restantes: {config.limiteTrabalhadores - (config.totalTrabalhadores || 0)}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={styles.guidelines}
                >
                    <Card>
                        <h3 style={{ color: 'var(--color-primary-400)', marginBottom: 'var(--spacing-md)', fontWeight: 800 }}>
                            ⚠️ Orientações Importantes
                        </h3>
                        <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li>✓ Destinado a quem <strong>já fez EJC</strong> e deseja servir.</li>
                            <li>✓ Não garante o chamado automático; depende da necessidade das equipes.</li>
                            <li>✓ O primeiro serviço deve ser obrigatoriamente no seu <strong>EJC de origem</strong>.</li>
                        </ul>
                    </Card>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Card>
                        <h2 className={styles.sectionTitle}>📧 Identificação de Acesso</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <Input
                                label="E-mail principal"
                                type="email"
                                {...register('email', { required: 'Campo obrigatório' })}
                                error={errors.email?.message}
                                placeholder="seu@email.com"
                            />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Modalidade de Inscrição *</label>
                                <select {...register('tipoInscricao', { required: true })} className={styles.select}>
                                    <option value="">Selecione...</option>
                                    <option value="SOLTEIRO">Inscrição Individual (Solteiro)</option>
                                    <option value="CASAIS_UNIAO_ESTAVEL">Inscrição de Casal / União Estável</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <AnimatePresence mode="popLayout">
                        {tipoInscricao && (
                            <motion.div
                                key={tipoInscricao}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <h2 className={styles.sectionTitle}>👤 {tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'Dados do Casal' : 'Dados do Encontreiro'}</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        <Input label="Nome Completo (Pessoa 1)" {...register('nomeCompleto1', { required: true })} />
                                        <Input label="WhatsApp (Pessoa 1)" {...register('contato1', { required: true })} />
                                        <Input label="CPF (Pessoa 1)" {...register('cpf1', { required: true })} />
                                        <div className={styles.inputGroup}>
                                            <label className={styles.label}>Sexo (Pessoa 1) *</label>
                                            <select {...register('sexo1', { required: true })} className={styles.select}>
                                                <option value="">Selecione...</option>
                                                <option value="MASCULINO">Masculino</option>
                                                <option value="FEMININO">Feminino</option>
                                            </select>
                                        </div>
                                        <Input label="Data Nascimento (Pessoa 1)" type="date" {...register('dataNascimento1', { required: true })} />
                                        <Input label="Instagram (Pessoa 1)" {...register('instagram1')} />
                                        <Input label="Apelido para o Crachá 1" {...register('apelido', { required: true })} />
                                        <Input label="Profissão (Pessoa 1)" {...register('profissao1', { required: true })} />
                                        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                            <label className={styles.label}>Foto 3x4 (Pessoa 1) *</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {fotoPreview1 && (
                                                    <img src={fotoPreview1} alt="Preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('foto1', { required: 'Foto é obrigatória' })}
                                                    onChange={(e) => {
                                                        register('foto1').onChange(e);
                                                        handleFotoChange(1)(e);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' && (
                                        <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--glass-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                            <Input label="Nome Completo (Pessoa 2)" {...register('nomeCompleto2', { required: true })} />
                                            <Input label="WhatsApp (Pessoa 2)" {...register('contato2', { required: true })} />
                                            <Input label="CPF (Pessoa 2)" {...register('cpf2', { required: true })} />
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Sexo (Pessoa 2) *</label>
                                                <select {...register('sexo2', { required: true })} className={styles.select}>
                                                    <option value="">Selecione...</option>
                                                    <option value="MASCULINO">Masculino</option>
                                                    <option value="FEMININO">Feminino</option>
                                                </select>
                                            </div>
                                            <Input label="Data Nascimento (Pessoa 2)" type="date" {...register('dataNascimento2', { required: true })} />
                                            <Input label="Instagram (Pessoa 2)" {...register('instagram2')} />
                                            <Input label="Apelido para o Crachá 2" {...register('apelido2', { required: true })} />
                                            <Input label="Profissão (Pessoa 2)" {...register('profissao2', { required: true })} />
                                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                                <label className={styles.label}>Foto 3x4 (Pessoa 2) *</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    {fotoPreview2 && (
                                                        <img src={fotoPreview2} alt="Preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        {...register('foto2', { required: tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' })}
                                                        onChange={(e) => {
                                                            register('foto2').onChange(e);
                                                            handleFotoChange(2)(e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Card>
                        <h2 className={styles.sectionTitle}>✝️ Caminhada no EJC</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            <Input label="Paróquia de Origem e Ano que fez o Encontro" {...register('paroquiaEjcAno', { required: true })} placeholder="Ex: Auxiliadora - 2018" />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Em quais equipes você já serviu?</label>
                                <textarea {...register('equipesJaServiram', { required: true })} className={styles.textarea} placeholder="Cite as equipes/círculos..." />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🎨 Habilidades e Talentos</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Toca instrumento?</label>
                                <select {...register('tocaInstrumento')} className={styles.select}>
                                    <option value="nao">Não</option>
                                    <option value="sim">Sim</option>
                                </select>
                            </div>
                            {watch('tocaInstrumento') === 'sim' && <Input label="Qual instrumento?" {...register('qualInstrumento')} />}

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Sabe cantar?</label>
                                <select {...register('sabeCantar')} className={styles.select}>
                                    <option value="nao">Não</option>
                                    <option value="sim">Sim</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Habilidades Digitais/PC?</label>
                                <select {...register('habilidadesComputador')} className={styles.select}>
                                    <option value="nao">Não</option>
                                    <option value="sim">Sim</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                                <label className={styles.label}>Outras Habilidades e Talentos (Descreva)</label>
                                <textarea
                                    {...register('habilidadesTalentos')}
                                    className={styles.textarea}
                                    placeholder="Ex: Sei cozinhar, mexer com elétrica, decoração, pintura, teatro..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </Card>

                    <div className={styles.actions}>
                        <Button type="button" variant="ghost" onClick={() => navigate('/')} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Processando...' : 'Enviar Inscrição de Serviço'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InscricaoTrabalhador;
