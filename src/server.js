// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

//Albums
const albums = require('./api/albums');
const AlbumsServices = require('./services/postgres/AlbumsServices');
const AlbumsValidator = require('./validator/albums');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

//Songs
const songs = require('./api/songs');
const SongsServices = require('./services/postgres/SongsServices');
const SongsValidator = require('./validator/songs');

// token manager
const TokenManager = require('./tokenize/TokenManager');

//Users
const users = require('./api/users');
const UsersServices = require('./services/postgres/UsersServices');
const UsersValidator = require('./validator/users');

// Exports
const _exports = require('./api/exports/');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Likes
const userAlbumLikes = require('./api/userAlbumLikes');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');

// Cache
const CacheService = require('./services/redis/CacheService');

// storage
const StorageService = require('./services/storage/StorageService');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumsServices = new AlbumsServices();
    const songsService = new SongsServices();
    const usersServices = new UsersServices();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService();
    const collaborationsService = new CollaborationsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/albums/images'));
    const userAlbumLikesService = new UserAlbumLikesService();
    const cacheService = new CacheService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);
    
    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    
    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsServices,
                validator: AlbumsValidator,
                storageService,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersServices,
                validator: UsersValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersServices,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options:{
              service: playlistsService,
              validator: PlaylistsValidator,
            },
          },
          {
            plugin: _exports,
            options: {
              producerService: ProducerService,
              playlistsService,
              validator: ExportsValidator,
            },
          },
          {
            plugin: userAlbumLikes,
            options: {
              service: userAlbumLikesService,
              albumsServices,
              cacheService,
            },
          },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;

        if (response instanceof Error) {
            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            }
            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }
        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
