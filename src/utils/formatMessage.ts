import { marked } from 'marked';

// Настройка marked для безопасного HTML
marked.setOptions({
  breaks: true,  // Преобразовывать \n в <br>
  gfm: true,     // GitHub Flavored Markdown
});

// Обработка ASCII-таблиц (например, из жеребьёвки)
const formatAsciiTable = (text: string): string => {
  // Оборачиваем моноширинные блоки в <pre>
  if (text.includes('```')) {
    return text;
  }
  
  // Если есть строки с таблицей (несколько пробелов или символы |)
  const lines = text.split('\n');
  let hasTable = false;
  
  for (const line of lines) {
    if (line.includes('|') || (line.includes(' vs ') && line.includes('Стол'))) {
      hasTable = true;
      break;
    }
  }
  
  if (hasTable) {
    return `<pre class="ascii-table">${text}</pre>`;
  }
  
  return text;
};

// Конвертация Markdown в HTML с поддержкой таблиц
export const markdownToHtml = (text: string): string => {
  try {
    // Проверяем на ASCII таблицу
    let processed = formatAsciiTable(text);
    
    if (processed !== text) {
      return processed;
    }
    
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const html = marked.parse(escaped, {
      breaks: true,
      gfm: true,
    }) as string;
    
    return html;
  } catch (error) {
    console.error('Ошибка парсинга Markdown:', error);
    return `<pre>${text}</pre>`;
  }
};

// Специальная обработка для сообщений из Telegram
export const formatTelegramMessage = (text: string): string => {
  let formatted = text;
  
  // Обработка жирного текста (*text* или **text**)
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  
  // Обработка курсива (_text_)
  formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Обработка моноширинного текста (`text`)
  formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Обработка блоков кода (```code```)
  formatted = formatted.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  // Обработка ссылок [text](url)
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Обработка переносов строк
  formatted = formatted.replace(/\n/g, '<br/>');
  
  // Обработка цитат (> text)
  formatted = formatted.replace(/^&gt;\s(.*?)$/gm, '<blockquote>$1</blockquote>');
  
  return formatted;
};

// Основная функция форматирования
export const formatServerMessage = (text: string): string => {
  // Сначала обрабатываем Telegram-специфичные теги
  let formatted = formatTelegramMessage(text);
  
  // Затем конвертируем Markdown
  formatted = markdownToHtml(formatted);
  
  return formatted;
};

