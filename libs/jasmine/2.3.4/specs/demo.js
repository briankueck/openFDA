describe("demo", function() {
	it("Our demo should initialize correctly", function() {
		var isInitClean = demo.init();
		expect(isInitClean).toEqual(true);
	});

	it("Our demo should allow an Ajax call to be made from the home page", function() {
		var isSearchFunctionOK = demo.search();
		expect(isSearchFunctionOK).toEqual(true);
	});

	it("Our demo should allow an Ajax call to be made from a linked page", function() {
		var isSearchFunctionOK = demo.search({
			"noun": "drugs",
			"type": 0,
			"searchPhrase": "drugs",
			"limit": 1
		});
		expect(isSearchFunctionOK).toEqual(true);
	});
});