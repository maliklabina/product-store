import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import {sql} from "./config/db.js"
 
dotenv.config();

const app = express();


const PORT = process.env.PORT || 3001;
console.log(PORT)

app.use(express.json());
app.use(cors());

app.use(helmet());   //helmet is an security middleware that helps you protect your app by setting various HTTP headers \
app.use(morgan("dev"));    //log the request and response in the console



app.use(async(req , res , next) => {
     try{
        const decision = await aj.protect(req , {
            requested:1   // specify that each request consumes 1 token 
        })

        if(decision.isDenied()){
            if(decision.reason.isRatelimit()){
                res.status(429).json({error:"too mamy requests"})
            }
            else if(decision.reason.isBot()){
                res.status(403).json({error:"bot access denied"})
            }
            else{
                res.status(403).json({error:"forbidden"})
            }
            return 
        }

        // check for spoofed bots
        if(decision.results.some((result ) => result.reason.isBot() && result.reason.isSpoofed ())){
            res.status(403).json({error:"spoofed bot detected"})
            return;
        }

        next(); 
     }catch(err){
        console.log("Arcjet error" , err);
        next(err);
     }
})



//routes
app.use("/api/products", productRoutes)


async function initDB() {
    try{
        await sql`
        CREATE TABLE IF NOT EXISTS products( 
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        `
    console.log("database initialized")
    }catch(err){
        console.log(err)

    }
}

initDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running on port " + PORT);
    });

});

