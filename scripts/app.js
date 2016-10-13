// Define the `ipvApp` module
var ipvApp = angular.module('ipvApp', []);

// Define the `PhoneListController` controller on the `ipvApp` module
ipvApp.controller('IptvController', function IptvController($scope, $http) {
    
    $scope.files =[];
    
    $scope.toggler = function(data) {
        data.show = !data.show;
    };
    
    $http.get('../files/')
    .success(function(data) {
        $(data).find("a:contains(.M3U)").each(function(){
            // will loop through 
             var file ={};
             file.id=this.text.split(".")[0];
             file.name =this.text
             file.url = this.href
             file.show = false;
             file.numberOn=0;
             file.numberOff=0;
             $http.get(file.url)
             .success(function(res) {
                var lines = res.split("\n");
                file.lines = parseLines(lines,file);
                $scope.files.push(file);
             });
        });
    });
    
    function parseLines(lines,file) {
        var result = [];
        for (i = 0; i < lines.length; i++) { 
            var line = lines[i];
            if(line && line.startsWith("#EXTINF:-1")){
                var data = {};
                line = line.substr(11);
                var map = line.split(",");
                data.name=map[1];
                data.group=getGroup(map[0]);
                data.logo=getLogo(map[0]);
                data.url=lines[++i];
                data.statusimage = '../img/loading.gif';
                setStatus(data,file);
                result.push(data);
            }
        }
        return result;
    };
    
    function setStatus(data,file) {
        var result = "";
        var url = data.url;
        if(url){
            $http.head('http://crossorigin.me/'+url).
                success(function(res, status, headers, config) {
                    if(status==200 && validateHeaderType(headers()["content-type"])){
                        data.status = status;
                        data.statusimage = '../img/ok.png';
                        file.numberOn=file.numberOn+1;
                    }else{
                        data.status = status;
                        data.statusimage = '../img/ko.png';
                        file.numberOff = file.numberOff+1;
                    }
                })
                .error(function(res, status, headers, config) {
                    data.status = status;
                    data.statusimage = '../img/ko.png';
                    file.numberOff = file.numberOff+1;
                });
        }
    };
    
    function validateHeaderType(type){
        var result=false;
        var types = ["application/x-mpegurl",
                     "application/vnd.apple.mpegurl",
                     "video/mp4"
                    ];
        if(types.indexOf(type)>=0){
            result = true;
        }
        return result;
    }
    
    function getGroup(text) {
        var result = "";
        var index = text.indexOf("group-title");
        if(index>=0){
            result = text.substr(index).split("\"",2)[1];
        }
        return result;
    };
    
    function getLogo(text) {
        var result = "";
        var index = text.indexOf("tvg-logo");
        if(index>=0){
            result = text.substr(index).split("\"",2)[1];
        }
        console.info(result);
        return result;
    };

});
