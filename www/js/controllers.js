angular.module('starter.controllers', [])

.controller('AppCtrl', function (AppModel, Backand, $scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

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

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    /*
    function login(pEmail, pSenha) {
        console.log('login APp')
        AppModel.login();
    }; */

   // app.login = login;

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        AppModel.login($scope.loginData.username, $scope.loginData.password);

        /*
        if ($scope.loginData.username == "thiago_lippel@hotmail.com" && $scope.loginData.password == "admin") {
            alert("Login efetuado com sucesso!");
        } else {
            alert("Usuario ou senha invalidos")
        }*/
        
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
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

    // Funções de validação de campos
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

.controller('CadEstabCrtl', function (EstabelecimentosModel, $scope) {
    var ce = this;
    $scope.input = {};

    function create(object) {
        EstabelecimentosModel.create(object)
        alert("Restaurante cadastrado!")              
    }

    ce.create = create;

})

.controller('SearchCtrl', function (EstabelecimentosModel, $scope, $state, $cordovaGeolocation) {
    var options = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        console.log(position.coords.latitude)

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.search = new google.maps.Map(document.getElementById("mapa"), mapOptions);

        // Marcação de pontos cadastrados no mapa 
        EstabelecimentosModel.all().then(function success(est) {
            var estabelecimento = est;            

            estabelecimento.forEach(function (value, index) {              

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(value.latitude, value.longitude),
                    map: $scope.search,
                    title: value.nome,
                    icon: 'img/chapeu.png',                    
                });

                var infowindow = new google.maps.InfoWindow(), marker;

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
                        alert('clicou');
                        window.location.href = "#/app/cadUsuario";
                    }
                })(marker))
            })
        });

    }, function (error) {
        console.log("Não foi possível identificar sua localização");
    });



})
