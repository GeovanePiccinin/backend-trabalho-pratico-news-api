const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const bodyParser = require("body-parser");
const dummyApiSearch = require("./dummy-api-search.json");
const dummyApiCategory = require("./dummy-api-category.json");

const app = express();
app.use(cors());

dotenv.config({ path: path.join(__dirname, "config.env") });

app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

app.get("/everything", async (req, res) => {
  const q = req.query.q ? `q=${req.query.q}` : "q=javascript";

  console.log("/everything", req);

  let data = "";
  const url = `${process.env.API_URL}/everything?${q}&apiKey=${process.env.API_KEY}`;

  const news = await axios
    .get(url)
    .then((response) => {
      console.log(response.status);
      data = response.data;
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(news);
});

app.get("/top-headlines", async (req, res) => {
  console.log("/top-headlines", req);

  const country = req.query.country
    ? `country=${req.query.country}`
    : "country=br";
  const category = req.query.category
    ? `category=${req.query.category}`
    : "category=technology";

  const query = [country, category].join("&");

  console.log("query", query);

  let data = "";
  const url = `${process.env.API_URL}/top-headlines?${query}&apiKey=${process.env.API_KEY}`;
  console.log(url);
  var news = await axios
    .get(url)
    .then((response) => {
      console.log(response.status);
      data = response.data;

      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  res.send(news);
});

app.get("/everything-dummy", async (req, res) => {
  console.log("/everything-dummy", req);
  const q = req.query.q;

  if (!q || q !== "javascript") {
    res.status(500).send({ error: "q param not found or has invalid value" });
  }
  setTimeout(() => {
    res.set("Content-Type", "application/json");
    res.status(200).send(dummyApiSearch);
  }, 2000);
});

app.get("/top-headlines-dummy", async (req, res) => {
  console.log("/top-headlines-dummy", req);
  const country = req.query.country;
  const category = req.query.category;

  console.log("country", country);
  console.log("category", category);
  if (!country || !category || country !== "br" || category !== "technology") {
    res.status(500).send({ error: "incorrect params" });
  }
  setTimeout(() => {
    res.set("Content-Type", "application/json");
    res.status(200).send(dummyApiCategory);
  }, 2000);
});

app.listen(PORT, () => {
  console.log(`Server is started on http://localhost:${PORT}`);
});
