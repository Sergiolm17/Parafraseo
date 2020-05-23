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
    console.log(req.body);

    var { text, number } = req.body;
    var retutext = { text };

    for (let index = 0; index < number + 1; index++) {
      to = index === number ? "es" : randlangs.next().value;
      retutext = await translate(retutext.text, {
        to,
      });
      let fix_esp = await translate(retutext.text, {
        to: "es",
      });
      rute.push({
        from: languages[retutext.from.language.iso],
        to: languages[to],
        fix_esp: fix_esp.text,
        text: retutext.text,
      });
    }

    //    console.log({ text: es.text, rute, erro: "" });

    res.send({
      input: text,
      output: rute[rute.length - 1].text || null,
      rute,
      erro: "",
    });
  } catch (err) {
    console.error("err", err);
    res.send({ text: "", rute, err });
  }
});
async function generatetranslate(params) {}
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
  console.log(text);

  const es = await translate(text, { to: "en" });
  const formData = {
    text: es.from.language.iso === "en" ? text : es.text,
  };
  var options = {
    url: "https://api.deepai.org/api/text-generator",
    method: "POST",
    headers: headers,
    formData,
  };
  request.post(options, async (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const { output, id } = JSON.parse(body);
      const es = await translate(output, { to: "es" });
      res.send({ es, en: output, id });
    }
  });
});

function* shuffle(array) {
  let i = array.length;

  while (i--) {
    yield array.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
  }
}
app.listen(PORT, () => console.log("Example app listening on port 3000!"));
