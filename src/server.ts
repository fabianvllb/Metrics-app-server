import express from "express";
import cors from "cors";
import config from "./config/server-config";
import routes from "./routes";

const app = express();
/* app.use(cors()); */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://fmetrics-app.netlify.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

//---------------------------- Server Config ---------------------------------
console.log(config);
const {
  app: { port },
} = config;

// Start database connection
//import "./models/db.js";

//----------------------------- Middleware -----------------------------------
// Add logging
//app.use(morgan("short"));

// Configure app to use bodyParser(), this will let us get the data from a POST
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   cors({
//     origin: "*",
//   })
// );

//----------------------------- Routing --------------------------------------
// Use the API routes when path starts with /api
app.use("/api", routes);

app.listen(port, () => console.log(`Backend running on port ${port}`));
