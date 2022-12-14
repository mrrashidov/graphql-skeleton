const { GraphQLError } = require('graphql')
const { createWriteStream, mkdir } = require('fs')
const { getHelloSchema } = require('./example.validator')
const { validateInput } = require('../../lib/helpers')
const { PubSub } = require('graphql-subscriptions')
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
		throw new GraphQLError('File type not supported')
	}
}

const pubSub = new PubSub()

const books = [
	{
		title: 'The Awakening',
		author: 'Kate Chopin'
	},
	{
		title: 'City of Glass',
		author: 'Paul Auster'
	}
]
const posts = [
	{
		author: 'Joh Doe',
		comment: 'First comment'
	}
]
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
		date: () => new Date(Date.now()),
		books: () => books,
		posts: () => posts
	},
	Subscription: {
		postCreated: {
			subscribe: () => pubSub.asyncIterator(['POST_CREATED'])
		}
	},
	Mutation: {
		singleUpload: async (_, args) => {
			mkdir('images', { recursive: true }, (err) => {
				if (err) throw new GraphQLError(err.message)
			})
			return processUpload(args)
		},
		async createPost(parent, args, context) {
			await pubSub.publish('POST_CREATED', { postCreated: args })
			return posts.push(args)
		}
	}
}
