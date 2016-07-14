function Automata(patternLists) {
	// initialize all the tokens and start tokens present in the patternLists
	var tokens = {};
	var startTokens = {};
	for (var iTag = 0; iTag < patternLists.length; iTag++) {
		var tagPattern = patternLists[iTag];
		for (var iList = 0; iList < tagPattern.tokenLists.length; iList++) {
			var tokenList = tagPattern.tokenLists[iList]; 
			if (tokenList.length > 0) {
				startTokens[tokenList[0]] = tokenList[0];
			}
			for (var iToken = 0; iToken < tokenList.length; iToken++) {
				var token = tokenList[iToken];
				tokens[token] = token;
			}
		}
	}
	// create the search tree
	var searchTree = {
		children: []
	};
	var searchTree = { children: []	};
	for (var iTag = 0; iTag < patternLists.length; iTag++) {
		var tagPattern = patternLists[iTag];
		var tag = tagPattern.tag;
		for (var iList = 0; iList < tagPattern.tokenLists.length; iList++) {
			var tokenList = tagPattern.tokenLists[iList]; 
			var curTree = searchTree;
			for (var iToken = 0; iToken < tokenList.length; iToken++) {
				var token = tokenList[iToken];
				if (curTree.children[token] == undefined) {
					curTree.children[token] = { children: [] };
				}
				curTree = curTree.children[token];
			}
			curTree.acceptedTag = tag;	
		}
	}

	/*
	 * Return {words,tokens}, where words is the list of the words in the text
	 * (spaces and punctuations are considered as words) and tokens is the
     * list of corresponding tokens (so the two list have the same length).
	 * Non-token words are associated to token "".
	 */
	var tokenize = function(text) {
		var words = text.split(/([ .,-;\/\"\n\r])/).filter(function (item) {
			return item != "";
		});
		var tokens_ = words.map(function(s) {
			var normalized = tokens[s.toLowerCase()];
			if (normalized) {
				return normalized;
			} else {
				return "";
			}
		});
		return {
			words : words,
			tokens : tokens_,
		};
	}

	// Return {prefixLength, tag} : the length of the longest admissible prefix
	// with the tag associated. If no admissible prefix exists,
	// it returns a length of 0 and an undefined tag.
	var longestAccept = function(tokens, iStart) {
		if (iStart == undefined) {
			iStart = 0;
		}
		var prefixLength = 0;
		var tag;
		var curTree = searchTree;
		for (var iToken = iStart; iToken < tokens.length; iToken++) {
			var token = tokens[iToken];
			if (curTree.children[token] == undefined) {
				break;
			}
			curTree = curTree.children[token];
			if (curTree.acceptedTag) {
				prefixLength = 1 + iToken - iStart;
				tag = curTree.acceptedTag;
			}
		}
		return {
			prefixLength : prefixLength,
			tag : tag,
		}
	};

	this.tokens = tokens;
	this.startTokens = startTokens;
	this.searchTree = searchTree;
	this.tokenize = tokenize;
	this.longestAccept = longestAccept;
}

function accentText(text, patternLists, replacementFunction) {
	var automata = new Automata(patternLists);
	var tokenizedText = automata.tokenize(text);
	var words = tokenizedText.words;
	var tokens = tokenizedText.tokens;
	var res = "";
	for (var iToken = 0; iToken < tokens.length; iToken++) {
		var acceptedLength = 0;
		var tag;
		if (automata.startTokens[tokens[iToken]]) {
			var longestAccept = automata.longestAccept(tokens, iToken);
			acceptedLength  = longestAccept.prefixLength;
			tag = longestAccept.tag;
		}
		if (acceptedLength == 0) {
			res += words[iToken];
		} else {
			var innerText = "";
			for (var iWord = iToken; iWord < iToken + acceptedLength; iWord++) {
				innerText += words[iWord];
			}
			res += replacementFunction(innerText, tag);
			iToken += acceptedLength - 1;
		}
	}
	return res;
}

function accentNode(node, patternLists, replacementFunction) {
	if (node.nodeType == 3) {
		var text = node.textContent;	
		var newText = accentText(text, patternLists, replacementFunction);
		if (newText != text) {
			$(node).replaceWith(newText);
		}
	}
	if($(node).prop("tagName") != "SCRIPT") {
		$(node).contents().each(function() {
			accentNode(this, patternLists, replacementFunction);
		});
	}
}

