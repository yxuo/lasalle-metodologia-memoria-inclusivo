import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardAnimal } from '../../components/card/card-animal.type';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute, Router } from '@angular/router';

interface Card {
  card: CardAnimal;
  index: number;
  disabled: boolean;
  flipped: boolean;
}

type WallType = 'incorrectCard' | 'faseFinished' | 'lastLevelFinished';

@Component({
  selector: 'app-fase',
  standalone: true,
  imports: [CardComponent, NgFor],
  templateUrl: './fase.component.html',
  styleUrl: './fase.component.scss',
})
export class FaseComponent implements OnInit {
  cards: Card[] = [];
  selectedCards: Card[] = [];
  rightCards: Card[] = [];
  wallTitle = '';
  wallType?: WallType;
  queryParams: any;
  level: number = -1;
  levelTitle = "";

  private readonly pairNames: CardAnimal[] = [
    'cao',
    'gato',
    'passaro',
    'cavalo',
    'vaca',
  ];

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    // Routes
    this._route.queryParamMap.subscribe((params: any) => {
      this.queryParams = params.params;

      // Se tiver nível, atualiza variável
      if (this.queryParams.nivel) {
        this.level = Number(this.queryParams?.nivel);
        this.levelTitle = `Fase ${this.level}`;
        this.sortCards(this.level);
      }

      // Senão, nível 1
      else {
        this.goToLevel(1);
      }
    });
  }

  goToLevel(level: number) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        nivel: level,
      },
      queryParamsHandling: 'merge',
    });
  }

  goToMenu() {
    this._router.navigate([''], {});
  }

  updateFlipState(card: Card, flipped: boolean) {
    card.flipped = flipped;
  }

  // #region wall

  openWall(title = '', type?: WallType) {
    const wall = document.getElementById('wall') as HTMLElement;
    wall.classList.remove('hidden');
    const wallTitle = document.getElementById('wall-title') as HTMLElement;
    wallTitle.innerText = title;
    this.wallType = type;
  }

  closeWall() {
    const wall = document.getElementById('wall') as HTMLElement;
    wall.classList.add('hidden');
  }

  clickWall() {
    if (this.wallType === 'incorrectCard') {
      const card1 = this.selectedCards[0];
      const card2 = this.selectedCards[1];
      if (this.selectedCards.length === 2 && card1.card !== card2.card) {
        card1.flipped = false;
        card2.flipped = false;
        this.selectedCards = [];
      }
    } else if (this.wallType === 'faseFinished') {
      this.goToLevel(this.level + 1);
    } else if (this.wallType === 'lastLevelFinished') {
      this.goToMenu();
    }
    this.closeWall();
  }

  // #endregion

  private shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  selectCard(card: Card) {
    if (card.disabled || this.selectedCards.includes(card)) {
      return;
    }
    // Adicionar carta
    this.selectedCards.push(card);

    // Se tiver 2 pares, marca como acertado
    if (this.selectedCards.length === 2) {
      const card1 = this.selectedCards[0];
      const card2 = this.selectedCards[1];
      if (card1.card === card2.card) {
        card1.disabled = true;
        card2.disabled = true;
        this.rightCards.push(card1);
        this.rightCards.push(card2);
        this.selectedCards = [];
      } else {
        this.openWall(
          `Os cartões ${card1.index}: ${card1.card} e ${card2.index}: ${card2.card} são diferentes.`,
          'incorrectCard'
        );
      }
    }

    // Se todos os cards foram acertados, próxima fase
    if (this.rightCards.length === this.cards.length) {
      if (this.level >= 3) {
        this.openWall(`Parabéns! Jogo finalizado.`, 'lastLevelFinished');
      } else {
        this.openWall(
          `Parabéns! Fase ${this.level} concluída.`,
          'faseFinished'
        );
      }
    }
  }

  sortCards(level: number) {
    const addPairs = level - 1;
    const pairs = 3 + addPairs;
    const sortedPairs = [...this.pairNames];
    this.shuffleArray(sortedPairs);
    const pairList = sortedPairs.slice(0, pairs);
    const cards = [...pairList, ...pairList];
    this.shuffleArray(cards);
    this.cards = [];
    for (const i in cards) {
      this.cards.push({
        card: cards[i],
        index: Number(i) + 1,
        disabled: false,
        flipped: false,
      });
    }
  }
}
