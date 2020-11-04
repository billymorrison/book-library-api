const { Book } = require('../models');
const helper = require('./helper');

exports.create = async (req, res) => {
    const errorMessage = 'Submissions must contain title and author'

    const response = await helper.createItem(Book, req.body, errorMessage)
    if(response.success) {
        res.status(201).json(response.item)
    } else {
        res.status(400).json({ error: response.error })
    }
};

exports.list = async (req, res) => {
    const records = await helper.listAll(Book)
    res.status(200).json(records);
}


exports.find = async (req, res) => {
    const { id } = req.params
    const errorMessage = 'The book could not be found.'

    const reader = await helper.findItemWithId(Book, id, errorMessage)
    if(reader.success) {
        res.status(200).json(reader.item)
    } else {
        res.status(404).json({ error: reader.error })
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const newDetails = req.body;
    const errorMessage = 'The book could not be found.'

    const updatedItem = await helper.updateItemWithId(Book, id, newDetails, errorMessage)
    if (updatedItem.success) {
        res.status(200).json(updatedItem.item)
    } else {
        res.status(404).json({ error: updatedItem.error })
    }
    
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const errorMessage = 'The book could not be found.'

    const deletedItem = await helper.deleteItemWithId(Book, id, errorMessage)
    if (deletedItem.success) {
        res.status(204).send()
    } else {
        res.status(404).json({ error: deletedItem.error })
    }
}