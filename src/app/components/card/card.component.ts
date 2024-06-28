import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardAnimal } from './card-animal.type';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() animal!: CardAnimal;
  @Input() index!: number;
  @Input() disabled!: boolean;
  @Input() flipped!: boolean;

  @Output() flipEvent = new EventEmitter<boolean>();

  title = "";
  imageUrl = "";
  imageAlt = "";

  private readonly titleMap = {
    'cachorro': 'cão',
    'gato': 'gato',
    'pássaro': 'pássaro',
    'vaca': 'vaca',
    'cavalo': 'cavalo'
  }

  private readonly imageMap = {
    'cachorro': 'assets/images/cao.png',
    'gato': 'assets/images/gato.png',
    'pássaro': 'assets/images/passaro.png',
    'vaca': 'assets/images/vaca.png',
    'cavalo': 'assets/images/cavalo.png'
  }

  private readonly imageAltMap = {
    'cachorro': 'carta com imagem de cachorro',
    'gato': 'carta com imagem de gato',
    'pássaro': 'carta com imagem de pássaro',
    'vaca': 'carta com imagem de vaca',
    'cavalo': 'carta com imagem de cavalo'
  }

  ngOnInit() {
    this.title = this.titleMap[this.animal];
    this.imageUrl = this.imageMap[this.animal];
    this.imageAlt = this.imageAltMap[this.animal];
  }

  toggleFlip() {
    if (!this.disabled) {
      this.flipped = !this.flipped;
      this.flipEvent.emit(this.flipped);
    }
  }

  flip() {
    this.flipped = true;
  }
  unflip() {
    this.flipped = false;
  }

}
