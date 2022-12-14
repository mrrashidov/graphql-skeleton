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

type Book {
	title: String
	author: String
}

type Post {
	comment: String
	author: String
}

type Query {
	#[field(name: "hello")]
	hello(name: String): String
	date: Date,
	books: [Book]
	posts: [Post]
}

type Mutation {
	singleUpload(file: Upload!): UploadResult
	createPost(author: String, comment: String): Post
}

type Subscription {
	postCreated: Post
}
`
