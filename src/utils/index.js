const mapDBToModel = ({id, name, year, created_at, updated_at}) => ({
    id,
    name,
    year,
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