const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
    
        const query = {
            // Perbaiki dengan menyebutkan kolom secara eksplisit
            text: `INSERT INTO albums(id, name, year, created_at, updated_at) 
                   VALUES($1, $2, $3, $4, $5) RETURNING id`,
            values: [id, name, year, createdAt, updatedAt],
        };
        
        const result = await this._pool.query(query);
    
        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }
    
        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditembukan');
        }

        const resultSongs = await this._pool.query({
            text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
            values: [id],
        });

        return {
            ...result.rows.map(mapDBToModel)[0],
            songs: resultSongs.rows,
        }
        
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(`Gagal memperbarui album. ${id} tidak ditemukan`);
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

    async updateAlbumCoverUrl({ id, url }) {
    
        const query = {
            text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
            values: [url, id],
        };

    const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal Menambahkan Album Cover. Id tidak ditemukan');
        }
    }
}
module.exports = AlbumsService;