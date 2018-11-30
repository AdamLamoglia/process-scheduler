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

    constructor(tempo_chegada, tempo_execucao, deadline, id, visitado) {
        this.tempo_chegada = tempo_chegada;
        this.tempo_execucao = tempo_execucao;
        this.deadline = deadline;
        this.id = id;
        this.visitado = visitado;

    }
}

function criarFields() {

    num_processos = document.getElementById("num_processos").value

    container.appendChild(document.createElement("br"));

    for (i = 0; i < num_processos; i++) {

        container.appendChild(document.createTextNode("Processo " + i));
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //tempo chegada
        container.appendChild(document.createTextNode("Tempo de Chegada: "));
        var input = document.createElement("input");
        input.type = "text";
        input.id = "tchegada" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //tempo execução

        container.appendChild(document.createTextNode("Tempo de Execução: "));
        input = document.createElement("input");
        input.type = "text";
        input.id = "texec" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

        //deadline
        container.appendChild(document.createTextNode("Deadline: "));
        input = document.createElement("input");
        input.type = "text";
        input.id = "deadline" + i;
        container.appendChild(input);
        container.appendChild(document.createElement("br"));
        container.appendChild(document.createElement("br"));

    }


}

function deletarFields() {

    for (i = 0; i < num_processos; i++) {

        processos[i] = new Processo(parseInt(document.getElementById("tchegada" + i).value), parseInt(document.getElementById("texec" + i).value),
            parseInt(document.getElementById("deadline" + i).value), i + 1, false);

    }

    var div = document.getElementById('container');

    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function criarGraficoDeGantt() {
    var time;

    timeline = document.getElementById("tempo");

    time = timeline.insertCell(-1);
    time.innerHTML = "Processo";

    time = timeline.insertCell(-1);
    time.innerHTML = "TC";

    time = timeline.insertCell(-1);
    time.innerHTML = "TE";

    time = timeline.insertCell(-1);
    time.innerHTML = "DL";

    //Cria colunas
    for (i = 0; i < 50; i++) {

        time = timeline.insertCell(-1);
        time.innerHTML = i;
    }

    //Cria linhas
    for (i = 0; i < num_processos; i++) {

        table = document.getElementById("gantt");

        var row = table.insertRow(-1);

        time = row.insertCell(-1);
        time.innerHTML = i;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].tempo_chegada;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].tempo_execucao;

        time = row.insertCell(-1);
        time.innerHTML = processos[i].deadline;

        //Cria colunas para cada linha
        for (j = 0; j < 50; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "&nbsp";
            time.width = "90px"
        }

    }

}


function fifo() {

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

    var tempo_atual = 4;
    var i = 0;
    var cells;
    var cellLength;

    while (i < processos.length) {

        cellLength = tempo_atual + processos[i].tempo_execucao;

        for (j = tempo_atual; j < cellLength; j++) {

            (function (i, index) {

                setTimeout(function () {

                    cells = table.rows.item(processos[i].id).cells;

                    cellLength = tempo_atual + processos[i].tempo_execucao;

                    cells.item(index).style.backgroundColor = "red";
                }, 200 * j);
            })(i, j)



        }

        i++;
        tempo_atual = cellLength;

    }



}

function sjf() {


    processos.sort(function (a, b) {

        if (a.tempo_execucao > b.tempo_execucao) {
            return 1;
        }
        if (a.tempo_execucao < b.tempo_execucao) {
            return -1;
        }

        return 0;
    });

    var table = document.getElementById('gantt');

    var tempo_atual = 4;

    var i = 0;
    var cells;
    var cellLength;

    while (i < processos.length) {

        //retorna indice correspondente ao primeiro da fila de prontos
        var k = procurarProcesso(tempo_atual);

        cellLength = tempo_atual + parseInt(processos[k].tempo_execucao);

        for (j = tempo_atual; j < cellLength; j++) {

            (function (k, index) {

                setTimeout(function () {

                    cells = table.rows.item(processos[k].id).cells;

                    cellLength = tempo_atual + parseInt(processos[k].tempo_execucao);

                    cells.item(index).style.backgroundColor = "red";

                }, 200 * j);
            })(k, j)



        }

        i++;
        tempo_atual = cellLength;

    }


}

function procurarProcesso(tempo_atual){

    var min = 999;
    var index;

    for(i = 0; i < processos.length; i++){

        if(!processos[i].visitado){

            if(processos[i].tempo_chegada < tempo_atual){
                
                if(processos[i].tempo_execucao < min){
                    
                    min = processos[i].tempo_chegada - tempo_atual;
                    
                    index = i;
                }
            }
            
      
        }

    }

    console.log(processos[index]);

    processos[index].visitado = true;

    return index;

}

function roundRobin() {

    quantum     = parseInt(document.getElementById("quantum").value);
    sobrecarga  = parseInt(document.getElementById("sobrecarga").value);

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

    var tempo_atual = 4;
    var cells;
    var cellLength;
    var soma = 0;

    for (var j = 0; j < processos.length; j++) {
        soma+= processos[j].tempo_execucao;
    }


    while (soma > 0) {
        var i = 0;

        while (i < processos.length) {

            if(processos[i].tempo_execucao > 0 && processos[i].tempo_chegada < tempo_atual){
                
                if(quantum > processos[i].tempo_execucao)
                    cellLength = tempo_atual + processos[i].tempo_execucao;
                else
                    cellLength = tempo_atual + quantum;
    
                for (j = tempo_atual; j < cellLength; j++) {
        
                    (function (i, index) {
        
                        setTimeout(function () {
        
                            cells = table.rows.item(processos[i].id).cells;
        
                            cells.item(index).style.backgroundColor = "red";
                
                        }, 350 * j);
                    })(i, j)


                    if(j== cellLength - 1){

                        for (k = tempo_atual + 1; k < tempo_atual + sobrecarga + 1; k++) {

                            (function (i, index, tExecucao) {
            
                                setTimeout(function () {
                
                                    cells = table.rows.item(processos[i].id).cells;
                
                                    if(tExecucao - quantum > 0){
                                        cells.item(index + 1).style.backgroundColor = "gray";
                                    }
                        
                                }, 350 * (k+1));
                            })(i, k, processos[i].tempo_execucao)
                        
                        }
                
                    }

                }

                if(quantum > processos[i].tempo_execucao)
                    soma -= processos[i].tempo_execucao;
                else
                    soma -= quantum;
            
                processos[i].tempo_execucao -= quantum;

                if(processos[i].tempo_execucao > 0)
                    tempo_atual = cellLength + sobrecarga;
                else
                    tempo_atual = cellLength;
                
                
            }

            i++;

        }

        
    }



}

function edf() {


}

function escalonarProcessos() {

    escalonamento = document.getElementById("escalonamentos").value;

    switch (escalonamento) {

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

function iniciar() {

    deletarFields();

    criarGraficoDeGantt();

    escalonarProcessos();
}