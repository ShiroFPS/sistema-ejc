
import { participanteSchema } from './src/schemas/inscricao.schema.js';

const testData = {
    nomeCompleto: "jonathas paulo dos santos catao",
    apelido: "jonathas",
    dataNascimento: "1990-08-28",
    sexo: "MASCULINO",
    cpf: "08777221451",
    email: "jonathaspaulo@gmail.com",
    telefone: "(83) 99837-3500",
    instagram: "@jonathaspsx",
    receberEmail: true,
    receberWhatsapp: true,
    estadoCivil: "CASADO",
    moraComQuem: "esposa",
    nomeMae: "Katia Regina",
    telefoneMae: "08998786765",
    nomePai: "Jonathas Catão",
    telefonePai: "83998775564",
    escolaridade: "Ensino superior completo",
    instituicaoEnsino: "Ciencia da Computação - UFPB",
    profissao: "Dev. Full Stack",
    trabalha: false,
    localTrabalho: "SIm em casa",
    batizado: false,
    fezPrimeiraComunhao: false,
    fezCrisma: false,
    enderecoCompleto: "rua antonia gomes da silveira",
    bairro: "Cristo",
    restricoesAlimentares: "nao tem",
    alergias: "nao tem",
    contatosEmergencia: "[]", // Simular ok
    lgpdCiente: true,
    tipo: 'PARTICIPANTE'
};

try {
    participanteSchema.parse(testData);
    console.log('✅ VALIDATION SUCCESS');
} catch (err) {
    console.log('❌ VALIDATION FAILED');
    console.log(JSON.stringify(err.errors, null, 2));
}
