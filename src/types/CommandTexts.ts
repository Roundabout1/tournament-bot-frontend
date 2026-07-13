export interface CommandParams {
  [key: string]: any;
}

export interface CommandConfig {
  text?: string;
  format?: (params: CommandParams) => string;
}

export const COMMAND_TEXTS: Record<string, Record<string, CommandConfig>> = {
  create_game: {
    start: {
      text: '📋 Начать создание новой игры',
    },
    make: {
      format: (params) => {
        const shuffleIcons: Record<string, string> = {
          Круговая: '🔄',
          Рейтинговая: '📊',
          Случайная: '🎲',
          'Мульти-турнир': '👑',
        };
        const icon = shuffleIcons[params.shuffle] || '🎯';
        let text = `🎮 Создание игры:\n`;
        text += `👥 Игроков: ${params.num_players}\n`;
        text += `${icon} Жеребьёвка: ${params.shuffle}\n`;
        if (params.num_tours !== null) text += `📊 Туров: ${params.num_tours}\n`;
        if (params.multiplier !== null) text += `✖️ Множитель: ${params.multiplier}\n`;
        if (params.size_group !== null) text += `👥 Размер группы: ${params.size_group}\n`;
        text += `🔄 Асимметричная: ${params.is_asymmetric ? 'Да' : 'Нет'}\n`;
        text += `💰 Штрафы: ${params.has_fines ? 'Да' : 'Нет'}`;
        return text;
      },
    },
    confirm: {
      format: (params) =>
        params.confirm ? '✅ Подтверждено создание новой игры' : '❌ Отменено создание новой игры',
    },
  },
  game_info: {
    sum_up_results: {
      text: '📊 Подведение итогов...',
    },
    status: {
      text: 'ℹ️ Запрос статуса игры...',
    },
    shuffle: {
      text: '🎲 Жеребьёвка...',
    },
    rounds_data: {
      text: '📋 Запрос данных туров...',
    },
  },
  add_results: {
    start: {
      text: '📝 Начало ввода результатов',
    },
    select_table: {
      format: (params) => `🎯 Выбран стол №${params.table}`,
    },
    set_status_handler: {
      format: (params) => {
        if (params.state === 'completed') {
          const winner = params.winner === params.player1 ? params.player1 : params.player2;
          return `🏆 Результат: победа игрока ${winner}`;
        } else if (params.state === 'draw') {
          return `🤝 Результат: ничья`;
        } else {
          return `⏸️ Результат: недоиграно`;
        }
      },
    },
  },
  edit_history: {
    start: {
      text: '📝 Редактирование истории игры',
    },
  },
  delete_player: {
    list: {
      text: '🗑️ Удаление игрока...',
    },
  },
};

export const getCommandText = (
  type: string,
  subtype?: string,
  content?: CommandParams,
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
