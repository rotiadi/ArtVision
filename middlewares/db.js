const dataBase = require('../libraries/dataBase');

const insertMaterialsiIntoDb = async (req, res, next) => {
    const {name} = req.body
    let errors = [];

    if (!name || name.length == 0) {
        errors.push({
            "field": "name",
            "message": "name is invalid"
        })
    }

    if (errors.length > 0) {
        return res.status(400).send({
            "Status": "Invalid inputs",
            "message": errors
        })
    }
    else {
        try {
            await dataBase.pool.query('insert into materials (name) values ($1)', [name]);
            next();
        } catch (err) {
            return res.status(500).send({
                status: "Error writing to DB",
                message: err.detail || "An unknown error occurred",
            });
        }
    }

}

const insertLogIntoDb = async (log) => {    
    
    try {
        await dataBase.pool.query('insert into logs (date, route, log) values ($1, $2, $3)', [log['Time:'], log['EndPoint:'], log]);
    } catch (error) {
        console.log('Error inserting log', error);
    }
}

module.exports = {insertMaterialsiIntoDb, insertLogIntoDb}