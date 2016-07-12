var patternLists = [
	{
		tokenLists : [
			["react"],
			["reactjs"],
			["react",".","js"],
		],
		tag: "react",
	},
	{
		tokenLists : [
			["react", "-", "native"],
			["react", " ", "native"],
		],
		tag: "react-native",
	},
	{
		tokenLists : [
			["angular"],
			["angularjs"],
			["angular", ".", "js"],
		],
		tag: "angular.js",
	},
	{
		tokenLists : [
			["node"],
			["nodejs"],
			["node", ".", "js"],
		],
		tag: "node.js",
	},
];

function replacementRule(matchedText, tag) {
	return "<span style='color:red;'>" + matchedText + "(" + tag + ")</span>"
}


////////////////
// accentText //
////////////////

/* Open the console in your browser to see the result ! */

var text = "I develop in React-Native, angular.js, and sometimes in Node.";
console.log(accentText(text, patternLists, replacementRule));

////////////////
// accentNode //
////////////////

$(window).ready(function() {
	accentNode($("#core")[0], patternLists, replacementRule);
});


