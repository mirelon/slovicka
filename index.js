Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)]
}

class Preklad {
  constructor(slovo, preklad) {
    this.slovo = slovo;
    this.preklad = preklad;
    this.pocet = 1;
  }
}

class Slovnik {
  constructor(preklady) {
    this.preklady = preklady;
  }

  sample() {
    this.current = this.preklady.sample()
  }

  dobre() {
    if (this.current.pocet > 1) {
      this.current.pocet--;
    } else {
      var index = this.preklady.indexOf(this.current);
      if (index > -1) {
        this.preklady.splice(index, 1);
      }
    }
  }

  zle() {
    this.current.pocet++;
  }

  isFinished() {
    return this.preklady.every(function(preklad) {preklad.pocet == 0});
  }
}

function parseInput() {
  var lines = $('textarea').val().split('\n');
  var preklady = lines.filter(function(line){return line.length > 0}).map(function(line){
    slova = line.split(',');
    if (slova.length > 2) {
      throw 'Riadok: ' + line + ' má viac ako jednu čiarku';
    } else if (slova.length == 1) {
      throw 'Riadok: ' + line + ' nemá žiadnu čiarku';
    } else {
      return new Preklad(slova[0], slova[1]);
    }
  });
  var slovnik = new Slovnik(preklady);
  return slovnik;
}

var slovnik;

function finishOrDalsieSlovo() {
  if (slovnik.isFinished()) {
    finish();
  } else {
    dalsieSlovo();
  }
}

function finish() {
  $('#step2').slideUp(function(){$('#step3').slideDown();});
}

function dalsieSlovo() {
  console.log('dalsieSlovo');
  slovnik.sample();
  $('#slovo').html(slovnik.current.slovo);
  $('#preklad').val('');
  $('#preklad').focus();
}

function checkCorrect(keyCode) {
  console.log('check' + keyCode.toString());
  var userEntered = $('#preklad').val();
  if (userEntered == slovnik.current.preklad) {
    slovnik.dobre();
    $('#preklad').css('background-color', 'lightgreen');
    setTimeout(function(){
      console.log('timeout');
      $('#preklad').css('background-color', '');
      finishOrDalsieSlovo();
    }, 1000);
  } else if (keyCode == 13) {
    slovnik.zle();
    $('#preklad').css('background-color', 'red');
    setTimeout(function(){
      console.log('timeout');
      $('#preklad').css('background-color', '');
      dalsieSlovo();
    }, 1000);
  }  
}

$(function() {
  var placeholder = '';
  var textAreas = document.getElementsByTagName('textarea');

  Array.prototype.forEach.call(textAreas, function(elem) {
      elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
  });

  $('#start').click(function(){
    slovnik = parseInput();
    $('#step1').slideUp(function() {$('#step2').slideDown(function() {
      finishOrDalsieSlovo();
    });});
    
  });

  $('#preklad').keyup(function(event){
    checkCorrect(event.keyCode);
  });

});