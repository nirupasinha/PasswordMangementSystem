function responseHandler(res, statusCode, msg, err, data) {
    console.log(data);
    if (err) {
        res.status(statusCode).json({
            status: 'error',
            ok: true,
            code: statusCode || 400,
            message: err.message || "something wrong",
            result: {
                err
            },
        });
    } else {
        res.status(statusCode).json({
            status: 'success',
            ok: true,
            code: statusCode || 200,
            message: msg || `Successfully done!`,
            result: {
                data
            },
        });
    }
};
module.exports = { responseHandler }