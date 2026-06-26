import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        title:{
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        status:{
            type: String,
            enum: ['Pendiente', 'En Progreso', 'Completada'],
            default: 'Pendiente',
        },
        tags: {
            type: [
                {
                    name: { type: String, required: true, trim: true },
                    color: { type: String, required: true, trim: true },
                }
            ],
            default: [],
        },
        clienteId:{
            type: String,
        },
        deleted: {
            type: Boolean,
            default: false
       },
        },
       { timestamps: true}
);

export default mongoose.model('Task', taskSchema);
