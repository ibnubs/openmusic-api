const UserAlbumLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'userAlbumLikes',
    version: '1.0.0',
    register: async (server, {service, albumsServices, cacheService}) => {
        const userAlbumLikesHandler = new UserAlbumLikesHandler(service, albumsServices, cacheService);
        server.route(routes(userAlbumLikesHandler));
    },
};