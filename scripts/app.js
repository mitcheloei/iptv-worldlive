// Define the `ipvApp` module
var ipvApp = angular.module('ipvApp', []);

ipvApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

// Added all header request and response.
/*ipvApp.all('/*', function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
    next();
});*/

// Define the `PhoneListController` controller on the `ipvApp` module
ipvApp.controller('IptvController', function IptvController($scope, $http) {
    
    $scope.files =[];
    $http.get('../files/')
    .success(function(data) {
        $(data).find("a:contains(.M3U)").each(function(){
            // will loop through 
             var file ={};
             file.id=this.text.split(".")[0];
             file.name =this.text
             file.url = this.href
             file.show = false;
             $http.get(file.url)
             .success(function(res) {
                var lines = res.split("\n");
                file.lines = parseLines(lines);
                $scope.files.push(file);
             });
        });
    });
    
    $scope.toggler = function(data) {
        data.show = !data.show;
    };
    
    function parseLines(lines) {
        var result = [];
        for (i = 0; i < lines.length; i++) { 
            var line = lines[i];
            if(line && line.startsWith("#EXTINF:-1")){
                var data = {};
                line = line.substr(11);
                var map = line.split(",");
                data.name=map[1];
                data.group=getGroup(map[0]);
                data.image = '../img/loading.gif';
                setStatus(data,lines[i+1]);
                result.push(data);
            }
        }
        return result;
    };
    
    function setStatus(data,url) {
        var result = "";
        if(url){
            $http.head('http://crossorigin.me/'+url).
                success(function(res, status, headers, config) {
                    if(status==200 &&headers()["content-type"]=="video/mp4"){
                        data.status = "ON";
                        data.image = '../img/ok.png';
                    }else{
                        data.status = "OFF";
                        data.image = '../img/ko.png';
                    }
                })
                .error(function(res, status, headers, config) {
                    data.status = "OFF";
                    data.image = '../img/ko.png';
                });
        }
    };
    
    function getGroup(text) {
        var result = "";
        var map2 = text.split(" ");
        for (j = 0; j < map2.length; j++) { 
            if(map2[j].startsWith("group-title")){
                result = map2[j].split("\"",3)[1];
           }
        }
        return result;
    };
    

    
    $scope.iptvs = [
        {
          name: 'Nexus S',
          group: 'Fast just got faster with Nexus S.',
          status: 'ON'
        }, {
          name: 'Motorola XOOM™ with Wi-Fi',
          group: 'The Next, Next Generation tablet.',
          status: 'ERROR'
        }, {
          name: 'MOTOROLA XOOM™',
          group: 'The Next, Next Generation tablet.',
          status: 'OFF'
        }
    ];

});
