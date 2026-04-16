export default class Todo {
	selectors = {
		root: 'data-js-todo',
		textInput: 'data-js-text-field',
		addTodoBtn: 'data-add-todo-btn',
		todoContainerList: 'data-js-todo-container',
		deleteTodoElementBtn: 'data-js-delete-element',

		localStorageKey: 'localElements',
	}

	constructor() {
		this.initElements()

		this.renderTodoElements(this.loadFromStorage())

		this.bindEvents()
	}

	initElements() {
		this.rootElement = document.querySelector(`[${this.selectors.root}]`)

		this.textInputElement = this.rootElement.querySelector(
			`[${this.selectors.textInput}]`,
		)
		this.addTodoBtnElement = this.rootElement.querySelector(
			`[${[this.selectors.addTodoBtn]}]`,
		)

		this.todoContainerListElement = this.rootElement.querySelector(
			`[${[this.selectors.todoContainerList]}]`,
		)
	}

	bindEvents() {
		this.addTodoBtnElement.addEventListener('click', this.addTodoItem)

		this.todoContainerListElement.addEventListener('click', e => {
			this.handleTodoListClick(e)
		})
	}

	// ? **************************************************************

	handleTodoListClick = e => {
		const { target } = e

		if (target.hasAttribute(this.selectors.deleteTodoElementBtn))
			this.refreshTodoList(
				target?.getAttribute(this.selectors.deleteTodoElementBtn),
			)
	}

	// ? **************************************************************

	renderTodoElements = e => {
		if (!e) {
			this.showMessage('Список задач пуст)')
			return
		}

		if (e.length === 0) {
			this.showMessage('Вы выполнили все задачи')
			return
		}

		let html = ''
		e.forEach(item => {
			html += `<li>  ${item.text}  <button ${this.selectors.deleteTodoElementBtn}= ${item.id} >Удалить </button> </li>`
		})

		this.todoContainerListElement.innerHTML = html
	}

	addTodoItem = () => {
		const dataInInput = { id: Date.now(), text: this.textInputElement.value }
		const storageElementsArr = this.loadFromStorage() || []

		storageElementsArr.push(dataInInput)
		this.saveToStorage(storageElementsArr)
		this.renderTodoElements(storageElementsArr)

		this.textInputElement.value = ''
	}

	showMessage = message => {
		if (message) this.todoContainerListElement.textContent = message
	}

	refreshTodoList = idElement => {
		this.todoContainerListElement.replaceChildren()
		this.deleteElementFromStorage(idElement)
		this.renderTodoElements(this.loadFromStorage())
	}

	// **********************************************************

	loadFromStorage = () => {
		const localElements = JSON.parse(
			localStorage.getItem(this.selectors.localStorageKey),
		)
		return localElements ? Object.values(localElements) : null
	}

	saveToStorage = arr => {
		localStorage.setItem(this.selectors.localStorageKey, JSON.stringify(arr))
	}

	deleteElementFromStorage = idElement => {
		console.log('удаление из локала')
		this.saveToStorage(this.loadFromStorage().filter(e => e.id != idElement))
	}
}
