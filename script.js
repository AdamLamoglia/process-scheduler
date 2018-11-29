var num_processos;
var quantum;
var sobrecarga;
var escalonamento;

//vetores
var tempos_chegada = [],
    prioridades = [],
    tempos_execucao = [],
    deadlines = [],
    processos = [];

class Processo {
    
    constructor(tempo_chegada, tempo_execucao, deadline, id) {
          this.tempo_chegada = tempo_chegada;
          this.tempo_execucao = tempo_execucao;
          this.deadline = deadline;
          this.id = id;

    }
}



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
        
        processos[i] = new Processo(document.getElementById("tchegada"+i).value, document.getElementById("texec"+i).value,
                                             document.getElementById("deadline"+i).value, i+1);

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

function colorir(lugar,cells){
    console.log(lugar);
    cells.item(lugar).style.backgroundColor = "red";
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  

function fifo(){

    //ordena processos por tempo de chegada
    processos.sort(function (a, b) {
        
        if (a.tempo_chegada > b.tempo_chegada) {
          return 1;
        }
        
        if (a.tempo_chegada < b.tempo_chegada) {
          return -1;
        }

        return 0;
      });

    var table = document.getElementById('gantt');

    var tempo_atual = 1;

    var i = 0;
    var cells;
    var cellLength;

    while(i<processos.length){

        cellLength = tempo_atual + parseInt(processos[i].tempo_execucao);
        
        for( j = tempo_atual; j < cellLength; j++){
            
            (function(i,index){
                
                setTimeout(function(){
                    
                    cells = table.rows.item(processos[i].id).cells;
                    
                    cellLength = tempo_atual + parseInt(processos[i].tempo_execucao);
                    
                    cells.item(index).style.backgroundColor = "red";
                },200*j);
            })(i,j)

          
            
        }
        
        i++;
        tempo_atual = cellLength;
    
    }

    

}

function sjf(){

    console.log(processos);

    processos.sort(function (a, b) {
        
        if (a.tempo_chegada > b.tempo_chegada) {
          return 1;
        }
        
        if (a.tempo_chegada < b.tempo_chegada) {
          return -1;
        }
        if(a.tempo_chegada == b.tempo_chegada){
            if (a.tempo_execucao < b.tempo_execucao) {
                return -1;
            }
            if(a.tempo_execucao > b.tempo_execucao){
                return 1;
            }
        }

        return 0;
      });
      var processo = new Processo(0,0,0,0);
      processo = processos[0];
      
      var table = document.getElementById('gantt');
      var cells;
      var cellLength;
      var tempo_atual = 1;
      var tamanho = processos.length;

      while(tamanho > 0){
          console.log("interacao");

        cellLength = tempo_atual + parseInt(processo.tempo_execucao);
        
        for( j = tempo_atual; j < cellLength; j++){

            (function(index){
                
                setTimeout(function(){
                    
                    cells = table.rows.item(processo.id).cells;
                    
                    cellLength = tempo_atual + parseInt(processo.tempo_execucao);
                    
                    cells.item(index).style.backgroundColor = "red";
                },200*j);
            })(j)
            
        }

        tempo_atual = cellLength;
        
        var aux = [];
        var cont = 0;
        var index;
        for(k = 0; k < processos.length; k++){
            if(processo.id == processos[k].id){
                index=k;
            }
        }
        console.log(index);
        if (index > -1) {
            processos.splice(index, 1);
        }
        console.log("processos");
        console.log(processos);
        for(var i = 0; i < processos.length; i++){

            if(processos[i].tempo_chegada < tempo_atual + 1){
                
                aux[cont] = processos[i];
                cont++;
            }
        }
        console.log("valor de aux");
         console.log(aux);

        aux.sort(function (a, b) {
        
            if (a.tempo_execucao < b.tempo_execucao) {
                return -1;
            }
            if(a.tempo_execucao > b.tempo_execucao){
                return 1;
            }
            
    
            return 0;
        });


        tamanho--;

        processo = aux[0];

        //console.log(aux[0]);

      }


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