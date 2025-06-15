const express = require('express');
const router = express.Router();
const ShoppingCart = require("../../models").ShoppingCart;
const controller = require('../controllers/shoppingCarts');
const { checkOwnership } = require('../middlewares/ownershipMiddleware');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Protected Routes
router.use(verifyJWT);
// GET all shopping carts for a specific user
router.get('/', controller.readUserShoppingCarts)
// GET a specific shopping cart through its id
router.get('/:id', checkOwnership(ShoppingCart), controller.readShoppingCart)
// GET all the products of a specific shopping cart through its id
router.get('/:id/products', checkOwnership(ShoppingCart), controller.readShoppingCartProducts)
// POST a shopping cart
router.post('/', controller.parseFormData, controller.createShoppingCart);
// POST a product to a shopping cart
router.post('/:cartId/products/', checkOwnership(ShoppingCart, {paramName: 'cartId'}), controller.parseFormData, controller.createProductInShoppingCart);
// PATCH a shopping cart
router.patch('/:id', checkOwnership(ShoppingCart), controller.parseFormData, controller.updateShoppingCart)
// DELETE a shopping cart
router.delete('/:id', checkOwnership(ShoppingCart), controller.deleteShoppingCart)
// DELETE a product from a shopping cart
router.delete('/:cartId/products/:productId', checkOwnership(ShoppingCart, {paramName: 'cartId'}), controller.parseFormData, controller.deleteProductFromCart)

module.exports = router;