var num_processos;
var quantum;
var sobrecarga;
var escalonamento;

//vetores
var tempos_chegada = [],
    prioridades = [],
    tempos_execucao = [],
    deadlines = [];


function criarFields(){

    num_processos = document.getElementById("num_processos").value
    
    container.appendChild(document.createElement("br"));

    for (i=0; i < num_processos; i++){

        container.appendChild(document.createTextNode("Processo " + i));
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));
        
        //tempo chegada
        container.appendChild(document.createTextNode("Tempo de Chegada: "));
        var input = document.createElement("input");
        input.type = "text";   
        input.id = "tchegada"+i;
        console.log(input.id)
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

function deletarFields(){
    
    for(i = 0; i < num_processos; i++){
    
        tempos_chegada[i]     = document.getElementById("tchegada"+i).value;
        tempos_execucao[i]    = document.getElementById("texec"+i).value;
        deadlines[i]          = document.getElementById("deadline"+i).value;

        console.log(tempos_execucao[i]);
    }
    
    var div = document.getElementById('container');
    
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}

function criarGraficoDeGantt(){

    timeline = document.getElementById("tempo");
    
    var time = timeline.insertCell(-1);
    time.innerHTML = "Processo";

    //Cria colunas
    for(i = 0; i < 50; i++){

        var time = timeline.insertCell(-1);
        time.innerHTML = i;
    }

    //Cria linhas
    for(i = 0; i < num_processos; i++){

        table = document.getElementById("gantt");

        var row = table.insertRow(-1);
        
        var time = row.insertCell(-1);
        time.innerHTML = i;

        //Cria colunas para cada linha
        for(j = 0; j < 50; j++){

            var time = row.insertCell(-1);
            time.innerHTML = "&nbsp";
            time.width = "90px"
        }

    }

}

function fifo(){


}

function sjf(){


}

function roundRobin(){


}

function edf(){


}

function escalonarProcessos(){

    escalonamento = document.getElementById("escalonamentos").value;
 
    switch(escalonamento){

        case "FIFO":
            fifo();
        break;

        case "SJF":
            sjf();
        break;

        case "Round Robin":
            roundRobin();
        break;

        case "EDF":
            edf();
        break;
        
    }

}

function iniciar(){

    deletarFields();
  
    criarGraficoDeGantt();

    escalonarProcessos();
}