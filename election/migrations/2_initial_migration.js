// Numeramos para que o Truffle saiba em qual ordem executá-los. 
// Nova migração para implantar o contrato

//Criamos a variável chamada "Election" que requer o contrato que criamos
var Election = artifacts.require("./Election.sol");

//Garantimos que ele seja implantado quando executarmos as migrações
module.exports = function(deployer) {
  deployer.deploy(Election);
};
