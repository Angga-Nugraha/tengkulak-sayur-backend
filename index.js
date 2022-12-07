import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileUpload from "express-fileupload";
import SequelizeStore from "connect-session-sequelize";
import cors from "cors";
import db from "./config/database.js";
import userRouter from "./routes/user_routes.js";
import productRouter from "./routes/product_routes.js";
import authRouter from "./routes/auth_routes.js";

dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db
});

try {
    await db.authenticate();
    console.log('Database connected...');
    // db.sync();
} catch (error) {
    console.log(error);
}

app.use(cors({
    credentials: true,
    origin: '*'
}));

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cookieParser());
app.use(FileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(userRouter);
app.use(productRouter);
app.use(authRouter);
app.use("/", (req, res) => {
    res.send('welcome to home page');
});
// store.sync();
const PORT = 5000;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server up and running...`);
});
