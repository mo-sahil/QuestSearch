const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { getDB } = require("./db");
const config = require("./config");

const PROTO_PATH = "./search.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questionProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

server.addService(questionProto.QuestSearch.service, {
  searchQuestions: async (call, callback) => {
    try {
      const { query, page = 1, pageSize = 10, type } = call.request;
      const skip = (page - 1) * pageSize;

      const database = getDB();
      const collection = database.collection("questions");

      const agg = [
        {
          $search: {
            index: "standard",
            text: {
              query,
              path: "title",
            },
          },
        },
        ...(type ? [{ $match: { type: type } }] : []),
        { $skip: skip },
        { $limit: pageSize },
      ];

      const results = await collection.aggregate(agg).toArray();
      callback(null, { questions: results });
    } catch (error) {
      console.error("Error during searchQuestions:", error.message);
      callback({
        code: grpc.status.INTERNAL,
        message: `Error during search: ${error.message}`,
      });
    }
  },
});

server.bindAsync(
  "0.0.0.0:" + config.grpcPort,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`gRPC server running on port ${config.grpcPort}`);
  }
);

module.exports = server;
