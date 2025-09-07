import mongoose from "mongoose";


const analyzerSchema = new mongoose.Schema({
   streams: {
    type: [String], 
    required: true
  }
});



const analyzerModel=mongoose.models.analyzers||mongoose.model('analyzers',analyzerSchema);

export default analyzerModel;
