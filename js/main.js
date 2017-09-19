var website = {
	displayedProblems: 0,
	availableProblems: 3,
	problems: [],
	container: null,
	registerProblems: function () {
		// Register all challenges here
		this.loadProblem('challenge_1.js');
		this.loadProblem('challenge_2.js');
		this.loadProblem('challenge_3.js');
	},
	loadProblem: function (filename) {
		var parent = this;

		jQuery.ajax({
			crossDomain: true,
			dataType: "script",
			url: 'js/problems/' + filename
		}).done(function () {
			parent.problems.push(challenge);

			if (parent.problems.length == parent.availableProblems)
				parent.displayProblems(20);
		});
	},
	displayProblems: function(amount) {
		var displayTo = amount + this.displayedProblems;
		if (displayTo > this.problems.length)
			displayTo = this.problems.length;

		for (var i = this.displayedProblems; i < displayTo; i++) {
			this.container.append(this.createProblem(this.problems[i]));
			this.problems[i].init();
		}

		this.displayedProblems = displayTo;
	},
	createProblem: function (problem) {
		var reddit = Math.random().toString(36).substr(2, 5);

		var element = '<div class="item"><div class="title-block" >';
		element += '<div class="title difficulty-' + problem.difficulty + '">';
		element += problem.title + '</div><div class="reddit" id="' + reddit + '" ></div ></div ><div class="description">';
		element += problem.description + '</div><div class="inputs" >';

		// Inputs
		for (var i = 0; i < problem.inputs.length; i++) {
			switch (problem.inputs[i].type){
				case 'text':
					element += '<input type="' + problem.inputs[i].type + '" class="input-' + problem.inputs[i].type + '" id="' + problem.inputs[i].name + '" placeholder="' + problem.inputs[i].title + '"/>';
					break;
				case 'number':
					element += '<div class="input-label">' + problem.inputs[i].title + '</div>';
					element += '<input type="' + problem.inputs[i].type + '" class="input-' + problem.inputs[i].type + '" id="' + problem.inputs[i].name + '" value="' + problem.inputs[i].default + '" min="' + problem.inputs[i].min + '" max="' + problem.inputs[i].max + '"/>';
					break;
			}
			
		}

		// Outputs
		element += '</div><div class="run-placeholder" >';
		var id = Math.random().toString(36).substr(2, 5);
		element += '<input type="button" class="input-run" id="' + id + '" value="Run"/></div ><div class="outputs"><div class="output-title">Output</div>';

		for (var i = 0; i < problem.outputs.length; i++) {
			switch (problem.outputs[i].type){
				case 'text':
					element += '<input type="' + problem.outputs[i].type + '" class="output-' + problem.outputs[i].type + '" id="' + problem.outputs[i].name + '" placeholder="' + problem.outputs[i].title + '" readonly/>';
					break;
				case 'button':
					element += '<input type="' + problem.outputs[i].type + '" class="output-' + problem.outputs[i].type + '" id="' + problem.outputs[i].name + '" value="' + problem.outputs[i].title + '"/>'
					$('body').on('click', '#' + problem.outputs[i].name, problem.outputs[i].action);
					break;
				case 'canvas':
					element += '<canvas id="' + problem.outputs[i].name + '" class="canvas-full" width="' + problem.outputs[i].width + 'px" height="' + problem.outputs[i].height + 'px"></canvas>';
			}
			
		}

		element += '</div></div >';

		// Run button
		$('body').on('click', '#' + id, function () {
			$('#' + id).val('Loading...');
			setTimeout(function () {
				problem.run();
				$('#' + id).val('Run');
			}, 50);
			
		});

		// Reddit button 
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
function formatMS(input) {
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

function hslToHex(h, s, l) {
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;
	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	const toHex = x => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

