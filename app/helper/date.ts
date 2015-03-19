/**
 * Format a date like YYYY-MM-DD.
 * @method formatDate
 * @param {string} template
 * @param {Date} d Date
 * @return {string}
 * @license MIT
 */

export function formatDate(template, d) {
    var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':');
    var date = new Date(d - d.getTimezoneOffset() * 60000);
    return date.toISOString().split(/[-:.TZ]/).reduce(function(template, item, i) {
        return template.split(specs[i]).join(item);
    }, template);
}
