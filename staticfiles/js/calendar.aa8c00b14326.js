x = document.querySelector('input');

function generate_month_day(date) {
	let year = date.getFullYear(),
		month = date.getMonth(),
		firstDay = new Date(year,month),
		lastDay = new Date(year,month+1,0);

	// Определение первого дня первой недели
	if (firstDay.getDay() != 1){
		for (var i = 0;firstDay.getDay() != 1; i--) {
			firstDay = new Date(year,month,i)
		};
	};

	// Определение последнего дня последней недели
	if (lastDay.getDay() != 0){
		for (var i = 0; lastDay.getDay() != 0; i++) {
			lastDay = new Date(year,month+1,i)
		};
	};

	// Создание финального списка
	let weekMonth = [firstDay,],
		yearWeek = firstDay.getFullYear(),
		monthWeek = firstDay.getMonth(),
		dayWeek = firstDay.getDate(),
		cont = 1;
	// 
	while(true){
		let x = new Date(yearWeek,monthWeek,dayWeek +cont);
		cont +=1;
		weekMonth.push(x);
		if ( (weekMonth[weekMonth.length - 1].getDate() == lastDay.getDate()) && 
			 (weekMonth[weekMonth.length - 1].getMonth() == lastDay.getMonth()) ) break;
	};
	// 
	return weekMonth
}
// generate_month_day(new Date).forEach(i => {
// 	let elem = document.createElement('div');
// 	elem.className = 'w';
// 	elem.textContent = i.getDate();
// 	let elem2 = document.createElement('div');
// 	elem2.className = 'b';
// 	elem2.append(elem)
// 	elem2.addEventListener('click', ()=> x.value = `${i.getDate()}-${i.getMonth()}-${i.getFullYear()}`)
// 	document.querySelector('.day').append(elem2);
// })


x = document.querySelector('.wrap');

x.addEventListener('wheel', (e) => {
	let x1 = document.querySelectorAll('.gg')[0],
		x2 = document.querySelectorAll('.gg')[1],
		x3 = document.querySelectorAll('.gg')[2];
	if (e.deltaY == -53) {
		x1.textContent = +x1.textContent -1;
		x2.textContent = +x2.textContent -1;
		x3.textContent = +x3.textContent -1;
	}
	if (e.deltaY == 53) {
		x1.textContent = +x1.textContent +1;
		x2.textContent = +x2.textContent +1;
		x3.textContent = +x3.textContent +1;
	}
});

