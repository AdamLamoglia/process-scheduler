var num_processos;
var quantum;
var sobrecarga;


function criarFields(){

    num_processos = document.getElementById("num_processos").value

    for (i=0; i < num_processos; i++){

        container.appendChild(document.createTextNode("Processo " + i));
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
        
        //tempo chegada
        container.appendChild(document.createTextNode("Tempo de Chegada: "));
        var input = document.createElement("input");
        input.type = "text";   
        input.id = "tchegada"+i;
        container.appendChild(input);  
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //tempo execução

        container.appendChild(document.createTextNode("Tempo de Execução: "));
        input = document.createElement("input");
        input.type = "text";   
        input.id = "texec"+i;
        container.appendChild(input);  
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //deadline
        container.appendChild(document.createTextNode("Deadline: "));
        input = document.createElement("input");
        input.type = "text";  
        input.id = "deadline"+i;
        container.appendChild(input);  
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
 
    }

    
}

function iniciar(){

    console.log("yes")
}