
/**
 * Script para preenchimento automático do formulário de Inscrição de Encontrista (Participante)
 * Como usar:
 * 1. Abra a página de inscrição no navegador.
 * 2. Aperte F12 para abrir o Console.
 * 3. Cole este código e aperte Enter.
 * 4. A foto e o comprovante (se houver) ainda precisam ser selecionados manualmente.
 */

(function fillForm() {
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

    function setCheckbox(name, checked) {
        const el = document.querySelector(`input[name="${name}"]`);
        if (el) {
            el.checked = checked;
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // LGPD
    setCheckbox('lgpdCiente', true);

    // Dados Pessoais
    set('nomeCompleto', 'João Teste da Silva');
    set('apelido', 'Joãozinho');
    set('dataNascimento', '2000-01-01');
    set('sexo', 'MASCULINO');
    set('telefone', '(83) 99999-9999');
    set('instagram', '@joao_teste');
    set('cpf', '000.000.000-00');
    set('email', 'joao.teste@exemplo.com');
    set('estadoCivil', 'SOLTEIRO');

    // Endereço
    set('enderecoCompleto', 'Rua de Teste, 123');
    set('bairro', 'Bairro de Teste');
    set('moraComQuem', 'Pais');

    // Escolaridade
    setRadio('escolaridade', 'Ensino superior completo');
    set('instituicaoEnsino', 'Computação - UFPB');
    set('localTrabalho', 'Sim, Empresa de Tecnologia');
    set('profissao', 'Desenvolvedor');

    // Dados Familiares
    set('nomeMae', 'Maria Teste');
    set('telefoneMae', '(83) 88888-8888');
    set('nomePai', 'José Teste');
    set('telefonePai', '(83) 77777-7777');

    // Contatos Extras
    for (let i = 1; i <= 5; i++) {
        set(`contato${i}Nome`, `Amigo Teste ${i}`);
        set(`contato${i}Telefone`, `(83) 66666-666${i}`);
    }

    // Saúde
    set('restricoesAlimentares', 'Nenhuma');
    set('alergias', 'Nenhuma');

    console.log('✅ Formulário preenchido com dados de teste!');
})();
