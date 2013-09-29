/*

  we are in private scope (component.io)
  
*/
var template = require('./template');

angular
  .module('digger.viewer', [
    
  ])


  .directive('diggerViewer', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'=',
        iconfn:'='
      },
      replace:true,
      template:template,
      controller:function($scope){

      	$scope.tabmode = 'children';

        $scope.geticon = function(container){
          return $scope.iconfn ? $scope.iconfn(container) : 'icon-file';
        }

        $scope.setmode = function(mode){
          $scope.tabmode = mode;
          $scope.deletemode = false;
        }
        
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }

          $scope.children = container.children().containers();

          $scope.deletemode = false;
          if($scope.children.length>0){
            $scope.showchildren = true;
          }
          else{
            $scope.showchildren = false; 
          }

          if(!$scope.showchildren){
            $scope.tabmode='details';
          }
        })

        $scope.deletemode = false;
        $scope.deletecontainer = function(confirm){
          if(!confirm){
            $scope.deletemode = true;
          }
          else{
            $scope.$emit('viewer:remove');
          }
        }

        $scope.savecontainer = function(){
          $scope.$emit('viewer:save');
        }
      }
    }
  })