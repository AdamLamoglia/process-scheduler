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

var tempoIago;

class Processo {

    constructor(tempo_chegada, tempo_execucao, deadline, id, visitado, referenciadoDisco) {
        this.tempo_chegada = tempo_chegada;
        this.tempo_execucao = tempo_execucao;
        this.deadline = deadline;
        this.id = id;
        this.visitado = visitado;
        this.referenciadoDisco = referenciadoDisco;
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
            parseInt(document.getElementById("deadline" + i).value), i + 1, false, false);

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

    //labels  = document.getElementById("legendas");

    timeline = document.getElementById("corExec");

    time = timeline.insertCell(0);
    time.innerHTML = "Executando";
    time.style.backgroundColor = "blue";

    timeline = document.getElementById("corTC");

    time = timeline.insertCell(0);
    time.innerHTML = "Troca de contexto";
    time.style.backgroundColor = "red";

}

function criarDisco() {
    var time;

    //Cria linhas
    for (i = 0; i < 7; i++) {

        table = document.getElementById("disco");

        var row = table.insertRow(-1);


        //Cria colunas para cada linha
        for (j = 0; j < 10; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "-";
            time.width = "90px"
        }

    }


}

function criarRam() {

    var time;

    //Cria linhas
    for (i = 0; i < 7; i++) {

        table = document.getElementById("ram");

        var row = table.insertRow(-1);


        //Cria colunas para cada linha
        for (j = 0; j < 7; j++) {

            time = row.insertCell(-1);
            time.innerHTML = "&nbsp";
            time.width = "90px"
        }

    }


}

function ReferenciarPagDisco(id) {

    var table = document.getElementById('disco');
    var cells;
    var lugar;

    cells = table.rows.item(1).cells;


    //encontra coluna livre
    for (var i = 0; i < 10; i++) {

        if (cells.item(i).innerHTML == "-") {
            console.log(cells.item(i).innerHTML);
            lugar = i;
            break;
        }

    }

    console.log(lugar);

    //escreve na coluna livre
    for (var i = 1; i <= 7; i++) {
        cells = table.rows.item(i).cells;
        cells.item(lugar).innerHTML = "P" + (id - 1);
    }


}

function retirarDoDisco(id) {

    var table = document.getElementById('disco');
    var cells;
    var lugar;

    cells = table.rows.item(1).cells;


    //encontra coluna livre
    for (var i = 0; i < 10; i++) {

        if (cells.item(i).innerHTML == "P" + (id - 1)) {
            //console.log(cells.item(i).innerHTML);
            lugar = i;
            break;
        }

    }

    //console.log(lugar);

    //escreve na coluna livre
    for (var i = 1; i <= 7; i++) {
        cells = table.rows.item(i).cells;
        cells.item(lugar).innerHTML = "-";
    }
}

