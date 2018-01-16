/* eslint no-alert: 0 */

'use strict';

var app = angular.module('MobileAngularUiExamples', [
  // 'ngRoute',
  'ui.knob',
  'ngWebSocket',
  'mobile-angular-ui',
  'angular.directives-round-progress',
  'mobile-angular-ui.gestures'
]);

//***********************                   WEBSOCKET             **************************************/ 
//***********************                   WEBSOCKET             **************************************/ 

app.factory('MyData', function($websocket){
  
  // var dataStream = $websocket('wss://serene-depths-49662.herokuapp.com');
  var dataStream = $websocket('ws://127.0.0.1:1337');

  var collection = [];
  var Errors = [];
  
  var clientbalance = [];
  var clientfullname = [];

  ////////////////////////////////////////////////////// RECEIVING
  
  dataStream.onMessage(function(message) {

    var jsondata = JSON.parse(message.data);

    if(jsondata.type === 'serverclock'){
      collection.push(jsondata.data);
    }
    else if(jsondata.type === 'Errors'){     
      Errors.push(jsondata.data);
    }
    else if(jsondata.type === 'bo_balance'){
      clientbalance[0] = (jsondata.data);
    }
    else if(jsondata.type === 'bo_fullname'){
      clientfullname[0] = (jsondata.data);
    }

  });
  
  //////////////////////////////////////////////// SENDING
  var methods = {
    collection: collection,
    clientbalance: clientbalance,
    clientfullname: clientfullname,
    Errors: Errors,
    getBalance: function() {
      dataStream.send(JSON.stringify({ action: 'getBalance' })); // json call to local receiver to query binary.com
    },
    connectToBinary: function() {
      dataStream.send(JSON.stringify({ action: 'connect2binarycom' })); // json call to local receiver to query binary.com
    },
    startServerClock: function() {
      dataStream.send(JSON.stringify({ action: 'serverclock' }));
    }
  };
  
  return methods;
  
});

//***********************                   MainController             **************************************/ 
/************************                   MainController             **************************************/
/************************                   MainController             **************************************/
/*************************                   MainController             **************************************/

