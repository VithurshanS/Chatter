import mongoose from 'mongoose';

export default async function connectDatabase(){
    await mongoose.connect("mongodb+srv://vithurshansivanathan2002:A7u6UNimTh1ow8w1@cluster0.i8rqa.mongodb.net/messager");
}