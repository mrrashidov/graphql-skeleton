const { getHelloSchema } = require('../../validation/example')
const { validateInput } = require('../../helpers')
module.exports = {
	Query: {
		/**
		 *
		 * @param _
		 * @param {Object} input
		 * @param {*=} input.name
		 * @returns {Promise<*>}
		 */
		hello: async (_, input) => {
			const { name } = await validateInput(getHelloSchema,input)
			return name
		},
		date: () => new Date(Date.now())
	}
}
