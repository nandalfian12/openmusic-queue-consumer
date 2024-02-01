const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getPlaylistWithSongs(playlistId) {
    const query = {
      text: `
      SELECT json_build_object(
        'id', playlists.id,
        'name', playlists.name,
        'songs', COALESCE(json_agg(
          json_build_object(
            'id', songs.id,
            'title', songs.title,
            'performer', songs.performer
          )
        ) FILTER (WHERE songs.id IS NOT NULL), '[]')
      ) as playlist
      FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      LEFT JOIN songs ON songs.id = playlist_songs.song_id
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
