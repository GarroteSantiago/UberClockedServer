const Models = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const multer = require("multer");
const router = require("../routes/boards");
const upload = multer()

exports.parseFormData = upload.none();

exports.readFields = catchAsync(async (req, res) => {
    const {model_name} = req.params;
    const {component_id} = req.query;

    const Model = Models[model_name];
    if (!Model) {
        throw new NotFoundError("Model name");
    }

    const non_fields = ['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']
    const fields = [];

    const attributes = Model.getAttributes();

    for (const attribute in attributes) {
        if (non_fields.includes(attribute)) continue;
        fields.push({
            name: attribute,
            type: mapSequelizeType(attributes[attribute].type.key),
            label: attribute,
            required: !attributes[attribute].allowNull,
        });
    }

    if (model_name === 'Product') {
        if (!component_id || isNaN(component_id)) {
            throw new ValidationError("component_id is required and must be numeric.");
        }
        const product_fields = await Models.ProductField.findAll({
            where: {component_id: component_id},
        })

        product_fields.forEach((field) => {
            fields.push({
                name: field.name,
                type: field.field_type || 'text',
                label: field.name,
                dynamic: true
            });
        });
    }

    return res.status(200).json({
        status: 'success',
        model: model_name,
        data: fields,
    })
})

function mapSequelizeType(typeKey) {
    const map = {
        STRING: 'text',
        TEXT: 'textarea',
        INTEGER: 'number',
        BIGINT: 'number',
        FLOAT: 'number',
        BOOLEAN: 'checkbox',
        DATE: 'date'
    };
    return map[typeKey] || 'text';
}