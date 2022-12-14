module.exports = `#graphql
scalar Date
scalar Upload

type UploadResult {
	success: Boolean!
	message: String!
	filename: String
	encoding: String
	mimetype: String
	location: String
}

type Query {
	#[field(name: "hello")]
	hello(name: String): String
	date: Date
}

type Mutation {
	singleUpload(file: Upload!): UploadResult
}
`
