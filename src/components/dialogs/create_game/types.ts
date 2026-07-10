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
export type CreateGameState = 'start' | 'finish' | 'cancel' | 'confirm';
