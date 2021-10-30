const { buildSubgraphSchema } = require('@apollo/federation')
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')

const { exampleResolvers, exampleTypeDefs } = require('./example')
const dateScalar = require('../scalars/date')
const typeDefs = mergeTypeDefs([exampleTypeDefs])
const resolvers = mergeResolvers([exampleResolvers,dateScalar])
module.exports = buildSubgraphSchema(
	{
		typeDefs,
		resolvers
	}
)
