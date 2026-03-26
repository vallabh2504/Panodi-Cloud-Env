/**
 * Sovereign GPT — API Client
 * Connects the frontend to the Bridge API with streaming support.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface HealthResponse {
  status: string
  model: string
  engine: string
}

/** Check if the bridge API is reachable */
export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error(`Bridge API unreachable (${res.status})`)
  return res.json()
}

/** Send a chat request and stream the response token-by-token */
export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
): Promise<void> {
  let res: Response

  try {
    res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, stream: true }),
    })
  } catch {
    onError('Cannot reach Sovereign GPT engine. Is bridge_api.py running?')
    return
  }

  if (!res.ok) {
    const text = await res.text()
    onError(`Bridge API error: ${text}`)
    return
  }

  const reader = res.body?.getReader()
  if (!reader) {
    onError('Streaming not supported')
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()

      if (data === '[DONE]') {
        onDone()
        return
      }

      try {
        const parsed = JSON.parse(data)
        if (parsed.error) {
          onError(parsed.error)
          return
        }
        if (parsed.content) {
          onToken(parsed.content)
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  onDone()
}

/** Send a chat request without streaming (single response) */
export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, stream: false }),
  })

  if (!res.ok) {
    throw new Error(`Bridge API error: ${await res.text()}`)
  }

  const data = await res.json()
  return data.content
}
