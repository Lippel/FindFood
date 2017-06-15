angular.module('starter.services', [])

    //Serviço responsável pelas requisições de login
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
           }).success(function (response) {
               console.log(response);
               if (response.length != "") {
                   console.log("OK usuário: " + response[0].nome);
                   alert("Login efetuado com sucesso!");
                   return response;
               } else {
                   console.log("NOK")
                   alert("Email ou senha invalidos")
               }

           });

        };

   })

   //Serviço responsável pelas requisições de usuários
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

        service.fetch = function (id) {
            return $http.get(getUrlForId(id)).then(
              function sucess(response) {
                return response.data;
                console.log("nickname: " + response.data);
              });
        };

        service.create = function (usuario) {
             return $http.post(getUrl(), usuario);
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

       service.fetch = function (id) {
           return $http.get(getUrlForId(id)).then(function sucess(response) {
             return response.data;
           });
       };

       service.update = function (id, object) {
           return $http.put(getUrlForId(id), object);
       };

       service.delete = function (id) {
           return $http.delete(getUrlForId(id));
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

   .service('AvaliacoesModel', function ($http, Backand){
      var service = this,
           baseUrl = '/1/objects/',
           objectName = 'avaliacoes/';

      function getUrl() {
           return Backand.getApiUrl() + baseUrl + objectName;
       };

       function getUrlForId(id) {
           return getUrl() + id;
       };

       service.fetch = function (id) {
           return $http.get(getUrlForId(id)).then(function sucess(response) {
             return response.data;
           });
       };

       service.create = function (avaliacao) {
           return $http.post(getUrl(), avaliacao);
       };

       service.avaliacoesEstab = function (pEstabelecimento) {
           return $http({
               method: 'GET',
               url: Backand.getApiUrl() + '/1/query/data/avaliacoesEstab',
               params: {
                   parameters: {
                       estabelecimento: pEstabelecimento,
                   }
               }
             }).then(function sucess(response) {
                 return response.data;
             }, function error(error) {
                 console.log(error);
             });
         };

      service.all = function(){
          return $http({
               method: 'GET',
               url: getUrl()
           }).then(function sucess(response) {
               return response.data.data;
           }, function error(error) {
               console.log(error);
           });
       }

       service.update = function (id, object) {
           return $http.put(getUrlForId(id), object);
       };

   })
