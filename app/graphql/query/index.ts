// import types from "./types";
import log from "../../util/plugin/log";
import * as Nexus from "@nexus/schema";
import connection from "../../util/plugin/connection";
import path from "path";
import {
  DateTimeResolver,
  JSONObjectResolver,
  TimeResolver,
} from "graphql-scalars";
import { Kind } from "graphql";

const jsonScalar = Nexus.asNexusMethod(JSONObjectResolver, "json");
const dateTimeScalar = Nexus.asNexusMethod(DateTimeResolver, "date");
const timeScalar = Nexus.asNexusMethod(TimeResolver, "time");
const ImageUrl = Nexus.scalarType({
  name: "ImageUrl",
  asNexusMethod: "imageUrl",
  description: "Image url custom scalar type",
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

console.log("--- Config graphql loading:");
// ...types,
const schema = Nexus.makeSchema({
  types: [jsonScalar, dateTimeScalar, timeScalar, ImageUrl],
  outputs: {
    schema: __dirname + "/../../schema.graphql",
    typegen: __dirname + "/../../typings.ts",
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(
          __dirname,
          "path",
          "to",
          "contextModule",
          "contextModule.ts"
        ),
        alias: "t",
      },
    ],
    contextType: "t.Context",
  },
  plugins: [
    log,
    Nexus.fieldAuthorizePlugin({
      formatError: (error) => {
        return error.error;
      },
    }),
    Nexus.declarativeWrappingPlugin(),
    connection,
  ],
});

export default schema;
