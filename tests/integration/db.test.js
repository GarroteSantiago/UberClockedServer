import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { setupTestDatabase, teardownTestDatabase } from '../testHelpers';
const db = require('../../src/models');

describe('Database Connection and Synchronization', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    }, 10000);

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('should authenticate with the database', async () => {
        const isConnected = await db.testConnection();
        expect(isConnected).toBe(true);
    });

    it('should have mysql dialect', () => {
        expect(db.sequelize.getDialect()).toBe('mysql');
    });

    describe('Database models with fk creation', () => {
        beforeAll(async () => {
            // This defines the necessary data for creating the necessary records for the product model
            const componentData = {
                name: 'TestComponent',
                description: 'This component was created while testing the db',
            };
            // This creates the record of the necessary objects for the product model in the db
            const newComponent = await db.Component.create(componentData);

            // This defines the necessary data for creating the necessary records for the ubication model
            const countryData = {
                name: 'TestCountry',
            };
            const provinceData = {
                name: 'TestProvince',
            };
            const localityData = {
                name: 'TestLocality',
            };
            // This creates the record of the necessary objects for the ubication model in the db
            const newCountry = await db.Country.create(countryData);
            const newProvince = await db.Province.create(provinceData);
            const newLocality = await db.Locality.create(localityData);

            // This defines the necessary data for creating the user
            const userData = {
                name_tag: 'TestUser',
                email: 'test@test.com',
                password: 'test123',
            }
            // This creates the record of the necessary objects for the ShoppingCart model in the db
            const newUser = await db.User.create(userData);
        })

        it('should add a product to the table components', async () => {
            const components = await db.Component.findAll();

            // This defines the necessary data for creating the product
            const productData = {
                name: 'TestProduct',
                description: 'This product was created while testing the db',
                image_url: 'https://dummyimage.com/150/000/ffffff.png',
                image_alt: 'This image alt was created while testing the db',
                component_id: components[0].id,
                price: 0.0,
                rating: 0.0
            }

            // This creates the record of the product in the db
            const newProduct = await db.Product.create(productData);

            // Verify the product was created with correct data
            expect(newProduct).toBeDefined();
            expect(newProduct.id).toBeDefined();
            expect(newProduct.name).toBe(productData.name);
            expect(newProduct.description).toBe(productData.description);
            expect(newProduct.image_url).toBe(productData.image_url);
            expect(newProduct.image_alt).toBe(productData.image_alt);
            expect(newProduct.component_id).toBe(productData.component_id);
            expect(newProduct.price).toBe(productData.price);
            expect(newProduct.rating).toBe(productData.rating);

            // Verify the product exists in the db
            const foundProduct = await db.Product.findByPk(newProduct.id);
            expect(foundProduct).toBeDefined();
        });

        it('should add an ubication to the table components', async () => {
            const countries = await db.Country.findAll();
            const provinces = await db.Province.findAll();
            const localities = await db.Locality.findAll();

            // This defines the necessary data for creating the ubication
            const UbicationData = {
                country_id: countries[0].id,
                province_id: provinces[0].id,
                locality_id: localities[0].id,
            }

            // This creates a record of ubication in the db and saves the object, received as a response, in the newUbication
            const newUbication = await db.Ubication.create(UbicationData);

            // Verify the ubication record were created with correct data
            expect(newUbication).toBeDefined();
            expect(newUbication.id).toBeDefined();
            expect(newUbication.country_id).toBe(UbicationData.country_id);
            expect(newUbication.province_id).toBe(UbicationData.province_id);
            expect(newUbication.locality_id).toBe(UbicationData.locality_id);
        });

        it('should add a ShoppingCart to the table shopping_carts', async () => {
            const users = await db.User.findAll();

            // This defines the necessary data for creating the shopping cart
            const shoppingCartData = {
                user_id: users[0].id,
                name: 'TestShoppingCart',
            }

            // This creates a record of ShoppingCart in the db and saves the object, received as a response, in the newShoppingCart
            const newShoppingCart = await db.ShoppingCart.create(shoppingCartData);

            // Verify the ubication record were created with correct data
            expect(newShoppingCart).toBeDefined();
            expect(newShoppingCart.id).toBeDefined();
            expect(newShoppingCart.user_id).toBe(shoppingCartData.user_id);
            expect(newShoppingCart.name).toBe(shoppingCartData.name);
            expect(newShoppingCart.is_active).toBeTruthy();
        })

        it('should add an Admin to the table admins', async () => {
            const users = await db.User.findAll();

            // This defines the necessary data for creating the admin
            const adminData = {
                user_id: users[0].id,
            }

            const newAdmin = await db.Admin.create(adminData);

            expect(newAdmin).toBeDefined();
            expect(newAdmin.id).toBeDefined();
            expect(newAdmin.user_id).toBe(adminData.user_id);
        });

        it('should add a Product to a Shopping Cart through the table carts_products', async () => {
            const cart = (await db.ShoppingCart.findOne());
            const product = await db.Product.findOne();

            await cart.addProduct(product,
                {
                    through: {quantity: 1}
                }
            );

            const productsInCart = await cart.getProducts()
            console.log(productsInCart);
            expect(productsInCart).toBeDefined();
            expect(productsInCart).toHaveLength(1);
            expect(productsInCart[0].id).toBeDefined(product.id);
        });
    });


});
