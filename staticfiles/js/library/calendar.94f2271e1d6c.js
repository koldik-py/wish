class Calendar {
	constructor(date = new Date){
		this.date = date;
		this.month = date.getMonth();
		this.year = date.getFullYear();

		this.dateList = this.generate_month_day(date);
		this.requestDjango = this.request_date_django(this.dateList);
	}

	// Дата JS > 'Среда, 29 Июля'
	rename_day(date) {
		let week = date.getDay(),
		    day = date.getDate(),
		    month = date.getMonth(),
		    week_str = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
		    month_str = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля',
		                'Августа','Сентября','Октября','Ноября','Декабря'],
		    full_date = `${week_str[week]}, ${day} ${month_str[month]}`;

		return  full_date
	}
	// 'yyyy-mm-dd' > '13 октября 2020г.'
	rename_date(date) {
		let month = date.split('-')[1],
			day = date.split('-')[2],
			month_str = ['января','февраля','марта','апреля','мая','июня','июля',
						'августа','сентября','октября','ноября','декабря'];

		if (+day[0] == 0) day = day[1]

		return  `${day} ${month_str[+month-1]} ${date.split('-')[0]} г.`
	}
	// '13 октября 2020г.' > 'yyyy-mm-dd'
	rename_date_reverse (date) {
		let month_str = ['января','февраля','марта','апреля','мая','июня','июля',
					'августа','сентября','октября','ноября','декабря'],
			month = date.split(' ')[1],
			day = date.split(' ')[0];

		month = month_str.findIndex(i => i == month);
		if (day.length == 1) day = `0${day}`

		return `${date.split(' ')[2].slice(0,4)}-${month+1}-${day}`
	}
	// Генерация месяца в списке (как в питоне)
	generate_month_day(date) {
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

	// format js > django (Date > 'yyyy-mm-dd')
	date_format_django(date) {
		let year = date.getFullYear(),
			month = date.getMonth() +1,
			day = date.getDate();
		if (month < 10) month = `0${month}`;
		if (day < 10) day = `0${day}`;
		
		return `${year}-${month}-${day}`
	}

	// format django > js ('yyyy-mm-dd' > Date)
	date_format_js(dateStr) {
		let year = +dateStr.split('-')[0],
			month = +dateStr.split('-')[1] -1,
			day = +dateStr.split('-')[2];

		return new Date(year, month, day)
	}

	// request django (firstDay,lastDay)
	request_date_django(date) {
		return `${this.date_format_django(date[0])},${this.date_format_django(date[date.length-1])}`
	}

	// Сравнение дат js
	comparison_date(date1,date2) {
		let year1 = date1.getFullYear(),
			month1 = date1.getMonth(),
			day1 = date1.getDate(),
			year2 = date2.getFullYear(),
			month2 = date2.getMonth(),
			day2 = date2.getDate();

		return ((year1 == year2) && (month1 == month2) && (day1 == day2))
	}
	comparison_month(date1,date2) {
		let year1 = date1.getFullYear(),
			month1 = date1.getMonth(),
			year2 = date2.getFullYear(),
			month2 = date2.getMonth();

		return ((year1 == year2) && (month1 == month2))
	}
}