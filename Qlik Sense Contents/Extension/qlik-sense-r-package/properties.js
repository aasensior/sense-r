define( [], function () {
	'use strict';
	
	var dimensions = {
		uses: "dimensions",
		min: 0,
		max: 3
	};
	
	var measures = {
		uses: "measures",
		min: 0,
		max: 1
	};
	
	var header1_item1 = {
		ref: "props.section1.item1",
		label: "Open CPU server URL",
		type: "string",
		expression: "optional"
	};

	// This one is from when I tried to get this to be a flexible module that took R commands as a parameter
	var header1_item2 = {
		ref: "props.section1.item2",
		label: "Open CPU server url",
		type: "string",
		expression: "optional"
	};

	var header1_item3 = {
		ref: "props.section1.item3",
		label: "Group by",
		type: "string",
		expression: "optional"
	};

	var exampleType = {
		type: "items",
		// component: "expandable-items",
		label: "Type of Integration Examples",
		items: {
			examplesDropDown: {
				ref: "props.exampleType",
				label: "Example type",
				type:"string",
				component: "dropdown",
				options:[
				{
					value: "0",
					label: "Base Extension Original Example"
				},
				{
					value: "1",
					label: "Hello World plain text"
				},
				{
					value: "2",
					label: "Static Bar Plot"
				},
				{
					value: "3",
					label: "Static 3D Plot"
				},
				{
					value: "4",
					label: "Dynamic Forecasting"
				},
				{
					value: "5",
					label: "Dynamic Decision Tree"
				}
				],
				defaultValue: "0"
			}
		}//props.exampleType
	} //exampleType
	
	
	// Use this technique for parameters to the relevant R snippet
	var myCustomSection = {
		component: "expandable-items",
		label: "R configuration",
		items: {
			header1_item1: header1_item1
		}
	};
	
	return {
		type: "items",
		component: "accordion",
		items: {
			dimensions: {
				uses: "dimensions"
			},
			measures: {
				uses: "measures"
			},
			sorting: {
						uses: "sorting"
			},
			grouping: header1_item3,
			customSection: header1_item1,
			exmplType: exampleType,
			appearance: {
				uses: "settings"
			}
		},
		snapshot: {
			canTakeSnapshot: true
		}
	};
} );