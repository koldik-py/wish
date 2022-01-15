const now = new Date;
// Генерация карточек на месяц
async function generate_card (date, now) {
	let main = document.querySelector('.only-card'),
		calendar = new Calendar(date),
		notesResult;
	await request_get('http://localhost:8000/json/notes/', calendar.requestDjango)
	.then(notes => {
		if (Object.keys(notes).length > 0) notesResult = notes
		else notesResult = 0
	})
	// Создание карточек на месяц
	calendar.dateList.forEach((date, index) => {
		let card = document.createElement('div'),
			dateName = calendar.rename_day(date).split(', '),
			nowDate = calendar.comparison_date(date,now);
		
		if (nowDate) nowDate = 'Сегодня';
		else nowDate = '';
		
		let x = '';
		if (notesResult) x = generate_event(date, notesResult, calendar);
		
		card.className = 'container-card';
		card.innerHTML = `
			<div class="title-card">
				<div class="card-week-day">${dateName[0]},&nbsp</div>
				<div class="card-week-date">${dateName[1]}</div>
				<div class="card-day-now">${nowDate}</div>
			</div>
			<div class="card-main">
				<div class="card-content">${x}</div>
				<div class="card-down">
					<div class="card-down-name">Заметка</div>
					<div class="card-down-add-icon">
						<div class="add"></div>
						<div class="add2"></div>
					</div>
				</div>
			</div>`;
		
		main.append(card);
		if (nowDate == 'Сегодня') scroll_by_element(index)
		if ((index+1) % 7 == 0) main.innerHTML += '<div class="plug"></div>'
	})

	highlight_month(calendar,now);

	// Запрос к джанго на наличие заметок
	async function request_get (URL,date) {
		let res = await fetch(URL + date);

		if (!res.ok) throw new Error(`Error url <${URL + date}>, status ${res.status}`);

		return await res.json(); 
	}
	// Генерация событий
	function generate_event (date, notesResult, calendar) {
		let x = '',
			dateDjango = calendar.date_format_django(date);

		if (dateDjango in notesResult) {
			notesResult[dateDjango].forEach( i => {
				if (!i["category.icon.url"]) i["category.icon.url"] = '/static/media/circle.png'
				if (!i["category.title"]) i["category.title"] = '<Укажите категорию>'
				//
				x += `
				<div class="event">
					<div class="event-category">
						<img src="${i["category.icon.url"]}" class="event-category-icon">
						<div class="event-category-title">${i["category.title"]}</div>
					</div>
					<div class="event-content">
						<p class="event-content-text">${i["content"]}</p>
					</div>
				</div>`
			})
		} 
		return x
	}
}
generate_card(now, now);

// Активация изменения месяца
function activite_month (now) {
	let x = document.querySelectorAll('.month')

	x.forEach((i,index) => {
		i.addEventListener('click', (e) => {
			let year = +document.querySelector('.year-button').textContent;
			e.preventDefault();
			clear_card();
			generate_card(new Date(year, index), now);
		})
	})
}
activite_month(now)

function clear_card () {
	let x = document.querySelector('.only-card');
	x.innerHTML = '';
}
// Активация изменения года
function year_button (now) {
	let yearNow = document.querySelector('.year-button'),
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
		clear_card();
		if (+e.target.textContent == now.getFullYear()) generate_card(now, now);
		else generate_card(new Date(+e.target.textContent, now.getMonth()), now);
	})
}
year_button(now)

// Подсветка текущего месяца
// index 
var highlightMonth,highlightMonthNow;
function highlight_month (calendar, now) {
	let x = document.querySelectorAll('.month'),
		month = calendar.month,
		nowUp = calendar.comparison_month(calendar.date,now);
	// Если месяц сменился, но ранее выбирался
	if (highlightMonth || highlightMonth == 0)x[highlightMonth].style.color = '';
	// Если не текущий месяц
	if (!nowUp) {
		x[month].style.color = '#FF672BFF'; 
		highlightMonth = month;
	} 
	// Если не текущий год
	else if (calendar.year != now.getFullYear()) {
		x[highlightMonthNow].style.color = '';
	} 
	// Если текущий месяц + год
	else {
		x[month].style.color = '#1043C4';
		highlightMonthNow = month;
	}
}

// Скролл до нужного элемента
function scroll_by_element (index) {
	let x,
		count = 872; // 394
	
	while(index % 7 != 0){
		index--
	}
	x = (index/7)*count
	
	setTimeout(() => {
		window.scroll({
			top: x,
			behavior: 'smooth'
		})
	},200)
}

// На основе текущих данных обновление контента страницы
csrf = document.cookie.split('=')[1];
var data = {
	content: 'News as JS',
	created_at: '2020-9-15'
}
fetch('http://localhost:8000/notes/json/createNote', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'X-CSRFToken': csrf
	},
	body: JSON.stringify(data),
})
.then( data => data.json() )
.then( i => console.log(i))
