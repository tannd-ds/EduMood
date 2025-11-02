/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai'
// import { buildGeminiStructuredResponseConfig } from './geminiRequestPayload'
import { buildGeminiPrompt } from './geminiPrompt'

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' })

export class NewGeminiService {
  private model = genAI;
  private model_name = 'gemini-2.5-flash';

  constructor() {}

  async chat(
    history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>,
    message: string,
  ): Promise<string> {
    try {
      const contents = [
        ...history.map((item) => ({ ...item })),
        { role: 'user', parts: [{ text: message }] },
      ]

      const response = await this.model.models.generateContent({
        model: this.model_name,
        contents,
        config: {
          systemInstruction: buildGeminiPrompt(),
        }
      })

      const text = this.extractText(response)

      if (!text) {
        throw new Error('Gemini chat returned an empty response')
      }

      return text
    } catch (error) {
      const parsedError = error instanceof Error ? error : new Error(String(error))
      console.error('❌ Gemini chat error:', parsedError)
      throw parsedError
    }
  }

  private extractText(response: any): string {
    if (!response) return ''

    if (typeof response === 'string') return response

    if (typeof response.text === 'function') {
      try {
        return response.text()
      } catch (err) {
        console.warn('⚠️ Failed to read response.text():', err)
      }
    }

    if (typeof response.text === 'string') return response.text

    if (response.response) {
      if (typeof response.response.text === 'function') {
        try {
          return response.response.text()
        } catch (err) {
          console.warn('⚠️ Failed to read response.response.text():', err)
        }
      }

      if (typeof response.response.text === 'string') {
        return response.response.text
      }
    }

    return ''
  }

}
