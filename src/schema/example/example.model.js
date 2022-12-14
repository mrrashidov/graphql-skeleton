const Model = require('./model')

class Example extends Model {
	tableName = 'example'
}

module.exports = new Example()
