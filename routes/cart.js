const express = require('express');
const dataBase = require('../libraries/dataBase');
const authenticateToken = require('../middlewares/authenticateToken');
const {checkPaintingAvailability} = require('../middlewares/db')

const router = express.Router();

router.post('/add', authenticateToken, checkPaintingAvailability,  async (req, res) => {
    
    const {id_painting, price} = req.body;
    let errors = [];

    if (!id_painting ) {
        errors.push({
            "field": "id_painting",
            "message": "id_painting is invalid"
        })
    }

    if (!price ) {
        errors.push({
            "field": "price",
            "message": "price is invalid"
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
    
            const records = await dataBase.query('INSERT INTO cart_products(id_user, id_painting, price, date) VALUES ( $1, $2, $3, $4)', [req.id_user, id_painting, price, (new Date()).toLocaleDateString()]).catch(err => {
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
                        "message": `The painting  has been added!`
                    })
    
            }
    }
})

router.post('/view', authenticateToken, async (req, res) => {

    const records = await dataBase.query(`select cp.id, cp.id_user, cp.id_painting, cp.price, cp.date, 
		p.title, p.description, p.width, p.height, m.name as material, s.name as surface,
		p.id_user as id_artist, u.name as artist
		
        from cart_products as cp
        join paintings as p on cp.id_painting = p.id
        join materials as m on p.id_material = m.id
        join surfaces as s on p.id_surface = s.id
        join users as u on p.id_user = u.id
        where cp.id_user = $1 and cp.status is null`, [req.id_user]);
    res.send(records.rows)

})

router.post('/sendToPay', authenticateToken, async (req, res) => {
    const {cart_paintings } = req.body;
    let errors = [];

    if (!cart_paintings ) {
        errors.push({
            "field": "cart_paintings",
            "message": "cart_paintings is invalid"
        })
    }
    else {
        if(cart_paintings.length === 0){
            errors.push({
                "field": "cart_paintings",
                "message": "There are no paintings"
            })
        }
    }
    
    if (errors.length > 0) {
        res.status(401)
        res.send({
            "Status": "Invalid inputs",
            "message": errors
        })
    }
    else {
        const client = await dataBase.pool.connect();
        await client.query('BEGIN')
        
        try {
        for (let index = 0; index < cart_paintings.length; index++) {
            const result = await client.query(
                `INSERT INTO public.order_details(id_user, id_cart, price, date) VALUES ($1, $2, $3, $4)`
              , [req.id_user, cart_paintings[index].id, cart_paintings[index].price, (new Date()).toLocaleDateString()]);

            const resultUpdate = await client.query(
                `update cart_products set status = 'Send to payment' where id = $1`, [cart_paintings[index].id]
            );

            await client.query(`update paintings  set status = 'Sold' where id  in (select cp.id_painting from cart_products cp where cp.id = $1)`, [cart_paintings[index].id]);
            
        }
        await client.query('COMMIT');
        res.status(200);
                res.send(
                    {
                        "Status": "Success",
                        "message": `The order is send!`
                    })
        } catch  (error) {
            await client.query('ROLLBACK');
            res.status(401).json({"Status": "Error", "message": error})
        } finally {
        client.release();
        }
       

        
    }
}) 

module.exports = router;