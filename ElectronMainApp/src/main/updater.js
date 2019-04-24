const updater = require('electron-simple-updater');
const config = require('config');
const packageJson = require('../../package.json');
const log = require('./app/utils/log');
const listeners = require('./notifier');
const events = require('./events');

/**
 * Updater
 */
module.exports = (() => {

    let silent = true;

    /**
     * Initialize
     */
    const initUpdater = () => {
        if (packageJson["standalone-build"] !== 'true') {
            return;
        }

        updater.init({
            channel: packageJson["standalone-beta"] === 'true' ? 'beta' : 'prod',
            url: config.get('updatesUrl')
        });

        updater.on('checking-for-update', () => {
            log.info('Checking for updates..');
        });

        updater.on('update-available', (meta) => {
            log.info(`Update found version ${meta.version} at ${meta.update}`);
            if (!silent) {
                listeners.notifyListeners(events.APPLICATION_UPDATE_FOUND, meta);
            }
        });

        updater.on('update-not-available', () => {
            log.info('Updates not found');
            if (!silent) {
                listeners.notifyListeners(events.APPLICATION_UPDATE_NOT_FOUND);
            }
        });
    };

    /**
     * Checks for updates with result notifications
     */
    const checkForUpdates = () => {
        silent = false;
        updater.checkForUpdates();
    };

    return {
        initUpdater,
        checkForUpdates }
})();



