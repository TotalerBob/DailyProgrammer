var challenge = {
	title: 'Subset Sum Automata',
	description: 'You begin with a board full of random integers in each cell. Cells will increment or decrement based on a simple application of the subset sum problem: if any subset of the 8 neighboring cells can sum to the target value, you increment the cell\'s sum by some value; if not, you decrement the cell by that value. Automata are defined with three integers x/ y / z, where x is the target value, y is the reward value, and z is the penalty value.',
	difficulty: 'hard',
	reddit: 'https://www.reddit.com/r/dailyprogrammer/comments/6vyihu/20170825_challenge_328_hard_subset_sum_automata/',
	fields: { width: 10, height: 10, history: [], curCyc: 0, values: [[], [], [], [], [], [], [], [], [], []] },
	inputs: [{ type: 'number', name: 'c2_target', title: 'Target Value', default: 0, min: 0, max: 360 }, { type: 'number', name: 'c2_reward', title: 'Reward Value', default: 20, min: 0, max: 360 }, { type: 'number', name: 'c2_penalty', title: 'Penalty Value', default: 40, min: 0, max: 360 }, { type: 'number', name: 'c2_iterations', title: 'Iterations', default: 100, min: 1, max: 10000 }],
	outputs: [{ type: 'canvas', name: 'c2_canvas', width: 10, height: 10 }, { type: 'button', name: 'c2_displayCycle', title: 'Run Simulation', action: function () { website.problems[1].public_NextCycle(); } }, { type: 'button', name: 'c2_reset', title: 'Reset', action: function () { website.problems[1].init(); } }],
	init: function () {
		// Canvas
		var canvas = document.getElementById("c2_canvas");
		var canvas_ctx = canvas.getContext("2d");

		// Generate new random field
		for (var i = 0; i < this.fields.width; i++) {
			for (var j = 0; j < this.fields.height; j++) {
				var hue = ~~(Math.random() * 360);
				this.fields.values[i][j] = hue;

				canvas_ctx.fillStyle = hslToHex(hue, 100, 50);
				canvas_ctx.fillRect(i, j, 1, 1);
			}
		}

		// Add first generation to history
		this.fields.history = [canvas_ctx.getImageData(0, 0, this.fields.width, this.fields.height)];
	},
	run: function () {
		var ctx = this;

		// Input vars
		var cycles = $('#' + ctx.inputs[3].name).val();
		var target = $('#' + ctx.inputs[0].name).val();
		var reward = $('#' + ctx.inputs[1].name).val();
		var penalty = $('#' + ctx.inputs[2].name).val();

		// Canvas
		var canvas = document.getElementById("c2_canvas");
		var canvas_ctx = canvas.getContext("2d");

		// Reset all values from previous generation
		ctx.fields.history = new Array(ctx.fields.history[0]);
		canvas_ctx.fillStyle = "white";
		canvas_ctx.fillRect(0, 0, 10, 10);

		// Generate as many cycles as in var cycles declared
		for (var x = 0; x < cycles; x++) {
			doCycle();
		}

		// Resets canvas to the first image
		canvas_ctx.putImageData(ctx.fields.history[0], 0, 0);
		

		// Generate a new generation
		function doCycle() {
			// Loop all fields
			for (var i = 0; i < ctx.fields.width; i++) {
				for (var j = 0; j < ctx.fields.height; j++) {
					// Get neighbors
					var neighbors = getNearby(i, j);
					// Check if subset sum fits
					if (subsetSum(neighbors, target)) {
						// Add reward
						ctx.fields.values[i][j] += reward;
						if (ctx.fields.values[i][j] > 360)
							ctx.fields.values[i][j] -= 360;
					}
					else {
						// Subtract penalty
						ctx.fields.values[i][j] -= penalty;
						if (ctx.fields.values[i][j] < 0)
							ctx.fields.values[i][j] += 360;
					}

					// Redraw field of canvas
					canvas_ctx.fillStyle = hslToHex(ctx.fields.values[i][j], 100, 50);
					canvas_ctx.fillRect(i, j, 1, 1);
				}
			}

			// Save generation
			ctx.fields.history.push(canvas_ctx.getImageData(0, 0, ctx.fields.width, ctx.fields.height));
		}

		// Check if a subset sum fits in sum
		function subsetSum(values, sum) {
			if (~values.indexOf(sum)) {
				return true;
			}

			var times = Math.pow(2, values.length);
			for (var i = 1; i < times; i++) {
				var number = i.toString(2);
				number = '00000000'.substr(number.length) + number;
				var chars = number.split('');

				var total = 0;
				for (var j = 0; j < values.length; j++) {
					if (chars[j] == true)
						total += values[j];
				}

				if (total == sum)
					return true;
			}

			return false;
		}

		// Gets all 8 nearby values
		function getNearby(x, y) {
			var nearby = [];

			nearby.push(ctx.fields.values[(x - 1 < 0) ? ctx.fields.width - 1 : x - 1][(y - 1 < 0) ? ctx.fields.height - 1 : y - 1]);
			nearby.push(ctx.fields.values[x][(y - 1 < 0) ? ctx.fields.height - 1 : y - 1]);
			nearby.push(ctx.fields.values[(x + 1 >= ctx.fields.width) ? 0 : x + 1][(y - 1 < 0) ? ctx.fields.height - 1 : y - 1]);
			nearby.push(ctx.fields.values[(x - 1 < 0) ? ctx.fields.width - 1 : x - 1][y]);
			nearby.push(ctx.fields.values[(x + 1 >= ctx.fields.width) ? 0 : x + 1][y]);
			nearby.push(ctx.fields.values[(x - 1 < 0) ? ctx.fields.width - 1 : x - 1][(y + 1 >= ctx.fields.height) ? 0 : y + 1]);
			nearby.push(ctx.fields.values[x][(y + 1 >= ctx.fields.height) ? 0 : y + 1]);
			nearby.push(ctx.fields.values[(x + 1 >= ctx.fields.width) ? 0 : x + 1][(y + 1 >= ctx.fields.height) ? 0 : y + 1]);

			return nearby;
		}		
	},
	public_NextCycle: function () {
		var ctx = this;

		// Input vars
		var cycles = $('#' + ctx.inputs[3].name).val();

		var timer = window.setInterval(function () {
			// Canvas
			var canvas = document.getElementById("c2_canvas");
			var canvas_ctx = canvas.getContext("2d");

			// Draw new generation
			canvas_ctx.putImageData(ctx.fields.history[ctx.fields.curCyc], 0, 0);

			// Increment
			ctx.fields.curCyc++;
		}, 80);

		// Stop timer after all cycles are done
		window.setTimeout(function () { window.clearInterval(timer); ctx.fields.curCyc = 0; }, 80 * cycles + 1);
		
	}
}