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

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Unable to create user" });
            }
            const user = new User({ name, mobile, email, password: hashedPassword });
            await user.save();
            delete user.password;
            const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            res.status(200).send({user: user, token: token});
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

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Unable to create user" });
            }
            const user = new Vendor({ name, mobile, email, password: hashedPassword });
            await user.save();
            // user.password = undefined; // Remove password from response
            delete user.password;
            const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            res.status(200).send({user: user, token: token});
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
            return res.status(200).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Invalid credentials" });
        }

        user.password = undefined; // Remove password from response
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
};

// Vendor login
exports.vendorlogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Vendor.findOne({ email });

        if (!user) {
            return res.status(200).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: "Invalid credentials" });
        }

        user.password = undefined; // Remove password from response
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({ user, token });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
};
