import requireAll = require("require-all");
const dirNameList = ["interface", "mutation", "object", "query"];

// console.log("--- Config types Loading:1qqq");

const types = dirNameList.map((dirName) => {
  return requireAll({
    dirname: `${__dirname}/${dirName}`,
    filter: process.env.NODE_ENV === "production" ? /(.+)\.js$/ : /(.+)\.ts$/,
    // filter: /(.+)\.ts$/,
    recursive: true,
    resolve(obj) {
      return "default" in obj ? obj.default : obj;
    },
  });
});

export default types;
