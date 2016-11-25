angular.module('starter.services', [])

    
   .service('AppModel', function ($http, Backand) {
       var service = this;

       service.login = function (pEmail, pSenha) {
           console.log(pEmail, pSenha);
           return $http({
               method: 'GET',
               url: Backand.getApiUrl() + '/1/query/data/login',
               params: {
                   parameters: {
                       email: pEmail,
                       senha: pSenha
                   }
               }
           }).success(function (param) {               
               console.log(param);
               if (param.length != "") {
                   console.log("OK");
                   alert("Login efetuado com sucesso!");
               } else {
                   console.log("NOK")
                   alert("Email ou senha invalidos")
               }

           });

       };
   })
   
    
   .service('UsuariosModel', function($http, Backand){
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'usuarios/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        };

        function getUrlForId(id) {
            return getUrl() + id;
        };

        service.login = function () {

            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/query/data/login',
                params: {
                    parameters: {
                        email: 'thiago_lippel@hotmail.com',
                        senha: 'admin'
                    }
                }
            }).success(function (param) {
                console.log(param);
                if (param.length != "") {
                    console.log("OK");
                } else {
                    console.log("NOK")
                }                

            });

        };

       service.create = function (usuario) {
            return $http.post(getUrl(), usuario);
        };
    })

   .service('EstabelecimentosModel', function ($http, Backand) {
       var service = this,
           baseUrl = '/1/objects/',
           objectName = 'estabelecimentos/';

       function getUrl() {
           return Backand.getApiUrl() + baseUrl + objectName;
       };

       function getUrlForId(id) {
           return getUrl() + id;
       };

       service.create = function (estabelecimento) {
           return $http.post(getUrl(), estabelecimento);
       };

       service.all = function () {
           return $http({
               method: 'GET',
               url: getUrl()
           }).then(function sucess(response) {
               return response.data.data;
           }, function error(error) {
               console.log(error);
           });
       };

   })