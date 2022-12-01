import path from "path";
import fs from "fs";
import Product from "../models/product_model.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        const total = await Product.count({ response });
        res.status(200).send({
            message: "success",
            data: response,
            total: total
        });
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
        res.status(200).send({
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProductByCategory = async (req, res) => {
    try {
        const response = await Product.findAll({
            where: {
                category: req.params.category
            }
        });
        res.status(200).send({
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const saveProduct = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.userId;
    const name = req.body.title;
    const desc = req.body.description;
    const price = req.body.price;
    const discount = req.body.discount;
    const ratting = req.body.ratting;
    const stock = req.body.stock;
    const category = req.body.category;
    const weight = req.body.weight;

    const file = req.files.file;
    const fileSize = file.length;

    const ext = path.extname(file.name);
    const filename = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "invalid images" });
    }
    if (fileSize > 5000000) {
        return res.status(422).json({ msg: "images must be less than 5 MB" })
    };
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
                weight: weight,
                image: filename,
                image_url: url,
                userId: userId
            });
            res.status(201).json({ msg: "Product created" });
        } catch (error) {
            console.log(error.message);
        }
    });
}


export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    });

    if (!product) {
        return res.status(404).json({ msg: "Data Not found" });
    }
    const name = req.body.title;
    const desc = req.body.description;
    const price = req.body.price;
    const discount = req.body.discount;
    const ratting = req.body.ratting;
    const stock = req.body.stock;
    const category = req.body.category;

    let filename = "";
    if (req.files == null) {
        filename = Product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.length;

        const ext = path.extname(file.name);
        filename = file.md5 + ext;
        const allowedType = ['.png', '.jpg', 'jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "invalid images" });
        }
        if (fileSize > 5000000) {
            return res.status(422).json({ msg: "images must be less than 5 MB" })
        };

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${filename}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const url = `${req.protocol}://${req.get("host")}/images/${filename}`;

    try {
        await Product.update({
            title: name,
            description: desc,
            price: price,
            discount: discount,
            ratting: ratting,
            stock: stock,
            category: category,
            image: filename,
            image_url: url,
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({ msg: "Product Updated" });
    } catch (error) {
        console.log(error.message);
    }
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
        fs.exists(filepath, (exists) => {
            if (exists) fs.unlinkSync(filepath)
        });
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

export const searchProduct = async (req, res) => {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offset = limit * page;
    try {
        const rows = await Product.count({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    category: {
                        [Op.like]: '%' + search + '%'
                    }
                }]
            }
        });
        const data = await Product.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.like]: `${search}`
                    }
                }, {
                    category: {
                        [Op.like]: `${search}`
                    }
                }]
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        res.json({
            message: "success",
            data: data,
            limit: limit,
            total: rows
        });
    } catch (error) {
        res.status(500).send({ msg: error.message });
    }
}