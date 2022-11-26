import path from "path";
import fs from "fs";
import Product from "../models/product_model.js";
import Users from "../models/user_model.js";

export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll({
            include: [{
                model: Users
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const saveProduct = (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No file uploaded" });
    const name = req.body.title;
    const desc = req.body.description;
    const price = req.body.price;
    const discount = req.body.discount;
    const ratting = req.body.ratting;
    const stock = req.body.stock;
    const category = [req.body.category];
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const filename = file.md5 + ext;
    console.log(filename);
    const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
    const userId = req.userId;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "invalid images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "images must be less than 5 MB" });

    file.mv(`./public/images/${filename}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Product.create({
                title: name,
                description: desc,
                price: price,
                discount: discount,
                ratting: ratting,
                stock: stock,
                category: category,
                image: filename,
                url: url,
                userId: userId
            });
            res.status(201).json({ msg: "Product created" });
        } catch (error) {
            console.log(error.message);
        }
    })
};

export const updateProduct = (req, res) => {

};

export const deleteProduct = async (req, res) => {
    const response = await Product.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!response) return res.status(404).json({ msg: "No data found" });
    try {
        const filepath = `./public/images/${response.image}`;
        fs.unlinkSync(filepath);
        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product deleted" })
    } catch (error) {
        console.log(error.message);
    }
};