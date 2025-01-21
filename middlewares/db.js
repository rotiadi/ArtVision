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

const checkPaintingToArtist = async (req, res, next) => {
    const {id_painting} = req.body;
    const id_user = req.id_user;

    try {
       const result =  await dataBase.pool.query(`select count(1) from paintings where id_user = $1 and id = $2`, [id_user, id_painting]);
        if(result.rows[0].count === "0"){
            res.status(500).send({
                "status": "Error",
                "message": "This is not your painting. "
            })
        }
        else {
            next();
        }
       
    } catch(error) {
        res.status(500).send({
            status: "Error checking the painting and the artist",
            message: error || "An unknown error occurred",
        });
    }
}

const checkPaintingAvailability = async (req, res, next) => {
    const {id_painting} = req.body;
    try {
        const result =  await dataBase.pool.query(`select title, status from paintings where id = $1`, [id_painting]);
        
        if(result.rows[0].status === "Sold"){
             res.status(500).send({
                 "status": "Error",
                 "message": `The painting ${result.rows[0].title} is no logger available. `
             })
         }
        else {
             next();
         }
        
     } catch(error) {
         res.status(500).send({
             status: "Error checking the painting Availability",
             message: error || "An unknown error occurred",
         });
     }
}

module.exports = {insertMaterialsiIntoDb, insertLogIntoDb, checkPaintingToArtist, checkPaintingAvailability}