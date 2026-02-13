import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './EditarTrabalhador.module.css'; // Reusing styles

const EditarParticipante = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [fotoArquivo, setFotoArquivo] = useState(null);
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        apelido: '',
        dataNascimento: '',
        sexo: '',
        telefone: '',
        instagram: '',
        estadoCivil: '',
        escolaridade: '',
        instituicaoEnsino: '',
        cursoAtual: '',
        profissao: '',
        trabalha: false,
        localTrabalho: '',
        batizado: false,
        localBatismo: '',
        fezPrimeiraComunhao: false,
        fezCrisma: false,
        enderecoCompleto: '',
        bairro: '',
        moraComQuem: '',
        estadoCivilPais: '',
        nomeMae: '',
        telefoneMae: '',
        enderecoMae: '',
        nomePai: '',
        telefonePai: '',
        enderecoPai: '',
        amigosParentesInscritos: '',
        restricoesAlimentares: '',
        alergias: '',
        problemasSaude: '',
        medicamentosContinuos: '',
        status: '',
        cpf: '',
        email: '',
        receberEmail: true,
        receberWhatsapp: true,
        corGrupo: '',
        codigoVerificacao: '',
        contatosEmergencia: '[]',
    });
    const [contatosJson, setContatosJson] = useState([]);

    useEffect(() => {
        const fetchParticipante = async () => {
            try {
                const response = await api.get(`/inscricoes/${id}?tipo=PARTICIPANTE`);
                const d = response.data;
                setFormData({
                    ...d,
                    dataNascimento: d.dataNascimento ? new Date(d.dataNascimento).toISOString().split('T')[0] : '',
                });
                if (d.contatosEmergencia) {
                    try {
                        const parsed = JSON.parse(d.contatosEmergencia);
                        setContatosJson(parsed);
                    } catch (e) {
                        console.error('Erro ao parsear contatos:', e);
                        setContatosJson([]);
                    }
                }
                if (d.fotoUrl) setFotoPreview(d.fotoUrl);
            } catch (error) {
                toast.error('Erro ao carregar participante');
                navigate('/admin/inscricoes');
            } finally {
                setLoading(false);
            }
        };
        fetchParticipante();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoArquivo(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleContatoChange = (index, field) => (e) => {
        const newContatos = [...contatosJson];
        if (!newContatos[index]) newContatos[index] = { nome: '', telefone: '' };
        newContatos[index][field] = e.target.value;
        setContatosJson(newContatos);
    };

    const handleSalvar = async () => {
        setSaving(true);
        try {
            let currentFotoUrl = formData.fotoUrl;

            // Fazer upload da foto se houver novo arquivo
            if (fotoArquivo) {
                const uploadFormData = new FormData();
                uploadFormData.append('foto', fotoArquivo);
                try {
                    const { data: uploadRes } = await api.post('/upload/foto', uploadFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    currentFotoUrl = uploadRes.url;
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error('Erro ao enviar foto');
                    setSaving(false);
                    return;
                }
            }

            // Limpar datas vazias e converter contatos para JSON
            const payload = {
                ...formData,
                fotoUrl: currentFotoUrl,
                contatosEmergencia: JSON.stringify(contatosJson.filter(c => c.nome || c.telefone))
            };

            if (!payload.dataNascimento) delete payload.dataNascimento;

            await api.put(`/inscricoes/${id}?tipo=PARTICIPANTE`, payload);
            toast.success('Inscrição atualizada!');
            // navigate(`/admin/inscricoes/${id}`);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const alterarStatus = async (novoStatus) => {
        try {
            if (novoStatus === 'APROVADA') await api.put(`/inscricoes/${id}/aprovar?tipo=PARTICIPANTE`);
            else if (novoStatus === 'REJEITADA') await api.put(`/inscricoes/${id}/rejeitar?tipo=PARTICIPANTE`);

            setFormData(prev => ({ ...prev, status: novoStatus }));
            toast.success(`Status alterado para ${novoStatus}`);
        } catch (error) {
            toast.error('Erro ao alterar status');
        }
    };

    if (loading) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button onClick={() => navigate(`/admin/inscricoes`)} variant="ghost">
                    ← Voltar
                </Button>
                <Button onClick={handleSalvar} disabled={saving}>
                    {saving ? 'Salvando...' : '💾 Salvar Alterações'}
                </Button>
            </div>

            <h1 className={styles.title}>Editar Encontrista</h1>

            <div className={styles.content} style={{ gridTemplateColumns: '1fr' }}>
                <div className={styles.leftCol}>
                    <Card>
                        <h2 className={styles.sectionTitle}>👤 Dados Pessoais</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                <label style={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>Status Atual: {formData.status}</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    <Button size="sm" onClick={() => alterarStatus('APROVADA')} disabled={formData.status === 'APROVADA'}>✅ Aprovar</Button>
                                    <Button size="sm" onClick={() => alterarStatus('REJEITADA')} variant="danger" disabled={formData.status === 'REJEITADA'}>❌ Reprovar</Button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Código Verificação</label>
                                <input value={formData.codigoVerificacao || ''} disabled className={styles.input} style={{ opacity: 0.7 }} />
                                {formData.codigoVerificacao && (
                                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>QR Code:</p>
                                        <img
                                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/qrcode/${id}?tipo=PARTICIPANTE`}
                                            alt="QR Code de Verificação"
                                            style={{ width: '150px', height: '150px', border: '2px solid #ddd', borderRadius: '8px' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Foto do Encontrista</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                                    {fotoPreview ? (
                                        <img
                                            src={fotoPreview}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--color-primary-200)' }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '8px',
                                        display: fotoPreview ? 'none' : 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        padding: '10px',
                                        flexDirection: 'column',
                                        gap: '5px'
                                    }}>
                                        <span style={{ fontSize: '24px' }}>📷</span>
                                        <span>Sem Foto</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        style={{ display: 'none' }}
                                        id="upload-foto"
                                    />
                                    <label htmlFor="upload-foto">
                                        <Button as="span" variant="ghost" size="sm">📷 Alterar Foto</Button>
                                    </label>
                                </div>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                                    * Formato recomendado: 3x4 (será redimensionado para 240x320).<br />
                                    * Tamanho máximo: 5MB. Qualidade otimizada automaticamente.
                                </p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nome Completo</label>
                                <input name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Apelido</label>
                                <input name="apelido" value={formData.apelido} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Data Nascimento</label>
                                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sexo</label>
                                <select name="sexo" value={formData.sexo} onChange={handleChange} className={styles.select}>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Telefone</label>
                                <input name="telefone" value={formData.telefone} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Instagram</label>
                                <input name="instagram" value={formData.instagram} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CPF</label>
                                <input name="cpf" value={formData.cpf} onChange={handleChange} className={styles.input} placeholder="000.000.000-00" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>E-mail</label>
                                <input name="email" value={formData.email} onChange={handleChange} className={styles.input} placeholder="seu@email.com" />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🔔 Notificações</h2>
                        <div className={styles.checkboxGrid} style={{ border: '0', paddingTop: '0' }}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="receberEmail" checked={formData.receberEmail} onChange={handleChange} />
                                Receber E-mail?
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="receberWhatsapp" checked={formData.receberWhatsapp} onChange={handleChange} />
                                Receber WhatsApp?
                            </label>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>👨‍👩‍👧‍👦 Família e Endereço</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Estado Civil</label>
                                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className={styles.select}>
                                    <option value="SOLTEIRO">Solteiro(a)</option>
                                    <option value="CASADO">Casado(a)</option>
                                    <option value="UNIAO_ESTAVEL">União Estável</option>
                                    <option value="DIVORCIADO">Divorciado(a)</option>
                                    <option value="VIUVO">Viúvo(a)</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Mora com quem?</label>
                                <input name="moraComQuem" value={formData.moraComQuem} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Endereço Completo</label>
                                <input name="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Bairro</label>
                                <input name="bairro" value={formData.bairro} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Estado Civil dos Pais</label>
                                <input name="estadoCivilPais" value={formData.estadoCivilPais} onChange={handleChange} className={styles.input} />
                            </div>
                        </div>
                        <div className={styles.formGrid} style={{ marginTop: '1rem' }}>
                            <div className={styles.fullWidth}><h3>Mãe</h3></div>
                            <div className={styles.formGroup}><label>Nome Mãe</label><input name="nomeMae" value={formData.nomeMae} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Telefone Mãe</label><input name="telefoneMae" value={formData.telefoneMae} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Endereço Mãe</label><input name="enderecoMae" value={formData.enderecoMae} onChange={handleChange} className={styles.input} /></div>

                            <div className={styles.fullWidth}><h3>Pai</h3></div>
                            <div className={styles.formGroup}><label>Nome Pai</label><input name="nomePai" value={formData.nomePai} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Telefone Pai</label><input name="telefonePai" value={formData.telefonePai} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Endereço Pai</label><input name="enderecoPai" value={formData.enderecoPai} onChange={handleChange} className={styles.input} /></div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>⛪ Vida Religiosa</h2>
                        <div className={styles.checkboxGrid} style={{ border: '0', paddingTop: '0' }}>
                            <label className={styles.checkboxLabel}><input type="checkbox" name="batizado" checked={formData.batizado} onChange={handleChange} /> Batizado?</label>
                            {formData.batizado && <input name="localBatismo" value={formData.localBatismo} onChange={handleChange} className={styles.input} placeholder="Local" />}
                            <label className={styles.checkboxLabel}><input type="checkbox" name="fezPrimeiraComunhao" checked={formData.fezPrimeiraComunhao} onChange={handleChange} /> Primeira Comunhão?</label>
                            <label className={styles.checkboxLabel}><input type="checkbox" name="fezCrisma" checked={formData.fezCrisma} onChange={handleChange} /> Crisma?</label>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>💼 Carreira</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Escolaridade</label><input name="escolaridade" value={formData.escolaridade} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Instituição</label><input name="instituicaoEnsino" value={formData.instituicaoEnsino} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Curso</label><input name="cursoAtual" value={formData.cursoAtual} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Profissão</label><input name="profissao" value={formData.profissao} onChange={handleChange} className={styles.input} /></div>
                            <label className={styles.checkboxLabel}><input type="checkbox" name="trabalha" checked={formData.trabalha} onChange={handleChange} /> Trabalha?</label>
                            {formData.trabalha && <input name="localTrabalho" value={formData.localTrabalho} onChange={handleChange} className={styles.input} placeholder="Local" />}
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🏥 Saúde</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Restrições Alimentares</label><textarea name="restricoesAlimentares" value={formData.restricoesAlimentares} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Alergias</label><textarea name="alergias" value={formData.alergias} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Problemas Saúde</label><textarea name="problemasSaude" value={formData.problemasSaude} onChange={handleChange} className={styles.input} /></div>
                            <div className={styles.formGroup}><label>Medicamentos</label><textarea name="medicamentosContinuos" value={formData.medicamentosContinuos} onChange={handleChange} className={styles.input} /></div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>📞 Amigos/Parentes (NÃO estão fazendo inscrição)</h2>
                        <div className={styles.formGrid}>
                            {[0, 1, 2, 3, 4].map(i => (
                                <React.Fragment key={i}>
                                    <div className={styles.formGroup}>
                                        <label>Nome Completo {i + 1}</label>
                                        <input
                                            value={contatosJson[i]?.nome || ''}
                                            onChange={handleContatoChange(i, 'nome')}
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>WhatsApp {i + 1}</label>
                                        <input
                                            value={contatosJson[i]?.telefone || ''}
                                            onChange={handleContatoChange(i, 'telefone')}
                                            className={styles.input}
                                        />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>📌 Outros</h2>
                        <div className={styles.formGroup}>
                            <label>Amigos/Parentes Inscritos</label>
                            <textarea name="amigosParentesInscritos" value={formData.amigosParentesInscritos} onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label>Status da Inscrição</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={styles.select}>
                                <option value="PENDENTE">Pendente</option>
                                <option value="APROVADA">Aprovada</option>
                                <option value="REJEITADA">Rejeitada</option>
                            </select>
                        </div>
                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label>Cor do Grupo (Encontrista)</label>
                            <select name="corGrupo" value={formData.corGrupo || ''} onChange={handleChange} className={styles.select}>
                                <option value="">Sem grupo definido</option>
                                <option value="VERMELHO">Vermelho</option>
                                <option value="VERDE">Verde</option>
                                <option value="AMARELO">Amarelo</option>
                                <option value="AZUL">Azul</option>
                                <option value="LARANJA">Laranja</option>
                            </select>
                        </div>
                    </Card>
                </div>
            </div>

            <Card style={{ marginTop: '20px' }}>
                <h2 className={styles.sectionTitle}>🎫 Preview Crachá</h2>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className={styles.crachaPreview}>
                        <Cracha
                            inscricao={{ ...formData, fotoUrl: fotoPreview || formData.fotoUrl }}
                            tipo="participante"
                            lado="frente"
                            layout="vertical"
                        />
                    </div>
                    <div className={styles.crachaPreview}>
                        <Cracha
                            inscricao={{ ...formData, fotoUrl: fotoPreview || formData.fotoUrl }}
                            tipo="participante"
                            lado="verso"
                            layout="vertical"
                        />
                    </div>
                </div>
            </Card>

            <div className={styles.actions} style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button onClick={() => navigate(`/admin/inscricoes/${id}`)} variant="ghost">Cancelar</Button>
                <Button onClick={handleSalvar} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar Alterações'}</Button>
            </div>
        </div>
    );
};

export default EditarParticipante;
