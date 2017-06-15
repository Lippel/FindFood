angular.module('starter.controllers', [])

.controller('AppCtrl', function (AppModel, Backand, $scope, $ionicModal, $timeout) {
    var app = this;
    $scope.loginData = {};

    $scope.currentUser = null;

    //Define o usuário que está logado no sistema
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
      app.usuarioLogado = user;
      console.log("das: " + app.usuarioLogado.admin);
    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Abre o formulário de login
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        //chamada ao controller o requisição de login
        AppModel.login($scope.loginData.username, $scope.loginData.password)
              .then(function (result){
                $scope.setCurrentUser(result.data[0]);
                app.usuario = result.data[0];
              });

        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    $scope.cadUser = function() {
        window.location.href = "#/app/cadUsuario";
        $scope.closeLogin();
    };
})


.controller('CadUserCtrl', function (UsuariosModel, $scope) {
    var cu = this;
    $scope.input = {};

    function create(object) {
        if (validaCampos()) {
            UsuariosModel.create(object)
            alert("Cadastro efetuado com sucesso!")
        }
    }
    cu.login = function () {
        UsuariosModel.login();
    };

    cu.create = create;

    // Funções de validação de campos do cadastro de usuário
    function validaCampos() {
        if (formUsuario.nome.value == "") {
            alert("Preencha o campo Nome");
            return false;
        } else if (!validacaoEmail(formUsuario.email)) {
            return false;
        } else if (formUsuario.senha.value == "") {
            alert("Preencha o campo Senha");
            return false;
        } else if (formUsuario.senha.value != formUsuario.confirmaSenha.value) {
            alert("As senhas digitadas nao conferem");
            return false;
        } else {
            return true;
        }

    }

    function validacaoEmail(field) {
        usuario = field.value.substring(0, field.value.indexOf("@"));
        dominio = field.value.substring(field.value.indexOf("@") + 1, field.value.length);

        if ((usuario.length >= 1) &&
            (dominio.length >= 3) &&
            (usuario.search("@") == -1) &&
            (dominio.search("@") == -1) &&
            (usuario.search(" ") == -1) &&
            (dominio.search(" ") == -1) &&
            (dominio.search(".") != -1) &&
            (dominio.indexOf(".") >= 1) &&
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
            return true;
        }
        else {
            alert("Email invalido");
            return false;
        }
    }

})

//Controlador do busca de restaurantes
.controller('SearchCtrl', function (EstabelecimentosModel, $scope, $state, $cordovaGeolocation) {

    var options = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        console.log("latitude: " + position.coords.latitude + " longitude: " + position.coords.longitude);

        //objeto utiizado para criação das rotas
        var routeDirection = new google.maps.DirectionsRenderer();

        var directionsService = new google.maps.DirectionsService();

        //Busca as coordenadas da posição atual do usuário
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.search = new google.maps.Map(document.getElementById("mapa"), mapOptions);
        routeDirection.setMap($scope.search);

        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.search,
            title: "Você está aqui!",
            icon: 'img/handUP.png'
        });

        var infowindow = new google.maps.InfoWindow(), marker;


        //------------ teste
          /*
        enderecoChegada = new google.maps.LatLng(-26.905465, -49.038898);

        var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
           origin: latLng, // origem
           destination: enderecoChegada, // destino
           travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
        };

        directionsService.route(request, function(result, status) {
           if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
              routeDirection.setDirections(result); // Renderizamos no mapa o resultado
           }
        });
            */
        //---- fim tste

        // Marcação de estabelecimentos cadastrados no app
        EstabelecimentosModel.all().then(function success(est) {
            var estabelecimento = est;

            estabelecimento.forEach(function (value, index) {

                //Icones de mapas
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.latitude, value.longitude),
                    map: $scope.search,
                    title: value.nome,
                    icon: 'img/marrker.png',
                });

                infowindow = new google.maps.InfoWindow(), marker;

                /*
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent('<b>' + value.nome + '</b>' + '<br>' + value.descricao + '<br>' + value.telefone
                                             + '<input type="button" onclick="funcao()" value="Rota"/>');

                        infowindow.open($scope.search, marker);
                    }
                }(marker)));
                */

                // Eventos marker
                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        infowindow.setContent('<b>' + value.nome + '</b>' + '<br>' + value.descricao + '<br>' + value.telefone);
                        infowindow.open($scope.search, marker);
                    }
                })(marker))

                google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
                    return function () {
                        infowindow.close($scope.search, marker);
                    }
                })(marker))

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        (window.location.href = "#/app/estabelecimentos/" + value.id).ready;
                    }
                })(marker))
            });
        });
    });
})

