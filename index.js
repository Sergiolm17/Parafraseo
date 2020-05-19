const translate = require("google-translate-free");
const languages = require("./langs").langs;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static("public"));
const plagiarism = require("plagiarism");
const PORT = process.env.PORT || 3000;

app.post("/", async (req, res) => {
  var randlangs = shuffle(Object.keys(languages));

  try {
    const rute = [];

    //const rute = lng.map((element) => languages[element]);
    //console.log(rute);

    var { text } = req.body;
    var retutext = "";

    var to = randlangs.next().value;
    rute.push(languages[to]);
    retutext = await translate(text, { to });

    to = randlangs.next().value;
    rute.push(languages[to]);
    retutext = await translate(retutext.text, { to });

    to = randlangs.next().value;
    rute.push(languages[to]);
    retutext = await translate(retutext.text, { to });

    const es = await translate(retutext.text, { to: "es" });
    console.log(es.text, rute);
    res.send({ text: es.text, rute, erro: "" });
  } catch (err) {
    console.error("err", err);
    res.send({ text: "", rute, err });
  }
});
function createtranslation(params) {}
//19d91456b9bcaaaa134c8c2c038d4703
app.post("/check", async (req, res) => {
  var { text } = req.body;
  console.log(text);

  const rescheck = await plagiarism(text, {
    "text.ru": {
      userkey: "19d91456b9bcaaaa134c8c2c038d4703",
      jsonvisible: true,
    },
  });
  console.log(rescheck);
  res.send(rescheck);
});
var request = require("request");
var headers = {
  "api-key": "60d93569-01f2-4c95-9357-44966d686647",
};
app.post("/generate", async (req, res) => {
  var { text } = req.body;

  const formData = {
    text,
  };
  var options = {
    url: "https://api.deepai.org/api/text-generator",
    method: "POST",
    headers: headers,
    formData,
  };
  request.post(options, (error, response, body) => {
    res.send(body);
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });
});

function* shuffle(array) {
  var i = array.length;

  while (i--) {
    yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
  }
}
app.listen(PORT, function () {
  console.log("Example app listening on port 3000!");
});
