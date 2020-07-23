//Oficina de Sintese de Som
//*** App Config e oustras funcoes.. ***
let time = 0;
let meiaTela;
let iconesNum = 0;
let espacoIcones = 0;
let volume = 100;
let userName;
//Numero de linhas e Colunas para Icones
let col = 4;
let lin = 5;
let xPosIcone = [];
let yPosIcone = [];
let diamIcone;
//Config Cores
let cor1;
let cor1a;
let cor2;
let cor2a;
let cor3;
let cor3s;

let oscilador = [];

function setup() {

  userName = document.querySelector('#userName');

  //Config Cores
  cor1 = color(255, 165, 0); //Orange
  cor1a = [255,165,0];
  cor2 = color(252, 252, 252); //Whitish grey
  cor2a = [252,252,252];
  cor3 = color(0, 0, 0); //Black
  cor3a = [0, 0, 0];
  cor3s = color(0, 0, 0, 50); //Black
  //Dimensoes Tela
  tela = createCanvas(displayWidth , displayHeight-115);
  tela.parent('jsHolder');
  tela.style('display', 'block');

  meiaTela = width/2;

  for(var y = 0; y < lin; y++){
    for(var x = 1; x < col+1; x++){
      xPosIcone[espacoIcones] = (meiaTela/1.15) + ((meiaTela/col)*(x));
      yPosIcone[espacoIcones] = height/lin*(y+1)+(y*10)-40;
      espacoIcones += 1;
    }
  }

  diamIcone = (width/2)/(col+2);
  //Oscilador
  //oscilador[0] = new OSC();

}
function checkColor(){

  //Config Cores
  cor1 = color(255, 165, 0); //Orange
  cor1a = [255,165,0];
  cor2 = color(252, 252, 252); //Whitish grey
  cor2a = [252,252,252];
  cor3 = color(0, 0, 0); //Black
  cor3a = [0, 0, 0];
  cor3s = color(0, 0, 0, 50); //Black

  select("body").style('background-color',cor1);
  select("mark").style('background-color',cor3);
  select("mark").style('color',cor1);
  select("label").style('color',cor1);
  select("#userName").style('background-color',cor1);
  select("#userName").style('color',cor3);
  select("#userName").style('border-bottom: 6px solid '+cor3+';');
  select("input").style("color", cor3);
  select("input").style('border-bottom: 6px solid '+cor3+';');
  select("input").style('background-color',cor1);
  select("button").style('color',cor2);
  select("button").style('background-color',cor3);
  select("button").style('border-bottom: 4px solid '+cor1+';');

}

function draw() {

  background(cor2);

  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].connectOutOSC(oscilador[i].outSelector.value());
    checkModulation();
    oscilador[i].drawOSCControl();
  }

  //background da Tela Oficina
  fill(cor1); //Orange
  noStroke();
  rectMode(CORNER);
  rect(meiaTela,0,meiaTela,height);

  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].drawOSC(String(i));
  }

  if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
  }
}

function checkModulation() {
  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].inputValue = parseInt(oscilador[i].inputNum.value());
    if (oscilador[i].inSelector.value() === 'Frequência'
     && oscilador[i].inputNum.value() !== ""
     && oscilador[i].inputNum.value() < oscilador.length
     && oscilador[i].inputNum.value() >= 0
   ) {
      oscilador[i].osc.freq(oscilador[oscilador[i].inputValue].osc);
    } else if (oscilador[i].inSelector.value() === 'Amplitude'
     && oscilador[i].inputNum.value() !== ""
     && oscilador[i].inputNum.value() < oscilador.length
     && oscilador[i].inputNum.value() >= 0
   ) {
      oscilador[i].osc.amp(oscilador[oscilador[i].inputValue].osc);
    }
  }
}
function addDiv(){
  // janelaAddNone();
  // oscilador.push(new OSC(xPosIcone[iconesNum],yPosIcone[iconesNum],diamIcone,"div",1));
  // oscilador[iconesNum].oscSetFreq(0., 40.);
  // iconesNum += 1;
}
function addOSC(){
  janelaAddNone();
  //oscilador.push(new OSC(xPosIcone[iconesNum/1-1],yPosIcone[iconesNum/1-1],diamIcone));
  oscilador.push(new OSC(xPosIcone[iconesNum],yPosIcone[iconesNum],diamIcone,"osc",0));
  oscilador[iconesNum].oscSetFreq(0., 400.);
  iconesNum += 1;
}

function delOSC(){
  for (var i = 0; i < oscilador.length; i++) {
    if (oscilador[i].OSCSelecionado) {
      for (var j = i+1; j < oscilador.length; j++) {
        oscilador[j].xPos = xPosIcone[j-1];
        oscilador[j].yPos = yPosIcone[j-1];
      }
      if(oscilador[i].tipo == 0){
        oscilador[i].osc.stop();
        oscilador[i].outSelector.remove();
        oscilador[i].inSelector.remove();
        oscilador[i].outLabel.remove();
        oscilador[i].inLabel.remove();
        oscilador[i].inputNum.remove();
      }
      oscilador.splice(i,1);
      iconesNum -= 1;
    }
  }
}
function touchStarted() {
  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].checkOSCSelecionado();
    oscilador[i].knobF.active();
    oscilador[i].knobA.active();
    oscilador[i].seletorDeOnda();
  }
}
function touchEnded() {
  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].knobF.inactive();
    oscilador[i].knobA.inactive();
  }
}
function mousePressed() {
  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].checkOSCSelecionado();
    oscilador[i].knobF.active();
    oscilador[i].knobA.active();
    oscilador[i].seletorDeOnda();
  }
}
function mouseReleased() {
  for (var i = 0; i < oscilador.length; i++) {
    oscilador[i].knobF.inactive();
    oscilador[i].knobA.inactive();
  }
}
function windowResized() {
  tela = resizeCanvas(windowWidth, windowHeight);
}
function FullScreen(){
  let fs = fullscreen();
    fullscreen(!fs);
}

function keyPressed() {

  if (keyCode === DELETE) {
    delOSC();
  }

}
function abrirMenu() {
  let telaAbertura = document.querySelector('#abertura');
  let telaOficina = document.querySelector('#jsHolder');
  let botoes = document.querySelector('#botoes');

  let menu = document.querySelector('#menuUser');
  let openUser = document.querySelector('#openUser');
  userName.innerHTML = "Olá " + document.querySelector('#userNameInput').value + "!";
  userName.style.opacity = 1;
  openUser.style.display = 'none';
  telaAbertura.style.display = 'block';
  telaOficina.style.display = 'none';
  botoes.style.display = 'none';
  menu.style.display = 'inline-block';
}
function janelaAddBlock() {
  let fechaAdd = document.querySelector("#fechaAdd");
  fechaAdd.style.display = "block";
  let janelaAdd = document.querySelector("#janelaAdd");
  janelaAdd.style.display = "block";
}
function janelaAddNone(){
  let fechaAdd = document.querySelector("#fechaAdd");
  fechaAdd.style.display = "none";
  let janelaAdd = document.querySelector("#janelaAdd");
  janelaAdd.style.display = "none";
}
function abrirOficina() {
  let telaAbertura = document.querySelector('#abertura');
  let telaOficina = document.querySelector('#jsHolder');
  let botoes = document.querySelector('#botoes');

  telaAbertura.style.display = 'none';
  telaOficina.style.display = 'block';
  botoes.style.display = 'block';
}
