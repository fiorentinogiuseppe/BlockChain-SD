//Mesma ideia do arquivo de migração
var Election = artifacts.require("./Election.sol");

//função para todos os nossos testes 
// Essa função de retorno de chamada fornece uma variável "accounts" que representa todas as contas em nosso 
// blockchain, fornecidas pela Ganache.

contract("Election", function(accounts) {
  var electionInstance;

  //Verifica se o contrato foi inicializado com o número correto de candidatos, verificando se a contagem
  it("initializes with 6 candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 6);
    });
  });

  //Inspeciona os valores de cada candidato na eleição,
  //garantindo que cada candidato tenha o ID, o nome e a contagem de votos corretos.
  it("it initializes the candidates with the correct values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "TAOQUEI", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "SPC", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "LULALIVRE", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(4);
    }).then(function(candidate) {
      assert.equal(candidate[0], 4, "contains the correct id");
      assert.equal(candidate[1], "VAI PLANETA", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(5);
    }).then(function(candidate) {
      assert.equal(candidate[0], 5, "contains the correct id");
      assert.equal(candidate[1], "URSAL", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return electionInstance.candidates(6);
    }).then(function(candidate) {
      assert.equal(candidate[0], 6, "contains the correct id");
      assert.equal(candidate[1], "SLIME", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  //Testa se a função incrementa a contagem de votos do candidato.
  //Testa se o eleitor é adicionado ao mapeamento sempre que ele votar.
  it("allows a voter to cast a vote", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });

  //Testes para as necessidades de funções
  it("throws an exception for invalid candiates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
      return electionInstance.candidates(3);
    }).then(function(candidate3) {
      var voteCount = candidate3[2];
      assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
      return electionInstance.candidates(4);
    }).then(function(candidate4) {
      var voteCount = candidate4[2];
      assert.equal(voteCount, 0, "candidate 4 did not receive any votes");
      return electionInstance.candidates(5);
    }).then(function(candidate5) {
      var voteCount = candidate5[2];
      assert.equal(voteCount, 0, "candidate 5 did not receive any votes");
      return electionInstance.candidates(6);
    }).then(function(candidate6) {
      var voteCount = candidate6[2];
      assert.equal(voteCount, 0, "candidate 6 did not receive any votes");
    });
  });
 //Teste para garantir que evitemos o voto duplo
 it("throws an exception for double voting", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "accepts first vote");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
      return electionInstance.candidates(3);
    }).then(function(candidate3) {
      var voteCount = candidate3[2];
      assert.equal(voteCount, 0, "candidate 3 did not receive any votes");
      return electionInstance.candidates(4);
    }).then(function(candidate4) {
      var voteCount = candidate4[2];
      assert.equal(voteCount, 0, "candidate 4 did not receive any votes");
      return electionInstance.candidates(5);
    }).then(function(candidate5) {
      var voteCount = candidate5[2];
      assert.equal(voteCount, 0, "candidate 5 did not receive any votes");
      return electionInstance.candidates(6);
    }).then(function(candidate6) {
      var voteCount = candidate6[2];
      assert.equal(voteCount, 0, "candidate 6 did not receive any votes");
    });
  });
});
