const { UserInputError, ApolloError } = require('apollo-server-errors')
const { GraphQLError } = require('graphql')
const { createWriteStream, mkdir } = require('fs')
const { getHelloSchema } = require('../../validation/example')
const { validateInput } = require('../../lib/helpers')
const storeUpload = async ({ stream, filename, mimetype, encoding }) => {
	const id = Date.now()
	const path = `images/${id}-${filename}`

	return new Promise((resolve, reject) =>
		stream
			.pipe(createWriteStream(path))
			.on('finish', () =>
				resolve({
					id,
					location: path,
					filename,
					mimetype,
					encoding,
					success: true,
					message: 'File uploaded successfully'
				})
			)
			.on('error', reject)
	)
}

const processUpload = async ({ file }) => {
	if (await typeCheck(file)) {
		const { createReadStream, filename, mimetype, encoding } = await file.file
		const stream = createReadStream()
		return storeUpload({
			stream,
			filename,
			mimetype,
			encoding
		})
	} else {
		return new UserInputError('File type not supported')
	}
}

//Mime type check
let typeCheck = async ({ file }) => {
	let { mimetype } = await file
	return mimetype === 'image/png' || mimetype === 'image/jpeg'
}
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
			const { name } = await validateInput(getHelloSchema, input)
			return name
		},
		date: () => new Date(Date.now())
	},
	Mutation: {
		singleUpload: async (_, args) => {
			mkdir('images', { recursive: true }, (err) => {
				if (err) throw new GraphQLError(err.message)
			})
			return processUpload(args)
		}
	}
}
