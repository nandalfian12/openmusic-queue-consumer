const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistWithSongs(playlistId) {
    const query = {
      text: `
      SELECT playlists.id, playlists.name, array_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer)) as songs
      FROM playlists
      LEFT JOIN songs ON songs.id = playlists.id
      WHERE playlists.id = $1
      GROUP BY playlists.id, playlists.name
    `,
      values: [playlistId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

module.exports = PlaylistsService;
