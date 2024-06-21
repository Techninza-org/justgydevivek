const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Vendor = require('../model/vendor');

const SALT_ROUNDS = 10;
const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';

// User signup
exports.signup = async (req, res) => {
    try {
        const { email, password, mobile, name } = req.body;
        let isAlreadyExist = false;
        try {
            const user = await User.findOne({ email });
            if (user) {
                isAlreadyExist = true;
            }
        } catch (err) {
            console.log(err);
        }
        if (isAlreadyExist) {
            return res.status(500).send({ message: "User already exists" });
        }
        //+++++++++++++++++++
        const userByMobile = await User.findOne({ mobile });
        if (userByMobile) {
            return res.status(500).send({ message: "Mobile number already exists" });
        }

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: "Unable to create user" });
            }
            const user = new User({ name, mobile, email, password: hashedPassword, usercreationdate: new Date()});
            await user.save();
            delete user.password;
            const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            return res.status(200).send({user: user, token: token, status: 200});
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Unable to create user, email may already exist in our database" });
    }
};

// Vendor signup
exports.vendorsignup = async (req, res) => {
    try {
        const { email, password, name, mobile } = req.body;
        let isAlreadyExist = false;
        try {
            const user = await Vendor.findOne({ email });
            if (user) {
                isAlreadyExist = true;
            }
        } catch (err) {
            console.log(err);
        }
        if (isAlreadyExist) {
            return res.status(500).send({ message: "User already exists" });
        }

        //+++++++++++++++++++ changes on 20-06-2024
        const userByMobile = await Vendor.findOne({ mobile });
        if (userByMobile) {
            return res.status(500).send({ message: "Mobile number already exists" });
        }
        //+++++++++++++++++++

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: "Unable to create user" });
            }
            const user = new Vendor({ name, mobile, email, password: hashedPassword, vendorcreationdate: new Date()});
            await user.save();
            // user.password = undefined; // Remove password from response
            delete user.password;
            const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            return res.status(200).send({user: user, token: token, status: 200});
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Unable to create user, email may already exist in our database" });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        user.password = undefined; // Remove password from response
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({ user, token, status: 200 });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
};

// Vendor login
exports.vendorlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });

        if (!vendor) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        vendor.password = undefined; // Remove password from response
        const token = jwt.sign({ email: vendor.email, role: vendor.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({ vendor, token, status: 200});
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
};
