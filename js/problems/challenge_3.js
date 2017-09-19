var challenge = {
	title: 'Path to Philosophy',
	description: 'Clicking on the first link in the main text of a Wikipedia article not in parentheses, and then repeating the process for subsequent articles, usually eventually gets you to the Philosophy article. As of May 26, 2011, 94.52% of all articles in Wikipedia lead eventually to the article Philosophy. The rest lead to an article with no wikilinks or with links to pages that do not exist, or get stuck in loops.',
	difficulty: 'hard',
	reddit: 'https://www.reddit.com/r/dailyprogrammer/comments/6j7k3x/20170624_challenge_320_hard_path_to_philosophy/',
	inputs: [{ type: 'text', name: 'c1_number', title: 'Wikipedia Article' }],
	outputs: [],
	init: function () {

		parseWikiPage('9gag');

		var status = 'searching';
		var pageList = [];
		function parseWikiPage(page) {
			var url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=' + page + '&section=0&prop=text&redirects&callback=?';

			/*$.ajax({
				url: url,
				dataType: 'json',
				data: data,
				success: callback
			}).done();*/

			$.getJSON(url, function (data) {
				// Load API answer and get page info
				var content = data['parse']['text']['*'];

				// Remove the sidebar
				var arr = content.split("\n<p>");
				arr.shift();
				text = arr.join("\n<p>");

				// Search for first link NOT in parantheses
				var newPage = '';
				var parantheses = 0;
				for (var i = 0; i < text.length; i++) {
					if (text[i] == '(') {
						parantheses++;
					} else if (text[i] == ')') {
						parantheses--;
					} else if (parantheses == 0) {
						if (text[i + 2] == '/' &&
							text[i + 1] == '"' &&
							text[i] == '=' &&
							text[i - 1] == 'f' &&
							text[i - 2] == 'e' &&
							text[i - 3] == 'r' &&
							text[i - 4] == 'h' &&
							text[i - 5] == ' ' &&
							text[i - 6] == 'a' &&
							text[i - 7] == '<') {
							for (var j = 8; j < 100; j++) {
								if (text[i + j] == '"' || text[i + j] == '#') {
									break;
								} else {
									newPage += text[i + j];
								}
							}
							break;
						}
					}
				}

				if (newPage == '') {
					status = 'noLinkFound';
					ShowResult();
				} else if (newPage == 'Philosophy' || newPage == 'philosophy') {
					status = 'success';
					pageList.push('Philosophy');
					ShowResult();
				} else {
					if ($.inArray(newPage, pageList) != -1) {
						status = 'loop';
						ShowResult();
					} else {
						status = 'searching';
						pageList.push(newPage);
						parseWikiPage(newPage);
					}
				}
			}).fail(function () {
				console.log("failed");
			});
		}

		function ShowResult() {
			console.log(pageList);
			console.log(status);
		}
	},
	run: function () {

	}
}