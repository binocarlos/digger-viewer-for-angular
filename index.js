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

          $scope.model = container.get(0);
        })

      },

      link:function($scope, elem, $attrs){

        $scope.$watch('model', function(model){
          if(!model){
            return;
          }

          var clone = JSON.parse(JSON.stringify(model));
          delete(clone._children);
          delete(clone._data);
          
          var jsonhtml = jsonMarkup(clone);
          elem.html(jsonhtml);

        }, true)
      }

    }
  })


  .directive('diggerViewer', function($safeApply, $digger_fields){

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

        if(!$scope.settings.view){
          $scope.settings.view = 'details';
        }
      },
      controller:function($scope){

      	$scope.tabmode = 'children';
        $scope.showtab = {};
        $scope.diggeractive = true;

        if($scope.settings.diggeractive!==undefined){
          $scope.diggeractive = $scope.settings.diggeractive;
        }

        $scope.class_summary = function(container){
          if(!container){
            return '';
          }
          var classes = container.digger('class') || [];

          return classes.map(function(classname){
            return '.' + classname;
          }).join(' ');
        }
        $scope.tag_summary = function(container){
          if(!container || !container.tag()){
            return '';
          }
          return '<' + container.tag() + '>';
        }
        $scope.id_summary = function(container){
          if(!container || !container.id()){
            return '';
          }
          return '#' + container.id();
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

        $scope.settings_button_clicked = function(button){
          $scope.$emit('viewer:button', button);
        }

        $scope.buttonclass = function(){
          return $scope.settings.buttonclass || '';
        }

        $scope.toggledigger = function(){
          $scope.diggeractive = !$scope.diggeractive;
        }

        $scope.geticon = function(container){
          return $scope.iconfn ? $scope.iconfn(container) : 'fa-file';
        }

        $scope.setmode = function(mode){
          $scope.tabmode = mode;
          $scope.deletemode = false;
          if($scope.settings.tabchange){
            $scope.settings.tabchange(mode);
          }
        }

        $scope.haserror = function(){
          if(!$scope.container){
            return false;
          }
          var errorfound = false;
          Object.keys($scope.container.data('error') || {}).forEach(function(key){
            if($scope.container.data('error.' + key)){
              errorfound = true;
            }
          })
          return errorfound;
        }

        $scope.$on('viewer:mode', function(ev, mode){
          $scope.setmode(mode);
        })

        

        $scope.$watch('settings.blueprints', function(blueprints){
          if(!blueprints){
            return;
          }
          $scope.addchildren = $digger.blueprint.filter_children(blueprints, $scope.blueprint);
        })

        $scope.$watch('container.models[0]._children', function(children){
          if(!children){
            return;
          }
          $scope.render_children();
        })

        $scope.render_children = function(){
          var container = $scope.container;

          $scope.children = container.children().containers();

          if($scope.settings.filterchildren){
            $scope.children = $scope.children.filter($scope.settings.filterchildren);
          }

          $scope.deletemode = false;

          var icon = container.digger('icon');

          if(!icon && $scope.iconfn){
            container.digger('icon', $scope.iconfn(container));
          }

          //if(!$scope.settings.blueprints){
            var addchildren = $digger.blueprint.all_containers(true);
            $scope.addchildren = $digger.blueprint.filter_children(addchildren, $scope.blueprint);
          //}
          
          var digger_leaf = container.digger('leaf');

          if(!digger_leaf){
            var has_children = $digger.blueprint.has_children($scope.blueprint);

            digger_leaf = !has_children;
          }
          $scope.showchildren = !digger_leaf;
          $scope.issaved = true;
          if(container.data('new')){
            $scope.showchildren = false;
            $scope.issaved = false;
          }
          if($scope.settings.showchildren===false){
            $scope.showchildren = false;
          }
          //$scope.showdetails = true;//$scope.blueprint ? true:false;//(($scope.blueprint.fields || []).length>0) : false;
          $scope.showdetails = container.tag()!='_supplychain';
          $scope.issupplychain = container.tag()=='_supplychain';
          $scope.edit_container = container;

          if(!$scope.showchildren || $scope.settings.blueprintmode){
            $scope.tabmode = 'details';
          }

          $scope.container_url = $digger.config.diggerurl + container.diggerurl();
          $scope.container_branch = container.diggerurl();

          $scope.digger_fields = $digger_fields;
        }

        $scope.$watch('container', function(container){
          if(!container){
            return;
          }
          $scope.render_children();
        })

        $scope.$on('viewer:render', function(){
          $scope.render_children();
        })

        $scope.selectparent = function(){
          $scope.$emit('viewer:up');
        }

        $scope.add_from_blueprint = function(blueprint){
          $scope.$emit('viewer:add', blueprint);
          $scope.addmode = true;
        }

        $scope.deletemode = false;

        $scope.click_container = function(container, force){
          $scope.$emit('viewer:selected', container, force);
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

        $scope.$on('viewer:delete:press', function(){
          $scope.deletecontainer();
        })

        $scope.$on('viewer:set:tab:' + $scope.settings.id, function(ev, tab){
          $scope.tabmode = tab;
          if($scope.settings.tabchange){
            $scope.settings.tabchange(tab);
          }
        })

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
          $scope.addmode = false;
        }
      }
    }
  })