/**
 * Created by michaelfisher on 7/1/15.
 */
var Item = require('../../model/item.js');

exports.page = function (req, res) {
    Item.paginate({}, {
        page: req.params.page, limit: 20
    }, function (err, results, pageCount, itemCount) {
        if (err) res.send(err);
        res.json({itemCount: itemCount, items: results});
    });
};
