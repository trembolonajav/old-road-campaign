import { Enemy } from '@/types/game';
import ratoCeleiroImg from '@/assets/enemies/rato-celeiro.png';
import loboMagroImg from '@/assets/enemies/lobo-magro.png';
import salteadorImg from '@/assets/enemies/salteador.png';
import escudeiroCaidoImg from '@/assets/enemies/escudeiro-caido.png';
import loboAlfaImg from '@/assets/enemies/lobo-alfa.png';
import capitaoSalteadoresImg from '@/assets/enemies/capitao-salteadores.png';
import trollPonteImg from '@/assets/enemies/troll-ponte.png';

export interface EnemyData extends Enemy {
  image: string;
}

export const ENEMIES: EnemyData[] = [
  {
    id: 'e1', name: 'Rato do Celeiro', type: 'common',
    hp: 10, maxHp: 10, attack: 3, defense: 1,
    xpReward: 4, goldReward: [2, 5], fleeChance: 0.9,
    description: 'Um rato enorme e faminto. Não é grande coisa, mas morde forte.',
    image: ratoCeleiroImg,
  },
  {
    id: 'e2', name: 'Lobo Magro', type: 'common',
    hp: 16, maxHp: 16, attack: 5, defense: 2,
    xpReward: 6, goldReward: [3, 7], fleeChance: 0.8,
    description: 'Faminto e desesperado. Mais perigoso do que parece.',
    image: loboMagroImg,
  },
  {
    id: 'e3', name: 'Salteador de Estrada', type: 'common',
    hp: 20, maxHp: 20, attack: 6, defense: 3,
    xpReward: 8, goldReward: [5, 10], fleeChance: 0.75,
    description: 'Um bandido que embosca viajantes na Estrada Velha.',
    image: salteadorImg,
  },
  {
    id: 'e4', name: 'Escudeiro Caído', type: 'common',
    hp: 24, maxHp: 24, attack: 7, defense: 5,
    xpReward: 10, goldReward: [6, 12], fleeChance: 0.7,
    description: 'Um escudeiro que nunca encontrou descanso. Ainda luta.',
    image: escudeiroCaidoImg,
  },
  {
    id: 'e5', name: 'Lobo Alfa', type: 'elite',
    hp: 35, maxHp: 35, attack: 9, defense: 4,
    xpReward: 18, goldReward: [10, 18], fleeChance: 0.4,
    description: 'O líder da matilha. Cicatrizes de batalha cobrem seu corpo.',
    image: loboAlfaImg,
  },
  {
    id: 'e6', name: 'Capitão dos Salteadores', type: 'elite',
    hp: 40, maxHp: 40, attack: 10, defense: 6,
    xpReward: 22, goldReward: [12, 22], fleeChance: 0.35,
    description: 'Comanda os bandidos da região. Cruel e experiente.',
    image: capitaoSalteadoresImg,
  },
  {
    id: 'e7', name: 'Troll da Ponte', type: 'boss',
    hp: 70, maxHp: 70, attack: 13, defense: 8,
    xpReward: 50, goldReward: [30, 45], fleeChance: 0.05,
    description: 'O senhor da ponte velha. Ninguém passa sem pagar... com sangue.',
    image: trollPonteImg,
  },
];
