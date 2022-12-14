const { GraphQLError } = require('graphql')
const { verify } = require('jsonwebtoken')
const can =
	(permission, modal = false) =>
	(next) =>
	(root, args, context, info) => {
		context.user = JSON.parse(context.headers.user ? context.headers.user : null)
		context.permissions = JSON.parse(context.headers.permissions ? context.headers.permissions : null)

		const access = typeof permission === 'string' ? context.permissions.includes(permission) : permission.some((r) => context.permissions.includes(r))

		if (!context.user)
			throw new GraphQLError('Unauthenticated.', {
				extensions: {
					code: 'UNAUTHENTICATED'
				}
			})
		if (context.permissions && !access)
			throw new GraphQLError('You are not authorized to perform this action.', {
				extensions: {
					code: 'FORBIDDEN'
				}
			})
		return modal ? access : next(root, args, context, info)
	}

function haveAccess(permissions, permission) {
	return typeof permission === 'string' ? permissions.includes(permission) : permission.some((r) => permissions.includes(r))
}

const PUBLIC_ACTIONS = ['login', 'storeApplicationForm', 'hello']

const actionIsPublic = ({ query }) => PUBLIC_ACTIONS.some((action) => query.includes(action))

const isIntrospectionQuery = ({ operationName }) => operationName === 'IntrospectionQuery'

const shouldAuthenticate = (body) => !isIntrospectionQuery(body) && !actionIsPublic(body)

const context = async ({ req }) => {
	if (shouldAuthenticate(req.body)) {
		return verify(req.headers.authorization, process.env.JWT_ACCESS_TOKEN_SECRET)
	}
}

module.exports = {
	context,
	can,
	haveAccess
}
