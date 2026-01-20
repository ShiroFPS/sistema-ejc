import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

const CORES = ['VERDE', 'AMARELO', 'VERMELHO'];
const CIRCULOS = ['VERMELHO', 'VERDE', 'LARANJA', 'AZUL', 'AMARELO'];
const ESTADOS_CIVIS = ['SOLTEIRO', 'CASADO', 'UNIAO_ESTAVEL', 'DIVORCIADO', 'VIUVO'];

const nomesM = ['João', 'Pedro', 'Lucas', 'Gabriel', 'Rafael', 'Felipe', 'Mateus', 'André', 'Carlos', 'José'];
const nomesF = ['Maria', 'Ana', 'Beatriz', 'Juliana', 'Camila', 'Fernanda', 'Patricia', 'Carla', 'Mônica', 'Paula'];
const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Lima', 'Pereira'];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNome(genero = 'M') {
    const primeiroNome = genero === 'M' ? randomItem(nomesM) : randomItem(nomesF);
    const sobrenome = randomItem(sobrenomes);
    const sobrenome2 = randomItem(sobrenomes);
    return `${primeiroNome} ${sobrenome} ${sobrenome2}`;
}

function randomTelefone() {
    return `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function randomEmail(nome) {
    const username = nome.toLowerCase().replace(/\s+/g, '.');
    return `${username}@email.com`;
}

function randomData() {
    const ano = Math.floor(Math.random() * 30) + 1990; // 1990-2020
    const mes = Math.floor(Math.random() * 12) + 1;
    const dia = Math.floor(Math.random() * 28) + 1;
    return `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

async function seedParticipantes() {
    console.log('📝 Criando 50 inscrições de participantes...');

    for (let i = 0; i < 50; i++) {
        const genero = Math.random() > 0.5 ? 'MASCULINO' : 'FEMININO';
        const nomeCompleto = randomNome(genero === 'MASCULINO' ? 'M' : 'F');
        const apelido = nomeCompleto.split(' ')[0];

        await prisma.inscricaoParticipante.create({
            data: {
                status: randomItem(['PENDENTE', 'APROVADA', 'REJEITADA']),
                corCracha: randomItem([...CORES, null, null]), // 40% sem cor
                lgpdCiente: true,

                nomeCompleto,
                apelido,
                dataNascimento: randomData(),
                sexo: genero,
                telefone: randomTelefone(),
                instagram: `@${apelido.toLowerCase()}${Math.floor(Math.random() * 999)}`,

                estadoCivil: randomItem(ESTADOS_CIVIS),
                escolaridade: randomItem(['Ensino Fundamental', 'Ensino Médio', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação']),
                instituicaoEnsino: Math.random() > 0.5 ? randomItem(['Colégio ABC', 'Escola XYZ', 'Universidade Federal']) : null,
                cursoAtual: Math.random() > 0.5 ? randomItem(['Administração', 'Engenharia', 'Direito', 'Medicina', 'Pedagogia']) : null,
                profissao: randomItem(['Estudante', 'Analista', 'Professor', 'Engenheiro', 'Comerciante', 'Autônomo']),
                trabalha: Math.random() > 0.5,
                localTrabalho: Math.random() > 0.5 ? randomItem(['Empresa ABC', 'Loja XYZ', 'Escola Municipal', 'Hospital Regional']) : null,

                batizado: Math.random() > 0.3,
                localBatismo: Math.random() > 0.3 ? 'Paróquia Nossa Senhora Auxiliadora' : null,
                fezPrimeiraComunhao: Math.random() > 0.4,
                fezCrisma: Math.random() > 0.5,

                enderecoCompleto: `Rua ${randomItem(['das Flores', 'do Sol', 'da Paz', 'Principal'])}, ${Math.floor(Math.random() * 500)}, Centro`,
                bairro: randomItem(['Centro', 'Jardim das Acácias', 'Vila Nova', 'Parque Industrial']),
                moraComQuem: randomItem(['Pais', 'Mãe', 'Pai', 'Avós', 'Sozinho(a)', 'Cônjuge']),

                estadoCivilPais: randomItem(['Casados', 'Divorciados', 'Separados', 'Viúvo(a)']),
                nomeMae: randomNome('F'),
                telefoneMae: randomTelefone(),
                enderecoMae: `Rua ${randomItem(['das Flores', 'do Sol'])}, ${Math.floor(Math.random() * 500)}`,
                nomePai: randomNome('M'),
                telefonePai: randomTelefone(),
                enderecoPai: `Rua ${randomItem(['da Paz', 'Principal'])}, ${Math.floor(Math.random() * 500)}`,

                amigosParentesInscritos: Math.random() > 0.7 ? `${randomNome()} (primo), ${randomNome('F')} (amiga)` : null,

                contatosEmergencia: JSON.stringify([
                    { nome: randomNome(), telefone: randomTelefone() },
                    { nome: randomNome('F'), telefone: randomTelefone() },
                ]),

                restricoesAlimentares: Math.random() > 0.8 ? randomItem(['Lactose', 'Glúten', 'Frutos do mar', 'Nenhuma']) : null,
                alergias: Math.random() > 0.9 ? randomItem(['Dipirona', 'Penicilina', 'Pólen', 'Nenhuma']) : null,
                problemasSaude: Math.random() > 0.85 ? randomItem(['Asma', 'Diabetes', 'Hipertensão', 'Nenhum']) : null,
                medicamentosContinuos: Math.random() > 0.9 ? randomItem(['Insulina', 'Anti-hipertensivo', 'Nenhum']) : null,

                fotoUrl: null,
                comprovanteUrl: null,
            },
        });

        if ((i + 1) % 10 === 0) {
            console.log(`   ✓ ${i + 1}/50 participantes criados`);
        }
    }
}

async function seedTrabalhadores() {
    console.log('\n👷 Criando 50 inscrições de trabalhadores...');

    for (let i = 0; i < 50; i++) {
        const tipoInscricao = Math.random() > 0.4 ? 'CASAIS_UNIAO_ESTAVEL' : 'SOLTEIRO';
        const nomeCompleto1 = randomNome('M');
        const nomeCompleto2 = tipoInscricao === 'CASAIS_UNIAO_ESTAVEL' ? randomNome('F') : null;

        await prisma.inscricaoTrabalhador.create({
            data: {
                status: randomItem(['PENDENTE', 'APROVADA', 'REJEITADA']),
                grupoFuncional: Math.random() > 0.3 ? randomItem(CIRCULOS) : null,
                corCracha: Math.random() > 0.4 ? randomItem(CORES) : null,
                funcaoTrabalhador: Math.random() > 0.3 ? randomItem(FUNCOES) : null,

                tipoInscricao,
                email: randomEmail(nomeCompleto1),

                nomeCompleto1,
                contato1: randomTelefone(),
                instagram1: `@${nomeCompleto1.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 999)}`,

                nomeCompleto2,
                contato2: nomeCompleto2 ? randomTelefone() : null,
                instagram2: nomeCompleto2 ? `@${nomeCompleto2.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 999)}` : null,

                enderecoCompleto: `Rua ${randomItem(['das Flores', 'do Sol', 'da Paz', 'Principal'])}, ${Math.floor(Math.random() * 500)}, Centro`,

                trabalhamOuEstudam: Math.random() > 0.3,
                areaTrabalhoEstudo: Math.random() > 0.3 ? randomItem(['Tecnologia', 'Saúde', 'Educação', 'Comércio', 'Indústria']) : null,

                paroquiaEjcAno: `Paróquia ${randomItem(['Nossa Senhora Auxiliadora', 'São José', 'Santa Terezinha', 'N.S. Aparecida'])} - ${2015 + Math.floor(Math.random() * 9)}`,
                equipesJaServiram: randomItem([
                    'Círculo Vermelho, Cozinha',
                    'Banda, Som & Iluminação',
                    'Secretaria, Ordem',
                    'Liturgia & Vigília, Externa',
                    'Sociodrama, Apresentadores',
                    'Boa Vontade, Minibox',
                ]),

                tocaInstrumento: Math.random() > 0.7,
                qualInstrumento: Math.random() > 0.7 ? randomItem(['Violão', 'Guitarra', 'Teclado', 'Bateria', 'Baixo']) : null,
                sabeCantar: Math.random() > 0.5,
                operaEquipamentosSom: Math.random() > 0.8,
                habilidadesComputador: Math.random() > 0.6,
                trabalhosManuais: Math.random() > 0.5,
            },
        });

        if ((i + 1) % 10 === 0) {
            console.log(`   ✓ ${i + 1}/50 trabalhadores criados`);
        }
    }
}

async function main() {
    console.log('🌱 Iniciando seed de dados fictícios...\n');

    try {
        await seedParticipantes();
        await seedTrabalhadores();

        console.log('\n✅ Seed concluído com sucesso!');
        console.log('📊 Total: 50 participantes + 50 trabalhadores = 100 inscrições');
    } catch (error) {
        console.error('❌ Erro no seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
