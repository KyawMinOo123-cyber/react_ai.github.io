import mongoose from "mongoose";

const storySchema = mongoose.Schema(
    {
        title:{
            type:String
        },
        content:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

export const Story = mongoose.model('Story',storySchema)