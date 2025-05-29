// Core Module
const path = require("path");

// External Module
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const DB_PATH =
  "mongodb+srv://chaitanyachaudhary73:FGGyrjub7QrPXHNf@chaitanya-cluster.7bkyhy1.mongodb.net/todo?retryWrites=true&w=majority&appName=chaitanya-cluster";

// Local Module
const todoItemsRouter = require("./routes/todoItemsRouter");
const errorsController = require("./controllers/errors");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.use("/api/todo", todoItemsRouter);

app.use(errorsController.pageNotFound);

const PORT = 3001;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to Mongo: ", err);
  });
