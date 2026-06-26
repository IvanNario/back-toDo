
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function createToken(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado");
    }

    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

export async function register(req, res) {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password) 
            return res.status(400).json({ok: false, message: 'Todos los campos son obligatorios'});

        const exist= await User.findOne({email});
        if(exist) return res.status(409).json({ok: false, message: 'El usuario ya esta registrado'});

        const hash = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hash});
        await user.save();

        const token = createToken(user._id);
        res.status(201).json({token, user:{id: user._id, name: user.name, email: user.email}});
    } catch(e){
        res.status(500).json({ok: false, message: 'Error en el servidor', error: e.message});
    }
}

export async function login(req, res) {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({ message: 'Email o constraseña incorrecta'});

        const ok = await bcrypt.compare(password, user.password);
        if(!ok) return res.status(401).json({ message: 'Email o constraseña incorrecta'});

        const token = createToken(user._id);
        res.json({token, user:{id: user._id, name: user.name, email: user.email}});
    } catch(e){
        res.status(500).json({message: 'Error del servidor'});

    }
}

export async function profile(req, res) {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener perfil"
        });
    }
}

export async function updateProfile(req, res) {
    try {
        const name = String(req.body?.name ?? "").trim();
        const photoUrl = String(req.body?.photoUrl ?? "").trim();
        const update = {};

        if (name) update.name = name;
        if (photoUrl || req.body?.photoUrl === "") update.photoUrl = photoUrl.slice(0, 250000);

        if (!Object.keys(update).length) {
            return res.status(400).json({
                message: "No hay cambios para guardar"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            update,
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil"
        });
    }
}

export async function updatePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword || String(newPassword).length < 6) {
            return res.status(400).json({
                message: "La contraseña nueva debe tener al menos 6 caracteres"
            });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) {
            return res.status(401).json({
                message: "La contraseña actual no coincide"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar contraseña"
        });
    }
}
