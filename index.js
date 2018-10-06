class Descat {
	constructor(element) {
		this.element = element;

		this.boards = [];

		if(localStorage.getItem("boards")) {
			this.boards = JSON.parse(localStorage.getItem("boards"));
		}

		this.selectedBoard = undefined;

		setInterval(() => {
			this.save();
		}, 1000 * 60);

		this.render();
	}

	save() {
		localStorage.setItem("boards", JSON.stringify(this.boards));
	}

	resetHandlers() {
		window.handlers = {};
		this.handlerId = 0;
	}

	handler(fn) {
		const id = this.handlerId++;
		window.handlers[id] = fn;

		return `window.handlers['${id}'](this)`;
	}

	render() {
		this.resetHandlers();

		this.element.innerHTML = `
			<div class="col-3">
				<li class="list-group-item">
					<button class="btn btn-primary" onclick="${this.handler(() => {
						this.boards.push({
							name: "Example Board",
							text: ""
						});

						this.render();
					})}">New</button>

					<button class="btn btn-primary" onclick="${this.handler(() => {
						this.save();
					})}">Save</button>
				</li>

				${this.boards.map((board, i) => `
					<li class="list-group-item">
						<span onclick="${this.handler(() => {
							this.selectedBoard = board;

							this.render();
						})}">${board.name}</span>

						<strong onclick="${this.handler(() => {
							this.boards.splice(i, 1);

							this.render();
						})}">x</strong>
					</li>
				`).join("")}
			</div>

			<div class="col-7">
				<div class="row">
					${this.selectedBoard ? `
						<div class="input-group">
							<textarea class="input-group-text col-12" onKeyUp="${this.handler(textarea => {
								this.selectedBoard.text = textarea.value;
							})}">${this.selectedBoard.text}</textarea>
						</div>
					` : `

					`}
				</div>
			</div>
		`;
	}
};

new Descat(document.querySelector("#descat"));
