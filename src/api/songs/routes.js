const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: handler.postSongHandler, // menerima dan simpan satu lagu
  },
  {
    method: "GET",
    path: "/songs",
    handler: handler.getSongsHandler, // mengembalikan seluruh lagu
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: handler.getSongByIdHandler, // mengembalikan "satu lagu"
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: handler.putSongByIdHandler, // menerima dan mengubah satu lagu berdasarkan id lagu
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: handler.deleteSongByIdHandler, // menghapus satu lagu berdasarkan id
  },
];

module.exports = routes;
