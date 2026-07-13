export interface ConfirmData {
  confirm: boolean;
}

export enum ShuffleType {
  Round = 'Круговая',
  Rating = 'Рейтинговая',
  Random = 'Случайная',
  MultiTournament = 'Мульти-турнир',
}

export type CreateGameState = 'start' | 'finish' | 'cancel' | 'confirm';