.controller('CadEstabCrtl', function (EstabelecimentosModel, AvaliacoesModel, $scope, $stateParams) {
    var ce = this;
    $scope.input = {};

    $scope.estabelecimentoId = $stateParams.id;
    ce.usuarioLogado = $scope.currentUser;

    function getAll() {
        EstabelecimentosModel.all()
            .then(function (result) {
                ce.data = result;
            });
    }

    function getById(){
      EstabelecimentosModel.fetch($scope.estabelecimentoId)
          .then(function (result) {
              ce.data = result;
          });
    }

    function create(object) {
        EstabelecimentosModel.create(object)
        alert("Restaurante cadastrado!")
    }

    function isCurrent(id) {
        return ce.edited !== null && ce.edited.id === id;
    }

    function update(object) {
        EstabelecimentosModel.update(object.id, object)
            .then(function (result) {
                cancelEditing();
                getAll();
            });
    }

    function deleteObject(id) {
        EstabelecimentosModel.delete(id)
            .then(function (result) {
                cancelEditing();
                getAll();
            });
    }

    function setEdited(object) {
        ce.edited = angular.copy(object);
        ce.isEditing = true;
    }

    function cancelEditing() {
        ce.edited = null;
        ce.isEditing = false;
    }

    function getAvaliacoesEstab() {
        AvaliacoesModel.avaliacoesEstab($scope.estabelecimentoId)
            .then(function (result) {
                ce.avaliacao = result;
            });
    }

    ce.getAvaliacoesEstab = getAvaliacoesEstab;

    //ESTABELECIMENTOS
    ce.objects = [];
    ce.create = create;
    ce.edited = null;
    ce.isCurrent = isCurrent;
    ce.getAll = getAll;
    ce.isEditing = false;
    ce.isCreating = false;
    ce.update = update;
    ce.delete = deleteObject;
    ce.setEdited = setEdited;
    ce.cancelEditing = cancelEditing;

    getAll();

    if ($scope.estabelecimentoId != null) {
      getById();

      getAvaliacoesEstab();
    }
})

.controller('AvaliacoesCtrl', function (AvaliacoesModel, UsuariosModel, $scope, $stateParams, $rootScope) {
    var avas = this;
    $scope.input = {};

    //Retorna o ID da avaliação retornado pela URL
    $scope.avaliacaoId = $stateParams.id;

    function getAll() {
        AvaliacoesModel.all()
            .then(function (result) {
                avas.avaliacoes = result;
            });
    }

    function getById(){
      AvaliacoesModel.fetch($scope.avaliacaoId)
          .then(function (result) {
              avas.avaliacao = result;
              getUsuarioById(result.usuario);
          });
    }

    function getUsuarioById(pUsuario){
      UsuariosModel.fetch(pUsuario)
          .then(function (result) {
              avas.usuario = result;
          });
    }

    function create(object) {
            AvaliacoesModel.create(object)
            alert("Avaliação cadastrada!")
    }

    function isCurrent(id) {
        return avas.edited !== null && avas.edited.id === id;
    }

    function update(object) {
        AvaliacoesModel.update(object.id, object)
            .then(function (result) {
                cancelEditing();
                getAll();
            });
    }

    function deleteObject(id) {
        AvaliacoesModel.delete(id)
            .then(function (result) {
                cancelEditing();
                getAll();
            });
    }

    function setEdited(object) {
        avas.edited = angular.copy(object);
        avas.isEditing = true;
    }

    function cancelEditing() {
        avas.edited = null;
        avas.isEditing = false;
    }

    //AVALIAÇÕES
    avas.objects = [];
    avas.create = create;
    avas.edited = null;
    avas.isCurrent = isCurrent;
    avas.getAll = getAll;
    avas.isEditing = false;
    avas.isCreating = false;
    avas.update = update;
    avas.delete = deleteObject;
    avas.setEdited = setEdited;
    avas.cancelEditing = cancelEditing;
    avas.getById = getById;

    getAll();

    //Retorna registro da avaliação selecionada
    getById();
})

// Controller Cadastro de avaliaçãoes
.controller('CadAvaliacoesCtrl', function (AvaliacoesModel, UsuariosModel, EstabelecimentosModel, $scope, $stateParams, $rootScope) {
    var ca = this;
    $scope.input = {};

    $scope.estabId = $stateParams.idEstab;
    console.log("oito e sete: " + $scope.estabId);

    function create(object) {
            object.estabelecimento = $scope.estabId;
            object.usuario = $scope.currentUser.id;
            AvaliacoesModel.create(object)
              .then(function (result) {
                alert("Avaliação cadastrada!");
          //      window.location.reload(true);
                window.location.href = "#/app/estabelecimentos/" + $scope.estabId;
              });
    }

    function getEstabelecimentoById(){
      EstabelecimentosModel.fetch($scope.estabId)
          .then(function (result) {
              ca.estabelecimento = result;
              ca.estabID = ca.estabelecimento.id;
              console.log('oitooito: ' + ca.estabID );
          });
    }

    ca.objects = [];
    ca.create = create;

    getEstabelecimentoById();

})
