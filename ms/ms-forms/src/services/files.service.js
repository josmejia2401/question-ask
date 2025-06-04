const path = require('path');
const fs = require('fs');
const constants = require('../utils/constants');

class FilesService {


    getFormImagesFolder(userId, formId) {
        const basePath = path.resolve(constants.UPLOADS_DIR || 'uploads');
        return path.join(basePath, userId, 'forms', formId, 'images');
    }

    // Listar imágenes disponibles en un formulario
    listImages(userId, formId) {
        const folderPath = this.getFormImagesFolder(userId, formId);
        if (!fs.existsSync(folderPath)) return [];
        try {
            return fs.readdirSync(folderPath).filter(file => {
                // Opcional: filtrar solo archivos (ignorar carpetas)
                const fullPath = path.join(folderPath, file);
                return fs.statSync(fullPath).isFile();
            });
        } catch (err) {
            // En caso de error devolver array vacío o lanzar error según prefieras
            return [];
        }
    }

    // Obtener ruta completa a imagen específica
    getImagePath(userId, formId, imageName) {
        // Evitar path traversal (../ etc)
        if (imageName.includes('..') || path.isAbsolute(imageName)) {
            throw new Error('Nombre de imagen inválido');
        }
        const folderPath = this.getFormImagesFolder(userId, formId);
        const imagePath = path.join(folderPath, imageName);
        console.log("imagePath", imagePath);
        if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
            throw new Error('Imagen no encontrada');
        }
        return imagePath;
    }

    getFormFolder(userId, formId) {
        const basePath = path.resolve(constants.UPLOADS_DIR || 'uploads');
        return path.join(basePath, userId, 'forms', formId);
    }

    deleteFormFiles(userId, formId) {
        const folderPath = this.getFormFolder(userId, formId);
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`Eliminado: ${folderPath}`);
        } else {
            console.warn(`No se encontró carpeta: ${folderPath}`);
        }
    }

    saveImage(userId, formId, imageName, buffer) {
        const folder = this.getFormImagesFolder(userId, formId);
        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(path.join(folder, imageName), buffer);
    }
}

module.exports = new FilesService();
