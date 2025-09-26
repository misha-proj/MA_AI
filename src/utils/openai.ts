const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const modelMap = {
  'AM Base': 'gpt-3.5-turbo',
  'AM Start': 'gpt-4-turbo',
  'AM Pro': 'gpt-4o'
};

export const streamChatCompletion = async (
  messages: { role: string; content: string }[],
  model: 'AM Base' | 'AM Start' | 'AM Pro',
  apiKey: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  if (!apiKey || !apiKey.startsWith('sk-')) {
    throw new Error('Недействительный API ключ OpenAI');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelMap[model],
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Неизвестная ошибка'}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('No reader available');
  }

  try {
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream reading error:', error);
    throw error;
  }
};