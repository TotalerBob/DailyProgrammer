var website = {
	displayedProblems: 0,
	problems: [],
	container: null,
	registerProblems: function () {
		this.loadProblem('problem_1.js');
		this.loadProblem('problem_2.js', true);
	},
	loadProblem: function (filename, isLast = false) {
		var parent = this;

		jQuery.ajax({
			crossDomain: true,
			dataType: "script",
			url: 'js/problems/' + filename
		}).done(function () {
			parent.problems.push(challenge);

			if (isLast)
				parent.displayProblems(20);
		});
	},
	displayProblems: function(amount) {
		var displayTo = amount + this.displayedProblems;
		if (displayTo > this.problems.length)
			displayTo = this.problems.length;

		for (var i = this.displayedProblems; i < displayTo; i++) {
			this.container.append(this.createProblem(this.problems[i]));
		}

		this.displayedProblems = displayTo;
	},
	createProblem: function (problem) {
		var reddit = Math.random().toString(36).substr(2, 5);

		var element = '<div class="item"><div class="title-block" >';
		element += '<div class="title difficulty-' + problem.difficulty + '">';
		element += problem.title + '</div><div class="reddit" id="' + reddit + '" ></div ></div ><div class="description">';
		element += problem.description + '</div><div class="inputs" >';

		for (var i = 0; i < problem.inputs.length; i++) {
			element += '<input type="' + problem.inputs[i].type + '" class="input-' + problem.inputs[i].type + '" id="' + problem.inputs[i].name + '" placeholder="' + problem.inputs[i].title + '"/>'
		}

		element += '</div><div class="run-placeholder" >';
		var id = Math.random().toString(36).substr(2, 5);
		element += '<input type="button" class="input-run" id="' + id + '" value="Run"/></div ><div class="outputs"><div class="output-title">Output</div>';

		for (var i = 0; i < problem.outputs.length; i++) {
			element += '<input type="' + problem.outputs[i].type + '" class="output-' + problem.outputs[i].type + '" id="' + problem.outputs[i].name + '" placeholder="' + problem.outputs[i].title + '" readonly/>'
		}

		element += '</div></div >';

		$('body').on('click', '#' + id, function () {
			$('#' + id).val('Loading...');
			setTimeout(function () {
				problem.run();
				$('#' + id).val('Run');
			}, 50);
			
		});

		$('body').on('click', '#' + reddit, function () {
			var win = window.open(problem.reddit, '_blank');
			win.focus();
		});

		return $(element);
	}
}

$(document).ready(function () {
	website.container = $('#wrapper');
	website.registerProblems();
});


// Helpers
function FormatMS(input) {
	var min = Math.floor(input / 60000);
	var sec = Math.floor((input % 60000) / 1000);
	var ms = ((input % 60000) % 1000);

	var result = '';
	if (min > 0)
		result += min + 'min ';
	if (sec > 0)
		result += sec + 'sec ';
	result += ms + 'ms';
	return result;
}


/*

// Input Generation

function ScaffoldStart() {
	return '<div class="problem-subitem input-item">';
}

function ScaffoldEnd() {
	return '</div>';
}

function CreateTextInput(title, name) {
	var inp = ScaffoldStart();
	inp += '<div class="input-title">' + title + ' </div>';
	inp += '<input type="text" class="input-text" id="' + name + '"/>';
	inp += ScaffoldEnd();
	$('#problem-input').append(inp);

	return $('#' + name);
}

// Output Generation

function CreateTextOutput(title, name) {
	var out = ScaffoldStart();
	out += '<div class="output-title">' + title + ' </div>';
	out += '<input type="text" class="input-text" id="' + name + '" readonly/>';
	out += ScaffoldEnd();
	$('#problem-output').append(out);

	return $('#' + name);
}

function CreateRunButton(text) {
	// Add button
	var inp = ScaffoldStart();
	inp += '<input type="button" class="input-run" value="' + text + '" />';
	inp += ScaffoldEnd();
	$('#problem-output').append(inp);

	// Add eventhandler
	$('.input-run').on('click', function () {
		// Visual
		$(this).addClass('input-run-pressed');

		setTimeout(function () {
			$('.input-run').removeClass('input-run-pressed');
		}, 60);

		// Functional
		$('.input-run').val('Calculating...');
		setTimeout(function () {
			Run();
			$('.input-run').val('Run Challenge');
		}, 50);	
	});
}

// Navigation

function SetNavigationTitle(title) {
	$('#nav-title').html(title);
}

function SetNavigationDescription(desc) {
	$('#nav-description').html(desc);
}

// Helpers

function ClearContent() {
	$('#problem-input').html('');
	$('#problem-output').html('');
}



function DisplayChallenge() {
	$('#popup').css("display", "inline-block");
}*/