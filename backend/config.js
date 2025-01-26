require("dotenv").config();

const config = {
  mongoURI: process.env.MONGODB_URI,
  grpcPort: process.env.GRPC_PORT || 50051,
  expressPort: process.env.PORT || 3000,
  corsOrigins: ["Access-Control-Allow-Origin", "http://localhost:5173", "https://quest-search-chi.vercel.app", "https://quest-search-mo-sahils-projects.vercel.app", "https://quest-search-git-main-mo-sahils-projects.vercel.app"
              ],
};

module.exports = config;
