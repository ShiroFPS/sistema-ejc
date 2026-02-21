import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import styles from './InscricaoForm.module.css';

const InscricaoParticipante = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);
    const [fotoUrl, setFotoUrl] = useState(null);

    useEffect(() => {
        api.get('/config').then(({ data }) => setConfig(data));
    }, []);

    const uploadFile = async (file, type) => {
        const formData = new FormData();
        formData.append(type, file);
        try {
            const { data } = await api.post(`/upload/${type}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.url;
        } catch (error) {
            toast.error(`Erro ao enviar ${type}`);
            return null;
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let currentFotoUrl = fotoUrl;
            let currentComprovanteUrl = null;

            if (data.foto?.[0]) {
                const url = await uploadFile(data.foto[0], 'foto');
                if (url) currentFotoUrl = url;
            }

            const contatosEmergencia = JSON.stringify([
                { nome: data.contato1Nome, telefone: data.contato1Telefone },
                { nome: data.contato2Nome, telefone: data.contato2Telefone },
                { nome: data.contato3Nome, telefone: data.contato3Telefone },
                { nome: data.contato4Nome, telefone: data.contato4Telefone },
                { nome: data.contato5Nome, telefone: data.contato5Telefone },
            ].filter(c => c.nome && c.telefone));

            const inscricaoData = {
                ...data,
                tipo: 'PARTICIPANTE',
                fotoUrl: currentFotoUrl,
                // comprovanteUrl removido
                contatosEmergencia,
                lgpdCiente: data.lgpdCiente === true,
                trabalha: data.trabalha === 'sim',
                batizado: data.batizado === 'sim',
                fezPrimeiraComunhao: data.fezPrimeiraComunhao === 'sim',
                fezCrisma: data.fezCrisma === 'sim',
                cpf: data.cpf.replace(/\D/g, ''),
            };

            await api.post('/inscricoes', inscricaoData);
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
                    <h1 className={styles.title}>Ficha de Inscrição</h1>
                    <p className={styles.subtitle}>ENCONTRISTA - XXIX EJC</p>
                    {config && (
                        <div className={styles.info}>
                            Vagas restantes: {config.limiteParticipantes - (config.totalParticipantes || 0)}
                        </div>
                    )}
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Card>
                        <h2 className={styles.sectionTitle}>⚖️ LGPD e Consentimento</h2>
                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    {...register('lgpdCiente', { required: 'Você deve estar ciente' })}
                                />
                                <span>Estou ciente e autorizo o uso dos meus dados para organização do encontro *</span>
                            </label>
                            {errors.lgpdCiente && <span className={styles.error}>{errors.lgpdCiente.message}</span>}
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>👤 Dados Pessoais</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Input label="Nome Completo" {...register('nomeCompleto', { required: 'Obrigatório' })} error={errors.nomeCompleto?.message} />
                            <Input label="Apelido" {...register('apelido', { required: 'Obrigatório' })} error={errors.apelido?.message} />
                            <Input label="Data de Nascimento" type="date" {...register('dataNascimento', { required: 'Obrigatório' })} error={errors.dataNascimento?.message} />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Sexo *</label>
                                <select {...register('sexo', { required: true })} className={styles.select}>
                                    <option value="">Selecione...</option>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                </select>
                            </div>
                            <Input label="WhatsApp" {...register('telefone', { required: 'Obrigatório' })} error={errors.telefone?.message} />
                            <Input label="Instagram" {...register('instagram')} />
                            <Input label="CPF" {...register('cpf', { required: 'Obrigatório' })} error={errors.cpf?.message} />
                            <Input label="E-mail" type="email" {...register('email', { required: 'Obrigatório' })} error={errors.email?.message} />
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Estado Civil *</label>
                                <select {...register('estadoCivil', { required: 'Obrigatório' })} className={styles.select}>
                                    <option value="">Selecione...</option>
                                    <option value="SOLTEIRO">Solteiro(a)</option>
                                    <option value="CASADO">Casado(a)</option>
                                    <option value="UNIAO_ESTAVEL">União Estável</option>
                                    <option value="DIVORCIADO">Divorciado(a)</option>
                                    <option value="VIUVO">Viúvo(a)</option>
                                </select>
                                {errors.estadoCivil && <span className={styles.error}>{errors.estadoCivil.message}</span>}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🏠 Endereço e Vida</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Input label="Endereço Completo" {...register('enderecoCompleto', { required: true })} />
                            <Input label="Bairro" {...register('bairro', { required: true })} />
                            <Input label="Mora com quem?" {...register('moraComQuem', { required: true })} />
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Grau de Escolaridade *</label>
                                <div className={styles.radioGroup} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {[
                                        'Ensino fundamental completo',
                                        'Ensino médio incompleto',
                                        'Ensino médio completo',
                                        'Ensino superior incompleto',
                                        'Ensino superior completo',
                                        'Pós - graduado(a)'
                                    ].map(opcao => (
                                        <label key={opcao} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input type="radio" value={opcao} {...register('escolaridade', { required: 'Obrigatório' })} />
                                            <span>{opcao}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.escolaridade && <span className={styles.error}>{errors.escolaridade.message}</span>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Instituição de ensino e curso (atual ou concluído) *</label>
                                <p className={styles.helpText} style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Exemplo: Psicologia - UFPB.</p>
                                <textarea {...register('instituicaoEnsino', { required: true })} className={styles.textarea} style={{ minHeight: '60px' }} />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Você trabalha? Se sim, onde? *</label>
                                <p className={styles.helpText} style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>Exemplo: Sim, Atendimento Clinico em João Pessoa.</p>
                                <input {...register('localTrabalho', { required: true })} className={styles.input} />
                            </div>

                            <Input label="Profissão / Sua área" {...register('profissao', { required: true })} />
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>👨‍👩‍👦 Dados Familiares</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Input label="Nome da Mãe" {...register('nomeMae', { required: true })} />
                            <Input label="WhatsApp da Mãe" {...register('telefoneMae', { required: true })} />
                            <Input label="Nome do Pai" {...register('nomePai', { required: true })} />
                            <Input label="WhatsApp do Pai" {...register('telefonePai', { required: true })} />
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>📞 Contatos de Amigos/Parentes Próximos</h2>
                        <p className={styles.helpText}>Forneça nome completo e telefone de 5 pessoas que NÃO estão fazendo a inscrição no EJC:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <React.Fragment key={i}>
                                    <Input label={`Nome Completo ${i}`} {...register(`contato${i}Nome`, { required: i <= 3 ? 'Obrigatório' : false })} />
                                    <Input label={`WhatsApp ${i}`} {...register(`contato${i}Telefone`, { required: i <= 3 ? 'Obrigatório' : false })} />
                                </React.Fragment>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🏥 Saúde e Alergias</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Restrições Alimentares</label>
                                <textarea {...register('restricoesAlimentares')} className={styles.textarea} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Alergias / Problemas de Saúde</label>
                                <textarea {...register('alergias')} className={styles.textarea} />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>📎 Anexos Obrigatórios</h2>
                        <div className={styles.fileInput}>
                            <label className={styles.label}>Foto 3x4 *</label>
                            <input type="file" accept="image/*" {...register('foto', { required: 'Obrigatório' })} />
                        </div>

                    </Card>

                    <div className={styles.actions}>
                        <Button type="button" variant="ghost" onClick={() => navigate('/')} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Enviando...' : 'Finalizar Inscrição'}
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default InscricaoParticipante;
