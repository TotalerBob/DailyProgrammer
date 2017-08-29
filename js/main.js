var problems = 	[
	{ "Title": "Problem 1 - Lorem ipsum dolor sit amet", "Description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", "Difficulty": 0, "Filename": "problem_1.js" },
	{ "Title": "Problem 2", "Description": "Description 2", "Difficulty": 1, "Filename": "problem_2.js" },
	{ "Title": "Problem 3", "Description": "Description 3", "Difficulty": 2, "Filename": "problem_3.js" }
	]

$(document).ready(function () {

	$('#button-close').on('click', function () {
		$('#popup').css('display', 'none');
	});

	$.each(problems, function (index, value) {
		var toAppend = '<div class="container-items ';
		switch (value['Difficulty']) {
			case 0:
				toAppend += "difficulty-easy";
				break;
			case 1:
				toAppend += "difficulty-intermediate";
				break;
			case 2:
				toAppend += "difficulty-hard";
				break;
		}
		toAppend += '">';
		toAppend += '<div class="container-title">' + value['Title'] + '</div>';
		toAppend += '<div class="container-description">' + value['Description'] + '</div>';
		toAppend += '</div>';
		var $square = $(toAppend);
		$('#container').prepend($square);

		$square.on('click', function () {
			jQuery.ajax({
				crossDomain: true,
				dataType: "script",
				url: 'js/problems/' + value['Filename']
			}).done(function () {
				Init();
			});
		});
	});
});