const express = require('express');
const dataBase = require('../libraries/dataBase');
const multer = require('multer');
const {insertMaterialsiIntoDb, checkConection} = require('../middlewares/db')
const pool = require('../libraries/newDB')

const router = express.Router();

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/general/materials', checkConection,  async (req, res) => {
         
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM materials');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    } finally {
        client.release(); 
    }  
})

router.post('/general/materials/add', checkConection,  insertMaterialsiIntoDb,  async (req, res) => {
        const {name} = req.body;

        res.status(200).send({
            status: "Success",
            message: `The material ${name} has been added!`
        })

})

router.post('/general/surfaces',checkConection, async (req, res) => {
       
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM surfaces');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    } finally {
        client.release(); 
    }  

})


router.post('/general/surfaces/add',checkConection,  async (req, res) => {
    const { name } = req.body;
    let errors = [];

    if (!name || name.length == 0) {
        errors.push({
            "field": "name",
            "message": "name is invalid"
        })
    }

    if (errors.length > 0) {
        res.status(401)
        res.send({
            "Status": "Invalid inputs",
            "message": errors
        })
    }
    else {

        const records = await dataBase.query('insert into surfaces (name) values ($1)', [name]).catch(err => {
            res.status(500)
            res.send(
                {
                    "Status": "error writting to DB",
                    "message": err.detail
                }
            )
        })

        if (records) {
            res.status(200);
            res.send(
                {
                    "Status": "Success",
                    "message": `The surfaces ${name} has been added!`
                })

        }
    }

})

router.post('/general/dimensions',checkConection,  async (req, res) => {
     
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM dimensions');
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    } finally {
        client.release(); 
    }  
})

router.post('/general/dimensions/add',checkConection,  async (req, res) => {
    
    const { name, min_area, max_area } = req.body;
    let errors = [];

    if (!name || name.length == 0) {
        errors.push({
            "field": "name",
            "message": "name is invalid"
        })
    }

    if (!min_area || min_area.length == 0) {
        errors.push({
            "field": "min_area",
            "message": "min_area is invalid"
        })
    }

    if (!max_area || max_area.length == 0) {
        errors.push({
            "field": "max_area",
            "message": "max_area is invalid"
        })
    }

    if (errors.length > 0) {
        res.status(401)
        res.send({
            "Status": "Invalid inputs",
            "message": errors
        })
    }
    else {

        const records = await dataBase.query('insert into dimensions (name, min_area, max_area) values ($1, $2, $3)', [name, min_area, max_area]).catch(err => {
            res.status(500)
            res.send(
                {
                    "Status": "rror writting to DB",
                    "message": err.detail
                }
            )
        })

        if (records) {
            res.status(200);
            res.send(
                {
                    "Status": "Success",
                    "message": `The dimension ${name} has been added!`
                })

        }
    }

})

module.exports = router;