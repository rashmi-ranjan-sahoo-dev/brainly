import mongoose, {model, Schema, Document} from 'mongoose'

interface User extends Document {
    email: string;
    password: string;
}

const UserSchema = new Schema<User>({
    email: { type: String, unique:true, required: true},
    password:  { type: String, required: true}
})

export const UsernModel = model<User>("User",UserSchema);

interface Content extends Document {
  title: string;
  link: string;
  tags: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
}

const ContentSchema = new Schema<Content>({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
});

export const ContentModel = model<Content>("Content", ContentSchema);