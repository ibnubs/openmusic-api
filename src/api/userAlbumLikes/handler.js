const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesHandler {
  constructor(service, albumsServices, cacheService) {
    this._service = service;
    this._albumsServices = albumsServices;
    this._cacheService = cacheService;
    
    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._albumsServices.getAlbumById(albumId);

    const isLiked = await this._service.checkLike({ userId: credentialId, albumId });

    if (isLiked) {
      throw new InvariantError('User sudah memberikan like pada album ini');
    }

    await this._service.addLike({ userId: credentialId, albumId });

    await this._cacheService.delete(`albums_likes:${albumId}`);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil diberikan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._albumsServices.getAlbumById(albumId);

    const isLiked = await this._service.checkLike({ userId: credentialId, albumId });

    if (!isLiked) {
      throw new InvariantError('User belum memberikan like pada album ini');
    }

    await this._service.deleteLike({ userId: credentialId, albumId });

    await this._cacheService.delete(`albums_likes:${albumId}`);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const albumId = request.params.id;

    await this._albumsServices.getAlbumById(albumId);

    let likesCount;
    let isCached = false;

    try {
        const cachedLikes = await this._cacheService.get(`albums_likes:${albumId}`);
        if (cachedLikes) {
            likesCount = JSON.parse(cachedLikes);
            isCached = true;
        }
    } catch (e) {
        // Cache miss is handled below
    }

    if (!isCached) {
        likesCount = await this._service.getLikesCount(albumId);
        await this._cacheService.set(
            `albums_likes:${albumId}`,
            JSON.stringify(likesCount),
            1800 // 30 minutes expiration
        );
    }

    const response = h.response({
        status: 'success',
        data: {
            likes: likesCount,
        },
    });
    response.code(200);
    if (isCached) response.header('X-Data-Source', 'cache');
    return response;
}
}


module.exports = UserAlbumLikesHandler;