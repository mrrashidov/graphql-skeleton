const yup = require('yup')

let getHelloSchema = yup.object().shape({
	name: yup.string().required().min(3).max(6)
});
module.exports = {
	getHelloSchema
}
