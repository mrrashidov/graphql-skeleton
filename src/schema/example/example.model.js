const Model = require('../../core/model')

class ExampleModel extends Model {
	tableName = 'example'
}

module.exports = new ExampleModel()
