/*

  we are in private scope (component.io)
  
*/
var template = require('./template');
var jsontemplate = require('./jsonviewer');
var jsonMarkup = require('json-markup');


angular
  .module('digger.viewer', [
    
  ])

  .directive('diggerJson', function(){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'='        
      },
      replace:true,
      template:jsontemplate,
      controller:function($scope){
        $scope.$watch('container', function(container){
          if(!container){
            return null;
          }

          var clone = JSON.parse(JSON.stringify(container.get(0)));
          delete(clone._children);
          delete(clone._data);
          $scope.model = clone;
        })

        
        

      },

      link:function($scope, elem, $attrs){

        $scope.$watch('model', function(model){
          if(!model){
            return;
          }
          
          var jsonhtml = jsonMarkup(model);
          elem.html(jsonhtml);

        }, true)
      }

    }
  })


  .directive('diggerViewer', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'=',
        iconfn:'=',
        extra_fields:'=',
        settings:'='
      },
      replace:true,
      template:template,
      link:function($scope, elem){
        

        $scope.selectbranchurl = function(){
          var branchtext = elem.find('#branchurl');  
          var branchelem = branchtext.get(0);

          branchelem.focus();
          branchelem.select();
        }

        $scope.selectcontainerurl = function(){
          var branchtext = elem.find('#containerurl');  
          var branchelem = branchtext.get(0);

          branchelem.focus();
          branchelem.select();
        }
      },
      controller:function($scope){

      	$scope.tabmode = 'children';
        $scope.showtab = {};
        $scope.diggeractive = true;

        if($scope.settings.diggeractive!==undefined){
          $scope.diggeractive = $scope.settings.diggeractive;
        }

        $scope.hidedelete = function(){
          if(!$scope.settings){
            return false;
          }

          var mode = $scope.settings.nodelete;

          if(typeof(mode)==='function'){
            return mode();
          }
          else{
            return mode;
          }
        }

        $scope.toggledigger = function(){
          $scope.diggeractive = !$scope.diggeractive;
        }

        $scope.geticon = function(container){
          return $scope.iconfn ? $scope.iconfn(container) : 'icon-file';
        }

        $scope.setmode = function(mode){
          $scope.tabmode = mode;
          $scope.deletemode = false;
        }

        $scope.$on('viewer:mode', function(ev, mode){
          $scope.setmode(mode);
        })

        $scope.$watch('container', function(container){

          if(!container){
            return;
          }

          $scope.children = container.children().containers();

          $scope.deletemode = false;

          var addchildren = $digger.blueprint.get_add_children($scope.blueprint);
          $scope.addchildren = addchildren ? addchildren.containers() : [];
          $scope.showchildren = $digger.blueprint.has_children($scope.blueprint);
          if(container.data('new')){
            $scope.showchildren = false;
          }
          if($scope.settings.showchildren===false){
            $scope.showchildren = false;
          }
          $scope.showdetails = $digger.blueprint ? true : false;
          $scope.edit_container = container;

          if(!$scope.showchildren){
            $scope.tabmode = 'details';
          }

          $scope.container_url = $digger.config.diggerurl + container.diggerurl();
          $scope.container_branch = container.diggerurl();

          $scope.digger_fields = [{
            name:'_digger.tag',
            title:'<tag>'
          },{
            name:'_digger.class',
            type:'diggerclass',
            title:'.class'
          },{
            name:'_digger.id',
            title:'#id'
          }]
        })


        $scope.add_from_blueprint = function(blueprint){
          $scope.$emit('viewer:add', blueprint);
          $scope.addmode = true;
        }

        $scope.deletemode = false;

        $scope.click_container = function(container){
          $scope.$emit('viewer:selected', container);
        }

        $scope.cancelcontainer = function(){
          if(!$scope.addmode){
            $scope.$emit('viewer:cancel');
          }
          else{
            $scope.$emit('viewer:canceladd');  
            $scope.addmode = false;  
          }
          
        }

        $scope.canceldelete = function(){
          $scope.deletemode = false;
        }

        $scope.deletecontainer = function(confirm){
          if(!confirm){
            $scope.deletemode = true;
          }
          else{
            $scope.$emit('viewer:remove');
            $scope.deletemode = false;
          }
        }

        $scope.savecontainer = function(){
          $scope.$emit('viewer:save');
        }
      }
    }
  })