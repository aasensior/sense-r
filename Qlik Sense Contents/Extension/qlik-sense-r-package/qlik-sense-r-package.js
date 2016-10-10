function runRegression($element, layout, fullMatrix) {
	// Read some parameters from the Sense Extension and construct the Open CPU service URL and command
	var url = layout.props.section1.item1;
	
	if(url === undefined || url === null || url == '') {
		$element.append('<p>Please use a valid Open CPU server URL parameter. You <i>could</i> use https://public.opencpu.org, but you <i>should</i> use a local installation to keep track of your own CPU usage.</p>');
	}
	else {
		function showLoader(){

			$element.empty();

			var min_side_size = Math.min($element[0].clientHeight, $element[0].clientWidth);
			var lw_max_size = 120;
			if(min_side_size<=120)
				lw_max_size=min_side_size;

			var css_rotation = ".rotate_loader {";
				css_rotation+= "position: absolute;";
				css_rotation+= "top: 50%;";
				css_rotation+= "left: 50%;";
				css_rotation+= "width: "+lw_max_size+"px;";
				css_rotation+= "height: "+lw_max_size+"px;";
				css_rotation+= "margin:-60px 0 0 -60px;";
				css_rotation+= "-webkit-animation:spin 4s linear infinite;";
				css_rotation+= "-moz-animation:spin 4s linear infinite;";
				css_rotation+= "animation:spin 2s linear infinite;";
				css_rotation+= "}";
				css_rotation+= "@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }";
				css_rotation+= "@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }";
				css_rotation+= "@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }";
			$element.append("<style>"+css_rotation+"</style");
			$element.append("<img src='../extensions/qlik-sense-r-package/loader.svg' class='rotate_loader' width='200' height='200' />")
			$element.append("<h1 style='text-align: center;'>Request sent...</h1>");
		}


		if(layout.props.exampleType==0){ //note: this is the original code from the base extension that can be found here -> http://branch.qlik.com/projects/showthread.php?597-Multi-factor-regression-using-R-and-Open-CPU
			showLoader();
			var ordering_parameter = layout.props.section1.item3;
			var keymap = new Map(); // Want to store dimension names and qDatapages indices

			// Initialise some objects for the occasion
			var r_analysis_axes = [];
			
			// Traverse the dimension info in the hypercube and store dimension names and the column index in the qMatrix.
			// Note that we are using the layout's hypercube for this, as it contains the parameter names and other metadata
			// that we need to construct the formula and retain the ordering we need.
			for(var i = 0; i < layout.qHyperCube.qDimensionInfo.length; i++ ) {
				if( layout.qHyperCube.qDimensionInfo[i].qFallbackTitle != ordering_parameter ) {
					var dimension_name = layout.qHyperCube.qDimensionInfo[i].qFallbackTitle;
					
					r_analysis_axes.push(dimension_name);
					keymap.set(i, dimension_name);
				}
			}

			// Find the measure name. We can have one measure.
			var measurename = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
			
			measurename = measurename.replace(/\W+/g, "_").// Avoid confusing R by removing non-alphanumeric characters from measure.
					replace(/_$/, ''); // Remove trailing '_' for teh pretties.

			// Create the regression formula to pass to R's lm function.  Add the measure to the column map.
			var r_formula = measurename +  '~' + r_analysis_axes.join( '+' );
			keymap.set(layout.qHyperCube.qDimensionInfo.length, measurename);
			
			// The data structure that we will pass to r, which will become a dataframe on the r-end of things. Add a first row with
			// the column names.
			var r_dataframe = {};
			for(var column_name of keymap.values()) {
				r_dataframe[column_name] = [];
			}

			// Traverse the flattened data structure we get from senseUtils and populate the data frame.
			for(var m = 0; m < fullMatrix.length; m++ ) {
				for(var column_index of keymap.keys()) {
					var cellvalue = fullMatrix[m][column_index].qText.replace(',','.');

					if(cellvalue - parseFloat(cellvalue) >= 0) {
						r_dataframe[keymap.get(column_index)].push(Number(cellvalue));
					}
					else {
						r_dataframe[keymap.get(column_index)].push(null);
					}

				}
			}
			
			// Read some parameters from the Sense Extension and construct the Open CPU service URL and command
			var url = layout.props.section1.item1;
			
			if(url === undefined || url === null || url == '') {
				$element.append('<p>Please use a valid Open CPU server URL parameter. You <i>could</i> use https://public.opencpu.org, but you <i>should</i> use a local installation to keep track of your own CPU usage.</p>');
			}
			else {
				// url = "https://public.opencpu.org";			
				url = url.replace(/\/?$/, '/');
				var command = url + 'ocpu/library/stats/R';

				ocpu.seturl(command)

				// Pass the structured data and formula to lm
				var req = $element.rplot(
					"lm", // This is the magic R function that does multi-factor regressions. Check ?lm in an R console for help
					{
						formula : r_formula,
						data : r_dataframe
					},
					function(output){
						$element.empty();

						
						var innerurl = url + output.output[0];

						$.ajax({
							type: "get",
							url: innerurl,
							
							success: function(inner) {$element.append('<pre>' + inner + '</pre>')},
							error: function(einner) {$element.append( 'Failed to retrieve result.' )}
						
						})
					}); 			
				
				// Catch error from rplot and say something hopefully useful
				req.fail(function(){
					$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
				});
			}
		}
		else if(layout.props.exampleType==1) { //example for Hello World Plain Text. Note: you can find the function within the R package at "qlikexamples/R/hello_function.R"
			showLoader();
			url = url.replace(/\/?$/, '/');
			var command = url + 'ocpu/library/qlikexamples/R';

			ocpu.seturl(command);

			// Request to Open CPU
			var req = $element.rplot(
				"hello_function", // This will call the hello_function() of the package
				{},
				function(output){
				$element.empty();
				
				var innerurl = url + output.output[1];

				$.ajax({
					type: "get",
					url: innerurl,
					
					success: function(inner) { $element.append('<pre>' + inner + '</pre>') },
					error: function(einner) { $element.append( 'Failed to retrieve result.' ) }
				
					})
				}
			);	
		
			// Catch error from rplot and say something hopefully useful
			req.fail(function(){
				$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
			});
		}
		else if(layout.props.exampleType==2){ //example for Static Bar Plot. Note: you can find the function within the R package at "qlikexamples/R/bar_example.R"
			showLoader();
			url = url.replace(/\/?$/, '/');
			// var command = url + 'ocpu/library/qlikexamples/R';
			var command = url + 'qlikexamples/R';

			ocpu.seturl(command);

			// Request to Open CPU
			var req = $element.rplot(
				"bar_example", // This will call the bar_example() of the package
				{},
				function(output){
					$element.empty();

					// var r_image_url = layout.props.section1.item1+output.output[1].replace('/1','/last')+"/png?"; //or svg or pdf.
					var r_image_url = output.getLoc() + "graphics/last/png?"; //or svg or pdf
					r_image_url += "width="+$element[0].clientWidth; //for svg format, calculate proportion
					r_image_url += "&height="+$element[0].clientHeight; //for svg format, calculate proportion

					$r_image = $(document.createElement('img'));
					// $r_image.attr('id', layout.qInfo.qId);
					$r_image.attr('src', r_image_url); 
					$element.append($r_image);
				}
			);

			// Catch error from rplot and say something hopefully useful
			req.fail(function(){
				$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
			});
		}
		else if(layout.props.exampleType==3){ //example for Static 3D Plot. Note: you can find the function within the R package at "qlikexamples/R/volcano_example.R"
			showLoader();
			url = url.replace(/\/?$/, '/');
			// var command = url + 'ocpu/library/qlikexamples/R';
			var command = url + 'qlikexamples/R';

			ocpu.seturl(command);

			// Request to Open CPU
			var req = $element.rplot(
				"volcano_example", // This will call the bar_example() of the package
				{},
				function(output){
					$element.empty();

					// var r_image_url = layout.props.section1.item1+output.output[1].replace('/1','/last')+"/png?"; //or svg or pdf.
					var r_image_url = output.getLoc() + "graphics/last/png?"; //or svg or pdf
					r_image_url += "width="+$element[0].clientWidth; //for svg format, calculate proportion
					r_image_url += "&height="+$element[0].clientHeight; //for svg format, calculate proportion

					$r_image = $(document.createElement('img'));
					// $r_image.attr('id', layout.qInfo.qId);
					$r_image.attr('src', r_image_url); 
					$element.append($r_image);
				}
			);

			// Catch error from rplot and say something hopefully useful
			req.fail(function(){
				$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
			});
		}
		else if(layout.props.exampleType==4){ //example for Dynamic Forecasting. Note: you can find the function within the R package at "qlikexamples/R/forecast_ts.R"
			showLoader();

			var ordering_parameter = layout.props.section1.item3;
			var keymap = new Map(); // Want to store dimension names and qDatapages indices

			// Initialise some objects for the occasion
			var r_analysis_axes = [];
			
			// Traverse the dimension info in the hypercube and store dimension names and the column index in the qMatrix.
			// Note that we are using the layout's hypercube for this, as it contains the parameter names and other metadata
			// that we need to construct the formula and retain the ordering we need.
			for(var i = 0; i < layout.qHyperCube.qDimensionInfo.length; i++ ) {
				if( layout.qHyperCube.qDimensionInfo[i].qFallbackTitle != ordering_parameter ) {
					var dimension_name = layout.qHyperCube.qDimensionInfo[i].qFallbackTitle;
					
					r_analysis_axes.push(dimension_name);
					keymap.set(i, dimension_name);
				}
			}

			// Find the measure name. We can have one measure.
			var measurename = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
			
			measurename = measurename.replace(/\W+/g, "_").// Avoid confusing R by removing non-alphanumeric characters from measure.
					replace(/_$/, ''); // Remove trailing '_' for teh pretties.

			// Create the formula to pass to R's rpart function.  Add the measure to the column map.
			var r_formula = measurename +  '~' + r_analysis_axes.join( '+' );
			keymap.set(layout.qHyperCube.qDimensionInfo.length, measurename);

			// The data structure that we will pass to r, which will become a dataframe on the r-end of things. Add a first row with
			// the column names.
			var r_dataframe = {};
			for(var column_name of keymap.values()) {
				r_dataframe[column_name] = [];
			}

			// Traverse the flattened data structure we get from senseUtils and populate the data frame.
			for(var m = 0; m < fullMatrix.length; m++ ) {
				for(var column_index of keymap.keys()) {
					var cellvalue = fullMatrix[m][column_index].qText;

					if(cellvalue - parseFloat(cellvalue) >= 0) {
						r_dataframe[keymap.get(column_index)].push(Number(cellvalue));
					}
					else {
						r_dataframe[keymap.get(column_index)].push(null);
					}
					
					if(m == 0){
						if(column_index == 0){
							var min_year = Number(cellvalue);
						}
						if(column_index == 1){
							var min_month = Number(cellvalue);
						}
					}

				}
			}

			// Read some parameters from the Sense Extension and construct the Open CPU service URL and command
			var url = layout.props.section1.item1;
			
			if(url === undefined || url === null || url == '') {
				$element.append('<p>Please use a valid Open CPU server URL parameter. You <i>could</i> use https://public.opencpu.org, but you <i>should</i> use a local installation to keep track of your own CPU usage.</p>');
			}else{
				// url = "https://public.opencpu.org";			
				url = url.replace(/\/?$/, '/');
				// var command = url + 'ocpu/library/qlikexamples/R';
				var command = url + 'qlikexamples/R';
				
				ocpu.seturl(command);

				var req = $element.rplot(
					"forecast_ts", // This will call the forecast_ts() of the package
					{
						datos : r_dataframe,
						year : min_year,
						month : min_month
					},
					function(output){
						$element.empty();

						// var r_image_url = layout.props.section1.item1+output.output[1].replace('/1','/last')+"/png?"; //or svg or pdf.
						var r_image_url = output.getLoc() + "graphics/last/png?"; //or svg or pdf
						r_image_url += "width="+$element[0].clientWidth; //for svg format, calculate proportion
						r_image_url += "&height="+$element[0].clientHeight; //for svg format, calculate proportion

						$r_image = $(document.createElement('img'));
						// $r_image.attr('id', layout.qInfo.qId);
						$r_image.attr('src', r_image_url); 
						$element.append($r_image);
					}
				); 

					// Catch error from rplot and say something hopefully useful
					req.fail(function(){
						$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
					});
			}
		}
		else if(layout.props.exampleType==5){ //example for Dynamic Decision Tree. Note: you can find the function within the R package at "qlikexamples/R/decision_tree.R"
			showLoader();
			var ordering_parameter = layout.props.section1.item3;
			var keymap = new Map(); // Want to store dimension names and qDatapages indices

			// Initialise some objects for the occasion
			var r_analysis_axes = [];
			
			// Traverse the dimension info in the hypercube and store dimension names and the column index in the qMatrix.
			// Note that we are using the layout's hypercube for this, as it contains the parameter names and other metadata
			// that we need to construct the formula and retain the ordering we need.
			for(var i = 0; i < layout.qHyperCube.qDimensionInfo.length; i++ ) {
				if( layout.qHyperCube.qDimensionInfo[i].qFallbackTitle != ordering_parameter ) {
					var dimension_name = layout.qHyperCube.qDimensionInfo[i].qFallbackTitle;
					
					r_analysis_axes.push(dimension_name);
					keymap.set(i, dimension_name);
				}
			}

			// Find the measure name. We can have one measure.
			var measurename = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
			
			measurename = measurename.replace(/\W+/g, "_").// Avoid confusing R by removing non-alphanumeric characters from measure.
					replace(/_$/, ''); // Remove trailing '_' for teh pretties.

			// Create the formula to pass to R's rpart function.  Add the measure to the column map.
			var r_formula = measurename +  '~' + r_analysis_axes.join( '+' );
			keymap.set(layout.qHyperCube.qDimensionInfo.length, measurename);

			// The data structure that we will pass to r, which will become a dataframe on the r-end of things. Add a first row with
			// the column names.
			var r_dataframe = {};
			for(var column_name of keymap.values()) {
				r_dataframe[column_name] = [];
			}

			// Traverse the flattened data structure we get from senseUtils and populate the data frame.
			for(var m = 0; m < fullMatrix.length; m++ ) {
				for(var column_index of keymap.keys()) {
					var cellvalue = fullMatrix[m][column_index].qText;

					if(cellvalue - parseFloat(cellvalue) >= 0) {
						r_dataframe[keymap.get(column_index)].push(Number(cellvalue));
					}
					else {
						r_dataframe[keymap.get(column_index)].push(null);
					}

				}
			}

			url = url.replace(/\/?$/, '/');
			// var command = url + 'ocpu/library/qlikexamples/R';
			var command = url + 'qlikexamples/R';

			ocpu.seturl(command);

			// Request to Open CPU
			var req = $element.rplot(
				"decision_tree", // This will call the decision_tree() of the package
				{
					formula : r_formula,
					data_table : r_dataframe
				},
				function(output){
					$element.empty();

					// var r_image_url = layout.props.section1.item1+output.output[1].replace('/1','/last')+"/png?"; //or svg or pdf.
					var r_image_url = output.getLoc() + "graphics/last/png?"; //or svg or pdf
					r_image_url += "width="+$element[0].clientWidth; //for svg format, calculate proportion
					r_image_url += "&height="+$element[0].clientHeight; //for svg format, calculate proportion

					$r_image = $(document.createElement('img'));
					// $r_image.attr('id', layout.qInfo.qId);
					$r_image.attr('src', r_image_url); 
					$element.append($r_image);
				}
			);			
			
			// Catch error from rplot and say something hopefully useful
			req.fail(function(){
				$element.append("<pre>R returned an error: " + req.responseText + '</pre>'); 
			});
		} 
	}
}	
	
define( [
		'./properties',
		'jquery',
		'./javascript/opencpu-0.5',
		'./javascript/senseUtils'
	],
	function ( props ) {
		'use strict';
		
		return {

		definition : props,
        initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [
					{
						qWidth: 10,
						qHeight: 1000
					}
				]
			}
		},
		paint: function ( $element, layout )  {
			// We use senseUtils to consolidate the hypercube into a single data matrix, and pass our regression function to it.
            senseUtils.pageExtensionData(this, $element, layout, runRegression);
		}
	};
});
