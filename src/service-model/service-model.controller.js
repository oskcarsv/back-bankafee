import serviceModel from "../service-model/service-model.model.js";
import upload from "../middlewares/multerConfig.js";
import {
  tittleExists,
  serviceExists,
  serviceDeleted,
} from "../helpers/service-validators.js";

export const createService = async (req, res) => {
    try {
      const { description, enterpise  } = req.body;

      const discountCode = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

      // await tittleExists(tittle);

      const newService = new serviceModel({
        ...req.body,
        discountCode,
      });

      await newService.save();

      res.status(201).json({
        msg: "Service created successfully",
        service: newService,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error creating service",
        errors: error.message,
      });
    }
};

export const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ status: true });

    const totalServices = services.length;

    res.status(200).json({
      totalServices,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error getting services",
      errors: error.message,
    });
  }
};

export const getServicesByCategory = async (req, res) => {
  try {
    const services = await serviceModel.find({
      category: req.params.id,
      status: true,
    });
    const totalServices = services.length;

    if (services.length === 0) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }

    res.status(200).json({
      totalServices,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error getting services",
      errors: error.message,
    });
  }
};

export const getServicesByCompany = async (req, res) => {
  try {
    const services = await serviceModel.find({
      company: req.params.company,
      status: true,
    });
    const totalServices = services.length;

    if (services.length === 0) {
      return res.status(404).json({
        msg: "Company not found",
      });
    }

    res.status(200).json({
      totalServices,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error getting services",
      errors: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await serviceModel.findById(id);

    await serviceExists(id);
    await serviceDeleted(id);

    res.status(200).json({
      service,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error getting services",
      errors: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  upload.single("img")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        msg: "Error uploading image",
        errors: err.message,
      });
    }
    try {
      const { id } = req.params;

      await tittleExists(req.body.tittle);
      await serviceExists(id);
      await serviceDeleted(id);

      const updatedService = {
        ...req.body,
        img: req.file.path,
      };

      await serviceModel.findByIdAndUpdate(id, updatedService, { new: true });

      res.status(200).json({
        msg: "Service updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error updating service",
        errors: error.message,
      });
    }
  });
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    await serviceExists(id);
    await serviceDeleted(id);

    await serviceModel.findByIdAndUpdate(id, { status: false });

    res.status(200).json({
      msg: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error deleting service",
      errors: error.message,
    });
  }
};
