var btnMenu = document.getElementById("btnMenu");
var navLista = document.querySelector("nav ul");

btnMenu.addEventListener("click", function() {
  navLista.classList.toggle("aberto");
});



var btnClima = document.getElementById("btnClima");
var resultadoClima = document.getElementById("resultadoClima");

btnClima.addEventListener("click", function() {
  var cidade = document.getElementById("inputCidade").value.trim();

  if (cidade === "") {
    resultadoClima.className = "resultado visivel";
    resultadoClima.innerHTML = "<p class='mensagem-erro'>Digite o nome de uma cidade.</p>";
    return;
  }

  resultadoClima.className = "resultado visivel";
  resultadoClima.innerHTML = "<p class='carregando'>Buscando...</p>";

  var urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(cidade) + "&count=1&language=pt&format=json";

  fetch(urlGeo)
    .then(function(resposta) {
      return resposta.json();
    })
    .then(function(dados) {
      if (!dados.results || dados.results.length === 0) {
        resultadoClima.innerHTML = "<p class='mensagem-erro'>Cidade não encontrada. Tente outro nome.</p>";
        return;
      }

      var local = dados.results[0];
      var lat = local.latitude;
      var lon = local.longitude;
      var nomeCidade = local.name;
      var pais = local.country;

      var urlClima = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&timezone=auto";

      return fetch(urlClima)
        .then(function(resposta) {
          return resposta.json();
        })
        .then(function(dadosClima) {
          var clima = dadosClima.current_weather;
          var temp = clima.temperature;
          var vento = clima.windspeed;
          var codigo = clima.weathercode;

          var descricao = traduzirCodigo(codigo);

          resultadoClima.innerHTML =
            "<h3>" + nomeCidade + ", " + pais + "</h3>" +
            "<p>🌡 Temperatura: <strong>" + temp + " °C</strong></p>" +
            "<p>🌤 Condição: <strong>" + descricao + "</strong></p>" +
            "<p>💨 Vento: <strong>" + vento + " km/h</strong></p>";
        });
    })
    .catch(function() {
      resultadoClima.innerHTML = "<p class='mensagem-erro'>Erro ao buscar dados. Verifique sua conexão.</p>";
    });
});

function traduzirCodigo(codigo) {
  if (codigo === 0) return "Céu limpo";
  if (codigo <= 2) return "Parcialmente nublado";
  if (codigo === 3) return "Nublado";
  if (codigo <= 49) return "Neblina";
  if (codigo <= 59) return "Garoa";
  if (codigo <= 69) return "Chuva";
  if (codigo <= 79) return "Neve";
  if (codigo <= 82) return "Pancadas de chuva";
  if (codigo <= 99) return "Tempestade";
  return "Indisponível";
}



var btnCep = document.getElementById("btnCep");
var resultadoCep = document.getElementById("resultadoCep");

btnCep.addEventListener("click", function() {
  var cep = document.getElementById("inputCep").value.trim().replace(/\D/g, "");

  if (cep.length !== 8) {
    resultadoCep.className = "resultado visivel";
    resultadoCep.innerHTML = "<p class='mensagem-erro'>CEP inválido. Digite 8 números.</p>";
    return;
  }

  resultadoCep.className = "resultado visivel";
  resultadoCep.innerHTML = "<p class='carregando'>Buscando...</p>";

  fetch("https://viacep.com.br/ws/" + cep + "/json/")
    .then(function(resposta) {
      return resposta.json();
    })
    .then(function(dados) {
      if (dados.erro) {
        resultadoCep.innerHTML = "<p class='mensagem-erro'>CEP não encontrado.</p>";
        return;
      }

      resultadoCep.innerHTML =
        "<h3>CEP: " + dados.cep + "</h3>" +
        "<p> Logradouro: <strong>" + (dados.logradouro || "—") + "</strong></p>" +
        "<p> Bairro: <strong>" + (dados.bairro || "—") + "</strong></p>" +
        "<p> Cidade: <strong>" + dados.localidade + " - " + dados.uf + "</strong></p>";
    })
    .catch(function() {
      resultadoCep.innerHTML = "<p class='mensagem-erro'>Erro ao buscar CEP. Verifique sua conexão.</p>";
    });
});




var form = document.getElementById("formContato");

form.addEventListener("submit", function(evento) {
  evento.preventDefault();

  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;
  var telefone = document.getElementById("telefone").value;
  var mensagem = document.getElementById("mensagem").value;

  var valido = true;

  document.getElementById("erroNome").textContent = "";
  document.getElementById("erroEmail").textContent = "";
  document.getElementById("erroTelefone").textContent = "";
  document.getElementById("erroMensagem").textContent = "";

  if (nome.length < 3) {
    document.getElementById("erroNome").textContent = "Nome deve ter pelo menos 3 caracteres.";
    valido = false;
  }

  if (email === "" || email.indexOf("@") === -1) {
    document.getElementById("erroEmail").textContent = "Informe um e-mail válido.";
    valido = false;
  }

  if (telefone === "") {
    document.getElementById("erroTelefone").textContent = "Telefone é obrigatório.";
    valido = false;
  }

  if (mensagem.length < 10) {
    document.getElementById("erroMensagem").textContent = "Mensagem deve ter pelo menos 10 caracteres.";
    valido = false;
  }

  if (valido) {
    document.getElementById("sucesso").style.display = "block";
    form.reset();
  }
});
