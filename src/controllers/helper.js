const { response } = require("express");

const createItem = async (itemType, itemObject, errorMessage) => {
    let response = {}
    try {
        const createdItem = await itemType.create(itemObject)
        const itemId = createdItem.id
        response.item =  await itemType.findByPk(itemId, {
            attributes: { exclude: ['password'] }
        })
        response.success = true
    } catch (err) {
        const errorObject = sendError(errorMessage, err)
        response.error = errorObject.error
        response.success = false
    }
    return response;
};

const sendError = (errorMessage, errorObject) => {
    const { type }  = errorObject?.errors[0]
    let response = {}
    if(type === 'notNull Violation') {
        response.error = errorMessage
    } else {
        response.error = errorObject.errors[0].message
    }
    return response;
}

const listAll = (item) => {
    return item.findAll({
        attributes: { 
            exclude: ['password'],
        },
    });
}

const findItemWithId = async (item, id, errorMessage) => {
    let response = {}
    try {
        const record = await item.findByPk(id, {
            attributes: { exclude: ['password'] },
        })
        if(record) {
            response.item = record
            response.success = true
        } else {
            response.error = errorMessage
            response.success = false
        }
    } catch (err) {
        const errorObject = sendError(errorMessage, err)
        response.error = errorObject
        response.success = false
    }
    return response
}

const updateItemWithId = async (item, id, updateBody, errorMessage) => {
    let response = {}
    try {
        const updatedStatus =  await item.update(updateBody, { where: {id} })
        if(updatedStatus[0]) {
            response.item = await item.findByPk(id, {
                attributes: { exclude: ['password'] }
            })
            response.success = true
        } else {
            response.error = errorMessage
            response.success = false
        }
    } catch (err) {
        const errorObject = sendError(errorMessage, err)
        response.error = errorObject
        response.success = false
    }
    return response
}

const deleteItemWithId = async (item, id, errorMessage) => {
    let response = {}
    try {
        const deletedStatus =  await item.destroy({ where: {id} })
        if(deletedStatus) {
            response.success = true
        } else {
            response.error = errorMessage
            response.success = false
        }
    } catch (err) {
        const errorObject = sendError(errorMessage, err)
        response.error = errorObject
        response.success = false
    }
    return response
}

const findDuplicateName = async (item, dupeValue, errorMessage) => {
    console.log(dupeValue)
    let response = {}
    try {
        const dupe = await item.findAll({ where: { name: dupeValue } })
        if (dupe[0]) {
            response.error = errorMessage
            response.success = false
        } else {
            response.success = true
        }
    } catch (err) {
        response.success = true
    }
    return response
}



module.exports = {
    createItem,
    sendError,
    listAll,
    findItemWithId,
    updateItemWithId,
    deleteItemWithId,
    findDuplicateName
}