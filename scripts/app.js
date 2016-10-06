// Define the `phonecatApp` module
var ipvApp = angular.module('ipvApp', []);

// Define the `PhoneListController` controller on the `ipvApp` module
ipvApp.controller('IptvController', function IptvController($scope, $http) {
    
    $scope.files =[];
    $http.get('../files/')
    .success(function(data) {
         $(data).find("a:contains(.M3U)").each(function(){
            // will loop through 
             var file ={};
             file.name =this.text
             file.url =this.href
             $http.get(file.url)
             .success(function(res) {
                var lines = res.split("\n");
                file.lines = parseLines(lines);
                $scope.files.push(file);
             });
        });
    });
    
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
                data.status="OFF";
                result.push(data);
            }
        }
        return result;
    };
    
    function getGroup(text) {
        var result = "";
        var map2 = text.split(" ");
        for (j = 0; j < map2.length; j++) { 
            if(map2[j].startsWith("group-title")){
                console.info(map2[j]);
                result = map2[j];
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
