export type CreateGameStep =
  | 'entry_players_count'
  | 'entry_shuffle_type'
  | 'set_multi_tour_group_size'
  | 'set_multiplier'
  | 'entry_tours_count'
  | 'entry_is_asymmetric'
  | 'entry_has_game_fine'
  | 'create_game_finish'
  | 'confirm_new_game'
  | 'entry_error'
  | 'cancel_game_creation';
