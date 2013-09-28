/*

  we are in private scope (component.io)
  
*/
require('digger-viewer-for-angular');

angular
  .module('digger.viewer', [
    
  ])


  .directive('diggerViewer', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'='
      },
      replace:true,
      template:template,
      controller:function($scope){


      	$scope.tabmode = 'form';
        
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }

          $scope.children = container.children().containers();
        })
      }
    }
  })