const express = require('express');
const dataBase = require('../libraries/dataBase');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

/* /cart/add - add a product to a cart (step 1)
/cart/view - gets products from a user cart (step 2)
/cart/sendToPay - create a list of products to be paid and "removes" the corresponding products from the cart (step 4) */

router.post('/add',authenticateToken,  async (req, res) => {
    
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
    
            const records = await dataBase.query('INSERT INTO public.cart_products(id_user, id_painting, price, date) VALUES ( $1, $2, $3, $4)', [req.id_user, id_painting, price, (new Date()).toLocaleDateString()]).catch(err => {
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

router.get('/view', authenticateToken, async (req, res) => {

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
        //TODO
        // INSERT INTO NEW TABLE
        //UPDATE STATUS IN cart_products WITH PAID
        const records = await dataBase.query().catch(err => {
            res.status(500)
            res.send(
                {
                    "Status": "error writting to DB",
                    "message": err
                }
            )
        })

        if (records) {
            res.status(200);
            res.send(
                {
                    "Status": "Success",
                    "message": `The list is send to pay!`
                })

        }
}
})

module.exports = router;