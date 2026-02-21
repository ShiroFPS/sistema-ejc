import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import styles from './InscricaoDetalhes.module.css';

const InscricaoDetalhes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inscricao, setInscricao] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregar();
    }, [id]);

    const carregar = async () => {
        try {
            const { data } = await api.get(`/inscricoes/${id}`);
            setInscricao(data);
        } catch (error) {
            toast.error('Erro ao carregar inscrição');
            navigate('/admin/inscricoes');
        } finally {
            setLoading(false);
        }
    };

    const downloadFicha = async () => {
        try {
            const response = await api.get(`/export/pdf/ficha/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ficha_${inscricao.nomeCompleto || 'inscricao'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Ficha baixada!');
        } catch (error) {
            toast.error('Erro ao baixar ficha');
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando ficha...</div>;
    }

    if (!inscricao) return null;

    const isTrabalhador = !inscricao.nomeCompleto && (inscricao.nomeCompleto1 || inscricao.nomeCompleto2);
    const displayNome = isTrabalhador
        ? (inscricao.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? `${inscricao.nomeCompleto1} & ${inscricao.nomeCompleto2}` : inscricao.nomeCompleto1 || 'Sem Nome')
        : inscricao.nomeCompleto;

    const renderField = (label, value) => {
        if (value === null || value === undefined || value === '') return null;
        let displayValue = value;
        if (typeof value === 'boolean') displayValue = value ? 'Sim' : 'Não';
        if (typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))) {
            displayValue = new Date(value).toLocaleDateString('pt-BR');
        }

        return (
            <div className={styles.field} key={label}>
                <label>{label}</label>
                <p>{displayValue}</p>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.blob}></div>

            <motion.div
                className="fade-in"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.header}>
                    <Button onClick={() => navigate('/admin/inscricoes')} variant="ghost">
                        ← Listagem
                    </Button>
                    <div className={styles.headerActions}>
                        <Button onClick={() => navigate(isTrabalhador ? `/admin/trabalhadores/editar/${inscricao.id}` : `/admin/inscricoes/editar/${inscricao.id}`)} variant="secondary">
                            Editar Registro
                        </Button>
                        <Button onClick={downloadFicha} variant="primary">
                            Exportar PDF
                        </Button>
                        <Button
                            onClick={async () => {
                                if (window.confirm('Tem certeza que deseja EXCLUIR permanentemente esta inscrição?')) {
                                    try {
                                        await api.delete(`/inscricoes/${id}?tipo=${isTrabalhador ? 'TRABALHADOR' : 'PARTICIPANTE'}`);
                                        toast.success('Inscrição excluída com sucesso');
                                        navigate('/admin/inscricoes');
                                    } catch (error) {
                                        toast.error('Erro ao excluir inscrição');
                                    }
                                }
                            }}
                            variant="secondary"
                            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 className={styles.title}>{displayNome}</h1>
                    <div className={styles.badges}>
                        <span className={`${styles.badge} ${styles[inscricao.tipo || (isTrabalhador ? 'TRABALHADOR' : 'PARTICIPANTE')]}`}>
                            {(inscricao.tipo === 'TRABALHADOR' || (isTrabalhador && !inscricao.tipo)) ? 'ENCONTREIRO' : 'ENCONTRISTA'}
                        </span>
                        <span className={`${styles.badge} ${styles[inscricao.status]}`}>
                            {inscricao.status}
                        </span>
                        {inscricao.grupoFuncional && (
                            <span className={`${styles.badge} ${styles[inscricao.grupoFuncional]}`}>
                                {inscricao.grupoFuncional}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <Card>
                        <h2 className={styles.sectionTitle}>👤 Informações Pessoais {inscricao.tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? '(Pessoa 1)' : ''}</h2>
                        <div className={styles.grid}>
                            {renderField('Nome Completo', isTrabalhador ? inscricao.nomeCompleto1 : inscricao.nomeCompleto)}
                            {renderField('Apelido', inscricao.apelido)}
                            {renderField('Data Nascimento', isTrabalhador ? inscricao.dataNascimento1 : inscricao.dataNascimento)}
                            {renderField('Sexo', isTrabalhador ? inscricao.sexo1 : inscricao.sexo)}
                            {renderField('CPF', isTrabalhador ? inscricao.cpf1 : inscricao.cpf)}
                            {renderField('WhatsApp', isTrabalhador ? inscricao.contato1 : inscricao.telefone)}
                            {renderField('Email', inscricao.email)}
                            {isTrabalhador && (
                                <>
                                    {renderField('Escolaridade', inscricao.escolaridade1)}
                                    {renderField('Instituição/Curso', inscricao.instituicaoEnsino1)}
                                    {renderField('Onde trabalha/estuda', inscricao.localTrabalho1)}
                                    {renderField('Profissão', inscricao.profissao1)}
                                </>
                            )}
                            {!isTrabalhador && renderField('Profissão', inscricao.profissao)}
                        </div>
                    </Card>

                    {isTrabalhador && inscricao.nomeCompleto2 && (
                        <Card>
                            <h2 className={styles.sectionTitle}>👤 Informações Pessoais (Pessoa 2)</h2>
                            <div className={styles.grid}>
                                {renderField('Nome Completo', inscricao.nomeCompleto2)}
                                {renderField('Apelido', inscricao.apelido2)}
                                {renderField('Data Nascimento', inscricao.dataNascimento2)}
                                {renderField('Sexo', inscricao.sexo2)}
                                {renderField('CPF', inscricao.cpf2)}
                                {renderField('WhatsApp', inscricao.contato2)}
                                {renderField('Escolaridade', inscricao.escolaridade2)}
                                {renderField('Instituição/Curso', inscricao.instituicaoEnsino2)}
                                {renderField('Onde trabalha/estuda', inscricao.localTrabalho2)}
                                {renderField('Profissão', inscricao.profissao2)}
                            </div>
                        </Card>
                    )}

                    {!isTrabalhador && (
                        <>
                            <Card>
                                <h2 className={styles.sectionTitle}>👨‍👩‍👦 Núcleo Familiar</h2>
                                <div className={styles.grid}>
                                    {renderField('Estado Civil', inscricao.estadoCivil)}
                                    {renderField('Mora com', inscricao.moraComQuem)}
                                    {renderField('Situação Pais', inscricao.estadoCivilPais)}
                                    {renderField('Nome da Mãe', inscricao.nomeMae)}
                                    {renderField('Telefone Mãe', inscricao.telefoneMae)}
                                    {renderField('Nome do Pai', inscricao.nomePai)}
                                    {renderField('Telefone Pai', inscricao.telefonePai)}
                                </div>
                            </Card>

                            <Card>
                                <h2 className={styles.sectionTitle}>🏥 Saúde e Alergias</h2>
                                <div className={styles.grid}>
                                    {renderField('Restrições Alimentares', inscricao.restricoesAlimentares)}
                                    {renderField('Alergias', inscricao.alergias)}
                                    {renderField('Problemas de Saúde', inscricao.problemasSaude)}
                                    {renderField('Medicamentos', inscricao.medicamentosContinuos)}
                                </div>
                            </Card>
                        </>
                    )}

                    <Card>
                        <h2 className={styles.sectionTitle}>🏠 Localização</h2>
                        <div className={styles.grid}>
                            {renderField('Endereço', inscricao.enderecoCompleto)}
                            {renderField('Bairro', inscricao.bairro)}
                        </div>
                    </Card>

                    <div className={styles.mediaSection}>
                        {(inscricao.fotoUrl || inscricao.fotoUrl1 || inscricao.fotoUrl2) && (
                            <Card>
                                <h2 className={styles.sectionTitle}>📷 Identificação Visual</h2>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    {inscricao.fotoUrl && (
                                        <div style={{ textAlign: 'center' }}>
                                            <img src={inscricao.fotoUrl} alt="Foto" className={styles.foto} />
                                            {isTrabalhador && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Foto</p>}
                                        </div>
                                    )}
                                    {inscricao.fotoUrl1 && (
                                        <div style={{ textAlign: 'center' }}>
                                            <img src={inscricao.fotoUrl1} alt="Foto 1" className={styles.foto} />
                                            {isTrabalhador && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Pessoa 1</p>}
                                        </div>
                                    )}
                                    {inscricao.fotoUrl2 && (
                                        <div style={{ textAlign: 'center' }}>
                                            <img src={inscricao.fotoUrl2} alt="Foto 2" className={styles.foto} />
                                            {isTrabalhador && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Pessoa 2</p>}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default InscricaoDetalhes;
