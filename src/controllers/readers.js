const { Reader } = require('../models');
const helper = require('./helper');

exports.create = async (req, res) => {
    const errorMessage = 'Submissions must contain name, email and password'

    const response = await helper.createItem(Reader, req.body, errorMessage)
    if(response.success) {
        res.status(201).json(response.item)
    } else {
        res.status(400).json({ error: response.error })
    }
};

exports.list = async (req, res) => {
    const records = await helper.listAll(Reader)
    res.status(200).json(records);
}

exports.find = async (req, res) => {
    const { id } = req.params
    const errorMessage = 'The reader could not be found.'
    
    const reader = await helper.findItemWithId(Reader, id, errorMessage)
    if(reader.success) {
        res.status(200).json(reader.item)
    } else {
        res.status(404).json({ error: reader.error })
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const newDetails = req.body;
    const errorMessage = 'The reader could not be found.'

    const updatedItem = await helper.updateItemWithId(Reader, id, newDetails, errorMessage)
    if (updatedItem.success) {
        res.status(200).json(updatedItem.item)
    } else {
        res.status(404).json({ error: updatedItem.error })
    }
    
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const errorMessage = 'The reader could not be found.'

    const deletedItem = await helper.deleteItemWithId(Reader, id, errorMessage)
    if (deletedItem.success) {
        res.status(204).send()
    } else {
        res.status(404).json({ error: deletedItem.error })
    }
}