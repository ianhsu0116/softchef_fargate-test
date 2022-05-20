const express = require("express");
const app = express();
const cors = require("cors");

try {
    app.use(express.json());
    app.use(cors());

    const testaDatas = [
        { id: 1, name: "Mark Wilkins", book: "Learning Amazon Web Services (AWS)" },
        { id: 2, name: "Steve Morad", book: "AWS Certified Advanced Networking" },
    ];

    //READ Request Handlers

    app.get("/test", (req, res) => {
        try {
            console.log("=== GET request  at / ===");
            res.send({ msg: "testtesttesttesttesttest" });
            // res.sendFile("./healthcheck.html", { root: __dirname });
        } catch (e) {
            console.log(e);
        }
    });
    app.get("/", (req, res) => {
        try {
            console.log("=== GET request  at / ===");
            res.send({ msg: "goodododododododod" });
            // res.sendFile("./healthcheck.html", { root: __dirname });
        } catch (e) {
            console.log(e);
        }
    });

    // app.get('/api/test/health', (req, res) => {
    //     console.log('=== GET request  at /api/authors/healthcheck ===');
    //     res.sendFile('./healthcheck.html', { root: __dirname });
    // });

    // app.get('/api/datas', (req, res) => {
    //     console.log('=== GET request  at /api/authors ===');
    //     res.send(testaDatas);
    // });

    // app.get('/api/datas/:id', (req, res) => {
    //     const data = testaDatas.find(c => c.id === parseInt(req.params.id));
    //     console.log('=== GET request  at /api/authors/{id} ===');
    //     if (!data) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    //     res.send(data);
    // });

    app.get("*", (req, res) => {
        try {
            res.send({ msg: "nogood" });
            console.log("nogood");
        } catch (e) {
            console.log(e);
        }
    });

    //PORT ENVIRONMENT VARIABLE
    // const port = process.env.PORT || 80;
    const port = 80;
    app.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}..`));
} catch (e) {
    console.log(e);
}
