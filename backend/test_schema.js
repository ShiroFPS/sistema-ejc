import { participanteSchema } from './src/schemas/inscricao.schema.js';

const testData = {
    nomeCompleto: 'Test Participant',
    apelido: 'Tester',
    dataNascimento: '1995-01-01',
    sexo: 'MASCULINO',
    cpf: '12345678901',
    email: 'test@example.com',
    telefone: '11999999999',
    instagram: '@test',
    receberEmail: true,
    receberWhatsapp: true,
    estadoCivil: 'SOLTEIRO',
    moraComQuem: 'Pais',
    estadoCivilPais: 'Casados',
    nomeMae: 'Mae Teste',
    telefoneMae: '11988888888',
    enderecoMae: 'Rua A, 1',
    nomePai: 'Pai Teste',
    telefonePai: '11977777777',
    enderecoPai: 'Rua A, 1',
    escolaridade: 'Superior',
    profissao: 'Engenheiro',
    trabalha: true,
    localTrabalho: 'Empresa X',
    batizado: true,
    localBatismo: 'Igreja Y',
    fezPrimeiraComunhao: true,
    fezCrisma: true,
    enderecoCompleto: 'Rua B, 2',
    bairro: 'Centro',
    restricoesAlimentares: 'Nenhuma',
    alergias: 'Nenhuma',
    problemasSaude: 'Nenhum',
    medicamentosContinuos: 'Nenhum',
    amigosParentesInscritos: 'Fulano',
    contatosEmergencia: '[]',
    corGrupo: 'VERDE',
    fotoUrl: 'https://cloudinary.com/test.jpg',
    comprovanteUrl: 'https://cloudinary.com/comprovante.jpg'
};

try {
    const validated = participanteSchema.parse(testData);
    console.log('✅ Validation successful!');
    console.log('FotoURL in validated data:', validated.fotoUrl);
    console.log('ComprovanteURL in validated data:', validated.comprovanteUrl);
} catch (error) {
    console.error('❌ Validation failed:');
    console.error(error.errors);
    process.exit(1);
}