app.controller('MainController', function($rootScope, $scope, $http, $location, $timeout, MyData) {
  
  var countie = 0;
  var isConnected = false;
  var beat = false;
  $scope.MySecs = 0;

  var counterrors = 0;
  var ter = -2;
  var connectimer;

  $scope.connectdisplay = "Connect";
  $scope.panelheading = "Welcome";
  $scope.lorem = 'Click Connect to start trading.';

  $scope.getConnected = function() {
    

    if($scope.connectdisplay == "Disconnect"){
      clearInterval(connectimer);
      $scope.connectdisplay = "Connect";
      $scope.panelheading = "Welcome.";
      $scope.MySecs = 0;
      $scope.lorem = 'Click Connect to start trading.';
      ter = -1;
      $scope.value = 0;
    }
    else if($scope.connectdisplay == "Connect"){
      connectimer = setInterval(function(){ startInternalClock() }, 1000);
      MyData.connectToBinary();
      $scope.connectdisplay = "Connecting ...";

      $scope.value = 10;
    }
 };

  function startInternalClock(){
    ter++;
    
    if(MyData.Errors.length > 0){
      counterrors++;
      $scope.lorem = MyData.Errors[0];
      $scope.panelheading = "Error";
      MyData.Errors.shift();
      $scope.connectdisplay = "Connect ("+ counterrors + ")";
      
    }else {
    
      $scope.MySecs =  MyData.collection[ter];
      
      if($scope.panelheading == "Error"){
        $scope.connectdisplay = "Connect ("+ counterrors + ")";
      }
      else {
        isConnected = true;
        $scope.connectdisplay = "Disconnect"
        $scope.panelheading = "Balance $" + MyData.clientbalance[0];
        $scope.lorem = "Welcome " + MyData.clientfullname[0];
      }
    }
  }

  $scope.countDownsec = 0;   
  $scope.countDownmin = 0;
  $scope.countDownhrs = 0;

  function startheatbeat(){
   
    $scope.timer1 = setInterval(function(){
      $scope.connectdisplay = "Disconnect";
      if(isConnected){
        $scope.countDownsec++;
        $scope.updateProfitBar();
        $scope.updatebalancedb();
        $scope.$apply();
        if($scope.countDownsec == 59) {
          $scope.countDownmin++;
          $scope.countDownmin = $scope.countDownmin%60;
          if($scope.countDownmin == 59){
            $scope.countDownhrs++;
            $scope.countDownhrs = $scope.countDownhrs%24;
          }
          $scope.countDownsec = 0;
        }
        
      }
    }, 1000);  
  }

  function stopConnectTimer1() {
    clearInterval($scope.timer1);
  }

  function stopDisconnectTimer2() {
    clearInterval($scope.timer2);
  }


  $scope.value = 0;
  $scope.profittarget = 0;
  $scope.options = {
    unit: "%",
    readOnly: true,
    subText: {
      enabled: true,
      text: 'Profit',
      color: 'gray',
      font: 'auto'
    },
    trackWidth: 30,
    barWidth: 15,
    trackColor: '#C7DDF7',
    barColor: 'lime'
  };
  

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

   
  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  $scope.updateidx = function(varvalue){

    // if(varvalue =="Profit")
    // else if(varvalue =="Credits")
    //   $scope.lorem = "Credits 4";
  }

  //'Scroll' screen
  var scrollItems = [];

  for (var i = 1; i <= 100; i++) {
    scrollItems.push('Item ' + i);
  }
  
  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  };

  //
  // Right Sidebar
  //
  $scope.chatUsers = [
    {name: 'Jenty Mepa', online: true},
    {name: 'Carline Pienaar', online: false},
    {name: 'Jana  Terry', online: false},
    {name: 'Ebony Rice', online: false}
  ];
  $scope.rememberMe = false;

  $scope.pbarvalues;

 
  
  $scope.updateProfitBar = function() {
    if(isConnected){
      $http({
        
        method: 'GET',
        url: 'api/getpbar.php'
        
        }).then(function (response) {
            
            $scope.pbarvalues = response.data;
            var tempbar = $scope.pbarvalues[0].circlebar;
            if(tempbar < 0 ){
              $scope.value = 80;
              $scope.profittarget = 0;
            }else {
              $scope.value = tempbar;
              $scope.profittarget = (($scope.value/100 * 10).toFixed(2))*10;
            }

            if($scope.value >= 100){
              
              
              stopConnectTimer1();
              if(!isConnected){
                $scope.lorem = "Disconnected.";
              }
                
              if(isConnected){
                $scope.lorem = "CONGRATULATIONS! Target reached.";
                $scope.connectdisplay = "Connect";
                $scope.disconnectdisplay = "Disconnected";
              }
            }
        }, function (response) {        
            // on error
            console.log(response.data,response.status);
            
        });
    }else {
      $scope.value = 50;
    }
  };

  $scope.updatebalance;

  $scope.updatebalancedb = function () {
        $http({
            
            method: 'GET',
            url: 'api/getbalance.php'
            
        }).then(function (response) {
            
            $scope.updatebalance = response.data;
    
        }, function (response) {        
            // on error
            console.log(response.data,response.status);
            
        });
    };
    

  $scope.roundProgressData = {
    label:  0,
    percentage: 100
  };

  $scope.login = function() {
    
  $location.path('/home');

  //bo_checkbalance();
  bo_connect();
  
  
  // $http({
  //     url:  'api/validatelogin.php',
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/x-www-urlencoded'
  //     },
  //     data: 'username='+Username+'&password='+Password
  // }).then(function(response){
  //   console.log(response.data);
  //    $location.path('/home');
  // })

  
};
  //
  // 'Drag' screen
  //
  $scope.notices = [];


  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1)});
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});

app.directive('toucharea', ['$touch', function($touch) {
  // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.containerRect = elem[0].getBoundingClientRect();
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);
//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem) {
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if (drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function() {
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() {
                scope.$apply(function() {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});
// //
app.directive('carousel', function() {
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function() {
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});



app.run(function($transform) {
  window.$transform = $transform;
});