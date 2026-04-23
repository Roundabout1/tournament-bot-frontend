export interface CommandParams {
  [key: string]: any;
}

export interface CommandConfig {
  text?: string;
  format?: (params: CommandParams) => string;
}

export const COMMAND_TEXTS: Record<string, Record<string, CommandConfig>> = {
  create_game: {
    'create_game': {
      text: '📋 Начать создание новой игры',
    },
    'confirm_new_game': {
      format: (params) => params.confirm 
        ? '✅ Подтверждено создание новой игры'
        : '❌ Отменено создание новой игры',
    },
    'player_count': {
      format: (params) => `👥 Установлено количество игроков: ${params.count}`,
    },
    'shuffle_type': {
      format: (params) => {
        const shuffleMap: Record<string, string> = {
          'Круговая': '🔄',
          'Рейтинговая': '📊',
          'Случайная': '🎲',
          'Мульти-турнир': '🏆',
        };
        const icon = shuffleMap[params.shuffle] || '🎯';
        return `${icon} Выбран тип жеребьёвки: ${params.shuffle}`;
      },
    },
    'set_multi_tour_group_size': {
      format: (params) => `👥 Установлен размер группы: ${params.count}`,
    },
    'set_multiplier': {
      format: (params) => `✖️ Установлен множитель туров: ${params.count}`,
    },
    'tour_count': {
      format: (params) => `📊 Установлено количество туров: ${params.count}`,
    },
    'asymmetric': {
      format: (params) => params.is_asymmetric 
        ? '🔄 Игра будет асимметричной'
        : '⚖️ Игра будет симметричной',
    },
    'fines': {
      format: (params) => params.has_fines 
        ? '💰 В игре будут штрафы'
        : '✅ Штрафы в игре отсутствуют',
    },
  },
  game_info: {
    'sum_up_results': {
      text: '📊 Подведение итогов...',
    },
    'status': {
      text: 'ℹ️ Запрос статуса игры...',
    },
    'shuffle': {
      text: '🎲 Жеребьёвка...',
    },
    'rounds_data': {
      text: '📋 Запрос данных туров...',
    },
  },
  enter_results: {
    'enter': {
      text: '✏️ Ввод результатов...',
    },
  },
  edit: {
    'edit': {
      text: '📝 Редактирование результатов...',
    },
  },
  remove_player: {
    'remove': {
      text: '🗑️ Удаление игрока...',
    },
  },
};

export const getCommandText = (
  type: string, 
  subtype?: string, 
  content?: CommandParams
): string | null => {
  const typeConfig = COMMAND_TEXTS[type];
  if (!typeConfig) return null;
  
  const commandConfig = subtype ? typeConfig[subtype] : null;
  if (!commandConfig) return null;
  
  if (commandConfig.format && content) {
    return commandConfig.format(content);
  }
  
  return commandConfig.text ?? null;
};