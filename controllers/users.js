import Users from "../models/user_model.js";
import bcrypt from "bcrypt";


export const getUser = async (req, res) => {
    try {
        const responses = await Users.findAll({
            attributes: ['id', 'uuid', 'name', 'email']
        });
        res.status(200).json(responses)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
export const getUserById = async (req, res) => {
    try {
        const responses = await Users.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['id', 'uuid', 'name', 'email']
        });
        res.status(200).json(responses)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }
        const { name, email, password, confPassword } = req.body;
        let hashPassword;
        if (password === "" || password === null) {
            hashPassword = user.password;
        } else {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
        }
        if (password !== confPassword) {
            return res.status(400).json({ msg: "Password dan ConfPassword tidak cocok" });
        }

        try {
            await Users.update({
                name: name,
                email: email,
                password: hashPassword
            }, {
                where: {
                    id: user.id
                }
            });
            res.json({ msg: "User updated" });
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const register = async (req, res) => {
    const { name, email, password, confPassword } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password dan ConfPassword tidak cocok" });
    }
    const salt = await bcrypt.genSalt();
    const hasPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hasPassword
        });
        res.json({ msg: "Register berhasil" });
    } catch (error) {
        console.log(error);
    }
}
