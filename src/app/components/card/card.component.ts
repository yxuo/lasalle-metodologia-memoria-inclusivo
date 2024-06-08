import { Component, Input } from '@angular/core';
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
  
}
