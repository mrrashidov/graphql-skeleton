function formatDate(date) {
	const local = new Date(date)
	local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
	return local.toJSON().slice(0, 10)
}

module.exports = formatDate
