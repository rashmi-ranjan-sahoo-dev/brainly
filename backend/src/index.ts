import express, { Request,Response} from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
//@ts-ignore
import { JWT_SECRET, MONGO_URL } from '../config';
import {z} from 'zod'
import bcrypt from 'bcrypt'
import { ContentModel, UsernModel } from './db';
import { userMiddleware } from './middleware';

const app = express();
app.use(express.json());
//@ts-ignore
app.post('/api/v1/signup',async function(req:Request,res: Response){
     
    const validedDate = z.object({
        email:z.string().min(4).max(40).email(),
        password:z.string().min(8).regex(/[A-Z]/, "Must include at least one uppercase letter")
                                  .regex(/[a-z]/, "Must include at least one lowercase letter")
                                  .regex(/[0-9]/, "Must include at least one digit")
                                  .regex(/[^A-Za-z0-9]/, "Must include at least one special character") 
    })

    const parsedDataWithSuccess = validedDate.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message: "incorrect format",
            error:parsedDataWithSuccess.error
        })

        return
    }

    const {email,password} = req.body;

    try{

        const existingUser = await UsernModel.findOne({ email })

        if(existingUser){
            return res.status(409).json({ message: "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);  


        const user = await UsernModel.create({
            email:email,
            password:hashedPassword
        })

        res.json({
            message: "you are signend up"
        })
    } catch(error: any) {
        console.error("Error during user signup:", error);
        res.status(500).json({
            message: "An error occurred during signup",
            error:error.message
        })
    }

})

app.post('/api/v1/signin',async function(req: Request,res: Response){
     const validedDate = z.object({
        email:z.string().min(4).max(40).email(),
        password:z.string().min(8).regex(/[A-Z]/, "Must include at least one uppercase letter")
                                  .regex(/[a-z]/, "Must include at least one lowercase letter")
                                  .regex(/[0-9]/, "Must include at least one digit")
                                  .regex(/[^A-Za-z0-9]/, "Must include at least one special character") 
    })

    const parsedDataWithSuccess = validedDate.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message: "incorrect format",
            error:parsedDataWithSuccess.error
        })

        return
    }
    const {email,password} = req.body;

    try {
        const response: any = await UsernModel.findOne({ email: email })

        if(!response){
            res.status(403).json({
                message: "User not found"
            })
        }

        const passwordMatch = await bcrypt.compare(password,response.password)

        if(passwordMatch){
            const token: any = jwt.sign({ id: response._id,}, JWT_SECRET);

            res.json({
                token
            })
        }  else {
            res.status(403).json({
                message: "Incorrect credentials"
            })
        }
    } catch (error: any){
        res.status(500).json({
            message: "An error occurred during signin",
            error: error.message
        })
    }

})

//@ts-ignore
app.post('/api/v1/content',userMiddleware, async function(req: Request,res: Response){
     
    const {title,link, tags} = req.body;

    // @ts-ignore - userId added by middleware
    const userId = req.userId;

    if(!title || !link){
       return res.status(400).json({ message: 'Title and link are required' })
    }

    try{
        const content = await ContentModel.create({
            title:title,
            link:link,
            tags:tags,
            userId:userId
        })

        res.status(201).json({ message: "Content created", content})
    } catch(error: any){
        res.status(500).json({ message: 'Error creating content', error:error.message})
    }

})

app.get('/api/v1/content',userMiddleware, async function(req:Request,res:Response){
    // @ts-ignore - userId added by middleware
    const userId = req.userId;

    try{
        const contents = await ContentModel.find({ userId }).populate('tags');
        res.json(contents);
    } catch(error: any){
        res.status(500).json({ message: 'Error fetching content', error: error.message})
    }
})
//@ts-ignore
app.delete('/api/v1/content/:id',userMiddleware, async function(req:Request,res: Response){
    
    const contentId = req.params.id;

    //@ts-ignore - userId added by middleware
    const userId = req.userId;

    if(!mongoose.Types.ObjectId.isValid(contentId)){
        return res.status(400).json({ message: 'invalid content ID'})
    }

    try{

        const content = await ContentModel.findOne({_id: contentId, userId });

        if(!content) {
            return res.status(404).json({ message: 'Content not found or unauthoirized'})
        }

        await ContentModel.deleteOne({_id: contentId});

        res.json({ message: 'Content deleted successfully'});

    } catch (error: any){
        res.status(500).json({message: 'Error deleting content', error: error.message})
    }
})

app.get('/api/v1/brain/:shareLink',function(req:Request,res: Response){

    const { shareLink } = req.params;

    res.json({
        message: 'Share link received',
        shareLink
    })
    
})

function main(){
    mongoose.connect(MONGO_URL)
    app.listen(3000, () => console.log("app listening on the port no 3000"));
}

main();