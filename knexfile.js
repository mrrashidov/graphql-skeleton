require('dotenv').config();
const { DB_CLIENT, DB_VERSION, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
module.exports = {
	development: {
		client: DB_CLIENT,
		version: DB_VERSION,
		connection: {
			database: DB_NAME,
			user: DB_USER,
			password: DB_PASSWORD,
			host: DB_HOST,
			port: DB_PORT,
			insecureAuth: true,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: __dirname + '/database/migrations',
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: __dirname + '/database/seeds',
		},
	},

	production: {
		client: DB_CLIENT,
		version: DB_VERSION,
		connection: {
			database: DB_NAME,
			user: DB_USER,
			password: DB_PASSWORD,
			host: DB_HOST,
			port: DB_PORT,
			insecureAuth: true
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: __dirname + '/database/migrations',
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: __dirname + '/database/seeds',
		},
	},
};
