import express from "express"
import cors from 'cors'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import { PORT,mongoDBURL } from "./config.js"
import router from "./router.js"

dotenv.config()
const API_KEY= process.env.API_KEY

const app = express()
//Middlewares
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>[
    res.status(200).send('Welcome')
])

app.use('/story',router)


//post req for Ai
app.post('/completions',async (req,res)=>{
    try{
        const respnse = await fetch('https://api.openai.com/v1/chat/completions',{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${API_KEY}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                model:"gpt-3.5-turbo",
                messages:[{role:"system",content:req.body.message}]
            })
        })

        const data = await respnse.json();
        res.send(data)
    }catch(err){
        console.error(err)
    }
})



//connecting to database
mongoose.connect(mongoDBURL)
.then(()=>{
    console.log('Applicatin connected to database Successfully')
    app.listen(PORT,()=>console.log(`Server is listening ${PORT}`))
})
.catch(err=>console.error(err))