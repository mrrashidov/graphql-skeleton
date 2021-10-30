const { gql } = require('apollo-server-core')
module.exports = gql`
	scalar Date
	type Query {
		#[field(name: "hello")]
		hello(name: String): String
		date: Date
	}
`
