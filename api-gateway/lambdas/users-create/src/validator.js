const schema = require('./schema');
module.exports.validate = (data) => {
  return schema.schema.validate(data);
};
