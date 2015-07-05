describe("demo", function() {
	it("Our demo should initialize correctly", function() {
		var isInitClean = demo.init();
		expect(isInitClean).toEqual(true);
	});

	it("Our demo should allow an Ajax call to be made", function() {
		var isSearchFunctionOK = demo.search();
		expect(isSearchFunctionOK).toEqual(true);
	});
});