export default class Utils {

    static url = (path) => {
        if (!path) {
            return "";
        }
        let url = process.env.NEXT_PUBLIC_APP_URL;
        if (!url.endsWith('/') && !path.startsWith('/')) {
            url += '/';
        }
        if (path) {
            url += path;
        }
        return url;
    }
    static getHash = (msg, algorithm = 'md5') => {
        const crypto = require('crypto');
        var hash = crypto.createHash(algorithm);
        hash.update(msg, 'binary');
        return hash.digest('hex');
    }
}
