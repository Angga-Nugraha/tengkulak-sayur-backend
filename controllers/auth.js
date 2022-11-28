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
        await Users.create({
            name: name,
            email: email,
            password: hasPassword,
            addres: addres
        });
        res.json({ msg: "Register berhasil" });
    } catch (error) {
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
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;

    const refreshToken = jwt.sign({ uuid, name, email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    const accessToken = jwt.sign({ uuid, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
    });

    await Users.update({ refresh_token: refreshToken }, {
        where: {
            uuid: uuid
        }
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({ uuid, name, email, accessToken });

}

export const me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }
    const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email'],
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.status(200).json({ user });
}

export const logout = (req, res) => {
    req.session.destroy(async (err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat logout" });

        const refreshToken = req.cookies.refreshToken;
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