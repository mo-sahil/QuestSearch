require("dotenv").config();

const config = {
  mongoURI: process.env.MONGODB_URI,
  grpcPort: process.env.GRPC_PORT || 50051,
  expressPort: process.env.PORT || 3000,
  corsOrigins: ["http://0.0.0.0:0", "http://localhost:5173", "https://quest-search-chi.vercel.app/"],
};

module.exports = config;
