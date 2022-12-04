import Users from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { name, email, password, confPassword, addres } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan ConfPassword tidak cocok" });
    }
    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(password, salt);



    try {
        const user = await Users.create({
            name: name,
            email: email,
            password: hasPassword,
            addres: addres
        });
        res.status(200).send({ msg: "Register berhasil", data: user });
    } catch (error) {
        res.status(400).json({ msg: "Email sudah terdaftar" });
        console.log(error);
    }
}


export const login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        return res.status(400).json({ msg: "Wroong password" });
    }
    req.session.userId = user.uuid;
    const id = user.id;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const image = user.image;
    const addres = user.addres;

    const refresh_token = jwt.sign({ uuid, name, email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    });


    await Users.update({ refresh_token: refresh_token }, {
        where: {
            uuid: uuid
        }
    });

    res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    })
    res.status(200).send({
        message: "success",
        data: { id, uuid, name, email, addres, image, refresh_token }
    });

}

export const logout = (req, res) => {
    req.session.destroy(async (err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });

        const refreshToken = req.headers['cookie'];
        if (!refreshToken) return res.sendStatus(204);
        const user = await Users.findOne({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user) return res.sendStatus(204);
        const uuid = user.uuid;

        await Users.update({ refresh_token: null }, {
            where: {
                uuid: uuid
            }
        });
        res.clearCookie('refreshToken');

        return res.json({ msg: "Logout berhasil" });
    });
}