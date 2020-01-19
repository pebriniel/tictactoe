
module.exports = (socket, next) => {
    const sockets = socket.request.headers.cookie;
    const datas = [];

    sockets.split(';').forEach(item => {
        let data = item.split('=').map(item => item.trim());
        datas[data[0]] = data[1];
    });
    // console.log(datas['cookiesDisclosureCount']);

    datas['test'] = 'ok';

    socket.request.cookies = datas;

    // console.log(socket.request.cookies);

    next();
}
