const getRequestLogger = require("../utils/request-logger");
const filesService = require('../services/files.service');
const { success, badRequest } = require("../utils/response");
const constants = require("../utils/constants");
const fs = require('fs');

exports.uploadImages = async (req, res) => {
  const logger = getRequestLogger(req.requestId);

  try {
    const { formId } = req.params;
    const userId = req.user?.keyid;

    if (!userId || !formId) {
      const error = badRequest("userId y formId son requeridos");
      logger.error(error);
      return res.status(400).json(error);
    }

    if (!req.files || req.files.length === 0) {
      const error = badRequest("No se enviaron archivos");
      logger.error(error);
      return res.status(400).json(error);
    }

    let images = req.files.images;
    if (!images) {
      const error = badRequest(`No se subieron imágenes`);
      logger.error(error);
      return res.status(400).json(error);
    }

    if (!Array.isArray(images)) {
      images = [images]; // Forzar a array si solo viene uno
    }

    // Validar número máximo de archivos
    if (images.length > constants.MAX_IMAGE_COUNT) {
      const error = badRequest(`Se permiten máximo ${constants.MAX_IMAGE_COUNT} imágenes`);
      logger.error(error);
      return res.status(400).json(error);
    }

    // Validar tamaño de cada archivo
    const oversizedFiles = images.filter(f => f.size > constants.MAX_IMAGE_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const error = badRequest(`Cada imagen debe pesar menos de ${constants.MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`);

      // Eliminar archivos subidos temporalmente (si se usó multer)
      for (const f of images) {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      }

      logger.error(error);
      return res.status(400).json(error);
    }

    // Guardar imágenes
    images.map(file => filesService.saveImage(userId, formId, file.name, file.data));

    res.status(200).json(success({ message: 'Imágenes cargadas con éxito' }));

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error subiendo imágenes' });
  }
};

// Endpoint para listar imágenes
exports.listImages = (req, res) => {
  const logger = getRequestLogger(req.requestId);
  const { formId } = req.params;
  try {
    const userId = req.user.keyid;
    const images = filesService.listImages(userId, formId);
    res.status(200).json(success({ images }));
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Endpoint para obtener imagen específica
exports.getImage = (req, res) => {
  const logger = getRequestLogger(req.requestId);
  const { formId, imageName } = req.params;
  try {
    const userId = req.user.keyid;
    const imagePath = filesService.getImagePath(userId, formId, imageName);
    res.sendFile(imagePath);
  } catch (error) {
    logger.error(error);
    res.status(404).json({ error: error.message });
  }
}
