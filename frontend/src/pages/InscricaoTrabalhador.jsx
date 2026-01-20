import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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

    useEffect(() => {
        api.get('/config').then(({ data }) => setConfig(data));
    }, []);

    const tipoInscricao = watch('tipoInscricao');
    const trabalhamOuEstudam = watch('trabalhamOuEstudam');
    const tocaInstrumento = watch('tocaInstrumento');

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const inscricaoData = {
                ...data,
                trabalhamOuEstudam: data.trabalhamOuEstudam === 'sim',
                tocaInstrumento: data.tocaInstrumento === 'sim',
                sabeCantar: data.sabeCantar === 'sim',
                operaEquipamentosSom: data.operaEquipamentosSom === 'sim',
                habilidadesComputador: data.habilidadesComputador === 'sim',
                trabalhosManuais: data.trabalhosManuais === 'sim',
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
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Inscrições para Encontreiros (Serviço)</h1>
                    <p className={styles.subtitle}>XXIX EJC AUXILIADORA</p>
                    {config && (
                        <p className={styles.info}>
                            Vagas restantes: {config.limiteTrabalhadores - (config.totalTrabalhadores || 0)}
                        </p>
                    )}
                </div>

                <Card>
                    <h3 style={{ color: 'var(--color-primary-400)', marginBottom: 'var(--spacing-md)' }}>
                        Atenção para as seguintes orientações:
                    </h3>
                    <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginLeft: 'var(--spacing-lg)' }}>
                        <li>A presente inscrição se destina aos encontreiros (pessoas que já fizeram EJC) e desejam integrar as equipes de serviço do XXVIII EJC AUXILIADORA.</li>
                        <li><strong>NÃO</strong> é a inscrição para quem quer fazer o EJC pela primeira vez.</li>
                        <li>A inscrição não garante o chamado ao serviço, o qual é feito de acordo com a disponibilidade das equipes.</li>
                        <li>Os chamados são feitos por ligação telefônica: fiquem atentos aos celulares.</li>
                    </ul>
                    <p style={{ color: 'var(--color-warning)', marginTop: 'var(--spacing-md)', fontWeight: 600 }}>
                        Obs.: Lembrando a todos que o <strong>primeiro serviço deve ser no seu EJC de origem</strong> (paróquia que fez seu EJC), segundo os direcionamentos da Arquidiocese.
                    </p>
                </Card>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* SEÇÃO 1: Email */}
                    <Card>
                        <h2 className={styles.sectionTitle}>📧 Contato</h2>

                        <Input
                            label="E-mail"
                            type="email"
                            {...register('email', { required: 'Campo obrigatório' })}
                            error={errors.email?.message}
                            required
                            placeholder="seu@email.com"
                        />
                    </Card>

                    {/* SEÇÃO 2: Tipo de Inscrição */}
                    <Card>
                        <h2 className={styles.sectionTitle}>👥 Tipo de Inscrição</h2>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Você é: *</label>
                            <label className={styles.radio}>
                                <input
                                    type="radio"
                                    {...register('tipoInscricao', { required: 'Campo obrigatório' })}
                                    value="SOLTEIRO"
                                />
                                <span>Solteiro</span>
                            </label>
                            <label className={styles.radio}>
                                <input
                                    type="radio"
                                    {...register('tipoInscricao', { required: 'Campo obrigatório' })}
                                    value="CASAIS_UNIAO_ESTAVEL"
                                />
                                <span>Casado/União estável</span>
                            </label>
                            {errors.tipoInscricao && <span className={styles.error}>{errors.tipoInscricao.message}</span>}
                        </div>
                    </Card>

                    {/* SEÇÃO 3: Dados das Pessoas - SEMPRE VISÍVEL (não condicional) */}
                    <Card>
                        <h2 className={styles.sectionTitle}>
                            {tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? '🎯 INSCRIÇÃO CASAIS E EM UNIÃO ESTÁVEL' : '👤 Dados Pessoais'}
                        </h2>

                        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                            {tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'Pessoa 1' : 'Nome Completo 1'}
                        </h3>

                        <Input
                            label="Nome Completo 1"
                            {...register('nomeCompleto1', { required: 'Campo obrigatório' })}
                            error={errors.nomeCompleto1?.message}
                            required
                        />

                        <Input
                            label="Contato 1 (WhatsApp)"
                            type="tel"
                            {...register('contato1', { required: 'Campo obrigatório' })}
                            error={errors.contato1?.message}
                            required
                            placeholder="(DDD) 9 XXXX-XXXX"
                        />

                        <Input
                            label="Instagram 1"
                            {...register('instagram1', { required: 'Campo obrigatório' })}
                            error={errors.instagram1?.message}
                            required
                            placeholder="@seuinstagram"
                        />

                        {tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' && (
                            <>
                                <h3 style={{ fontSize: 'var(--font-size-lg)', marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                                    Nome Completo 2
                                </h3>

                                <Input
                                    label="Nome Completo 2"
                                    {...register('nomeCompleto2', { required: tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'Campo obrigatório' : false })}
                                    error={errors.nomeCompleto2?.message}
                                    required={tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'}
                                />

                                <Input
                                    label="Contato 2 (WhatsApp)"
                                    type="tel"
                                    {...register('contato2', { required: tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'Campo obrigatório' : false })}
                                    error={errors.contato2?.message}
                                    required={tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'}
                                    placeholder="(DDD) 9 XXXX-XXXX"
                                />

                                <Input
                                    label="Instagram 2"
                                    {...register('instagram2', { required: tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? 'Campo obrigatório' : false })}
                                    error={errors.instagram2?.message}
                                    required={tipoInscricao === 'CASAIS_UNIAO_ESTAVEL'}
                                    placeholder="@seuinstagram"
                                />
                            </>
                        )}
                    </Card>

                    {/* SEÇÃO 4: Endereço e Trabalho/Estudo */}
                    <Card>
                        <h2 className={styles.sectionTitle}>🏠 Endereço e Trabalho/Estudo</h2>

                        <Input
                            label="Endereço Completo"
                            {...register('enderecoCompleto', { required: 'Campo obrigatório' })}
                            error={errors.enderecoCompleto?.message}
                            required
                        />

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Trabalham ou estudam? *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('trabalhamOuEstudam', { required: true })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('trabalhamOuEstudam', { required: true })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.trabalhamOuEstudam && <span className={styles.error}>Campo obrigatório</span>}
                        </div>

                        {trabalhamOuEstudam === 'sim' && (
                            <Input
                                label="Se sim, em qual área?"
                                {...register('areaTrabalhoEstudo')}
                                placeholder="Ex: Tecnologia, Saúde, Educação..."
                            />
                        )}
                    </Card>

                    {/* SEÇÃO 5: Experiência no EJC */}
                    <Card>
                        <h2 className={styles.sectionTitle}>✝️ Experiência no EJC</h2>

                        <Input
                            label="Paróquia em que fez EJC (ou ECC) e o ano"
                            {...register('paroquiaEjcAno', { required: 'Campo obrigatório' })}
                            error={errors.paroquiaEjcAno?.message}
                            required
                            placeholder="Ex: Paróquia Nossa Senhora Auxiliadora - 2019"
                        />

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>
                                Em qual(is) equipe(s) vocês já serviram? *
                                <br /><small>Informe os círculos/equipes que já participou como trabalhador</small>
                            </label>
                            <textarea
                                {...register('equipesJaServiram', { required: 'Campo obrigatório' })}
                                className={styles.textarea}
                                rows="3"
                                placeholder="Ex: Círculo Vermelho, Círculo Verde, Cozinha, Intercessão..."
                            />
                            {errors.equipesJaServiram && <span className={styles.error}>{errors.equipesJaServiram.message}</span>}
                        </div>
                    </Card>

                    {/* SEÇÃO 6: Habilidades */}
                    <Card>
                        <h2 className={styles.sectionTitle}>🎨 Habilidades</h2>
                        <p className={styles.helpText}>
                            Marque as habilidades que possui. Isso nos ajuda a organizar as equipes de serviço.
                            <br /><small style={{ color: 'var(--color-text-tertiary)' }}>(não precisa ser os dois)</small>
                        </p>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Vocês sabem tocar algum instrumento musical? (não precisa ser os dois) *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('tocaInstrumento', { required: 'Campo obrigatório' })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('tocaInstrumento', { required: 'Campo obrigatório' })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.tocaInstrumento && <span className={styles.error}>{errors.tocaInstrumento.message}</span>}
                        </div>

                        {tocaInstrumento === 'sim' && (
                            <Input
                                label="Se sim, qual(is) instrumento(s)?"
                                {...register('qualInstrumento')}
                                placeholder="Ex: Violão, teclado, bateria..."
                            />
                        )}

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Vocês sabem cantar? (não precisa ser os dois) *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('sabeCantar', { required: 'Campo obrigatório' })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('sabeCantar', { required: 'Campo obrigatório' })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.sabeCantar && <span className={styles.error}>Campo obrigatório</span>}
                        </div>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Vocês sabem operar equipamentos de som? (não precisa ser os dois) *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('operaEquipamentosSom', { required: 'Campo obrigatório' })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('operaEquipamentosSom', { required: 'Campo obrigatório' })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.operaEquipamentosSom && <span className={styles.error}>Campo obrigatório</span>}
                        </div>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Vocês têm habilidades no computador? (não precisa ser os dois) *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('habilidadesComputador', { required: 'Campo obrigatório' })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('habilidadesComputador', { required: 'Campo obrigatório' })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.habilidadesComputador && <span className={styles.error}>Campo obrigatório</span>}
                        </div>

                        <div className={styles.radioGroup}>
                            <label className={styles.label}>Vocês têm habilidades com trabalhos manuais? (não precisa ser os dois) *</label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('trabalhosManuais', { required: 'Campo obrigatório' })} value="sim" />
                                <span>Sim</span>
                            </label>
                            <label className={styles.radio}>
                                <input type="radio" {...register('trabalhosManuais', { required: 'Campo obrigatório' })} value="nao" />
                                <span>Não</span>
                            </label>
                            {errors.trabalhosManuais && <span className={styles.error}>Campo obrigatório</span>}
                        </div>
                    </Card>

                    {/* Botões de ação */}
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

export default InscricaoTrabalhador;
