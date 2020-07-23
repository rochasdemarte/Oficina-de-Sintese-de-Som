// Tipos de Icones OSC
// 0 = Oscilador livre com frequencia customizavel
// 1 = DIV

class OSC {

  constructor(xPos, yPos, diam, iconeNome, tipo){

    this.xPos = xPos;
    this.yPos = yPos;
    this.diam = diam;
    this.iconeNome = iconeNome;
    this.tipo = tipo;

    //Seletor de Onda dos Osciladores
    this.OSCSelecionado = false;
    this.waveSeletor = 25; // -25, 0, 25, 50
    this.wSoverUp = true;
    this.wSoverMid = false;
    this.wSoverMid2 = false;
    this.wSoverDown = false;

    this.fft = new p5.FFT();
    this.fftWave = new p5.FFT();
    this.outSelector = createSelect();
    this.outLabel = createElement('label', 'SAÍDA');
    this.inSelector = createSelect();
    this.inLabel = createElement('label', 'MODULAÇÃO');
    this.inputNum = createInput('','number');
    this.inputNum.class('inputNum');
    this.inputValue = "";
    this.OSCInit();

  }

  oscSetFreq(minFreq, maxFreq){
    //Knobs de Frequencia Hz (Pitch) e Amplitude (Volume)
    //MakeKnobC(knobColor, diameter, locx, locy, lowNum, hiNum, defaultNum, numPlaces, labelText, textColor, textPt)
    this.knobF = new MakeKnobC(cor1a, diamIcone, width/10, height-(height/lin), minFreq, maxFreq, 0, 1, 'Freq', cor3a, 15);
    this.knobA = new MakeKnobC(cor1a, diamIcone, width/10*2, height-(height/lin), 0., 1., 0, 2, 'Amp', cor3a, 15);
  }

  OSCInit(){
    if(this.tipo == 0){
      this.osc = new p5.Oscillator();
      this.osc.setType('sine');
      this.osc.freq(0.0);
      this.osc.amp(0);
      this.osc.start();
    } else if(this.tipo == 1){
      this.osc = [];
      for (var i = 0; i < 8; i++) {
        this.osc[i] = new p5.Oscillator();
      }
      for (var i = 0; i < 8; i++) {
        this.osc[i].setType('sine');
      }
      for (var i = 0; i < 8; i++) {
        this.osc[i].freq(0.0);
      }
      for (var i = 0; i < 8; i++) {
        this.osc[i].amp(0);
      }
      for (var i = 0; i < 8; i++) {
        this.osc[i].start();
      }
    }

    //Label Output
    this.outLabel.position(width/10*2.6, height-((height/lin)*1.2));
    //Seletor Output
    this.outSelector.position(width/10*2.6, height-(height/lin));
    this.outSelector.option('Amplificador Geral');
    this.outSelector.option('Desconectada');
    //this.outSelector.changed();
    //Label Input
    this.inLabel.position(width/10*2.6, height-((height/lin)/1.2));
    //Seletor Input
    this.inSelector.position(width/10*2.6, height-((height/lin)/1.5));
    this.inSelector.option('Frequência');
    this.inSelector.option('Amplitude');
    //Seletor InputDigitador
    this.inputNum.position(width/10*2.6, height-((height/lin)/2.1));
  }
  connectOutOSC(out){
    if (this.tipo == 0) {
      if (out === 'Amplificador Geral') {
        this.osc.connect();
      } else if (out === 'Desconectada') {
        this.osc.disconnect();
      }
    } else if (this.tipo == 1) {
      for (var i = 0; i < 8; i++) {
        if (out === 'Amplificador Geral') {
          this.osc[i].connect();
        } else if (out === 'Desconectada') {
          this.osc[i].disconnect();
        }
      }
    }
  }

  seletorDeOnda(){
    if (this.tipo == 0) {
      if (this.wSoverUp) {
        this.waveSeletor = 25;
        this.osc.setType('sine');
      }
      else if (this.wSoverMid) {
        this.waveSeletor = 0;
        this.osc.setType('triangle');
      }
      else if (this.wSoverMid2) {
        this.waveSeletor = -25;
        this.osc.setType('sawtooth');
      }
      else if (this.wSoverDown) {
        this.waveSeletor = -50;
        this.osc.setType('square');
      }
    }
     else if (this.tipo == 1) {
       for (var i = 0; i < 8; i++) {
        if (this.wSoverUp) {
          this.waveSeletor = 25;
          this.osc[i].setType('sine');
        }
        else if (this.wSoverMid) {
          this.waveSeletor = 0;
          this.osc[i].setType('triangle');
        }
        else if (this.wSoverMid2) {
          this.waveSeletor = -25;
          this.osc[i].setType('sawtooth');
        }
        else if (this.wSoverDown) {
          this.waveSeletor = -50;
          this.osc[i].setType('square');
        }
      }
    }
  }

