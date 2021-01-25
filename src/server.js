const express = require("express")
const cors = require("cors")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
const app = express()
const {
    catchAll,
    unauthorized,
    forbidden,
    notFound,
    badRequestHandler,
} = require("./errorHandler");

const profilesRoute = require("./services/profiles")

const port = process.env.PORT

app.use(cors());
app.use(express.json());

// Endpoints


app.use("/profiles", profilesRoute)

app.use(unauthorized);
app.use(forbidden);
app.use(notFound);
app.use(badRequestHandler);
app.use(catchAll);



mongoose
    .connect(process.env.MONGO_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        app.listen(port, () => {
            console.log("\x1b[34m", "Running on port", port, "\x1b[37m")
            console.log(listEndpoints(app))
        })
    )
    .catch(err => console.log(err))