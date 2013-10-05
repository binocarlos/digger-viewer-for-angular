module.exports = '<div>\n  <div class="row" ng-show="deletemode">\n    Are you sure?<br /><br />\n\n    <button class="btn btn-info" ng-click="canceldelete()">No Cancel</button>\n    <button class="btn btn-danger" ng-click="deletecontainer(true)">Yes! Delete</button>\n  </div>\n\n  <div ng-hide="deletemode">\n    <ul class="nav nav-tabs" id="viewerTab">\n      <li ng-show="showchildren" ng-class="{active:tabmode==\'children\'}"><a style="cursor:pointer;" ng-click="setmode(\'children\')">Children</a></li>\n      <li ng-show="showdetails" ng-class="{active:tabmode==\'details\'}"><a style="cursor:pointer;" ng-click="setmode(\'details\')">Details</a></li>\n      \n    </ul>\n    <div id="myTabContent" class="tab-content">\n      <div ng-show="showdetails" ng-class="{active:tabmode==\'details\', in:tabmode==\'details\', fade:tabmode!=\'details\'}" class="tab-pane" id="details" style="margin-top:20px;">\n         <form class="form form-horizontal" name="containerForm" onSubmit="return false;" ng-hide="deletemode">\n\n            <fieldset>\n              \n                <form novalidate>\n                  <digger-form fields="blueprint.fields" container="edit_container" />\n                </form>\n\n                <div class="pull-right">\n                  <a href="" ng-click="toggledigger()">\n                  <span ng-show="diggeractive">-</span>\n                  <span ng-hide="diggeractive">+</span>\n                   digger\n                  </a>\n                </div>\n\n                <div ng-show="diggeractive">\n                  <hr />\n                  <form novalidate>\n                    <digger-form fields="digger_fields" container="edit_container" />\n                  </form>\n\n                  \n                </div>\n\n                <div class="form-group text-center" style="margin-top:10px;">\n                    <button ng-show="addmode" class="btn btn-warning" ng-click="cancelcontainer()">Cancel</button>\n                    <button ng-hide="hidedelete()" class="btn btn-info" ng-click="deletecontainer()">Delete</button>\n                    <button class="btn btn-success" ng-click="savecontainer()">Save</button>\n                    \n                </div>\n              \n            </fieldset>\n\n          </form>\n\n\n        \n\n      </div>\n      <div ng-show="showchildren" ng-class="{active:tabmode==\'children\', in:tabmode==\'children\', fade:tabmode!=\'children\'}" class="tab-pane" id="children" style="margin-top:20px;">\n\n        <div>\n\n        	<div class="digger-viewer-container" ng-repeat="$digger in children" ng-click="click_container($digger)">\n\n            <div style="margin-bottom:5px;">\n              <i class="icon" ng-class="geticon($digger)"></i>\n            </div>\n            <div>\n        		  {{ $digger.title() }}\n            </div>\n\n          </div>\n\n        </div>\n        <hr style="clear: left;" />\n        <div>\n          <button style="margin:10px;" class="btn btn-sm btn-info" ng-click="add_from_blueprint(blueprint)" ng-repeat="blueprint in addchildren">new {{ blueprint.title() }}</button>\n        </div>\n\n      </div>\n    </div>\n  </div>';