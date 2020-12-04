import fetch from 'isomorphic-unfetch'

export default class Fetch {
    static async execute(method, url, body = null, key = 'objects', headers = { 'Content-type': 'application/json' }) {
        method = method.toLowerCase();
        if (['get', 'post'].indexOf(method) < 0) {
            return null;
        }

        if (method == 'post') {
            body = JSON.stringify(body);
        }

        const res = await fetch(url, { method, headers, body });
        const data = await res.json();
        return data;
    }
}
