const component = require('../../models').Component;

exports.getAllComponents = async (req, res) => {
    try {
        const [rows] = await component.getAllComponents();

        res.status(200).json({
            status: 'success',
            data: { rows },
        });
    } catch (error) {
        res.status(500).json({})
    }
};
exports.getComponent = (req, res) => {};
exports.createComponent = (req, res) => {};
exports.updateComponent = (req, res) => {};
exports.deleteComponent = (req, res) => {};