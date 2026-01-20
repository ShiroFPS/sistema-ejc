import React from 'react';
import styles from './Cracha.module.css';
import logoEjc from '../assets/logo-ejc.jpg';

const Cracha = ({ inscricao, tipo, lado = 'frente' }) => {
    const nome = tipo === 'trabalhador'
        ? (inscricao.apelido || inscricao.nomeCompleto1)
        : inscricao.apelido;

    const nomeCompleto = tipo === 'trabalhador'
        ? inscricao.nomeCompleto1
        : inscricao.nomeCompleto;

    const corFaixa = {
        'VERDE': '#22c55e',
        'AMARELO': '#eab308',
        'VERMELHO': '#ef4444',
    }[inscricao.corCracha] || '#6366f1';

    // Gerar código curto de 6 dígitos se não existir
    const codigoCurto = inscricao.codigoVerificacao
        ? inscricao.codigoVerificacao.slice(0, 6).toUpperCase()
        : '000000';

    if (lado === 'frente') {
        return (
            <div className={styles.cracha}>
                {/* Faixa colorida lateral */}
                <div className={styles.faixaCor} style={{ backgroundColor: corFaixa }}></div>

                <div className={styles.conteudoFrente}>
                    <div className={styles.logo}>
                        <img src={logoEjc} alt="Logo EJC" className={styles.logoImg} />
                    </div>

                    <div className={styles.infoFrente}>
                        <h2 className={styles.nomeFrente}>{nome}</h2>
                        {inscricao.funcaoTrabalhador && (
                            <div className={styles.funcaoBox} style={{ backgroundColor: corFaixa }}>
                                <p className={styles.funcao}>{inscricao.funcaoTrabalhador}</p>
                            </div>
                        )}
                    </div>
                    {/* Código removido da frente */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cracha}>
            <div className={styles.conteudoVerso}>
                <div className={styles.topoVerso}>
                    <h3 className={styles.tituloVerso}>Encontro de Jovens com Cristo</h3>
                    <p className={styles.subtituloVerso}>XXIX EJC AUXILIADORA</p>
                </div>

                <div className={styles.dadosVerso}>
                    <div className={styles.campoVerso}>
                        <span className={styles.labelVerso}>Nome Completo:</span>
                        <p className={styles.valorVerso}>{nomeCompleto}</p>
                    </div>

                    <div className={styles.campoVerso}>
                        <span className={styles.labelVerso}>Código de Verificação:</span>
                        <p className={styles.codigoVerso}>{codigoCurto}</p>
                    </div>
                </div>

                <div className={styles.rodapeVerso}>
                    <p className={styles.avisoVerso}>Este crachá é pessoal e intransferível</p>
                </div>
            </div>
        </div>
    );
};

export default Cracha;