function fifo() {

    /*//ordena processos por tempo de chegada
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

    var tempo_atual = 4 + processos[0].tempo_chegada;
    var i = 0;
    var cells;
    var cellLength;

    //var tempo = 1;

    while (i < processos.length) {


        for (var j = 0; j < processos.length; j++) {
            var h = -1;
            console.log(tempo);
            if (!processos[j].referenciadoDisco) {

                if (processos[j].tempo_chegada < tempo) {

                    (function (j, tempo, h) {

                        setTimeout(function () {
                            ReferenciarPagDisco(processos[j].id);
                        }, 0);
                    })(j, tempo, h)

                    processos[j].referenciadoDisco = true;
                    h -= 70.7;
                }
            }
        }

        if (processos[i].tempo_chegada < tempo_atual - 3) {

            cellLength = tempo_atual + processos[i].tempo_execucao;


            for (j = tempo_atual; j < cellLength; j++) {

                tempo = (function (i, index) {

                    setTimeout(function () {


                        cells = table.rows.item(processos[i].id).cells;

                        cellLength = tempo_atual + processos[i].tempo_execucao;

                        cells.item(index).style.backgroundColor = "blue";
                    }, 500 * j);
                })(i, j)


            }

            (function (i, cellLength) {

                setTimeout(function () {
                    retirarDoDisco(processos[i].id);
                }, 500 * cellLength);
            })(i, cellLength)

            i++;
            tempo_atual = cellLength;
        }

        else
            tempo_atual++;

    }*/

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

    var cells;

    var soma = 4;
    var execucoes = 4;
    var tempo = 4;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > execucoes) {

        for (var j = 0; j < processos.length; j++) {

            if (!processos[j].referenciadoDisco) {

                if (processos[j].tempo_chegada < tempo - 3) {

                    (function (j, tempo) {

                        setTimeout(function () {
                            ReferenciarPagDisco(processos[j].id);
                        }, 500 * tempo);
                    })(j, tempo)

                    processos[j].referenciadoDisco = true;
                }
            }
        }

        var id_processo = procurarProcesso(tempo);

        if (id_processo != -1 && processos[id_processo].tempo_execucao > 0) {

            (function (id_processo, tempo) {
                setTimeout(function () {

                    cells = table.rows.item(processos[id_processo].id).cells;

                    cells.item(tempo).style.backgroundColor = "blue";

                }, 500 * tempo);
            })(id_processo, tempo)

            processos[id_processo].tempo_execucao--;

            if(processos[id_processo].tempo_execucao == 0){

                (function (id_processo, tempo) {

                    setTimeout(function () {
                        retirarDoDisco(processos[id_processo].id);
                    }, 500 * tempo);
                })(id_processo, tempo)
    
                
            }

            execucoes++;
        }

        tempo++;
    }

}


function sjf() {

    var table = document.getElementById('gantt');

    var tempo_atual = 4;

    var i = 0;
    var cells;
    var cellLength;

    while (i < processos.length) {

        //retorna indice correspondente ao primeiro da fila de prontos
        var k = procurarProcesso(tempo_atual);

        if (k != -1) {
            cellLength = tempo_atual + parseInt(processos[k].tempo_execucao);

            for (j = tempo_atual; j < cellLength; j++) {

                (function (k, index) {

                    setTimeout(function () {

                        cells = table.rows.item(processos[k].id).cells;

                        cellLength = tempo_atual + parseInt(processos[k].tempo_execucao);

                        cells.item(index).style.backgroundColor = "blue";

                    }, 200 * j);
                })(k, j)



            }

            i++;
            tempo_atual = cellLength;
        }

        else
            tempo_atual++;

    }


}

function procurarProcesso(tempo_atual) {

    var min = 999;
    var index = -1;

    if (escalonamento == "FIFO") {

        for (i = 0; i < processos.length; i++) {

            //if (!processos[i].visitado) {

            if (processos[i].tempo_chegada < tempo_atual - 3 && processos[i].tempo_execucao > 0) {

                //if (processos[i].tempo_execucao < min) {

                //min = processos[i].tempo_execucao;

                index = i;
                break;
                //}
            }

            //}

        }

        //if (index != -1)
        //  processos[index].visitado = true;

        return index;
    }

    if (escalonamento == "SJF") {

        for (i = 0; i < processos.length; i++) {

            if (!processos[i].visitado) {

                if (processos[i].tempo_chegada < tempo_atual - 3) {

                    if (processos[i].tempo_execucao < min) {

                        min = processos[i].tempo_execucao;

                        index = i;
                    }
                }

            }

        }

        if (index != -1)
            processos[index].visitado = true;

        return index;
    }

    //edf
    for (i = 0; i < processos.length; i++) {

        if (!processos[i].visitado) {

            if (processos[i].tempo_chegada < tempo_atual - 3) {

                if (processos[i].deadline < min) {

                    min = processos[i].deadline;

                    index = i;
                }
            }

        }
    }

    return index;

}

