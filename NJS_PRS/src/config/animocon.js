
export const Animocon = {
	extend: (a, b) => {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	},
	animocon: (el, opt) => {
		let options = Animocon.extend({}, opt);
		Animocon.extend(options, opt);

		let checked = false;
		let timeline = new mojs.Timeline();

		for (let i = 0, len = options.tweens.length; i < len; ++i) {
			timeline.add(options.tweens[i]);
		}
		el.addEventListener('click', function () {
			if (checked) {
				options.onUnCheck();
			}
			else {
				options.onCheck();
				timeline.replay();
			}
			checked = !checked;
		});
	}
}