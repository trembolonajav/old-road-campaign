import { RoadNode } from '@/types/game';

export interface WorldRegion {
  id: string;
  name: string;
  description: string;
  locked: boolean;
  lockMessage: string;
  nodes: RoadNode[];
}

export const ROAD_NODES: RoadNode[] = [
  {
    id: 'n1',
    name: 'Saída da Vila',
    description: 'Algo se move entre restos de carga apodrecida.',
    enemyId: 'e1',
    type: 'common',
    unlockCondition: 'start',
  },
  {
    id: 'n2',
    name: 'Trilha Gasta',
    description: 'Olhos famintos surgem na trilha estreita.',
    enemyId: 'e2',
    type: 'common',
    unlockCondition: 'start',
  },
  {
    id: 'n3',
    name: 'Posto Abandonado',
    description: 'Uma voz rouca corta o caminho: "Deixe as moedas e siga vivo."',
    enemyId: 'e3',
    type: 'common',
    unlockCondition: 'start',
  },
  {
    id: 'n4',
    name: 'Ruínas da Guarda',
    description: 'Armadura enferrujada. Passos lentos. A guarda jamais terminou.',
    enemyId: 'e4',
    type: 'common',
    unlockCondition: 'start',
  },
  {
    id: 'n5',
    name: 'Clareira da Matilha',
    description: 'A mata silencia. A matilha espera o comando do maior.',
    enemyId: 'e5',
    type: 'elite',
    unlockCondition: 'clear_commons',
  },
  {
    id: 'n6',
    name: 'Acampamento dos Salteadores',
    description: 'Ele não ameaça. Só saca a lâmina e avança.',
    enemyId: 'e6',
    type: 'elite',
    unlockCondition: 'defeat_alpha',
  },
  {
    id: 'n7',
    name: 'Ponte Velha',
    description: 'A ponte velha estremece. Algo enorme se ergue do outro lado.',
    enemyId: 'e7',
    type: 'boss',
    unlockCondition: 'defeat_captain',
  },
];

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'estrada_velha',
    name: 'Estrada Velha',
    description: 'Uma rota antiga infestada por criaturas e bandidos.',
    locked: false,
    lockMessage: '',
    nodes: ROAD_NODES,
  },
  {
    id: 'montanhas_cinzentas',
    name: 'Montanhas Cinzentas',
    description: 'Picos gelados onde ecoam rugidos distantes.',
    locked: true,
    lockMessage: 'Conclua a Estrada Velha',
    nodes: [],
  },
  {
    id: 'pantano_sinos',
    name: 'Pântano dos Sinos',
    description: 'Névoa perpétua e sons que não deveriam existir.',
    locked: true,
    lockMessage: 'Conclua a Estrada Velha',
    nodes: [],
  },
  {
    id: 'ruinas_ferro',
    name: 'Ruínas de Ferro',
    description: 'Fortalezas esquecidas guardam segredos terríveis.',
    locked: true,
    lockMessage: 'Conclua a Estrada Velha',
    nodes: [],
  },
  {
    id: 'costa_partida',
    name: 'Costa Partida',
    description: 'Falésias partidas e naufrágios assombrados.',
    locked: true,
    lockMessage: 'Conclua a Estrada Velha',
    nodes: [],
  },
];
