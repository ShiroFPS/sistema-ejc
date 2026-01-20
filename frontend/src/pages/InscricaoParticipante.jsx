import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
    const [comprovanteUrl, setComprovanteUrl] = useState(null);

    useEffect(() => {
        // Buscar configurações para verificar limites
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
            // Upload de arquivos
            if (data.foto?.[0]) {
                const url = await uploadFile(data.foto[0], 'foto');
                if (url) setFotoUrl(url);
            }

            if (data.comprovante?.[0]) {
                const url = await uploadFile(data.comprovante[0], 'comprovante');
                if (url) setComprovanteUrl(url);
            }

            // Preparar dados de contatos de emergência
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
                fotoUrl,
                comprovanteUrl,
                contatosEmergencia,
                trabalha: data.trabalha === 'sim',
                batizado: data.batizado === 'sim',
                fezPrimeiraComunhao: data.fezPrimeiraComunhao === 'sim',
                fezCrisma: data.fezCrisma === 'sim',
            };

            // Remover campos de upload
            delete inscricaoData.foto;
            delete inscricaoData.comprovante;
            delete inscricaoData.contato1Nome;
            delete inscricaoData.contato1Telefone;
            delete inscricaoData.contato2Nome;
            delete inscricaoData.contato2Telefone;
            delete inscricaoData.contato3Nome;
            delete inscricaoData.contato3Telefone;
            delete inscricaoData.contato4Nome;
            delete inscricaoData.contato4Telefone;
            delete inscricaoData.contato5Nome;
            delete inscricaoData.contato5Telefone;

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
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Inscrição - Participante</h1>
                    <p className={styles.subtitle}>Preencha todos os campos com atenção</p>
                    {config && (
                        <p className={styles.info}>
                            Vagas restantes: {config.limiteParticipantes - (config.totalParticipantes || 0)}
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Card>
                        <h2 className={styles.sectionTitle}>📋 LGPD e Consentimento</h2>
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

                        <Input
                            label="Nome Completo"
                            {...register('nomeCompleto', { required: 'Campo obrigatório' })}
                            error={errors.nomeCompleto?.message}
                            required
                        />

                        <Input
                            label="Como gostaria de ser chamado (Apelido)"
                            {...register('apelido', { required: 'Campo obrigatório' })}
                            error={errors.apelido?.message}
                            required
                        />

                        <Input
                            label="Data de Nascimento"
                            type="date"
                            {...register('dataNascimento', { required: 'Campo obrigatório' })}
                            error={errors.dataNascimento?.message}
                            required
                        />

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Sexo *</label>
                            <select {...register('sexo', { required: 'Campo obrigatório' })} className={styles.select}>
                                <option value="">Selecione...</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                            </select>
                            {errors.sexo && <span className={styles.error}>{errors.sexo.message}</span>}
                        </div>

                        <Input
                            label="Telefone (WhatsApp)"
                            type="tel"
                            placeholder="(DDD) 9 XXXX-XXXX"
                            {...register('telefone', { required: 'Campo obrigatório' })}
                            error={errors.telefone?.message}
                            required
                        />

                        <Input
                            label="Instagram (opcional)"
                            {...register('instagram')}
                            placeholder="@seuinstagram"
                        />
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>💑 Estado Civil e Escolaridade</h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Estado Civil *</label>
                            <select {...register('estadoCivil', { required: true })} className={styles.select}>
                                <option value="">Selecione...</option>
                                <option value="SOLTEIRO">Solteiro(a)</option>
                                <option value="CASADO">Casado(a)</option>
                                <option value="UNIAO_ESTAVEL">União Estável</option>
                                <option value="DIVORCIADO">Divorciado(a)</option>
                                <option value="VIUVO">Viúvo(a)</option>
                            </select>
                        </div>

                        <Input
                            label="Grau de Escolaridade"
                            {...register('escolaridade', { required: true })}
                            placeholder="Ex: Ensino médio completo"
                            required
                        />

                        <Input
                            label="Instituição de Ensino e Curso (se aplicável)"
                            {...register('instituicaoEnsino')}
                            placeholder="Ex: Psicologia - UFPB"
                        />

                        <Input
                            label="Profissão"
                            {...register('profissao', { required: true })}
                            required
                        />

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Você trabalha?</label>
                            <select {...register('trabalha')} className={styles.select}>
                                <option value="nao">Não</option>
                                <option value="sim">Sim</option>
                            </select>
                        </div>

                        {watch('trabalha') === 'sim' && (
                            <Input
                                label="Onde você trabalha?"
                                {...register('localTrabalho')}
                            />
                        )}
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>✝️ Informações Religiosas</h2>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>É batizado(a)? *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('batizado', { required: true })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('batizado', { required: true })} value="nao" />
                                <span>Não</span>
                            </label>
                        </div>

                        {watch('batizado') === 'sim' && (
                            <Input
                                label="Onde foi batizado?"
                                {...register('localBatismo')}
                            />
                        )}

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Fez primeira comunhão? *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('fezPrimeiraComunhao', { required: true })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('fezPrimeiraComunhao', { required: true })} value="nao" />
                                <span>Não</span>
                            </label>
                        </div>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Fez Crisma? *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('fezCrisma', { required: true })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('fezCrisma', { required: true })} value="nao" />
                                <span>Não</span>
                            </label>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🏠 Endereço</h2>

                        <Input
                            label="Endereço Completo"
                            {...register('enderecoCompleto', { required: true })}
                            required
                        />

                        <Input
                            label="Bairro"
                            {...register('bairro', { required: true })}
                            required
                        />

                        <Input
                            label="Mora com quem?"
                            {...register('moraComQuem', { required: true })}
                            required
                        />
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>👨‍👩‍👦 Dados dos Pais</h2>

                        <Input
                            label="Estado Civil dos Pais"
                            {...register('estadoCivilPais', { required: true })}
                            placeholder="Ex: Casados"
                            required
                        />

                        <Input
                            label="Nome Completo da Mãe"
                            {...register('nomeMae', { required: true })}
                            required
                        />

                        <Input
                            label="Telefone da Mãe (WhatsApp)"
                            type="tel"
                            {...register('telefoneMae', { required: true })}
                            required
                        />

                        <Input
                            label="Endereço da Mãe"
                            {...register('enderecoMae', { required: true })}
                            required
                        />

                        <Input
                            label="Nome Completo do Pai"
                            {...register('nomePai', { required: true })}
                            required
                        />

                        <Input
                            label="Telefone do Pai (WhatsApp)"
                            type="tel"
                            {...register('telefonePai', { required: true })}
                            required
                        />

                        <Input
                            label="Endereço do Pai"
                            {...register('enderecoPai', { required: true })}
                            required
                        />
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>👥 Amigos/Parentes Inscritos</h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Possui amigo/parente que também está fazendo inscrição para o EJC?
                                <br /><small>Se sim, informe nomes para melhor identificação</small>
                            </label>
                            <textarea
                                {...register('amigosParentesInscritos')}
                                className={styles.textarea}
                                rows="3"
                                placeholder="Ex: João da Silva (primo), Flávia Souza (amiga)"
                            />
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🆘 Contatos de Emergência</h2>
                        <p className={styles.helpText}>Forneça 5 parentes/amigos que NÃO estão fazendo inscrição:</p>

                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={styles.contactGroup}>
                                <h4>Contato {i}</h4>
                                <div className={styles.row}>
                                    <Input
                                        label="Nome Completo"
                                        {...register(`contato${i}Nome`, { required: true })}
                                    />
                                    <Input
                                        label="Telefone"
                                        type="tel"
                                        {...register(`contato${i}Telefone`, { required: true })}
                                    />
                                </div>
                            </div>
                        ))}
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🏥 Saúde</h2>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Restrições Alimentares</label>
                            <textarea
                                {...register('restricoesAlimentares')}
                                className={styles.textarea}
                                rows="2"
                                placeholder="Descreva se tiver alguma restrição"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Alergias</label>
                            <textarea
                                {...register('alergias')}
                                className={styles.textarea}
                                rows="2"
                                placeholder="Descreva se tiver alguma alergia"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Problemas de Saúde</label>
                            <textarea
                                {...register('problemasSaude')}
                                className={styles.textarea}
                                rows="2"
                                placeholder="Descreva se tiver algum problema de saúde"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Medicamentos de Uso Contínuo</label>
                            <textarea
                                {...register('medicamentosContinuos')}
                                className={styles.textarea}
                                rows="2"
                                placeholder="Descreva se faz uso de algum medicamento regularmente"
                            />
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>📎 Anexos</h2>

                        <div className={styles.fileInput}>
                            <label className={styles.label}>Foto 3x4 *</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register('foto', { required: 'Foto obrigatória' })}
                            />
                            {errors.foto && <span className={styles.error}>{errors.foto.message}</span>}
                        </div>

                        <div className={styles.fileInput}>
                            <label className={styles.label}>Comprovante de Pagamento *</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                {...register('comprovante', { required: 'Comprovante obrigatório' })}
                            />
                            {errors.comprovante && <span className={styles.error}>{errors.comprovante.message}</span>}
                        </div>
                    </Card>

                    <div className={styles.actions}>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Inscrição'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InscricaoParticipante;