  drawOSCControl(){
    if (this.OSCSelecionado) {

      this.outLabel.style( 'display', 'block');
      this.inLabel.style( 'display', 'block');

      this.outSelector.style( 'display', 'block');
      this.inSelector.style( 'display', 'block');
      this.inputNum.style('display', 'block');

      //Knobs e Osciladores
      textFont('Montserrat');

      if (this.tipo == 0) {
        this.osc.freq(this.knobF.knobValue);
        this.knobF.update();
        this.osc.amp(this.knobA.knobValue);
        this.knobA.update();
      } else if (this.tipo == 1) {
        var divNum = 2;
        for (var i = 0; i < 8; i++) {
          divNum *= (i+1);
          this.osc[i].freq(this.knobF.knobValue/divNum);
          this.knobF.update();
          this.osc[i].amp(this.knobA.knobValue);
          this.knobA.update();
        }
      }

      // analiza a waveform
      this.fftWave.setInput(this.osc);
      this.fft.setInput();
      let waveform = this.fft.waveform();
      let oscWaveform = this.fftWave.waveform();


      noFill();
      beginShape();
      strokeWeight(7);
      for (let i = 0; i < oscWaveform.length; i++) {
        let x = map(i, 0, oscWaveform.length, 0, width/2);
        let y = map(oscWaveform[i], -1, 1, height-(height/2), height/10);
        stroke(cor1);
        vertex(x, y);
      }
      endShape();
      beginShape();
      strokeWeight(5);
      for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length, 0, width/2);
        let y = map(waveform[i], -1, 1, height-(height/2), height/10);
        stroke(cor3);
        vertex(x, y);
      }
      endShape();

      // Seletor de onda no Meio
      if(
        mouseX > (width/8*3.2)-10 &&
        mouseX < (width/8*3.2)+10 &&
        mouseY > (height-(height/lin))-10 &&
        mouseY < (height-(height/lin))+10
      ){
        this.wSoverUp = false;
        this.wSoverMid = true;
        this.wSoverMid2 = false;
        this.wSoverDown = false;
      } else if (
        // Seletor de onda Cima
        mouseX > (width/8*3.2)-10 &&
        mouseX < (width/8*3.2)+10 &&
        mouseY > (height-(height/lin))-30 &&
        mouseY < (height-(height/lin))-10
      ) {
        this.wSoverUp = true;
        this.wSoverMid = false;
        this.wSoverMid2 = false;
        this.wSoverDown = false;
      } else if (
        // Seletor de onda Meio 2
        mouseX > (width/8*3.2)-10 &&
        mouseX < (width/8*3.2)+10 &&
        mouseY > (height-(height/lin))+10 &&
        mouseY < (height-(height/lin))+30
      ) {
        this.wSoverUp = false;
        this.wSoverMid = false;
        this.wSoverMid2 = true;
        this.wSoverDown = false;
      } else if (
        // Seletor de onda Baixo
        mouseX > (width/8*3.2)-10 &&
        mouseX < (width/8*3.2)+10 &&
        mouseY > (height-(height/lin))+30 &&
        mouseY < (height-(height/lin))+50
      ) {
        this.wSoverUp = false;
        this.wSoverMid = false;
        this.wSoverMid2 = false;
        this.wSoverDown = true;
      }

      fill(cor3);
      strokeWeight(2);
      stroke(cor1);
      rectMode(CENTER);
      rect(width/8*3.2, height-(height/lin)+13,10,100,5);

      noStroke();
      fill(cor3s);
      rect(width/8*3.2, height-(height/lin)-(this.waveSeletor),20,20,5);
      fill(cor2);
      rect(width/8*3.2, height-(height/lin)-(this.waveSeletor),17,17,5);
      fill(cor3)

      textAlign(LEFT);
      text('Sine', width/8*3.3, height-(height/lin)-25);
      text('Triangle', width/8*3.3, height-(height/lin));
      text('Sawtooth', width/8*3.3, height-(height/lin)+25);
      text('Square', width/8*3.3, height-(height/lin)+50);
    } else {

        this.outLabel.style( 'display', 'none');
        this.inLabel.style( 'display', 'none');

        this.outSelector.style( 'display', 'none');
        this.inSelector.style( 'display', 'none');
        this.inputNum.style('display', 'none');
    }
  }
  checkOSCSelecionado(){
    if (
      mouseX > this.xPos - this.diam/2 &&
      mouseX < this.xPos + this.diam/2 &&
      mouseY > this.yPos - this.diam/2 &&
      mouseY < this.yPos + this.diam/2
    ){
      this.OSCSelecionado = true;
    } else {
      if (mouseX > width/2){
        this.OSCSelecionado = false;
      }
    }
  }
  drawOSC(num){

    if (this.OSCSelecionado) {
      //Sombra Icone
      noStroke();
      fill(cor3s);
      ellipse(this.xPos,this.yPos,this.diam+4,this.diam+4);

      //Corpo Icone
      strokeWeight(2);
      stroke(cor2);
      fill(cor3s);
      ellipse(this.xPos,this.yPos,this.diam,this.diam);
      noStroke();
      //Texto Icone
      textAlign(CENTER,CENTER);
      textFont('Monoton');
      textSize(33);
      fill(cor3s);
      text('OSC',this.xPos,this.yPos+(this.diam/20)+2);
      fill(cor2);
      text('OSC',this.xPos,this.yPos+(this.diam/20));
      textFont('Montserrat');
      textSize(16);
      textStyle(BOLD);
      fill(cor3s);
      text('OSC '+num,this.xPos,this.yPos+(this.diam/1.6)+2);
      fill(cor2);
      text('OSC '+num,this.xPos,this.yPos+(this.diam/1.6));
      textStyle(NORMAL);
    }
    else {
      //Corpo Icone
      fill(cor2);
      ellipse(this.xPos,this.yPos,this.diam-5,this.diam-5);
      //Texto Icone
      textAlign(CENTER,CENTER);
      textFont('Monoton');
      textSize(30);
      fill(cor1);
      text('OSC',this.xPos,this.yPos+(this.diam/20));
      textFont('Montserrat');
      textSize(14);
      fill(cor2);
      text('OSC '+num,this.xPos,this.yPos+(this.diam/1.6));
    }
  }
}
