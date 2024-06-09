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

  private readonly titleMap = {
    'cao': 'cão',
    'gato': 'gato',
    'passaro': 'pássaro',
    'vaca': 'vaca',
    'cavalo': 'cavalo'
  }

  private readonly imageMap = {
    'cao': 'assets/images/cao.png',
    'gato': 'assets/images/gato.png',
    'passaro': 'assets/images/passaro.png',
    'vaca': 'assets/images/vaca.png',
    'cavalo': 'assets/images/cavalo.png'
  }
  
  ngOnInit() {
    this.title = this.titleMap[this.animal];
    this.imageUrl = this.imageMap[this.animal];
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
