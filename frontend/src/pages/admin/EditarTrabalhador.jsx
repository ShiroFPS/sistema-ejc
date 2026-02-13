import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Cracha from '../../components/Cracha';
import styles from './EditarTrabalhador.module.css';

const FUNCOES = [
    'Equipe dirigente',
    'Coordenação Geral',
    'Boa Vontade',
    'Banda',
    'Apresentadores',
    'Sociodrama',
    'Som & Iluminação',
    'Liturgia & Vigília',
    'Externa',
    'Secretaria',
    'Círculos',
    'Tráfego, Correios e Compras',
    'Lanchinho',
    'Cozinha',
    'Minibox',
    'Ordem',
    'Trânsito & Recepção',
];

const EditarTrabalhador = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trabalhador, setTrabalhador] = useState(null);
    const [formData, setFormData] = useState({
        corCracha: '',
        funcaoTrabalhador: '',
        apelido: '',
        apelido2: '',
        sexo1: '',
        sexo2: '',
        dataNascimento1: '',
        dataNascimento2: '',
        nomeCompleto1: '',
        nomeCompleto2: '',
        contato1: '',
        contato2: '',
        instagram1: '',
        instagram2: '',
        email: '',
        enderecoCompleto: '',
        trabalhamOuEstudam: false,
        areaTrabalhoEstudo: '',
        paroquiaEjcAno: '',
        equipesJaServiram: '',
        tocaInstrumento: false,
        qualInstrumento: '',
        sabeCantar: false,
        operaEquipamentosSom: false,
        habilidadesComputador: false,
        trabalhosManuais: false,
        cpf1: '',
        cpf2: '',
        receberEmail: true,
        receberWhatsapp: true,
        fotoUrl1: '',
        fotoUrl2: '',
    });
    const [fotoPreview1, setFotoPreview1] = useState(null);
    const [fotoArquivo1, setFotoArquivo1] = useState(null);
    const [fotoPreview2, setFotoPreview2] = useState(null);
    const [fotoArquivo2, setFotoArquivo2] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewPerson, setPreviewPerson] = useState(1);

    useEffect(() => {
        const fetchTrabalhador = async () => {
            try {
                const response = await api.get(`/inscricoes/${id}?tipo=trabalhador`);
                const d = response.data;
                setTrabalhador(d);
                setFormData({
                    corCracha: d.corCracha || '',
                    funcaoTrabalhador: d.funcaoTrabalhador || '',
                    apelido: d.apelido || d.nomeCompleto1?.split(' ')[0] || '',
                    apelido2: d.apelido2 || d.nomeCompleto2?.split(' ')[0] || '',
                    sexo1: d.sexo1 || '',
                    sexo2: d.sexo2 || '',
                    dataNascimento1: d.dataNascimento1 ? new Date(d.dataNascimento1).toISOString().split('T')[0] : '',
                    dataNascimento2: d.dataNascimento2 ? new Date(d.dataNascimento2).toISOString().split('T')[0] : '',
                    nomeCompleto1: d.nomeCompleto1 || '',
                    nomeCompleto2: d.nomeCompleto2 || '',
                    contato1: d.contato1 || '',
                    contato2: d.contato2 || '',
                    instagram1: d.instagram1 || '',
                    instagram2: d.instagram2 || '',
                    email: d.email || '',
                    enderecoCompleto: d.enderecoCompleto || '',
                    trabalhamOuEstudam: d.trabalhamOuEstudam || false,
                    areaTrabalhoEstudo: d.areaTrabalhoEstudo || '',
                    paroquiaEjcAno: d.paroquiaEjcAno || '',
                    equipesJaServiram: d.equipesJaServiram || '',
                    tocaInstrumento: d.tocaInstrumento || false,
                    qualInstrumento: d.qualInstrumento || '',
                    sabeCantar: d.sabeCantar || false,
                    operaEquipamentosSom: d.operaEquipamentosSom || false,
                    habilidadesComputador: d.habilidadesComputador || false,
                    trabalhosManuais: d.trabalhosManuais || false,
                    cpf1: d.cpf1 || '',
                    cpf2: d.cpf2 || '',
                    receberEmail: d.receberEmail !== undefined ? d.receberEmail : true,
                    receberWhatsapp: d.receberWhatsapp !== undefined ? d.receberWhatsapp : true,
                    fotoUrl1: d.fotoUrl1 || '',
                    fotoUrl2: d.fotoUrl2 || '',
                });
                if (d.fotoUrl1) setFotoPreview1(d.fotoUrl1);
                if (d.fotoUrl2) setFotoPreview2(d.fotoUrl2);
            } catch (error) {
                console.error('Erro ao buscar trabalhador:', error);
                toast.error('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchTrabalhador();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFotoChange = (num) => (e) => {
        const file = e.target.files[0];
        if (file) {
            if (num === 1) {
                setFotoArquivo1(file);
                setFotoPreview1(URL.createObjectURL(file));
            } else {
                setFotoArquivo2(file);
                setFotoPreview2(URL.createObjectURL(file));
            }
        }
    };

    const handleSalvar = async () => {
        setSaving(true);
        try {
            // Limpar datas vazias para evitar erro de Invalid Date no backend
            let currentFotoUrl1 = formData.fotoUrl1;
            let currentFotoUrl2 = formData.fotoUrl2;

            // Upload Foto 1
            if (fotoArquivo1) {
                const fd1 = new FormData();
                fd1.append('foto', fotoArquivo1);
                try {
                    const { data } = await api.post('/upload/foto', fd1, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    currentFotoUrl1 = data.url;
                } catch (error) {
                    toast.error('Erro ao enviar foto 1');
                    setSaving(false);
                    return;
                }
            }

            // Upload Foto 2
            if (fotoArquivo2) {
                const fd2 = new FormData();
                fd2.append('foto', fotoArquivo2);
                try {
                    const { data } = await api.post('/upload/foto', fd2, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    currentFotoUrl2 = data.url;
                } catch (error) {
                    toast.error('Erro ao enviar foto 2');
                    setSaving(false);
                    return;
                }
            }

            const payload = { ...formData, fotoUrl1: currentFotoUrl1, fotoUrl2: currentFotoUrl2 };
            if (!payload.dataNascimento1) delete payload.dataNascimento1;
            if (!payload.dataNascimento2) delete payload.dataNascimento2;

            await api.put(`/inscricoes/${id}?tipo=TRABALHADOR`, payload);

            // Atualiza o state local para o preview
            setTrabalhador(prev => ({
                ...prev,
                ...formData
            }));

            toast.success('Alterações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast.error('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }

    };

    const alterarStatus = async (novoStatus) => {
        try {
            if (novoStatus === 'APROVADA') await api.put(`/inscricoes/${id}/aprovar?tipo=TRABALHADOR`);
            else if (novoStatus === 'REJEITADA') await api.put(`/inscricoes/${id}/rejeitar?tipo=TRABALHADOR`);
            else {
                // Para desfazer (PENDENTE), usamos o update comum já que não tem endpoint específico
                await api.put(`/inscricoes/${id}?tipo=TRABALHADOR`, { status: 'PENDENTE' });
            }

            setTrabalhador(prev => ({ ...prev, status: novoStatus }));
            toast.success(`Status alterado para ${novoStatus}`);
        } catch (error) {
            toast.error('Erro ao alterar status');
        }
    };

    const handleImprimirCracha = async () => {
        try {
            const response = await api.get(`/cracha/gerar/${id}?tipo=trabalhador&person=${previewPerson}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cracha_${trabalhador?.codigoVerificacao || 'print'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Crachá gerado!');
        } catch (error) {
            toast.error('Erro ao gerar crachá');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!trabalhador) {
        return null;
    }

    const isCasal = trabalhador.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button onClick={() => navigate('/admin/inscricoes')} variant="ghost">
                    ← Voltar
                </Button>
                <div className={styles.headerActions}>
                    <Button onClick={() => navigate(`/admin/inscricoes/${id}`)} variant="ghost">
                        👁️ Ver Detalhes
                    </Button>
                    <Button onClick={handleImprimirCracha} variant="secondary">
                        🖨️ Imprimir Crachá
                    </Button>
                </div>
            </div>

            <h1 className={styles.title}>Editar Encontreiro</h1>

            <div className={styles.content}>
                <div className={styles.leftCol}>
                    <Card>
                        <h2 className={styles.sectionTitle}>👤 Pessoa 1</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                <label style={{ color: 'var(--color-primary-500)', fontWeight: 'bold' }}>Status Atual: {trabalhador.status}</label>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    <Button size="sm" onClick={() => alterarStatus('APROVADA')} disabled={trabalhador.status === 'APROVADA'}>✅ Aprovar</Button>
                                    <Button size="sm" onClick={() => alterarStatus('REJEITADA')} variant="danger" disabled={trabalhador.status === 'REJEITADA'}>❌ Reprovar</Button>
                                    <Button size="sm" onClick={() => alterarStatus('PENDENTE')} variant="secondary" disabled={trabalhador.status === 'PENDENTE'}>↩️ Desfazer</Button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Código Verificação</label>
                                <input value={trabalhador.codigoVerificacao || ''} disabled className={styles.input} style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nome Completo</label>
                                <input name="nomeCompleto1" value={formData.nomeCompleto1} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Apelido (Nome no Crachá)</label>
                                <input name="apelido" value={formData.apelido} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sexo</label>
                                <select name="sexo1" value={formData.sexo1} onChange={handleChange} className={styles.select}>
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Nascimento</label>
                                <input type="date" name="dataNascimento1" value={formData.dataNascimento1} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Contato</label>
                                <input name="contato1" value={formData.contato1} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Instagram</label>
                                <input name="instagram1" value={formData.instagram1} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>CPF 1</label>
                                <input name="cpf1" value={formData.cpf1} onChange={handleChange} className={styles.input} placeholder="000.000.000-00" />
                            </div>
                            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                <label>Foto Pessoa 1</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                                    {fotoPreview1 ? (
                                        <img src={fotoPreview1} alt="Preview 1" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '100px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>Sem foto</div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleFotoChange(1)} id="foto-1" style={{ display: 'none' }} />
                                    <label htmlFor="foto-1">
                                        <Button as="span" variant="ghost" size="sm">📷 Alterar Foto 1</Button>
                                    </label>
                                </div>
                                <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                                    * Formato: 3x4. Máx: 5MB. Otimizado automaticamente.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {isCasal && (
                        <Card>
                            <h2 className={styles.sectionTitle}>👤 Pessoa 2</h2>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Nome Completo</label>
                                    <input name="nomeCompleto2" value={formData.nomeCompleto2} onChange={handleChange} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Apelido (Nome no Crachá)</label>
                                    <input name="apelido2" value={formData.apelido2} onChange={handleChange} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sexo</label>
                                    <select name="sexo2" value={formData.sexo2} onChange={handleChange} className={styles.select}>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nascimento</label>
                                    <input type="date" name="dataNascimento2" value={formData.dataNascimento2} onChange={handleChange} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Contato</label>
                                    <input name="contato2" value={formData.contato2} onChange={handleChange} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Instagram</label>
                                    <input name="instagram2" value={formData.instagram2} onChange={handleChange} className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>CPF 2</label>
                                    <input name="cpf2" value={formData.cpf2} onChange={handleChange} className={styles.input} placeholder="000.000.000-00" />
                                </div>
                                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                                    <label>Foto Pessoa 2</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                                        {fotoPreview2 ? (
                                            <img src={fotoPreview2} alt="Preview 2" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        ) : (
                                            <div style={{ width: '80px', height: '100px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>Sem foto</div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFotoChange(2)} id="foto-2" style={{ display: 'none' }} />
                                        <label htmlFor="foto-2">
                                            <Button as="span" variant="ghost" size="sm">📷 Alterar Foto 2</Button>
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                                        * Formato: 3x4. Máx: 5MB. Otimizado automaticamente.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card>
                        <h2 className={styles.sectionTitle}>🏠 Contato e Endereço</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>E-mail</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Endereço Completo</label>
                                <input name="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} className={styles.input} />
                            </div>
                        </div>
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
                        <h2 className={styles.sectionTitle}>🛠️ Experiência e Habilidades</h2>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Paróquia e Ano EJC</label>
                                <input name="paroquiaEjcAno" value={formData.paroquiaEjcAno} onChange={handleChange} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Equipes que já serviu (Histórico)</label>
                                <textarea
                                    name="equipesJaServiram"
                                    value={formData.equipesJaServiram}
                                    readOnly
                                    className={styles.input}
                                    style={{
                                        minHeight: '80px',
                                        resize: 'none',
                                        cursor: 'not-allowed',
                                        opacity: 0.7
                                    }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Equipe deste ano (Função) *</label>
                                <select name="funcaoTrabalhador" value={formData.funcaoTrabalhador} onChange={handleChange} className={styles.select}>
                                    <option value="">Selecione uma função</option>
                                    {FUNCOES.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.checkboxGrid}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="tocaInstrumento" checked={formData.tocaInstrumento} onChange={handleChange} />
                                Toca instrumento?
                            </label>
                            {formData.tocaInstrumento && (
                                <input name="qualInstrumento" value={formData.qualInstrumento} onChange={handleChange} placeholder="Qual?" className={styles.input} />
                            )}
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="sabeCantar" checked={formData.sabeCantar} onChange={handleChange} />
                                Sabe cantar?
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="operaEquipamentosSom" checked={formData.operaEquipamentosSom} onChange={handleChange} />
                                Opera som/luz?
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="habilidadesComputador" checked={formData.habilidadesComputador} onChange={handleChange} />
                                Habilidades Computador?
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="trabalhosManuais" checked={formData.trabalhosManuais} onChange={handleChange} />
                                Trabalhos manuais?
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="trabalhamOuEstudam" checked={formData.trabalhamOuEstudam} onChange={handleChange} />
                                Trabalha ou Estuda?
                            </label>
                            {formData.trabalhamOuEstudam && (
                                <input name="areaTrabalhoEstudo" value={formData.areaTrabalhoEstudo} onChange={handleChange} placeholder="Área" className={styles.input} />
                            )}
                        </div>
                    </Card>
                </div>

                <div className={styles.rightCol}>
                    <Card>
                        <h2 className={styles.sectionTitle}>🎨 Configuração Crachá</h2>
                        <div className={styles.formGroup}>
                            <label>Cor do Crachá *</label>
                            <select name="corCracha" value={formData.corCracha} onChange={handleChange} className={styles.select}>
                                <option value="">Selecione uma cor</option>
                                <option value="VERDE">🟢 Verde</option>
                                <option value="AMARELO">🟡 Amarelo</option>
                                <option value="VERMELHO">🔴 Vermelho</option>
                            </select>
                        </div>

                        <Button onClick={handleSalvar} disabled={saving} fullWidth>
                            {saving ? 'Salvando...' : '💾 Salvar Todas Alterações'}
                        </Button>
                    </Card>

                    <Card>
                        <h2 className={styles.sectionTitle}>🎫 Preview</h2>
                        {isCasal && (
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                <Button size="sm" variant={previewPerson === 1 ? 'primary' : 'ghost'} onClick={() => setPreviewPerson(1)}>Pessoa 1</Button>
                                <Button size="sm" variant={previewPerson === 2 ? 'primary' : 'ghost'} onClick={() => setPreviewPerson(2)}>Pessoa 2</Button>
                            </div>
                        )}
                        <div className={styles.crachaPreview}>
                            <Cracha
                                inscricao={{ ...trabalhador, ...formData }}
                                tipo="trabalhador"
                                lado="frente"
                                layout="vertical"
                                person={previewPerson}
                            />
                        </div>
                        <div className={styles.crachaPreview} style={{ marginTop: '20px' }}>
                            <Cracha
                                inscricao={{ ...trabalhador, ...formData }}
                                tipo="trabalhador"
                                lado="verso"
                                layout="vertical"
                                person={previewPerson}
                            />
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    );
};

export default EditarTrabalhador;
