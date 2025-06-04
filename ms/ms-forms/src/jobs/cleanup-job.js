const cron = require('node-cron');
const { Op } = require('sequelize');
const { Token } = require('../models/token.model');
const { PasswordReset } = require('../models/password-reset.model');

const scheduleCleanup = () => {
    // Corre cada día a la 1:00 AM
    cron.schedule('0 1 * * *', async () => {
        const now = new Date();

        try {
            const tokenDeleted = await Token.destroy({
                where: {
                    expiresAt: { [Op.lt]: now }
                }
            });

            const resetDeleted = await PasswordReset.destroy({
                where: {
                    expiresAt: { [Op.lt]: now }
                }
            });

            console.log(`[CLEANUP] Tokens eliminados: ${tokenDeleted}, PasswordResets eliminados: ${resetDeleted}`);
        } catch (error) {
            console.error('[CLEANUP ERROR]', error);
        }
    });
};

module.exports = { scheduleCleanup };
