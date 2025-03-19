const mapDBToModel = ({id, name, year, cover, songs, created_at, updated_at}) => ({
    id,
    name,
    year,
    coverUrl: cover,
    songs,
    createdAt: created_at,
    updatedAt: updated_at,
});

const mapSongDBToModel = ({id, title, year, performer, genre, duration, album_id, created_at, updated_at}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: album_id,
    createdAt: created_at,
    updatedAt: updated_at,
});

const mapPlaylistSongDBToModel = ({
    id, 
    title,
    performer,
    }) => ({
    id,
    title,
    performer
});

module.exports = { mapDBToModel, mapSongDBToModel, mapPlaylistSongDBToModel };