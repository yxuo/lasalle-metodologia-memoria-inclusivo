import { NgFor } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CardAnimal } from '../../components/card/card-animal.type';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SoundService } from '../../services/sound.service';
import { SpeechService } from '../../services/speech.service';

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
  imports: [CardComponent, NgFor, RouterModule],
  providers: [SpeechService],
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
  levelTitle = '';

  private readonly pairNames: CardAnimal[] = [
    'cachorro',
    'gato',
    'pássaro',
    'cavalo',
    'vaca',
  ];

  private readonly cardIndexesMap = {
    level1: [4, 5, 6, 1, 2, 3],
    level2: [7, 8, 9, 4, 5, 6, 1, 2],
    level3: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0],
  };
  private cardIndexes: number[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private soundService: SoundService,
    private speechService: SpeechService
  ) { }

  ngOnInit() {
    // Routes
    this._route.queryParamMap.subscribe((params: any) => {
      this.queryParams = params.params;

      // Se tiver nível, atualiza variável
      if (this.queryParams.nivel) {
        this.level = Number(this.queryParams?.nivel);
        this.levelTitle = `Fase ${this.level}`;

        // índices dos cards
        this.cardIndexes = this.cardIndexesMap.level1;
        if (this.level === 2) {
          this.cardIndexes = this.cardIndexesMap.level2;
        } else if (this.level === 3) {
          this.cardIndexes = this.cardIndexesMap.level3;
        }
        this.setLevelIndexes();
        this.sortCards(this.level);
      }

      // Senão, nível 1
      else {
        this.goToLevel(1);
      }
    });
  }

  private setLevelIndexes() {
    // índices dos cards
    this.cardIndexes = this.cardIndexesMap.level1;
    if (this.level === 2) {
      this.cardIndexes = this.cardIndexesMap.level2;
    } else if (this.level === 3) {
      this.cardIndexes = this.cardIndexesMap.level3;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let cardNumber = +event.key;
    const card = this.cards.filter((i) => i.index === cardNumber)[0] as Card | undefined;
    const isNumber = event.code.match(/^(Numpad|Digit)[0-9]$/g);
    if (isNumber && card) {
      if (card.flipped) {
        // Card já virado, nada a fazer
      } else {
        card.flipped = true;
      }
      this.selectCard(card);
    }

    if (event.code === 'Enter' || event.code === 'Space') {
      if (this.wallType) {
        this.clickWall();
      }
    }

    if (event.code === 'Escape') {
      if (!this.wallType) {
        this.goToMenu();
      }
    }
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
    this.wallType = undefined;
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
        this.soundService.playSuccessSound();
        this.speechService.speak('Par encontrado');
        card1.disabled = true;
        card2.disabled = true;
        this.rightCards.push(card1);
        this.rightCards.push(card2);
        this.selectedCards = [];
      }

      // Senão lança aviso
      else {
        this.soundService.playErrorSound();
        this.openWall(
          `Os cartões ${card1.index}: ${card1.card} e ${card2.index}: ${card2.card} são diferentes. Clique na tela para continuar`,
          'incorrectCard'
        );
        this.speechService.speak(`Os cartões ${card1.index}: ${card1.card} e ${card2.index}: ${card2.card} são diferentes. Clique na tela para continuar`);
      }
    }

    // Se todos os cards foram acertados, próxima fase
    if (this.rightCards.length === this.cards.length) {
      this.selectedCards = [];
      this.rightCards = [];

      if (this.level >= 3) {
        setTimeout(() => {
          this.speechService.speak('Parabéns! Jogo finalizado.');
        }, 2000);
        this.openWall(`Parabéns! Jogo finalizado.`, 'lastLevelFinished');
      } else {
        setTimeout(() => {
          this.speechService.speak(`Parabéns! Fase ${this.level} concluída.`);
        }, 2000);
        this.openWall(
          `Parabéns! Fase ${this.level} concluída.`,
          'faseFinished'
        );
      }
    }
  }

  sortCards(level: number) {
    // Nível 1 = 3 pares, nível 2 = 4, nível 3 = 5...
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
        index: +i,
        disabled: false,
        flipped: false,
      });
    }

    for (const i in this.cards) {
      const card = this.cards[i];
      card.index = this.cardIndexes[i];
    }
    if (this.cards.length === 10) {
      const card10 = this.cards.find((i) => i.index === 10);
      if (card10) {
        card10.index = 0;
      }
    }
  }
}
