function generateMonthCalendar(year, month) {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let week = new Array(7).fill(null);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const dayOfWeek = currentDate.getDay();

        week[dayOfWeek] = day;

        if (dayOfWeek === 6 || day === lastDay.getDate()) {
            weeks.push(week);
            week = new Array(7).fill(null);
        }
    }

    return weeks;
}

module.exports = {
  generateMonthCalendar
};
