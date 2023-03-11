 const urlMain = `${window.location.protocol}//${document.location.host}`,
	note = {
	id: 1,
	name: 'Заметки',
	nameSolo: 'Заметки',
	color:'#0036C0',
	url:{
		get: urlMain +'/notes/json/getNotes/',
		add: urlMain +'/notes/json/createNote',
		del: urlMain +'/notes/json/deleteNote',
		edit: urlMain +'/notes/json/editNote',
		category: urlMain +'/notes/json/createCategory',
		getCategory: urlMain +'/notes/json/getCategory',
	}
	},
	task = {
		id: 2,
		name: 'Задачи',
		nameSolo: 'Задачи',
		color:'#C06800',
		url:{
			get: urlMain +'/tasks/json/getTasks/',
			progress: urlMain +'/tasks/json/progressTask',
			add: urlMain +'/tasks/json/createTask',
			del: urlMain +'/tasks/json/deleteTask',
			category: urlMain +'/notes/json/createCategory',
			getCategory: urlMain +'/notes/json/getCategory',
			// edit: 'http://localhost:8000/tasks/json/ediTask'
		}
	},
	target = {
		id: 3,
		name: 'Цели',
		nameSolo: 'Цель',
		url:{
			get: urlMain +'/targets/json/getTargets',
			get_progress: urlMain +'/targets/json/getProgress',
			add: urlMain +'/targets/json/createTarget',
			del: urlMain +'/targets/json/deletTarget',
			edit: urlMain +'/targets/json/editTarget',
			progress: urlMain +'/targets/json/editProgress',
			addProgress: urlMain +'/targets/json/addProgress',
		}
	},  
choice = { 
		now: new Date,
		calendar: new Calendar,
		url: urlMain,
		csrf : document.cookie.split('=')[1],
		user: {
			logout: 'http://localhost:8000/notes/json/'
		},
		event: note,
		highlightMonth: null,
		highlightMonthNow: null,
	};
//

 activiteFull()
 activite_navigation ()
 // Активация изменения <Заметки-Задачи-Цели>
function activite_navigation () {
	let notes = document.querySelector('#navigation-but-notes'),
		tasks = document.querySelector('#navigation-but-tasks'),
		targets = document.querySelector('#navigation-but-target');

	notes.addEventListener('click', ()=> {
		// Если не активный
		if (notes.style.color != 'rgb(43, 43, 43)') {
			higliht(notes, tasks, targets);
			choice.event = note;
			render()
		}else {
			higliht(notes, tasks, targets);
			choice.event = note;
			render()
		}
	})

	tasks.addEventListener('click', ()=> {
		if (tasks.style.color != 'rgb(43, 43, 43)') {
			higliht(tasks, notes, targets);
			choice.event = task;
			render()
		}
	})

	targets.addEventListener('click', ()=> {
		if (targets.style.color != 'rgb(43, 43, 43)') {
			higliht(targets, notes, tasks);
			choice.event = target;
			renderTg()
		}
	})

	notes.click()

	function higliht (elem, elem1, elem2) {
		// style.color = 'rgb(43, 43, 43)'	style.fontFamily = 'Roboto-medium'
		// style.color = 'rgb(143, 143, 143)'	style.fontFamily = 'Roboto-regular'

		elem.style.color = 'rgb(43, 43, 43)'
		elem.style.fontFamily = 'Roboto-medium'
		elem1.style.color = 'rgb(143, 143, 143)'
		elem1.style.fontFamily = 'Roboto-regular'
		elem2.style.color = 'rgb(143, 143, 143)'
		elem2.style.fontFamily = 'Roboto-regular'
	}
}

