const { connectDB } = require("./db");
const grpcServer = require("./grpc");
require("./expressServer");

connectDB();
