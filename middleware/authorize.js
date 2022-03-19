require('dotenv').config();

const jwt = require('express-jwt');
const { User } = require("../models");
const secret = process.env.secret
module.exports = authorize;

function authorize() {
    return [
        jwt({ secret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            const user = await User.findByPk(req.user.sub);
            // console.log(user)
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user.get();
            next();
        }
    ];
}