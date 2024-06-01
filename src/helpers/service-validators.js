import serviceModel from '../service-model/service-model.model.js';

export const tittleExists = async (tittle) => {
    const tittleExists = await serviceModel.findOne({ tittle });
    if (tittleExists) {
        throw new Error(`The tittle '${tittle}' already exists`);
    }
};

export const serviceExists = async (id) => {
    const serviceExists = await serviceModel.findById(id);
    if (!serviceExists) {
        throw new Error(`The service with id '${id}' does not exist`);
    }
};