function roundRobin() {

    quantum = parseInt(document.getElementById("quantum").value);
    sobrecarga = parseInt(document.getElementById("sobrecarga").value);

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

    var tempo_atual = 4 + processos[0].tempo_chegada;
    var cells;
    var cellLength;
    var soma = 0;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }


    while (soma > 0) {
        var i = 0;

        while (i < processos.length) {

            if (processos[i].tempo_execucao > 0 && processos[i].tempo_chegada < tempo_atual - 3) {

                if (quantum > processos[i].tempo_execucao)
                    cellLength = tempo_atual + processos[i].tempo_execucao;
                else
                    cellLength = tempo_atual + quantum;

                for (j = tempo_atual; j < cellLength; j++) {

                    (function (i, index) {

                        setTimeout(function () {

                            cells = table.rows.item(processos[i].id).cells;

                            cells.item(index).style.backgroundColor = "blue";

                        }, 350 * j);
                    })(i, j)


                    if (j == cellLength - 1) {

                        for (k = j + 1; k < cellLength + sobrecarga; k++) {

                            (function (i, index, tExecucao) {

                                setTimeout(function () {

                                    cells = table.rows.item(processos[i].id).cells;

                                    if (tExecucao - quantum > 0) {
                                        cells.item(index).style.backgroundColor = "red";
                                    }

                                }, 350 * (k));
                            })(i, k, processos[i].tempo_execucao)

                        }

                    }

                }

                if (quantum > processos[i].tempo_execucao)
                    soma -= processos[i].tempo_execucao;
                else
                    soma -= quantum;

                processos[i].tempo_execucao -= quantum;

                if (processos[i].tempo_execucao > 0)
                    tempo_atual = cellLength + sobrecarga;
                else
                    tempo_atual = cellLength;


            }

            i++;

        }


    }



}

function edf() {

    quantum = parseInt(document.getElementById("quantum").value);
    sobrecarga = parseInt(document.getElementById("sobrecarga").value);

    processos.sort(function (a, b) {

        if (a.deadline > b.deadline) {
            return 1;
        }
        if (a.deadline < b.deadline) {
            return -1;
        }

        return 0;
    });

    var table = document.getElementById('gantt');

    var tempo_atual = 4;

    var i = 0;
    var cells;
    var cellLength;
    var soma = 0;

    for (var j = 0; j < processos.length; j++) {
        soma += processos[j].tempo_execucao;
    }

    while (soma > 0) {
        var i = 0;

        while (i < processos.length) {
            console.log("loop");
            m = procurarProcesso(tempo_atual);

            if (m != -1) {

                //console.log(m);

                if (processos[m].tempo_execucao > 0 && processos[m].tempo_chegada < tempo_atual - 3) {
                    //console.log("entrou1");

                    if (quantum > processos[m].tempo_execucao)
                        cellLength = tempo_atual + processos[m].tempo_execucao;
                    else
                        cellLength = tempo_atual + quantum;

                    for (j = tempo_atual; j < cellLength; j++) {

                        (function (m, index) {

                            setTimeout(function () {

                                cells = table.rows.item(processos[m].id).cells;

                                cells.item(index).style.backgroundColor = "blue";

                            }, 350 * j);
                        })(m, j)


                        if (j == cellLength - 1) {

                            for (k = j + 1; k < cellLength + sobrecarga; k++) {

                                (function (m, index, tExecucao) {

                                    setTimeout(function () {

                                        cells = table.rows.item(processos[m].id).cells;

                                        if (tExecucao - quantum > 0) {
                                            cells.item(index).style.backgroundColor = "red";
                                        }

                                    }, 350 * (k));
                                })(m, k, processos[m].tempo_execucao)

                            }

                        }

                    }

                    if (quantum > processos[m].tempo_execucao)
                        soma -= processos[m].tempo_execucao;
                    else
                        soma -= quantum;

                    processos[m].tempo_execucao -= quantum;

                    if (processos[m].tempo_execucao > 0)
                        tempo_atual = cellLength + sobrecarga;
                    else {
                        tempo_atual = cellLength;
                        processos[m].visitado = true;
                    }

                    console.log(soma);
                }

                else
                    tempo_atual++;


            }

            else {
                //console.log(m);
                tempo_atual++;
            }

            i++;
        }

    }




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

    criarDisco();
    criarRam();

    escalonarProcessos();
}