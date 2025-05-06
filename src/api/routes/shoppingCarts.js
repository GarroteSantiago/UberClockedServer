const express = require('express');
const router = express.Router();
const controller = require('../controllers/shoppingCarts');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Protected Routes
router.use(verifyJWT);
// GET all shopping carts for a specific user
router.get('/:userId', controller.readShoppingCarts)
// GET a specific shopping cart through its id
router.get('/:id', controller.readShoppingCart)
// POST a shopping cart
router.post('/', controller.parseFormData, controller.createShoppingCart);
// POST a product to a shopping cart
router.post('/:id/products', controller.parseFormData, controller.createProductInShoppingCart);
// PATCH a shopping cart
router.patch('/:id', controller.parseFormData, controller.updateShoppingCart)
// DELETE a shopping cart
router.delete('/:id', controller.deleteShoppingCart)
// DELETE a product from a shopping cart
router.delete('/api/carts/:cartId/products/:productId', controller.parseFormData, controller.deleteProductFromCart)

module.exports = router;