function render () {
	if (choice.event.id == 1 || choice.event.id == 2) {
		generate_card()
	}
	// Создание и добавление карточек на страницу
	async function generate_card () {
		let main = document.querySelector('.only-card'),
			calendar = choice.calendar,
			result;

		main.innerHTML = '';
		let plug = document.createElement('div');
		plug.className = 'plug';
		main.append(plug);

		await requestGet(calendar.requestDjango)
		.then( i => {
			if (Object.keys(i).length > 0) result = i
			else result = 0
		})
		// Создание карточек на месяц
		calendar.dateList.forEach((date, index) => {
			let card = document.createElement('div'),
				dateName = calendar.rename_day(date).split(', '),
				nowDate = calendar.comparison_date(date, choice.now);
			
			if (nowDate) nowDate = 'Сегодня';
			else nowDate = '';
			
			let event = '';
			if (result) event = generate_event(date, result, calendar);
			
			card.className = 'container-card';
			card.innerHTML = `
				<div class="title-card">
					<div class="card-week-day">${dateName[0]},&nbsp</div>
					<div class="card-week-date">${dateName[1]}</div>
					<div class="card-day-now">${nowDate}</div>
				</div>
				<div class="card-main">

					<div class="card-content">${event}</div>
					<div class="card-down">
						<div class="card-down-name" style="color:${choice.event.color};">${choice.event.nameSolo}</div>
						<div class="card-down-add-icon">
							<div class="add" style="background:${choice.event.color};"></div>
							<div class="add2"style="background:${choice.event.color};"></div>
						</div>
					</div>
				</div>`;

			if (result && choice.event.id == 1) card.querySelectorAll('.event').forEach( i => activite_note(i))
			if (result && choice.event.id == 2) card.querySelectorAll('.event').forEach( i => activite_task(i))

			activite_add(card, date)
			main.append(card);

			if (nowDate == 'Сегодня') card.classList.add('card--now')
				
			if ((index+1) % 7 == 0) main.append(plug.cloneNode(true))
		})
		highlight_month ()

		scrollToElement(document.querySelector('.card--now'))

		// Запрос к джанго на наличие заметок
		async function requestGet (date) {
			let request = await fetch(choice.event.url.get + date);

			if (!request.ok) throw new Error(`Error url <${URL + date}>, status ${request.status}`);

			return await request.json(); 
		}
		// Генерация событий
		function generate_event (date, result) {
			let event = '',
				dateDjango = choice.calendar.date_format_django(date);

			if ((dateDjango in result) && choice.event.id == 1) {
				result[dateDjango].forEach( i => {
					if (!i["category.icon.url"]) i["category.icon.url"] = 'static/media/circle.png'
					if (!i["category.title"]) i["category.title"] = '<Укажите категорию>'
					//
					event += `
					<div class="event">
						<div class="event-category">
							<input type="hidden" value="${i["pk"]}" class="event-pk">
							<div class="event-category-js">
								<img src="${i["category.icon.url"]}" class="event-category-icon">
								<div class="event-category-title">${i["category.title"]}</div>
							</div>
							<img src="static/media/yes.png" class="push-event-yes" style='display: none;'>
							<div class="push-event" style="visibility: hidden;">
								<img src="static/media/edit.svg" class="push-event-edit" >
								<img src="static/media/delete.png" class="push-event-delete">
							</div>
						</div>
						<div class="event-content">
							<p class="event-content-text">${i["content"]}</p>
						</div>
					</div>`
				})
			} else if ((dateDjango in result) && choice.event.id == 2) {
				result[dateDjango].forEach( i => {
					if (!i["category.icon.url"]) i["category.icon.url"] = 'static/media/circle.png'
					if (!i["category.title"]) i["category.title"] = '<Укажите категорию>'
					if (i.progress == true) i.progress = 'yes'
					else i.progress = 'circle'
					event += `
					<div class="event">
						<div class="event-category">
							<input type="hidden" value="${i["pk"]}" class="event-pk">
							<div class="event-category-js">
								<img src="${i["category.icon.url"]}" class="event-category-icon">
								<div class="event-category-title">${i["category.title"]}</div>
							</div>
							<img src="static/media/${i.progress}.png" class="event-progress">
						</div>
						<div class="event-content">
							<p class="event-content-text">${i["content"]}</p>
						</div>
					</div>`
				})
			} 


			return event
		}

		// Подсветка месяца
		function highlight_month () {
			let x = document.querySelectorAll('.month'),
				month = choice.calendar.month,
				nowUp = choice.calendar.comparison_month(choice.calendar.date,choice.now);
			// Если месяц сменился, но ранее выбирался
			if (choice.highlightMonth || choice.highlightMonth == 0)x[choice.highlightMonth].style.color = '';
			// Если не текущий месяц
			if (!nowUp) {
				x[month].style.color = '#FF672BFF'; 
				choice.highlightMonth = month;
			} 
			// Если не текущий год
			else if (choice.calendar.year != choice.now.getFullYear()) {
				x[choice.highlightMonthNow].style.color = '';
			} 
			// Если текущий месяц + год
			else {
				x[month].style.color = '#1043C4';
				choice.highlightMonthNow = month;
			}
		}

		// Добавление возможности создавать события
		function activite_add (card, date) {
			let icon = card.querySelector('.card-down-add-icon'),
				card_content = card.querySelector('.card-content');

			icon.addEventListener('click', () =>{
				let newEvent = document.createElement('div');
				newEvent.className = 'event';

				if (choice.event.id == 1){
					newEvent.innerHTML = `
						<div class="event-category">
							<input type="hidden" value="" class="event-pk">
							<div class="event-category-js">
								<img src="static/media/clock.png" class="event-category-icon">
								<div class="event-category-title" style="color: #0036C0; font-family: Roboto-regular;">Выбрать категорию</div>
							</div>

							<img src="static/media/yes.png" class="push-event-yes" style='display: none;'>
							<img src="static/media/delete.png" class="push-event-del" style='display: none;'>

							<div class="push-event" style="visibility: hidden;">
								<img src="static/media/edit.svg" class="push-event-edit" >
								<img src="static/media/delete.png" class="push-event-delete">
							</div>
						</div>
						<div class="event-content">
							<textarea class="event-content-textarea"></textarea>
						</div>`
				} else if (choice.event.id == 2){
					newEvent.innerHTML = `
						<div class="event-category">
							<input type="hidden" value="" class="event-pk">
							<div class="event-category-js">
								<img src="static/media/clock.png" class="event-category-icon">
								<div class="event-category-title" style="color: #0036C0; font-family: Roboto-regular;">Выбрать категорию</div>
							</div>
							<img src="static/media/circle.png" class="event-progress" style='display: none;' >
							<img src="static/media/yes.png" class="push-event-yes" style='display: none;'>
							<img src="static/media/delete.png" class="push-event-del" style='display: none;'>
						</div>
						<div class="event-content">
							<textarea class="event-content-textarea"></textarea>
						</div>`
				}
				let categoryIcon = newEvent.querySelector('.event-category-icon'),
					categoryTitle = newEvent.querySelector('.event-category-title'),
					categoryClick = newEvent.querySelector('.event-category-js'),
					categoryPush = document.querySelector('.choice-category-push').cloneNode(true);
				//
				let categoryAdd = document.createElement('div');
				categoryAdd.className = 'choise-categoty-variable'
				categoryAdd.innerHTML = `
					<img src="/static/media/plus.png" class="push-category-icon">
					<div class="push-category-title" style="font-family: Roboto-Light;">Добавить категорию</div>
						
				`
				categoryPush.append(categoryAdd)
				//

				categoryPush.childNodes.forEach( (i, index) => {
					if (index % 2 != 0) {
						i.addEventListener('click', (e) => {
							if (i.children[1].textContent == 'Добавить категорию') {
								add_category(categoryTitle, categoryIcon, categoryPush, i)
							} else {
								categoryTitle.textContent = i.querySelector('.push-category-title').textContent;
								categoryIcon.src = i.querySelector('.push-category-icon').src;}
						})
					}
				})
				categoryClick.append(categoryPush);
				categoryClick.addEventListener('click', (e)=> {
					if (categoryPush.style.visibility == 'hidden') categoryPush.style.visibility = 'visible';
					else categoryPush.style.visibility = 'hidden';
					})

				let yes = newEvent.querySelector('.push-event-yes'),
					del = newEvent.querySelector('.push-event-del');

				del.style.display = 'block';
				del.addEventListener('click', ()=> newEvent.remove())
				yes.style.display = 'block';
				yes.addEventListener('click', ()=> {
					fetch(choice.event.url.add, {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': choice.csrf
						},
						body: JSON.stringify({
							category: categoryTitle.textContent,
							content: newEvent.querySelector('textarea').value,
							created_at : choice.calendar.date_format_django(date)
							 })
					})
					.then(i => i.json())
					.then(i => {
						if (i[0]==1 && choice.event.id == 1) {
							yes.style.display = 'none';
							del.style.display = 'none';
							categoryTitle.style = ''

							categoryClick.querySelector('.choice-category-push').remove();

							let newContent = document.createElement('p');
							newContent.className = 'event-content-text';
							newContent.textContent = newEvent.querySelector('textarea').value;
							newEvent.querySelector('textarea').remove();
							newEvent.querySelector('.event-pk').value = i.pk;
							newEvent.querySelector('.event-content').append(newContent);

							newEvent.innerHTML += '';
							activite_note(newEvent);
						} else if(i[0]==1 && choice.event.id == 2){
							yes.style.display = 'none';
							del.style.display = 'none';
							newEvent.querySelector('.event-progress').style.display = 'block';
							categoryTitle.style = ''

							categoryClick.querySelector('.choice-category-push').remove();

							let newContent = document.createElement('p');
							newContent.className = 'event-content-text';
							newContent.textContent = newEvent.querySelector('textarea').value;
							newEvent.querySelector('textarea').remove();
							newEvent.querySelector('.event-pk').value = i.pk;
							newEvent.querySelector('.event-content').append(newContent);


							newEvent.innerHTML += '';
							activite_task(newEvent);

						}else newEvent.remove()
					})
					.catch( i => newEvent.remove())
				})

				card_content.prepend(newEvent)

			})
		}
	}
}
function scrollToElement(elem) {
	  elem.scrollIntoView({ behavior: "smooth", block: "center"})
	  // setTimeout(() => window.scroll(0, -200), 500)
}
// activite
// Активация изменения/удаления заметки (рекурсия)
function activite_note (elem) {
	let push = elem.querySelector('.push-event');
	
	elem.addEventListener('mousemove', () => push.style.visibility = 'visible');
	elem.addEventListener('mouseout', () => push.style.visibility = 'hidden');


	let edit = elem.querySelector('.push-event-edit'),
		del = elem.querySelector('.push-event-delete'),
		yes = elem.querySelector('.push-event-yes'),

		context = elem.querySelector('.event-content-text'),
		contextContain = elem.querySelector('.event-content'),
		categoryClick = elem.querySelector('.event-category-js'),
		categoryIcon = elem.querySelector('.event-category-icon'),
		categoryTitle = elem.querySelector('.event-category-title'),

		pk = elem.querySelector('.event-pk');

	edit.addEventListener('click', () => {
		edit.style.display = 'none';
		del.style.display = 'none';
		yes.style.display = 'block';

		categoryTitle.style.color = '#0036C0';
		categoryTitle.style.fontFamily = 'Roboto-regular';
		// Возможность выбрать другую категорию
		let categoryPush = document.querySelector('.choice-category-push').cloneNode(true);
		//
		let categoryAdd = document.createElement('div');
		categoryAdd.className = 'choise-categoty-variable'
		categoryAdd.innerHTML = `
			<img src="/static/media/plus.png" class="push-category-icon">
			<div class="push-category-title" style="font-family: Roboto-Light;">Добавить категорию</div>
				
		`
		categoryPush.append(categoryAdd)
		//
		categoryPush.childNodes.forEach( (i, index) => {
			if (index % 2 != 0) {
				if (i.children[1].textContent == 'Добавить категорию') {
					i.addEventListener('click', () => {
						add_category(categoryTitle, categoryIcon, categoryPush, i)
					})
				} else {
					i.addEventListener('click', () => {
						categoryTitle.textContent = i.querySelector('.push-category-title').textContent;
						categoryIcon.src = i.querySelector('.push-category-icon').src;
					})
				}
			}
		})
		categoryClick.append(categoryPush);
		categoryClick.addEventListener('click', (e)=> {
			if (categoryPush.style.visibility == 'hidden') categoryPush.style.visibility = 'visible';
			else categoryPush.style.visibility = 'hidden';
			})
		// Возможность изменить текст
		let editText = document.createElement('textarea');
		editText.className = 'event-content-textarea';
		editText.value = context.textContent;
		context.remove();
		contextContain.append(editText);
	})
	del.addEventListener('click', ()=> {
		fetch(choice.event.url.del, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': choice.csrf
			},
			body: JSON.stringify({pk: pk.value})
		})
			.then( i => i.json())
			.then( i => {if (i[0] == 1) elem.remove()})
	})
	yes.addEventListener('click', ()=> {
		fetch(choice.event.url.edit, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': choice.csrf
			},
			body: JSON.stringify({
				pk: pk.value,
				title: categoryTitle.textContent,
				content: contextContain.querySelector('.event-content-textarea').value })
		})
		.then(i => i.json())
		.then(i => {
			if (i[0]==1) {
				edit.style = '';
				del.style = '';
				yes.style.display = 'none';

				categoryTitle.style = ''

				categoryClick.querySelector('.choice-category-push').remove()

				let newContent = document.createElement('p');
				newContent.className = 'event-content-text';
				newContent.textContent = elem.querySelector('textarea').value;
				elem.querySelector('textarea').remove();
				contextContain.append(newContent);

				elem.innerHTML += '';
				activite_note(elem);
			}
		})
	})
}
//
// Добавление категорий
function add_category (title, icon, main, elem) {
	let x = document.createElement('div');
	x.className = 'push-main';
	x.innerHTML = `<div class="box-category">
				<div class="box-input-icon">
					<input autofocus type="text" class="title-category" placeholder="Введите название">
					<img src="/static/media/plus.png" class="add-category" alt="">
				</div>
				<div class="variant-icon">
				</div>
				<input type="hidden" class="category-pk" >
			</div>
			<div class="push-exit">
			<img src="/static/media/delete.png" class="push-exit-img">
		</div>`
	fetch(choice.event.url.getCategory)

	.then(i => i.json())
	.then(i => { 
		let main = x.querySelector('.variant-icon');
		for (e=1;e < Object.keys(i).length + 1; e++) {

			let icon = document.createElement('img');
			icon.className = 'icon';
			icon.id = e;
			icon.src = i[e];

			icon.addEventListener('click', ()=> {
				icon.classList.add('icon-activite')
				x.querySelector('.category-pk').value = icon.id
			});

			main.append(icon);
			if (e % 6 == 0) {
				let line = document.createElement('div');
				line.className = 'line';
				main.append(line);
			}
		}
	})
	x.querySelector('.push-exit').addEventListener('click', ()=> x.remove())
	x.querySelector('.add-category').addEventListener('click', ()=> {
		let pk = x.querySelector('.category-pk');
			title_cat = x.querySelector('.title-category'),
			data = new FormData();

		data.append('title', title_cat.value);
		data.append('pk', pk.value);

		fetch(choice.event.url.category, {
			method: 'POST',
			headers: {
			'X-CSRFToken': choice.csrf
			},
			body: data
		})
		.then(i => i.json())
		// Доделать
		.then(i => x.remove())

	})

	
	document.body.append(x);

}
//
function activite_task (elem) {
	let img = elem.querySelector('.event-progress');
	img.addEventListener('click', ()=> {
		let pk = elem.querySelector('.event-pk');

		if (img.src == choice.url + '/static/media/circle.png'){
			fetch(choice.event.url.progress, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': choice.csrf
				},
				body: JSON.stringify({pk: pk.value, progress: true})
			})
			.then(i => i.json())
			.then(i => {if (i[0]==1) img.src = 'static/media/yes.png'})

		} else {
			fetch(choice.event.url.progress, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': choice.csrf
				},
				body: JSON.stringify({pk: pk.value, progress: false})
			})
			.then(i => i.json())
			.then(i => {if (i[0]==1) img.src = 'static/media/circle.png'})
		}
	})

	delete_task (elem)

	function delete_task (elem) {
		elem.addEventListener('click', (e)=> {
			if ((e.target != elem.querySelector('.event-progress')) &&
			elem.querySelector('.event-progress').src == 
			choice.url + '/static/media/circle.png' ){

				let del = document.createElement('img');
				del.className = 'event-progress'
				del.src = 'static/media/delete.png'
				elem.querySelector('.event-progress').remove()
				elem.querySelector('.event-category').append(del)

				let pk = elem.querySelector('.event-pk');

				del.addEventListener('click', ()=> {
					fetch(choice.event.url.del, {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': choice.csrf
						},
						body: JSON.stringify({pk: pk.value})
					})
					.then(i => i.json())
					.then(i => {if (i[0]==1) elem.remove()})
				})
			}
		})
	}
}

