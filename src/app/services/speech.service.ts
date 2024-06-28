// speech.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string, lang: string = 'pt-BR', rate: number = 3): void {
    if (this.synth) {
      if (this.synth.speaking) {
        console.error('SpeechSynthesisUtterance.speaking');
        return;
      }

      if (text !== '') {
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.lang = lang;
        utterThis.rate = rate; // Set the speech rate
        utterThis.onend = () => {
          console.log('SpeechSynthesisUtterance.onend');
        };

        utterThis.onerror = (event) => {
          console.error('SpeechSynthesisUtterance.onerror', event);
        };

        this.synth.speak(utterThis);
      }
    } else {
      console.error('Speech synthesis not supported.');
    }
  }
}
