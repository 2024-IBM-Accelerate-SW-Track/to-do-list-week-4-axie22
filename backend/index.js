const express = require("express");
const app = express();
const port = process.env.PORT || 3001; 
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require("fs").promises;

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", (req, res) => {
    res.send({ message: "Connected to Backend server!" });
});

app.post("/add/item", addItem);

async function addItem(request, response) {
    try {
        const { id, task, currentDate, dueDate } = request.body.jsonObject;
        const newTask = {
            ID: id,
            Task: task,
            Current_date: currentDate,
            Due_date: dueDate
        };
       
        const data = await fs.readFile("database.json");
        const json = JSON.parse(data);
  
        json.push(newTask);

        await fs.writeFile("database.json", JSON.stringify(json));
        console.log('Successfully wrote to file');
        response.sendStatus(200);
    } catch (err) {
        console.log("error: ", err);
        response.sendStatus(500);
    }
}

app.get("/tasks", async (req, res) => {
    try {
        const data = await fs.readFile("database.json");
        const tasks = JSON.parse(data);
        res.json(tasks);
    } catch (err) {
        console.log("error: ", err);
        res.sendStatus(500);
    }
});

