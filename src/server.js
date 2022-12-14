require('dotenv').config()
const express = require('express'),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	{ createServer } = require('http'),
	{ WebSocketServer } = require('ws'),
	{ ApolloServer } = require('@apollo/server'),
	{ expressMiddleware } = require('@apollo/server/express4'),
	{ ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer'),
	{ ApolloServerPluginInlineTrace } = require('@apollo/server/plugin/inlineTrace'),
	{ startStandaloneServer } = require('@apollo/server/standalone'),
	{ useServer } = require('graphql-ws/lib/use/ws'),
	{ context } = require('./middleware'),
	{ graphqlUploadExpress } = require('graphql-upload'),
	schema = require('./schema')

async function startApolloServer(port) {
	const app = express()
	app.use(graphqlUploadExpress())
	app.disable('x-powered-by')
	app.get('/', async (req, res) => {
		return res.status(200).json({
			errors: true,
			message: 'Cannot get'
		})
	})

	const httpServer = createServer(app)
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: '/graphql'
	})
	const serverCleanup = useServer({ schema }, wsServer)
	let SENSITIVE_REGEX
	const server = new ApolloServer({
		schema,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose()
						}
					}
				}
			},
			ApolloServerPluginInlineTrace({
				includeErrors: {
					transform: (err) => (err.message.match(SENSITIVE_REGEX) ? null : err)
				}
			})
		]
	})

	const { url } = await startStandaloneServer(server, {
		context
	})

	app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server))
	httpServer.listen(port, () => {
		console.log(`🚀 Server listening at: ${url}`)
	})
}

startApolloServer(3000)
