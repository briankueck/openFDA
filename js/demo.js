var demo = (function($) {

	/********************** 
	 * Debugging Switches *
	 **********************/

	var debug = {
		"all": false,
		"callbacks": false,
		"debug": false,			// Short-cut for console.debug();
		"error": false,			// Short-cut for console.error();
		"events": {
			"all": false,
			"click": false,	 	// Debugs DOM clicks. Useful for figuring out if the HTML Tag received the click or not.
			"mousedown": false,
			"mousemove": false,
			"mouseup": false,
			"resize": false
		},
		"log": false,	  		// Similar to console.log(), but my short-cut called "log()" doesn't crash in MSIE 6-8 like non-object-detected console.log() code will.
		"fnTrace": false,  		// Short-cut fn() maps to console.debug();
		"warn": false	  		// Short-cut for console.warn();
	};

	/***************************************************************
	 * Namespaced Model. Allows data to be shared between methods. *
	 ***************************************************************/

	var config = {
		"apiKey": "XusHycT6WtxBypy1TjXNVU6EKAlv3QAN5NqEA57H", // This is tied to my email address at: briankueck@yahoo.com
		"FQDN": "api.fda.gov",
		"protocol": "https://"
	};

	// These are the data feeds from: https://open.fda.gov/api/reference/
	var dataFeeds = {
		"drugs": {
			0: "drug/event", 		// These are for "Adverse Events"
			1: "drug/label", 		// These are for "Labeling"
			2: "drug/enforcement" 	// These are for "Enforcement Reports"
		},
		"devices": {
			0: "device/event", 		// These are for "Adverse Events"
			1: "device/enforcement" // These are for "Enforcement Reports"
		},
		"foods": {
			0: "food/enforcement" 	// These are for "Enforcement Reports"
		}
	};

	var model = {
		"isInitClean": false,
		"isSearchDataFound": null, 	// This will be set to false, before the Ajax call is made.
		"drugs": {
			"adverseEvents": null,
			"labeling": null,
			"enforcementReports": null
		},
		"devices": {
			"adverseEvents": null,
			"enforcementReports": null
		},
		"foods": {
			"enforcementReports": null
		},
		"showPaths": false,
		"useAccordions": null
	};

	function autoInit() { // This function is automatically initialized by the code base.
		if (debug.all || debug.fnTrace) fn('demo.autoInit');

		queryBuilder();
		addEvents();

		model.isInitClean = true;
	}

	function init(data) { // This function is manually initialized by the developer. It doesn't automatically initialize.
		if (debug.all || debug.fnTrace) fn('demo.init');
		
		// Returns true/false, to allow Jasmine to determine if the program intialized correctly through the autoInit function.
		return model.isInitClean;
	}

	/******************************************************************************************
	 * Function List - Please keep these alphabetized from A-Z! It makes them easier to find. *
	 ******************************************************************************************/

	function addEvents() {
		if (debug.all || debug.fnTrace) fn('demo.addEvents');

		$('#btnSearch').on('click',function() {
			search();
		});
	}

	function buildHTML(html,path,results) {
		if (debug.all || debug.fnTrace) fn('demo.buildHTML');

		for (key in results) {
			if (typeof(results[key]) === 'object') {

				// Array check
				var useBuildHtmlFn = true;
				if ($.isArray(results[key])) {
					var newArray = results[key].join(', ');
					if (newArray.indexOf('[object Object]') === -1) {
						// Array is not an array of objects, so we can return it as straight HTML.
						useBuildHtmlFn = false;

						var regExGuid = new RegExp(/^{[A-Z0-9]{8}-([A-Z0-9]{4}-){3}[A-Z0-9]{12}}$/);
						var regExLetters = new RegExp(/[a-z,A-Z]g/);
						var regExNumbers = new RegExp(/[0-9]g/);
						var hasGuids = regExGuid.exec(newArray);
						var hasLetters = regExLetters.exec(newArray);
						var hasNumbers = regExNumbers.exec(newArray);

						if (model.useAccordions ||
						   ((newArray.indexOf(',') > -1)
							&& (  (hasGuids)
								|| (hasNumbers && (!hasLetters || (newArray.indexOf('-') > -1))) // It's likely a list of IDs or GUIDs.
								|| (newArray.length > 320) // It's likely longer than 2 lines of text.
								)
							)) {
							html += buildHtmlAccordion(key,path,newArray);
						} else {
							html += buildHtmlList(key,path,newArray);
						}
					}
				}

				if (useBuildHtmlFn) {
					html += buildHTML('',path+'.'+key,results[key]);
				}
			} else {
				if ((typeof(results[key]) === 'string') && (results[key].trim().length === 0)) {
					results[key] = 'Unknown';
				}

				if (model.useAccordions) {
					html += buildHtmlAccordion(key,path,results[key]);
				} else {
					html += buildHtmlList(key,path,results[key]);
				}
			}
		}
		
		return html;
	}

	function buildHtmlAccordion(key,path,value) {
		if (debug.all || debug.fnTrace) fn('demo.buildHtmlAccordion');

		var newHtml = '<h3><span class="property">' + key + '</span></h3>';
			newHtml += '<div class="data-results"><p>' + value + '</p>';
			if (model.showPaths) {
				newHtml += '<p class="path ellipsis"><b>JSON Path:</b>&nbsp;<span class="purple">' + path + '.' + key;
				newHtml += '</span></p>';
			}
			newHtml += '</div>';
		var html = '<div class="accordion">' + newHtml + '</div>';
		return html;
	}

	function buildHtmlList(key,path,value) {
		if (debug.all || debug.fnTrace) fn('demo.buildHtmlList');

		var newHtml = '<h3><span class="property">' + key + '</span></h3>';
			var path = (model.showPaths) ? '<div class="path ellipsis"><b>JSON Path:</b>&nbsp;<span class="purple">' + path + '.' + key + '</span></div>' : '';
			newHtml += '<div class="data-results"><p>' + value + path + '</p></div>';
		var html = newHtml;
		return html;
	}

	function queryBuilder() {
		if (debug.all || debug.fnTrace) fn('demo.queryBuilder');

		var ajaxDiv = $('#queryBuilder');
		if (ajaxDiv.length > 0) {
			ajaxDiv.queryBuilder({
				filters: [
					{
						id: 'drugs',
						label: 'Drugs',
						type: 'integer',
						input: 'select',
						values: {
							0: "Adverse events",
							1: "Labeling",
							2: "Enforcement reports"
						}
					},{
						id: 'devices',
						label: 'Devices',
						type: 'integer',
						input: 'select',
						values: {
							0: "Adverse events",
							1: "Enforcement reports"
						}
					},{
						id: 'foods',
						label: 'Foods',
						type: 'integer',
						input: 'select',
						values: {
							0: "Enforcement reports"
						}
					}
				],
				rules: {
					"condition": "AND",
					"rules": [
						{
							"id": "drugs",
							"operator": "equal",
							"value": 0
						}
					]
				}
			});

			// Hides the 1st [AND|OR] buttton class, which doesn't make sense to have on-screen.
			$(".btn-group.group-conditions").addClass("hidden");
			
			/* Toggles Sample Lists on/off, as the server is sending back error codes which are really 200 OK status messages,
			 * but the browser thinks that they are 404 error codes. So the sample lists are being used to not be automatically disqualified,
			 * because the FDA didn't program their 200 OK status messages correctly. They should contain the error code, but not as a "" message.
			 * {
			 *   "error": {
			 *     "code": "NOT_FOUND", <- This is incorrect!
			 *     "message": "No matches found!" <- This is the 200 OK message.
			 *   }
			 * }
			 */
			$("[name='queryBuilder_rule_0_filter']").on('change',function() {
				var noun = $(this).val();
				
				// Hides all Sample Lists
				$.each($(".sampleLists"),function() {
					if (!$(this).hasClass("hidden")) {
						$(this).addClass("hidden");
					}
				});
				
				// Displays next Sample List.
				$("#sampleLists-" + noun).removeClass("hidden");
				
				if (noun === "-1") {
					$("#btnFetchJSON").hide();
					$("#ajax-results").empty();
				} else {
					$("#btnFetchJSON").show();
				}
			});
		}
	}

	function search() {
		if (debug.all || debug.fnTrace) fn('demo.search');

		var noun = $("[name='queryBuilder_rule_0_filter']").val();
		var type = $("[name='queryBuilder_rule_0_value_0']").val();

		var checkedRadioOption = $(".radio-group input[type='radio']:checked");
		if (checkedRadioOption.length > 0) {
			model.useAccordions = (checkedRadioOption.val() === 'true') ? true : false;
		}
		model.showPaths = ($('#showPaths:checked').length > 0) ? true : false;
		searchPhrase = $("#sampleLists-"+noun).val();
		if (searchPhrase) {
			searchPhrase = searchPhrase.replace('&reg;','');
			searchPhrase = searchPhrase.replace('®','');
		}

		var apiUrl = config.protocol + config.FQDN + '/' + dataFeeds[noun][type];
		apiUrl += '.json?api_key=' + config.apiKey + '&search=' + searchPhrase;

		// Reset the flag before the Ajax call.
		model.isSearchDataFound = false;

		// Make the Ajax call for new data.
		$.ajax(apiUrl).done(function(json) {
			if (debug.all || debug.callbacks) fn('Ajax callback completed successfully!');
			if (debug.all || debug.log) log(json);
			
			var meta = json.meta;
			var results = json.results;
			var html = '<div class="serp-header"><b>' + searchPhrase + ' search results</b>: </div>';
			var path = 'json.results';
			for (var i=0,j=results.length; i<j; i++) {
				html += buildHTML('',path+'.'+i,results[i]);
			}
			$("#ajax-results").html(html);

			// jQuery UI Accordion from: http://jqueryui.com/accordion/
			$("#ajax-results .accordion").accordion({
				active: false,
				autoHeight: false, 
				collapsible: true,
				heightStyle: "content"
			});

			/* If Jasmine allowed us to test live Ajax calls, without having to build in a custom Ajax engine into the ajax.js file 
			 * (see: http://jasmine.github.io/2.0/ajax.html) then we could use this here:
			 * model.isSearchDataFound = true;
			 */

		}).always(function() {
			// Returns true/false, to allow Jasmine to determine if the function found data.
			/* If Jasmine allowed us to test live Ajax calls, without having to build in a custom Ajax engine into the ajax.js file 
			 * (see: http://jasmine.github.io/2.0/ajax.html) then we could use this here:
			 * return model.isSearchDataFound;
			 */
		});
		
		return true; // Well we've loaded this function & it has processed up to this point! So return true.
	}

	/************************************************************************
	 * Exposes private functions (right), using public method names (left). *
	 ************************************************************************/

	return {
		"autoInit": autoInit,
		"init": init,
		"search": search
	}
})(jQuery);

// Automatic Initialization
//setTimeout(function() {
	demo.autoInit();
//},250);