// Активация элементов
function activiteFull () {
	activite_month();
	activite_year();
	user_exit();
	month_progress();

	function activite_month () {
		let x = document.querySelectorAll('.month'),
				mob = document.querySelector('.month-mob'),
				mobBtn = mob.querySelector('#month'),
				mobList = mob.querySelector('.month-mob__push'),
				mobLi = mobList.querySelectorAll('.month-mob__btn');

		x.forEach((i,index) => {
			i.addEventListener('click', (e) => {
				let year = +document.querySelector('#year-button').textContent;
				e.preventDefault();
				choice.calendar = new Calendar(new Date(year, index));
				mobBtn.textContent = i.textContent
				render();
			})

		})

		let visibleMob = () => mobList.classList.toggle('month-mob__push--active')

		mobBtn.addEventListener('click', () => visibleMob()) 

		mobLi.forEach( (i, index) => i.addEventListener('click', (e) => {
			let year = +document.querySelector('#year-button').textContent;
			mobBtn.textContent = i.textContent
			choice.calendar = new Calendar(new Date(year, index));
			visibleMob()
			render();
		}))

	}

	function activite_year () {
		let yearNow = document.querySelector('#year-button'),
			push = document.querySelector('.year-push');
		// Скрывать\показывать
		yearNow.addEventListener('click', (e) => {
			if (push.style.visibility == 'hidden') push.style.visibility = 'visible'
			else push.style.visibility = 'hidden'
		})
		push.addEventListener('mouseleave', (e) => push.style.visibility = 'hidden')

		let option = document.querySelectorAll('.year-option');
		// Изменение значение, при клике
		option.forEach((e) => {
			e.addEventListener('click', (e) => {
				let g = e.target.textContent;
				e.target.textContent = yearNow.textContent;
				yearNow.textContent = g;
				push.style.visibility = 'hidden';
			})
		})
		// Изменился год > рендер страницы
		yearNow.addEventListener('DOMSubtreeModified', (e) => {
			if (+e.target.textContent == choice.now.getFullYear()) {
				choice.calendar = new Calendar(choice.now);
				render()
			} else {
				choice.calendar = new Calendar(new Date(+e.target.textContent, choice.now.getMonth()));
				render()
			}
		})
	}

	function user_exit () {
		let user = document.querySelector('.profile-button'),
			push = document.querySelector('.profile-push');

		user.addEventListener('click', () => {
			if (push.style.opacity != 1 ) {
				push.style.opacity = 1;
				push.style.visibility = 'visible';
			}
			else {
				push.style.opacity = 0
				push.style.visibility = 'hidden';

			}
		})

		let exit = document.querySelectorAll('.profile-push-button');

		exit[1].addEventListener('click', ()=> window.location.href = 'exit')
	}

	function month_progress () {
		let monthDay = 30,
			monthNow = choice.now.getMonth()
			dayNow = choice.now.getDate()
			result = (monthNow*monthDay + dayNow)/3.68
		document.querySelector('.progress').style.width = result + '%'
	}
}
// target
// Загрузка Целей
async function renderTg () {
	document.querySelector('.only-card').innerHTML = '';

	let result;
	await getTargets()
	.then(i =>  {if (i[0]!= 0) result = i})

	if (result) {
		head(true)
		for (i in result) render_target(result[i])
	}else {
		head(false)
		render_add()
	}
	
	// Запрос на наличие Целей
	async function getTargets () {
		let request = await fetch(choice.event.url.get);

		if (!request.ok) throw new Error(`Error url <${URL + date}>, status ${request.status}`);

		return await request.json()
	}
	// Рендер шапки
	function head(bool) {
		let x;
		if (bool) x = 'Мои Цели'
		else x = 'Поставить цель'

		let main = document.querySelector('.only-card');
		plug = document.createElement('div');
		plug.className = 'week-name';
		plug.innerHTML = `<h1 class="week-name-text">${x}</h1>`;
		main.append(plug);
	}
	// Рендер готовой Цели
	function render_target(data) {
		let main = document.querySelector('.only-card'),
			card = document.createElement('div');
		card.className = 'container-card-target';
		card.innerHTML = `
		<div class="card-target">
			<div class="push-target-edit" style="visibility: hidden;">
				<div class="push-target-circle"></div>
				<div class="push-target-circle"></div>
				<div class="push-target-circle"></div>
			</div>
			<div class="push-target-menu" style="visibility: hidden;">
				<div class="target-menu-variable" ><img src="static/media/fire.png" class="target-menu-icon">Поставить цель</div>
				<div class="target-menu-variable" ><img src="static/media/edit.svg" class="target-menu-icon">Редактировать</div>
				<div class="target-menu-variable" ><img src="static/media/delete.png" class="target-menu-icon">Удалить</div>
			</div>
			<div class="target-photo">
				<img src="${data.photo_url}" alt="" class="target-photo-img">
			</div>
			<div class="target-title">
				<h2 class="target-title-text">${data.title}</h2>
			</div>
			<div class="target-date">
				<p class="target-date-description">Планирую достичь к:</p>
				<p class="target-date-personal" style="color: ${data.color};">${choice.calendar.rename_date(data.deadline)}</p>
			</div>
			<div class="target-progress">
				<div class="target-progress-scale">
					<div class="target-progress-band"></div>
				</div>
				<div class="target-progress-info">
					<div class="target-progress-contain"> 
						<div class="target-progress-circle" style="background-color: ${data.color};"></div>
						<p class="target-personal-result">${data.result_user} из ${data.result} ${data.progress_title}</p>
					</div>
					<div class="target-progress-star"></div>
				</div>
				<input type="hidden" value="${data.pk}" class="target-pk">
			</div>
		</div>`
		activite_target(card)
		main.append(card)
	}
	function activite_target (elem) {
		push(elem)
		activite_scale(elem)

		function push (elem) {
			let main = elem.querySelector('.card-target'),
				push = elem.querySelector('.push-target-edit'),
				menu = elem.querySelector('.push-target-menu'),
				variant = elem.querySelectorAll('.target-menu-variable');

			main.addEventListener('mousemove', () => push.style.visibility = 'visible')
			main.addEventListener('mouseleave', () => {
				push.style.visibility = 'hidden'
				menu.style.visibility = 'hidden'
			})

			push.addEventListener('click', (e)=> {
				if (menu.style.visibility == 'hidden') menu.style.visibility = 'visible'
				else menu.style.visibility = 'hidden'
			})
			
			variant.forEach((i, index) => i.addEventListener('click', ()=> {
				if (index == 0) {
					render_add()
				} if (index == 1) {
					render_edit (elem)
				} if (index == 2) {
					let pk = elem.querySelector('.target-pk').value;
					fetch(choice.event.url.del, {
						method: 'POST',
						headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': choice.csrf
						},
						body: JSON.stringify({pk: pk})
					})
						.then( i => i.json())
						.then( i => {if (i[0] == 1) elem.remove()})
				}
			}))
			activite_progress()
			function activite_progress () {
				let main = elem.querySelector('.target-progress-info'),
					replacement = elem.querySelector('.target-progress-contain'),
					circle = replacement.querySelector('.target-progress-circle');
					btn = elem.querySelector('.target-progress-star');

					btn.addEventListener('click', ()=> {
						if (!main.querySelector('.progress-target-form-i-edit')){
							let info = elem.querySelector('.target-personal-result'),
								input = document.createElement('input'), x;
							x = info.textContent.split(' ');
							info.textContent = `${x[1]} ${x[2]} ${x[3]} ${x[4]}`;
							input.type = 'text';
							input.className = 'progress-target-form-i-edit';
							circle.after(input);
							input.focus()
						} else {
							let info = elem.querySelector('.target-personal-result'),
								input = elem.querySelector('.progress-target-form-i-edit');
							fetch(choice.event.url.progress, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									'X-CSRFToken': choice.csrf,
								},
								body: JSON.stringify({result_user : input.value,
													pk: elem.querySelector('.target-pk').value})
							})
							.then(i => i.json())
							.then(i => {
								if (i[0]==1){
									let x = input.value;
									input.remove()
									info.textContent = x +' '+ info.textContent
									activite_scale (elem)
								}else {
									input.remove()
									info.textContent = '0 '+ info.textContent
								}
							})
						}

					})
			}
		}
		function activite_scale (elem) {
			let scale = elem.querySelector('.target-progress-band'),
				resultMain = +elem.querySelector('.target-personal-result').textContent.split(' ')[2],
				result = +elem.querySelector('.target-personal-result').textContent.split(' ')[0],
				info = elem.querySelector('.target-personal-result'),
				interest;
			interest = result/resultMain * 100;
			scale.style.width = interest + "%";
			x = info.textContent.split(' ');
			info.textContent = `${x[0]} ${x[1]} ${x[2]} ${x[3]} (${Math.floor(interest)}%)`;
		}
	}
	// Рендер блока Добавления
	function render_add() {
		let main = document.querySelector('.only-card'),
			card = document.createElement('div');
		card.className = 'container-card-target';
		card.innerHTML = 
			`<div class="card-target">
				<div class="photo-target-form" style="background: #737373;">
					<button class="photo-target-form-btn">
						<img src="static/media/flower.png" class="photo-target-form-btn-i">
						<p class="photo-target-form-btn-t">Добавить картинку</p>
						<input type="file" name="" id="" class="photo-target-form-i">
					</button>
				</div>
				<div class="target-main-form">
					<div class="color-target-form">
						<input type="text" name="color" style="display: none;" class="target-input-color">
						<div class="color-target-form-c" style="background: #56CCF2;left: 4px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #EB5757;left: 20px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #F2994A;left: 36px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #F2C94C;left: 52px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #219653;left: 68px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #9B51E0;left: 84px; top: 0;"></div>
						<div class="color-target-form-c" style="background: #BB6BD9;left: 100px; top: 0;"></div>
					</div>
					<div class="title-target-form">
						<p class="title-target-form-t">Опишите свою цель</p>
						<textarea name="" id="" cols="30" rows="10" class="title-target-form-i"></textarea>
					</div>
					<div class="date-target-form">
						<p class="title-target-form-t">Планирую достичь к:</p>
						<input type="date" class="date-target-form-i">
					</div>
					<div class="progress-target-form">
						<p class="title-target-form-t">Желаемый результат (Цифры)</p>
						<input type="text" class="progress-target-form-i">
						<div class="progress-target-p">
							<div class="progress-text">Без типа</div>
							<img src="static/media/selector.svg">
							<div class="push-progress-p" style="display: none;"></div>
						</div>
					</div>
					<button class="target-form-btn">Сохранить</button>
				</div>
			</div>`
		activate_add(card)
		main.append(card)
	}
	//
	function render_edit (elem) {
		let data = {
			pk: elem.querySelector('.target-pk').value,
			img: elem.querySelector('.target-photo-img').src,
			imgEdit: false,
			title: elem.querySelector('.target-title-text').textContent,
			date: elem.querySelector('.target-date-personal').textContent,
			color: elem.querySelector('.target-date-personal').style.color,
			progress: elem.querySelector('.target-personal-result').textContent
		}
		loadAnimation(elem)
		parser(data)
		
		elem.innerHTML = 
			`<div class="card-target">
					<div class="photo-target-form" style="background-image: url(${data.img})">
						<button class="photo-target-form-btn">
							<img src="static/media/flower.png" class="photo-target-form-btn-i">
							<p class="photo-target-form-btn-t">Заменить картинку</p>
							<input type="file" name="" id="" class="photo-target-form-i">
						</button>
					</div>
					<div class="target-main-form">
						<div class="color-target-form">
							<input type="text" name="color" style="display: none;" class="target-input-color">
							<div class="color-target-form-c" style="background: #56CCF2;left: 4px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #EB5757;left: 20px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #F2994A;left: 36px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #F2C94C;left: 52px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #219653;left: 68px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #9B51E0;left: 84px; top: 0;"></div>
							<div class="color-target-form-c" style="background: #BB6BD9;left: 100px; top: 0;"></div>
						</div>
						<div class="title-target-form">
							<p class="title-target-form-t">Опишите свою цель</p>
							<textarea name="" cols="30" rows="10" class="title-target-form-i">${data.title}</textarea>
						</div>
						<div class="date-target-form">
							<p class="title-target-form-t">Планирую достичь к:</p>
							<input type="date" class="date-target-form-i" value="${data.date}" format="DD MMMM YYYY">
						</div>
						<div class="progress-target-form">
							<input type="hidden" value="${data.pk}" class="target-pk">
							<p class="title-target-form-t">Желаемый результат (Цифры)</p>
							<input type="text" class="progress-target-form-i" value="${data.progress}">
							<div class="progress-target-p"><div class="progress-text">${data.progress_title}</div>
							<img src="static/media/selector.svg">
								<div class="push-progress-p" style="display: none;"></div>
							</div>
						</div>
						<button class="target-form-btn">Сохранить</button>
					</div>
				</div>`
		// x = elem.querySelector('.date-target-form-i'); // date
		activate_add(elem, data)
		// Вытаскиваем инфу из блока
		function parser (data) {
			let x = data.progress.split(' ');
			data.result_user = x[0];
			data.progress = x[2];
			data.progress_title = x[3];
			data.date = choice.calendar.rename_date_reverse(data.date)
		}
	}
	// Активация элементов добавления
	function activate_add(elem, edit=false) {
		if (!edit){
			download_image(elem)
			enter_color(elem)
			activite_progress(elem)
			request_form(elem)
		}else {
			enter_color(elem, edit.color)
			download_image(elem, edit)
			activite_progress (elem)
			save_edit(elem, edit)
		}
		// edit save
		function save_edit (elem, dict) {
			let btn = elem.querySelector('.target-form-btn');
			btn.addEventListener('click', ()=>{
				let pk = elem.querySelector('.target-pk');
					color = elem.querySelector('.target-input-color'),
					content = elem.querySelector('.title-target-form-i'),
					date = elem.querySelector('.date-target-form-i'),
					progress = elem.querySelector('.progress-target-form-i'),
					progressTitle = elem.querySelector('.progress-text'),
					data = new FormData();
				data.append('color', color.value);
				data.append('imgEdit', dict.imgEdit);
				data.append('pk', pk.value);
				data.append('title', content.value);
				data.append('deadline', date.value);
				data.append('result', progress.value);
				data.append('result_user', dict.result_user);
				data.append('progress_title', progressTitle.innerText);

				if (dict.imgEdit) {
					let img = elem.querySelector('.photo-target-form-i');
					data.append('img', img.files[0]);
				}
				loadAnimation(elem);
				fetch(choice.event.url.edit, {
					method: 'POST',
					headers: {
					'X-CSRFToken': choice.csrf,
					},
					body: data
				})
				.then(i => i.json())
				.then(i => {
					if (i[0]==1){
						let x = {};
						data.forEach((value, key) => {if (key != 'img') x[key] = value})
						x.photo_url = i['photo_url'];
						elem.remove()
						render_target(x)
					}
				})
			})
		}
		// Отправка формы после "Сохранить" (new)
		function request_form(elem) {
			let img = elem.querySelector('.photo-target-form-i'),
				color = elem.querySelector('.target-input-color'),
				content = elem.querySelector('.title-target-form-i'),
				date = elem.querySelector('.date-target-form-i'),
				progress = elem.querySelector('.progress-target-form-i'),
				progressTitle = elem.querySelector('.progress-text'),
				btn = elem.querySelector('.target-form-btn');

			btn.addEventListener('click', ()=>{
				let data = new FormData();
				data.append('img', img.files[0]);
				data.append('color', color.value);
				data.append('title', content.value);
				data.append('deadline', date.value);
				data.append('result', progress.value);
				data.append('progress_title', progressTitle.innerText);

				fetch(choice.event.url.add, {
					method: 'POST',
					headers: {
					'X-CSRFToken': choice.csrf,
					},
					body: data
				})
				.then(i => i.json())
				.then(i => {
					if (i[0]==1){
						let x = {};
						data.forEach((value, key) => {if (key != 'img') x[key] = value})
						x.pk = i['pk'];
						x.photo_url = i['photo_url'];
						x.result_user = 0;
						elem.remove()
						render_target(x)
					}
				})
			})
		}
		// Выбор прогресса
		async function activite_progress (elem) {
			let main = elem.querySelector('.progress-target-p'),
				text = elem.querySelector('.progress-text'),
				push = elem.querySelector('.push-progress-p');

			main.addEventListener('click', ()=> {
				if (push.style.display == 'none') push.style.display = 'block'
				else push.style.display = 'none'
			})

			// После выбора прогресса эта хуйня самоудаляется (её никто не просил)
			await fetch(choice.event.url.get_progress)
			.then(i => i.json())
			.then(e => {
				for (let i = 0; i < Object.keys(e).length; i++) {
					let x = document.createElement('div');
					x.className = 'push-progress-variable'
					x.textContent = e[i]
					x.addEventListener('click', ()=> text.textContent = x.textContent)
					push.append(x)
				};
				let addP = document.createElement('div');
				addP.className = 'push-progress-variable';
				addP.textContent = 'Добавить';
				add_progress(push,addP);
				push.append(addP);

			})
		}
		// Выбор цвета
		function enter_color (elem, colorUser=false) {
			let color = elem.querySelectorAll('.color-target-form-c'),
				inputColor = elem.querySelector('.target-input-color'),
				count;
			color.forEach( (i, index) => {
				i.addEventListener('click', ()=> {
					if (count >= 0) color[count].className = 'color-target-form-c'
					count = index
					i.className = 'color-target-form-c-final'
					inputColor.value = i.style.background
				})
			})
			if (colorUser){
				color.forEach( (i, index) => {
					if (i.style.background == colorUser) color[index].click()
				})
			} else color[0].click()
		}
		// Загрузка картинки
		function download_image (elem, image=false) {
			let btn = elem.querySelector('.photo-target-form-btn'),
				form = elem.querySelector('.photo-target-form-i'),
				img = elem.querySelector('.photo-target-form'),
				reader  = new FileReader();

			if (image){
				btn.style.opacity = 0;
				btn.addEventListener('mouseenter', ()=> btn.style.opacity = 1);
				btn.addEventListener('mouseleave', ()=> btn.style.opacity = 0);
			}
			btn.addEventListener('click', ()=> {
				form.click()
			})
			form.addEventListener('change', ()=>{
				reader.addEventListener('load', ()=> {
					img.style.background = ''
					img.style.backgroundSize = 'cover';
					img.style.backgroundImage = 'url("'+ reader.result +'")';
					btn.style.opacity = 0;
					if (!image){
						btn.addEventListener('mouseenter', ()=> btn.style.opacity = 1)
						btn.addEventListener('mouseleave', ()=> btn.style.opacity = 0)
					}else image.imgEdit = true
				})
			reader.readAsDataURL(form.files[0]);
			})
		}
	}
}
function add_progress (main, elem) {
	let push = document.createElement('div');
	push.className = 'push-main';
	push.innerHTML = `
	<div class="box-category">
		<div class="box-input-icon">
			<input autofocus type="text" class="title-category" placeholder="Введите название">
			<img src="/static/media/plus.png" class="add-category" alt="">
		</div>
	</div>`
	elem.addEventListener('click', function(e) {
		document.body.append(push)
		push.querySelector('.add-category').addEventListener('click', ()=>{
			let data = new FormData();
			data.append('title', push.querySelector('.title-category').value);

			fetch(choice.event.url.addProgress, {
				method: 'POST',
				headers: {
				'X-CSRFToken': choice.csrf
				},
				body: data
			})
			.then(i => i.json())
			.then(i => {
				push.remove()
			})

		})
	})
}


// Анимация загрузки
function loadAnimation (elem) {
	let main = document.createElement('div');
	main.className = 'cssload-dots'
	main.innerHTML = `
		<div class="cssload-dot"></div>
		<div class="cssload-dot"></div>
		<div class="cssload-dot"></div>
		<div class="cssload-dot"></div>
		<div class="cssload-dot"></div>`

	elem.innerHTML = ''
	elem.append(main)
}
