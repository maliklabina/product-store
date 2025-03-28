 import arcjet , {tockenBucket , shield , detecctBot} from '@arcjet/node';

 import dotenv from 'dotenv';
 dotenv.config();

 //initialize arcjet
 export const aj = arcjet({
    key: process.env.ARCJET_KEY , 
    characteristics: ["ip.src"],
    rules :[
        // shield protects your app from common attacks such as SQL injection and cross-site scripting (XSS)
        shield({mode:"LIVE"}),
        detectBot({
            mode: "LIVE",
            // block all bots except search engines
            allow:[
                "CATEGORY:SEARCH_ENGINE "
            ]
        }),
        // rate limiting

        tockenBucket({
            mode: "LIVE",
            refillRate : 5,
            interval:10,
            capacity:10,

        }),

    ],
 });