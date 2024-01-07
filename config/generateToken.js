const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    data = { id };
    const token = jwt.sign(data, "HolaAdhyanTiwari", { expiresIn: "30d" })
    return token;
}
module.exports = generateToken;