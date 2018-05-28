define( ["qlik", "text!./codewander-d3CirclePack.ng.html", "css!./codewander-d3CirclePack.css","./lib/js/d3.v4.min","./lib/js/render"],
	function ( qlik, template,lcss,d3lib,renderFn ) {
		"use strict";
		return {
			template: template,
			initialProperties: {
				qHyperCubeDef: {
					qMode:"P",
					qAlwaysFullyExpanded:true,
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 5,
						qHeight: 1000
					}]
				}
			},
			
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 1,
						max: 3,
						items:{
							fillColor:{
								type:"string",
								label:"Fill Color",
								ref: "qDef.fillColor",
								expression:"never",
								defaultValue:"#EBF2EA"								
							}
							
						}
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 1,
						items:{
							fillColor:{
								type:"string",
								label:"Fill Color",
								ref: "qAttributeExpressions.0.qExpression",
								expression:"always",
								defaultValue:"='#80ADD7'"								
							}
							
						}
					},
					settings: {
						uses: "settings",
						items:{
							BackgroundColor:{
								type:"string",
								label:"Background Color",
								ref: "bgColor",
								expression:"never",
								defaultValue:"#EBF2EA"								
							},
							OuterCircleColor:{
								type:"string",
								label:"Outer Circle Color",
								ref: "outercircleColor",
								expression:"never",
								defaultValue:"#D4DCA9"								
							}
							
						}
					},
					
					sorting: {
						uses: "sorting"
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function () {
				$('#svg').empty();
				var layoutColor= this.$scope.layout.bgColor? this.$scope.layout.bgColor: "#F2EAED";
				var outercircleColor=this.$scope.layout.outercircleColor? this.$scope.layout.outercircleColor:"#A4A4BF";
				var d=this.$scope.layout.qHyperCube.qPivotDataPages[0];
				console.log(d);
				var chart_data=convert(d);
				var self=this;
				//this.backendApi.selectValues(1, ["Central"], true);
				render(this.$element,chart_data,d3lib,this.$scope.layout.qHyperCube.qDimensionInfo,layoutColor,outercircleColor,this,qlik);			
				
				//needed for export
				this.$scope.selections = [];			
				return qlik.Promise.resolve();
			},
			controller: ["$scope", "$element", function ( $scope ) {
				$scope.getPercent = function ( val ) {
					return Math.round( (val * 100 / $scope.layout.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
				};

				$scope.selections = [];

				$scope.sel = function ( $event ) {
					if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
						var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
							cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
						if ( cell.qIsNull !== true ) {
							cell.qState = (cell.qState === "S" ? "O" : "S");
							if ( $scope.selections.indexOf( cell.qElemNumber ) === -1 ) {
								$scope.selections.push( cell.qElemNumber );
							} else {
								$scope.selections.splice( $scope.selections.indexOf( cell.qElemNumber ), 1 );
							}
							$scope.selectValues( dim, [cell.qElemNumber], true );
						}
					}
				};
			}]
		};

	} );
