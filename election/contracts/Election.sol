//Solidity é uma linguagem de programação orientada a contratos para escrever contratos inteligentes. 
//Ele é usado para implementar contratos inteligentes em várias plataformas blockchain
//Versão do solidity
pragma solidity ^0.5.0;

// Declaracao do smart contract
contract Election {
    // Struct Candidate que ira guardar info dos candidatos
    // Declaramos uma variável de estado que armazenará o valor do nome do candidato. 
    // Variáveis de estado nos permitem gravar dados no blockchain.
    struct Candidate {
        //Maneira de armazenar vários candidatos e armazenar vários atributos sobre cada candidato
        uint id; //unsigned int
        string name;
        uint voteCount; //unsigned int
    }

    // Capacidade de votar na eleição. 
    // Definido um mapeamento de "eleitores" para o contrato inteligente para acompanhar 
    //as contas que votaram na eleição 
    mapping(address => bool) public voters;

    //Local para salvar os candidatos
    //mapping em Solidity é como um array associativo ou um hash, que associa pares de valores-chave.
    mapping(uint => Candidate) public candidates; // A chave um unsigned inteiro e o valor é do tipo 
                                                  // structure Candidate
    
    // Controla quantos candidatos existem na eleição, pois em Solidity, não há como determinar o tamanho de um 
    // mapeamento e também não é possível iterar sobre ele.
    uint public candidatesCount;

    // evento voted
    event votedEvent (
        uint indexed _candidateId
    );

    //criamos uma função de construtor que será chamada sempre que implementarmos o contrato 
    //inteligente no blockchain. É aqui que definiremos o valor da variável de estado candidato que será 
    // armazenada no blockchain na migração.

    constructor () public {
        addCandidate("TAOQUEI");
        addCandidate("SPC");
        addCandidate("LULALIVRE");
        addCandidate("VAI PLANETA");
        addCandidate("URSAL");
        addCandidate("SLIME");
    }

    // Função para adicionar candidatos ao mapeamento
    // Observe que a visibilidade dessa função é privada porque queremos chamá-la apenas dentro do contrato.
    function addCandidate (string memory _name) private {
        //incrementamos o contador de candidatos para denotar que um novo candidato foi adicionado. 
        candidatesCount ++;
        //Atualizamos o mapeamento com uma nova struct Candidate, usando a contagem atual de candidatos como a 
        //chave. 
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0); //Essa struct Candidate é 
                                                                            //inicializada com o ID de candidato 
                                                                            //da contagem de candidatos atual, o 
                                                                            //nome do argumento de função e a 
                                                                            //contagem inicial de votos para 0. 
    }
    //Função para votar
    //Aumenta a contagem de votos do candidato lendo a struct Candidate do mapeamento "candidates" 
    //e aumentando o "voteCount" em 1.
    //Recebe um unint com o id do candidato
    function vote (uint _candidateId) public {
	//Implementa instruções requer que parará a execução se as condições não forem atendidas. Em seguida, . 
        // exige que o eleitor não tenha votado antes.
        require(!voters[msg.sender]);

        // requer que o ID do candidato seja válido
	//O ID do candidato deve ser maior que zero e menor ou igual à contagem total de candidatos.
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // Indica que foi votado
        voters[msg.sender] = true;

        // Atualiza o numero de votos
        candidates[_candidateId].voteCount ++;

        // trigger para o evento voted
        emit votedEvent(_candidateId);
    }
}
