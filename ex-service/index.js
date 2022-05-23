const express = require("express");
const app = express();

app.use(express.json());

//READ Request Handlers
app.get("/", (req, res) => {
  try {
    console.log("=== GET request  at / ===");
    res.send({ msg: "goodododododododod" });
    // res.sendFile("./healthcheck.html", { root: __dirname });
  } catch (e) {
    console.log(e);
  }
});

app.get("*", (req, res) => {
  try {
    console.log("=== GET request  at / ===");
    res.send({ msg: "nogood" });
  } catch (e) {
    console.log(e);
  }
});

//PORT ENVIRONMENT VARIABLE
// const port = process.env.PORT || 80;
const port = 80;
app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}..`));
