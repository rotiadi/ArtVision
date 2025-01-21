
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dataBase = require('../libraries/dataBase');
const { route } = require('./api');
const authenticateToken = require('../middlewares/authenticateToken');
require('dotenv').config();

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//router.use(authenticateToken);

router.post('/upload', upload.single('image'), authenticateToken, async (req, res) => {

    const myImage = req.file;
    const { id_material, id_surface, title, description, width, height , price } = req.body;

    let errors = [];

    if (!id_material) {
        errors.push({
            "field": "id_material",
            "message": "id_material is invalid"
        })
    }

    if (!id_surface) {
        errors.push({
            "field": "id_surface",
            "message": "id_surface is invalid"
        })
    }

    if (!myImage) {
        errors.push({
            "field": "image",
            "message": "No file uploaded!"
        })
    }

    if (!title) {
        errors.push({
            "field": "title",
            "message": "title is invalid"
        })
    }

    if (!description) {
        errors.push({
            "field": "description",
            "message": "description is invalid"
        })
    }

    if (!width) {
        errors.push({
            "field": "width",
            "message": "width is invalid"
        })
    }

    if (!height) {
        errors.push({
            "field": "height",
            "message": "height is invalid"
        })
    }

    if (!price) {
        errors.push({
            "field": "price",
            "message": "price is invalid"
        })
    }

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    else {
        const uploadResultCloudinary = await cloudinary.uploader.upload(myImage.path , {
            folder: 'ArtZVision',
        });
        console.log("Succes upload in cloud");

        await dataBase.pool.query(`INSERT INTO public.paintings(
         id_user, title, description, id_material, id_surface, width, height, price, status,  original_file_name, share_path, uploaded_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
            [req.id_user, title, description,  id_material, id_surface, width, height, price, 'Insert', uploadResultCloudinary.original_filename, uploadResultCloudinary.secure_url, (new Date()).toLocaleDateString()],
            (error, results) => {
                if (error) {
                    console.log('Error writting in DB');

                    //delete the picture from Cloudinary
                    cloudinary.api
                        .delete_resources([uploadResultCloudinary.public_id],
                            { type: 'upload', resource_type: 'image' })
                        ;

                    return res.status(500).json(
                        {
                            "Status": "error writting to DB",
                            "message": error
                        });
                }
                else {
                    if (results.affectedRows === 0) {
                        res.send('No data inserted!')
                    }
                    else {
                        res.status(200).json({
                            message: 'Image uploaded successfully',
                            url: uploadResultCloudinary.secure_url,
                        });
                    }
                }
            })
    }

})


router.post('/getAll', async (req, res) => {

    try {
        const result = await dataBase.pool.query(`select 
            p.id, p.id_material, m.name material_name,
            p.id_surface, s.name as surface_name,
            p.title, p.description, p.width, p.height, p.price, p.share_path,
            p.id_user, u.name, p.uploaded_date
            from  paintings as  p
            join materials as m on p.id_material = m.id
            join surfaces as s on p.id_surface = s.id
            join users as u on p.id_user = u.id`);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

router.post('/getByUser', authenticateToken, async (req, res) => {
    
    try {
        const result = await dataBase.pool.query(`select 
            p.id, p.id_material, m.name material_name,
            p.id_surface, s.name as surface_name,
            p.title, p.description,p.width, p.height, p.price, p.share_path,
            p.id_user, u.name, p.uploaded_date
            from  paintings as  p
            join materials as m on p.id_material = m.id
            join surfaces as s on p.id_surface = s.id
            join users as u on p.id_user = u.id
            where u.id = $1`, [req.id_user]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

router.post('/getByIdUser', async (req, res) => {
   
    let errors = [];
    const { idUser } = req.body;

    if (!idUser) {
        errors.push({
            "field": "idUser",
            "message": "idUser is invalid"
        })
    }

    if (errors.length > 0) {
        return res.status(400).json(errors);
    }
    else {

        try {
            const result = await dataBase.pool.query(`select 
            p.id, p.id_material, m.name material_name,
            p.id_surface, s.name as surface_name,
            p.title, p.description, p.width, p.height, p.price, p.share_path,
            p.id_user, u.name, p.uploaded_date
            from  paintings as  p
            join materials as m on p.id_material = m.id
            join surfaces as s on p.id_surface = s.id
            join users as u on p.id_user = u.id
            where u.id = $1`, [idUser]);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    }
});

router.post('/getFiltered', async (req, res) => {
    
    const {materials, surfaces, dimensions, prices} = req.body;   
      

     try {
        
        const result = await dataBase.pool.query(`select 
        p.id, p.id_material, m.name material_name,
        p.id_surface, s.name as surface_name,
        p.title, p.description, p.width, p.height, p.price, p.share_path,
        p.id_user, u.name, p.uploaded_date
        from  paintings as  p
        join materials as m on p.id_material = m.id
        join surfaces as s on p.id_surface = s.id
        join users as u on p.id_user = u.id
        where ($1::int[] IS NULL OR $1 = '{}' or p.id_material = ANY($1))
        and ($2::int[] IS NULL OR $2 = '{}' or p.id_surface = ANY($2))        
        and p.price between $3 and $4
        and ($5::int[] IS NULL OR $5 = '{}' or (select d.id from dimensions d where p.width * p.height between d.min_area and d.max_area)  = ANY($5))
        ` , [materials,surfaces, prices.min, prices.max, dimensions]
        
    );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to fetch images', err: err });
    } 

})

module.exports = router;