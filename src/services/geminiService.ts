class GeminiService {
  private getApiKey(): string {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBaY7RnDcRRxE3ytOZfirGDC1OXR4C1urk';
  }

  /**
   * Transforms raw gesture phrase tokens (e.g. ['I', 'NEED', 'HELP']) 
   * into a natural, grammatically refined human sentence via Google AI Studio Gemini 1.5.
   */
  public async refineSentence(tokens: string[]): Promise<string> {
    if (!tokens || tokens.length === 0) return '';

    const rawPhrase = tokens.join(' ');
    const apiKey = this.getApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are the AI engine inside AI GLOVE, a wearable assistive technology device for non-verbal communication. 
Convert the following hand gesture phrase tokens into one natural, clear, polite sentence ready to be spoken aloud by a text-to-speech engine. 
Keep the sentence concise and direct. Do not include quotes, markdown formatting, or explanations.

Gesture Tokens: "${rawPhrase}"`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Google AI Studio API HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return generatedText.trim().replace(/^["']|["']$/g, '');
      }

      return rawPhrase;
    } catch (err) {
      console.warn('Gemini AI Studio API call failed, falling back to raw tokens:', err);
      return rawPhrase;
    }
  }

  /**
   * Generates a short technical AI explanation of a recognized gesture.
   */
  public async explainGestureIntent(gestureName: string, phrase: string): Promise<string> {
    const apiKey = this.getApiKey();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Provide a concise 1-sentence technical AI intent description for hand gesture "${gestureName}" mapped to phrase "${phrase}".`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || `Kinetic gesture "${gestureName}" mapped to speech output.`;
    } catch {
      return `Kinetic gesture "${gestureName}" mapped to speech output.`;
    }
  }
}

export const geminiService = new GeminiService();
