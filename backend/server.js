const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const client = new mongodb.MongoClient(process.env.DB_URL)

const server = express();

server.use(cors());
server.use(express.json());

//ROUTES
server.get("/", (request, response) => {

    response.send({
        message: "the api server is running fine"
    })

})

//Save note to database
server.post("/save-note", async (request, response) => {

    let note_title = request.body.note_title;
    let note_content = request.body.note_content;
    let date_created = new Date().getTime();
    let author_name = "Olu Adeyemo";

    const feedback = await client.db(process.env.DB_NAME).collection("notes").insertOne({
        note_title: note_title,
        note_content: note_content,
        date_created: date_created,
        author_name: author_name
    })

    if(feedback){
        response.send({
            message: "Note saved successfully"
        })

    }


})


server.get("/get-all-saved-notes", async (request, response) => {
    //get the saved notes from mongodb

    const feedback = await client.db(process.env.DB_NAME).collection(process.env.COLLECTION).find().toArray();

    if(feedback){
        response.send({
            message: "note retrieved successfully",
            data: feedback,
            code: "success"
        })
    }

})



server.listen(process.env.PORT1, process.env.HOSTNAME, () => console.log(`Server is running on http://${process.env.HOSTNAME}:${process.env.PORT1}`))