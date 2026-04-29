export interface StepProps {
  onNext: (data?: any) => void;
  onCancel: () => void;
  onBack?: () => void;
  data?: any;
}

export interface PlayersCountData {
  count: number;
}

export interface ShuffleTypeData {
  shuffle: string;
}

export interface GroupSizeData {
  count: number;
}

export interface MultiplierData {
  count: number;
}

export interface ToursCountData {
  count: number;
}

export interface AsymmetricData {
  is_asymmetric: boolean;
}

export interface FinesData {
  has_fines: boolean;
}

export interface ConfirmData {
  confirm: boolean;
}
export type CreateGameStep = 'entry_players_count' |
  'entry_shuffle_type' |
  'set_multi_tour_group_size' |
  'set_multiplier' |
  'entry_tours_count' |
  'entry_is_asymmetric' |
  'entry_has_game_fine' |
  'create_game_finish' |
  'confirm_new_game' |
  'entry_error' |
  'cancel_game_creation';
