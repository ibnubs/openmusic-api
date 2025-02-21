const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistSongDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }


  async getPlaylists(owner) {
    const query = {
      text: `SELECT DISTINCT p.id, p.name, u.username
      FROM playlists p
      LEFT JOIN users u ON u.id = p.owner
      LEFT JOIN collaborations c ON c.playlist_id = p.id
      WHERE p.owner = $1 OR c.user_id = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError(`Playlist gagal dihapus. ${id} tidak ditemukan`);
    }
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: 'INSERT INTO playlist_songs ( playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };
    
    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._pool.query({
      text: 'INSERT INTO playlist_song_activities (playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4)',
      values: [playlistId, songId, userId, 'add'],
    });

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {

    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    
    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];
    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs LEFT JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songsQuery);
    
    const songs = songsResult.rows.map(mapPlaylistSongDBToModel);
    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs,
    };

  }

  async deleteSongFromPlaylist(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }

    await this._pool.query({
      text: 'INSERT INTO playlist_song_activities (playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4)',
      values: [playlistId, songId, userId, 'delete'],
    });
  }
  
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      const query = {
        text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
        values: [playlistId, userId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, psa.action, psa.time
            FROM playlist_song_activities psa
            LEFT JOIN users ON users.id = psa.user_id
            LEFT JOIN songs ON songs.id = psa.song_id
            WHERE psa.playlist_id = $1
            ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

}

module.exports = PlaylistService;