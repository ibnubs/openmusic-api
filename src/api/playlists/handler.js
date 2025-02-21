const autoBind = require('auto-bind');
const { object } = require('joi');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const {id: owner} = request.auth.credentials;
    const playlistId = await this._service.addPlaylist({ name, owner });
    
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request){
    const {id: owner} = request.auth.credentials;
    const playlists = await this._service.getPlaylists(owner);
    
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request){
    const { id } = request.params;
    const {id: owner} = request.auth.credentials;
    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deletePlaylistById(id);
    return {
      status:'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h){

    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const {id: playlistId } = request.params;
    const {id: owner} = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, owner);
    await this._service.verifySongId(songId);
    await this._service.addSongToPlaylist(playlistId, songId, owner);
    const response = h.response({
      status:'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request){
    const {id: playlistId } = request.params;
    const {id: owner} = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    const playlist = await this._service.getSongsFromPlaylist(playlistId);
    return {
      status:'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request){
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const {id: playlistId } = request.params;
    const {id: owner} = request.auth.credentials;
    await this._service.verifyPlaylistAccess(playlistId, owner);
    await this._service.deleteSongFromPlaylist(playlistId, songId, owner);
    return {
      status:'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: owner } = request.auth.credentials;
    
    await this._service.verifyPlaylistAccess(playlistId, owner);
    const activities = await this._service.getPlaylistActivities(playlistId);
    
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;