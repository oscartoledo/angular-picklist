/* global angular */
'use strict';

function ListEntry(originalIndex, data) {
  this.originalIndex = originalIndex;
  this.data = data;
}

angular.module('apicklist', [])
  .factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
  })

  .directive('picklist', ['_', function (_) {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class=\"container-fluid\" ng-cloak>  <div class=\"row\">    <!--unselected data-->    <div class=\"col-xs-5\">      <div class=\"row\">        <div class=\"col-xs-12\">          <input placeholder=\"Search\" type=\"text\" class=\"form-control\" ng-model=\"leftFilter\"             style=\"width: 75%;margin-bottom: 10px;\"/>        </div>      </div>      <div class=\"row\">        <div class=\"col-xs-12\">          <select multiple ng-multiple=\"true\" ng-model=\"leftSelected\"              ng-options=\"r.data as r.data.value for r in leftListRows | filter:{$:leftFilter} track by r.data.value\"              style=\"overflow: auto;\" ng-style=\"listCss\"></select>        </div>      </div>    </div>    <!--navigation buttons-->    <div class=\"col-xs-1 v-center\">        <button style=\"display: block;\" type=\"button\" class=\"btn btn-default\" ng-click=\"moveRightSelected()\">          <span class=\"glyphicon glyphicon-forward\"></span>        </button>        <button style=\"display: block;\" type=\"button\" class=\"btn btn-default\" ng-click=\"moveRightAll()\" ng-show=\"showAllButtons\">          <span class=\"glyphicon glyphicon-fast-forward\"></span>        </button>        <button style=\"display: block;\" type=\"button\" class=\"btn btn-default\" ng-click=\"moveLeftSelected()\">          <span class=\"glyphicon glyphicon-backward\"></span>        </button>        <button style=\"display: block;\" type=\"button\" class=\"btn btn-default\" ng-click=\"moveLeftAll()\" ng-show=\"showAllButtons\">          <span class=\"glyphicon glyphicon-fast-backward\"></span>        </button>    </div>    <!--selected data-->    <div class=\"col-xs-5\">      <div class=\"row\">        <div class=\"col-xs-12\">          <input placeholder=\"Search\" type=\"text\" class=\"form-control\" ng-model=\"rightFilter\"                style=\"width: 75%;margin-bottom: 10px;\"/>        </div>      </div>      <div class=\"row\">        <div class=\"col-xs-12\">          <select multiple=\"multiple\" ng-model=\"rightSelected\"              ng-options=\"r.data as r.data.value for r in rightListRows | filter:{$:rightFilter} track by r.data.value\"              style=\"overflow: auto;\" ng-style=\"listCss\"></select>        </div>      </div>    </div>  </div></div>',
      scope: {
        leftListRowsModel: '=leftListRows',
        rightListRowsModel: '=rightListRows',

        listWidth: '@listWidth',//optional, empty by default
        listHeight: '@listHeight',//optional, empty by default
        showMoveAllButtons : '@' //optional, true by default
      },
      link: function (scope) {

        function initializeRowLists() {
          scope.leftListRows = _.map(scope.leftListRowsModel, function (element, index) {
            return new ListEntry(index, element);
          });
          scope.rightListRows = _.map(scope.rightListRowsModel, function (element, index) {
            return new ListEntry(index, element);
          });
        }


        scope.listCss = {};

        scope.showAllButtons = scope.showMoveAllButtons || true;

        if (scope.listWidth){
          scope.listCss['min-width'] = scope.listWidth + 'px';
        }

        if (scope.listHeight){
          scope.listCss.height = scope.listHeight + 'px';
        }

        initializeRowLists();

        //indices of selected rows
        scope.leftSelected = [];
        scope.rightSelected = [];

        scope.leftFilter = '';
        scope.rightFilter = '';

        /**
         * moves only selected rows from left to right
         */
        scope.moveRightSelected = function () {
          //convert selected rows into raw data
          var selectedData = scope.leftSelected.map(function (row) {
            return row;
          });

          //add data to the right list
          scope.rightListRowsModel = scope.rightListRowsModel.concat(selectedData);

          //remove from left list
          scope.leftSelected.forEach(function (element) {
            scope.leftListRowsModel.splice(element.originalIndex, 1);
          });

          //reinitialize row models
          initializeRowLists();

          //clear selected lists
          scope.rightSelected = [];
          scope.leftSelected = [];
        };

        /**
         * moves only selected rows from right to left
         */
        scope.moveLeftSelected = function () {
          //convert selected rows into raw data
          var selectedData = scope.rightSelected.map(function (row) {
            return row;
          });

          //add data to the left list
          scope.leftListRowsModel = scope.leftListRowsModel.concat(selectedData);

          //remove from right list
          scope.rightSelected.forEach(function (element) {
            scope.rightListRowsModel.splice(element.originalIndex, 1);
          });

          //reinitialize row models
          initializeRowLists();

          //clear selected lists
          scope.rightSelected = [];
          scope.leftSelected = [];
        };

        scope.moveRightAll = function () {
          //add data to the right list
          scope.rightListRowsModel = scope.rightListRowsModel.concat(scope.leftListRowsModel);

          //remove data from left list
          scope.leftListRowsModel = [];

          //reinitialize row models
          initializeRowLists();

          //clear selected lists
          scope.rightSelected = [];
          scope.leftSelected = [];
        };


        scope.moveLeftAll = function () {
          //add data to the right list
          scope.leftListRowsModel = scope.leftListRowsModel.concat(scope.rightListRowsModel);

          //remove data from left list
          scope.rightListRowsModel = [];

          //reinitialize row models
          initializeRowLists();

          //clear selected lists
          scope.rightSelected = [];
          scope.leftSelected = [];
        };

      }
    };
  }]);
