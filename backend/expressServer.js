const express = require("express");
const cors = require("cors");
const { getDB } = require("./db");
const config = require("./config");

const app = express();
app.use(
  cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.sendStatus(200);
});

app.post("/api/search", async (req, res) => {
  const { query, page = 1, pageSize = 10, type } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const skip = (page - 1) * pageSize;
    const database = getDB();
    const collection = database.collection("questions");

    const agg = [
      {
        $search: {
          index: "standard",
          text: {
            query,
            path: ["title", "blocks.text"],
          },
        },
      },
      ...(type ? [{ $match: { type: type } }] : []),
      { $skip: skip },
      { $limit: pageSize },
    ];

    const results = await collection.aggregate(agg).toArray();
    res.json({ questions: results });
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).json({ error: "Error fetching search results" });
  }
});

app.listen(config.expressPort, () => {
  console.log(`Express server running on port ${config.expressPort}`);
});
