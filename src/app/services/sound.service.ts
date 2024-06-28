import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private successSoundSrc = '../../assets/sounds/sucess.mp3';
  private errorSoundSrc = '../../assets/sounds/error.mp3';

  playSuccessSound() {
    const successSound = new Audio(this.successSoundSrc);
    successSound.play();
  }

  playErrorSound() {
    const errorSound = new Audio(this.errorSoundSrc);
    errorSound.play();
  }
}
