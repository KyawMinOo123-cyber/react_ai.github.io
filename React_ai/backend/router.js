import express from "express";
import { Story } from "./Model.js";

const router = express.Router();

//Router for saving new Story;
router.post('/',async(req,res)=>{
    try{
        const newStory = {
            title:req.body.title,
            content:req.body.content
        }

        const story = await Story.create(newStory)
        return res.status(201).send(story);
    }catch(err){
        console.log(err)
        res.status(500).send({message:err.message})
    }
})

//Router for getting all favorite Stories form database

router.get('/',async(req,res)=>{
    try{
        const story = await Story.find({})
        return res.status(200).json(
            {
                count:story.length,
                data:story
            }
        )
    }catch(err){
        console.log(err)
        res.status(500).send({message:err.message})
    }
})

//Router for remove story

router.delete('/:id',async (req,res)=>{
    try{
        const {id} = req.params
        const result = await Story.findByIdAndDelete(id);
        if(!result){
            return res.status(404).json({message:"Story Not found"})
        }
        return res.status(200).send({message:"Story deleted successfully"})

    }catch(error){
        console.log(error)
        res.status(500).send({message:error.message})
    }
});

export default router;