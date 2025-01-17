const express = require('express');
const db = require('../libraries/dataBase');
const { insertMaterialsiIntoDb } = require('../middlewares/db')

const router = express.Router();

router.all("/", async (req, res) => {

    console.log('start migrate');


    await db.query(`
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,  
            user_name varchar(255) not null UNIQUE,
            name VARCHAR(255) NOT NULL,  
            email VARCHAR(255) NOT NULL UNIQUE,  
            password VARCHAR(255) NOT NULL,  
            phone VARCHAR(50),
            address varchar(255),
            artist int                
            );

        `)

    await db.query(`
            DROP TABLE IF EXISTS materials;
            CREATE TABLE materials (
                id SERIAL PRIMARY KEY,  
                name VARCHAR(255) NOT NULL
                );
        `)

    await db.query(`
            DROP TABLE IF EXISTS surfaces;
            CREATE TABLE surfaces (
                id SERIAL PRIMARY KEY,  
                name VARCHAR(255) NOT NULL
                );
        `)

    await db.query(`DROP TABLE IF EXISTS dimensions;

            CREATE TABLE IF NOT EXISTS dimensions
            (
                id SERIAL PRIMARY KEY ,
                name text ,
                min_area numeric,
                max_area numeric                    
            )
        `)

    await db.query(`
            DROP TABLE IF EXISTS paintings;

            CREATE TABLE IF NOT EXISTS paintings
            (
                id SERIAL PRIMARY KEY NOT NULL, 
                id_user integer,
                title text,
                description text,
                id_material integer,
                id_surface integer,
                width numeric,
                height numeric,
                price numeric,
                status text ,
                original_file_name text,
                share_path text ,
                uploaded_date date,                
                CONSTRAINT fk_material FOREIGN KEY (id_material)
                    REFERENCES materials (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT fk_surface FOREIGN KEY (id_surface)
                    REFERENCES surfaces (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION,
                CONSTRAINT fk_user FOREIGN KEY (id_user)
                    REFERENCES users (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
            )
            `)

    await db.query(`DROP TABLE IF EXISTS reviews;

            CREATE TABLE IF NOT EXISTS reviews
            (
                id SERIAL PRIMARY KEY NOT NULL, 
                "id_artist" integer,
                "id_user" integer,
                rating numeric,
                title text ,
                body text ,
                date date,
                 CONSTRAINT fk_artist FOREIGN KEY ("artistId")
                REFERENCES users (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID,
                CONSTRAINT fk_user FOREIGN KEY ("userId")
                    REFERENCES users (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE NO ACTION
                    NOT VALID              
            )`)

    await db.query(`DROP TABLE IF EXISTS logs;

            CREATE TABLE IF NOT EXISTS logs
            (
                id SERIAL PRIMARY KEY NOT NULL, 
                date date,
                route text ,
                log text 
               
    )`)

    await db.query(`
        DROP TABLE IF EXISTS cart_products;

        CREATE TABLE IF NOT EXISTS cart_products
        (
            id SERIAL PRIMARY KEY NOT NULL, 
            id_user integer NOT NULL,
            id_painting integer NOT NULL,
            price numeric,
            date date,
            status text,
            CONSTRAINT fk_painting FOREIGN KEY (id_painting)
                REFERENCES paintings (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID,
            CONSTRAINT fk_user FOREIGN KEY (id_user)
                REFERENCES users (id) MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                NOT VALID
        )
        `)



    res.status(201).json({
        "message": "migrated successfully"
    })
})

router.all('/populate', async (req, res) => {
    console.log('start popullate with data');
    console.log('materials');

    const materials = ["oil painting", "acrylic painting", "watercolour", "gouache", "egg tempera", "ink", "graphite", "mixed media", "other"];

    for (let i = 0; i < materials.length; i++) {
        try {
            await db.pool.query('insert into materials (name) values ($1)', [materials[i]]);

        } catch (err) {
            console.log({
                status: "Error writing to DB",
                message: err,
            });
        }
    }

    console.log('surfaces');
    //surfaces 
    const surfaces = ["paper", "canvas", "wood", "cardboard", "fabric", "glass", "metal", "other"];

    for (let i = 0; i < surfaces.length; i++) {
        try {
            await db.pool.query('insert into surfaces (name) values ($1)', [surfaces[i]]);

        } catch (err) {
            console.log({
                status: "Error writing to DB",
                message: err,
            });
        }
    }

    console.log('dimensions');
    // dimensions 
    const dimensions = [{ "name": "small", "min_area": 0, "max_area": 100 }, { "name": "medium", "min_area": 101, "max_area": 300 }, { "name": "large", "min_area": 301, "max_area": 600 }, { "name": "extra large", "min_area": 601, "max_area": 100 }]

    for (let i=0; i<dimensions.length; i++){
        try {
                       
            await db.pool.query('insert into dimensions (name, min_area, max_area) values ($1, $2, $3)', [dimensions[i].name, dimensions[i].min_area, dimensions[i].max_area])
        } catch (err) {
            console.log({
                status: "Error writing to DB",
                message: err,
            });
        }
    }

    console.log('reviews');

    


    res.status(201).json({
        "message": "populate successfully"
    })


})

module.exports = router;