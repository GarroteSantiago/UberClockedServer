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

    describe('Database model creation', () => {
        it('should add a product to the table components', async () => {
            // This defines the necessary data for creating the necessary records for the product model
            const componentData = {
                name: 'TestComponent',
                description: 'This component was created while testing the db',
            };

            // This creates the record of the necessary objects for the product model in the db
            const newComponent = await db.Component.create(componentData);

            // Verify the necessary records were created with correct data
            expect(newComponent).toBeDefined();
            expect(newComponent.id).toBeDefined();
            expect(newComponent.name).toBe(componentData.name);
            expect(newComponent.description).toBe(componentData.description);

            // Verify the necessary records exists in the database
            const foundComponent = await db.Component.findByPk(newComponent.id);
            expect(foundComponent).not.toBeNull();

            // This defines the necessary data for creating the product
            const productData = {
                name: 'TestProduct',
                description: 'This product was created while testing the db',
                image_url: 'https://dummyimage.com/150/000/ffffff.png',
                image_alt: 'This image alt was created while testing the db',
                component_id: newComponent.id,
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
            expect(newProduct.price).toBe(productData.price);
            expect(newProduct.rating).toBe(productData.rating);

            // Verify the product exists in the db
            const foundProduct = await db.Product.findByPk(newProduct.id);
            expect(foundProduct).toBeDefined();
        });

        it('should add an ubication to the table components', async () => {
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


            // Verify the necessary records were created with correct data
            expect(newCountry).toBeDefined();
            expect(newCountry.id).toBeDefined();
            expect(newCountry.name).toBe(countryData.name);
            expect(newProvince).toBeDefined();
            expect(newProvince.id).toBeDefined();
            expect(newProvince.name).toBe(provinceData.name);
            expect(newLocality).toBeDefined();
            expect(newLocality.id).toBeDefined();
            expect(newLocality.name).toBe(localityData.name);

            // Verify the necessary records exists in the database
            const foundCountry = await db.Country.findByPk(newCountry.id);
            expect(foundCountry).not.toBeNull();
            const foundProvince = await db.Province.findByPk(newProvince.id);
            expect(foundProvince).not.toBeNull();
            const foundLocality = await db.Locality.findByPk(newLocality.id);
            expect(foundLocality).not.toBeNull();

            // This defines the necessary data for creating the ubication
            const UbicationData = {
                country_id: newCountry.id,
                province_id: newProvince.id,
                locality_id: newLocality.id,
            }

            // This creates a record of ubication in the db and saves the object, received as a response, in the newUbication
            const newUbication = await db.Ubication.create(UbicationData);

            // Verify the ubication record were created with correct data
            expect(newUbication).toBeDefined();
            expect(newUbication.id).toBeDefined();
            expect(newUbication.country_id).toBe(newCountry.id);
            expect(newUbication.province_id).toBe(newProvince.id);
            expect(newUbication.locality_id).toBe(newLocality.id);
        });
    });


});
