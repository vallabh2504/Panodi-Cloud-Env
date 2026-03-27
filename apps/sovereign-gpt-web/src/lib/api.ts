export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const TUNNEL_URL = 'https://mentor-plants-defence-katie.trycloudflare.com';
const SOVEREIGN_ENGINE_KEY = 'sk-sovereign-nano-2026';

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${TUNNEL_URL}/health`);
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function streamChat(
  history: ChatMessage[],
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(`${TUNNEL_URL}/chat`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SOVEREIGN_ENGINE_KEY}`
    },
    body: JSON.stringify({ messages: history }),
  });

  if (!response.ok) {
    throw new Error(`Engine error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data.trim() === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onChunk(content);
        } catch (e) {}
      }
    }
  }
}
