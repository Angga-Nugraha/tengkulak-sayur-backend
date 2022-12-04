import Users from "../models/user_model.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";


export const getUser = async (req, res) => {
    try {
        const responses = await Users.findAll({
            attributes: ['id', 'uuid', 'name', 'email', 'addres']
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
            attributes: ['id', 'uuid', 'name', 'email', 'addres', 'image', 'refresh_token']
        });
        res.status(200).send({ msg: 'success', data: responses, })
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

        const { name, email, addres, password, confPassword } = req.body;

        let filename = "";
        if (req.files == null) {
            filename = Users.image;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            filename = file.md5 + ext;
            const allowedType = ['.png', '.jpg', 'jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "invalid images" });
            }
            if (fileSize > 5000000) {
                return res.status(422).json({ msg: "images must be less than 5 MB" })
            };

            const filepath = `./public/user/${user.image}`;
            fs.exists(filepath, (exists) => {
                if (exists) fs.unlinkSync(filepath)
            });
            file.mv(`./public/user/${filename}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }
        const url = `${req.protocol}://${req.get("host")}/user/${filename}`;
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
                password: hashPassword,
                addres: addres,
                image: filename,
                image_url: url
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
