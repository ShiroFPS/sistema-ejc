
/**
 * Script para preenchimento automático do formulário de Inscrição de Trabalhador (Encontreiro)
 * Como usar:
 * 1. Abra a página de inscrição de trabalhador no navegador.
 * 2. Aperte F12 para abrir o Console.
 * 3. Cole este código e aperte Enter.
 * 4. As fotos ainda precisam ser selecionadas manualmente.
 */

(function fillWorkerForm() {
    function set(name, value) {
        const el = document.querySelector(`[name="${name}"]`);
        if (el) {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setRadio(name, value) {
        const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (el) {
            el.checked = true;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Identificação
    set('email', 'trabalhador.teste@exemplo.com');
    set('tipoInscricao', 'SOLTEIRO'); // Ou 'CASAIS_UNIAO_ESTAVEL'

    // Aguarda um pouco para o React renderizar os campos dependentes do tipo de inscrição
    setTimeout(() => {
        // Pessoa 1
        set('nomeCompleto1', 'Pedro Trabalhador Teste');
        set('contato1', '(83) 98888-8888');
        set('cpf1', '111.111.111-11');
        set('sexo1', 'MASCULINO');
        set('dataNascimento1', '1995-05-15');
        set('instagram1', '@pedro_servico');
        set('apelido', 'Pedro');
        setRadio('escolaridade1', 'Ensino superior completo');
        set('instituicaoEnsino1', 'Engenharia - UFPB');
        set('trabalhoEstudoStatus1', 'sim');
        set('profissao1', 'Engenheiro');
        set('localTrabalho1', 'Empresa de Construção');

        // Se for casal, preenche a Pessoa 2 (opcional dependendo da seleção acima)
        if (document.querySelector('[name="nomeCompleto2"]')) {
            set('nomeCompleto2', 'Ana Trabalhadora Teste');
            set('contato2', '(83) 97777-7777');
            set('cpf2', '222.222.222-22');
            set('sexo2', 'FEMININO');
            set('dataNascimento2', '1997-08-20');
            set('instagram2', '@ana_servico');
            set('apelido2', 'Ana');
            setRadio('escolaridade2', 'Ensino superior completo');
            set('instituicaoEnsino2', 'Arquitetura - UNIESP');
            set('trabalhoEstudoStatus2', 'sim');
            set('profissao2', 'Arquiteta');
            set('localTrabalho2', 'Escritório de Design');
        }

        // Caminhada no EJC
        set('equipesJaServiram', 'Lanchonete, Círculos, Secretaria');

        // Habilidades
        set('tocaInstrumento', 'sim');
        setTimeout(() => set('qualInstrumento', 'Violão'), 100);
        set('sabeCantar', 'nao');
        set('habilidadesComputador', 'sim');
        set('habilidadesTalentos', 'Sei mexer com som e iluminação básica.');

        console.log('✅ Formulário de Trabalhador preenchido!');
    }, 500);
})();
