const { DB_CLIENT, DB_VERSION, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env,
	Knex = require('knex'),
	knex = Knex({
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
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}),
	pagination = require('../lib/pagination')
module.exports = class Model {
	constructor() {
		this.db = knex
	}

	tableName = ''
	select = [ '*' ]

	/**
	 * @param {Object} params
	 * @param {Object} options
	 * @param {Function} options.queryBuilder
	 * @param {Array} options.select
	 * @param {Object} options.pagination
	 * @returns {Promise<T>}
	 */
	getAll(params, options = {}) {
		let qb, select, paginationOptions

		qb = options.hasOwnProperty('queryBuilder') ? options.queryBuilder : false
		select = options.hasOwnProperty('select') ? options.select : this.select
		paginationOptions = options.hasOwnProperty('pagination') ? options.pagination : null

		let baseQuery = this.db.select(select).from(this.tableName)

		const query = typeof qb === 'function' ? qb(baseQuery) : baseQuery

		return pagination(query, params, paginationOptions)
	}

	/**
	 * @param {Object|ID} options
	 * @param {string} options.tableName
	 * @param {Array|Function} options.where
	 * @param {Array} options.select
	 * @param {Function} options.queryBuilder
	 * @returns {Knex.QueryBuilder<TRecord, TResult>}
	 */
	get(options = {}) {
		let table, where, select, qb
		if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
			table = options.hasOwnProperty('tableName') ? options.tableName : this.tableName
			where = options.hasOwnProperty('where') ? options.where : { id: options }
			select = options.hasOwnProperty('select') ? options.select : this.select
			qb = options.hasOwnProperty('queryBuilder') ? options.queryBuilder : false
		} else {
			table = this.tableName
			where = { id: options }
			select = this.select
		}
		const baseQuery = this.db(table).select(select).where(where)
		if (qb && typeof qb === 'function') {
			qb(baseQuery)
		}
		return baseQuery
	}

	/**
	 * @param {Object} data
	 * @param {Object} options
	 * @param {string} options.tableName
	 * @param {Object|Function} options.where
	 * @returns {Knex.QueryBuilder<TRecord, number[]>}
	 */
	create(data, options = {}) {
		let table, where

		table = options.hasOwnProperty('tableName') ? options.tableName : this.tableName
		where = options.hasOwnProperty('where') ? options.where : false

		let baseQuery = this.db(table).insert(data)
		if (where) {
			baseQuery.where(where)
		}
		return baseQuery
	}

	/**
	 *
	 * @param {Object} data
	 * @param {Object|ID} options
	 * @param {string} options.tableName
	 * @param {Object|Function} options.where
	 * @returns {Promise<T>}
	 */
	update(options, data) {
		let table, where
		if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
			table = options.hasOwnProperty('tableName') ? options.tableName : this.tableName
			where = options.where
		} else {
			table = this.tableName
			where = { id: options }
		}

		return this.db(table).where(where).update(data)
	}

	/**
	 * @param {Object|ID} options
	 * @param {string} options.tableName
	 * @param {Object|Function} options.where
	 * @returns {Promise<T>}
	 */
	delete(options) {
		let table, where
		if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
			table = options.hasOwnProperty('tableName') ? options.tableName : this.tableName
			where = options.where
		} else {
			table = this.tableName
			where = { id: options }
		}

		return this.db(table).where(where).del()
	}
}
