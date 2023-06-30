const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    ownerName: {
        type: String,
        required: true,
        maxlength: 50
    },
    price: {
        type: Number,
        required: true,
    },

    contact : {
       type : String,
       required: true
    },

    description: {
        type: String,
        required: true,
        maxlength: 2000
    },

    avatar: {
        type: String
    },

    imageUrl: {
        type: String
    }
});

const Item = mongoose.model("Item", itemSchema);


function validateItem(item) {
    const schema = {
        title: Joi.string().max(50).required(),
        ownerName: Joi.string().max(50).required(),
        price: Joi.number().required(),
        contact: Joi.string().required(),
        description: Joi.string().max(2000).required(),
    };

    return result = Joi.validate(item, schema);
}

module.exports.Item = Item;
module.exports.validateItem = validateItem;
module.exports.itemSchema = itemSchema;