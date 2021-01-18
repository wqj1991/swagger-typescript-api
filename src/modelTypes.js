const { formatters } = require("./typeFormatters");
const { checkAndRenameModelName } = require("./modelNames");
const { config } = require("./config");
const { getTypeData } = require("./components");
const _ = require("lodash");

const prepareModelType = (typeInfo) => {
  const typeData = getTypeData(typeInfo);
  let { typeIdentifier, name: originalName, content, type, description } = typeData;

  if (config.generateUnionEnums && typeIdentifier === "enum") {
    typeIdentifier = "type";
  }

  if (typeIdentifier === "interface" && content && content.length > 0) {
    _.forEach(content, (e) => {
      if (e.field) {
        let field = e.field;
        if (field) {
          const arr = _.split(field, ":");
          if (arr.length === 2) e.field = arr[0] + ":" + _.replace(arr[1], "object", "any");
        }
      }
    });
  }

  const resultContent = formatters[type] ? formatters[type](content) : content;
  const name = checkAndRenameModelName(originalName);

  return {
    typeIdentifier,
    name,
    description,
    rawContent: content,
    content: resultContent,
    typeData,
  };
};

module.exports = {
  prepareModelType,
};
