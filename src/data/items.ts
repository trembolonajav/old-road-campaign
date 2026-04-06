import { Equipment } from '@/types/game';

// Item images
import swordRusty from '@/assets/items/sword-rusty.png';
import swordIron from '@/assets/items/sword-iron.png';
import swordGuard from '@/assets/items/sword-guard.png';
import swordReinforced from '@/assets/items/sword-reinforced.png';
import armorCloth from '@/assets/items/armor-cloth.png';
import armorLeather from '@/assets/items/armor-leather.png';
import armorChain from '@/assets/items/armor-chain.png';
import armorPlate from '@/assets/items/armor-plate.png';
import shieldCracked from '@/assets/items/shield-cracked.png';
import shieldWood from '@/assets/items/shield-wood.png';
import shieldIron from '@/assets/items/shield-iron.png';
import shieldGate from '@/assets/items/shield-gate.png';
import potionHealth from '@/assets/items/potion-health.png';

export const WEAPONS: Equipment[] = [
  { id: 'w1', name: 'Espada Gasta', type: 'weapon', bonus: 2, price: 0, description: 'Uma lâmina enferrujada, mas ainda corta.', image: swordRusty },
  { id: 'w2', name: 'Espada Curta de Ferro', type: 'weapon', bonus: 4, price: 22, description: 'Ferro simples, porém confiável.', image: swordIron },
  { id: 'w3', name: 'Espada do Guarda Velho', type: 'weapon', bonus: 7, price: 40, description: 'Pertenceu a um guarda veterano.', image: swordGuard },
  { id: 'w4', name: 'Lâmina Reforçada', type: 'weapon', bonus: 10, price: 65, description: 'Aço temperado com cuidado artesanal.', image: swordReinforced },
];

export const ARMORS: Equipment[] = [
  { id: 'a1', name: 'Túnica Gasta', type: 'armor', bonus: 1, price: 0, description: 'Pano velho que mal protege.', image: armorCloth },
  { id: 'a2', name: 'Gibão de Couro', type: 'armor', bonus: 3, price: 20, description: 'Couro curtido, flexível e resistente.', image: armorLeather },
  { id: 'a3', name: 'Cota Reforçada', type: 'armor', bonus: 5, price: 38, description: 'Malha de ferro costurada com firmeza.', image: armorChain },
  { id: 'a4', name: 'Armadura do Vigia', type: 'armor', bonus: 8, price: 60, description: 'Placas pesadas de um antigo vigia.', image: armorPlate },
];

export const SHIELDS: Equipment[] = [
  { id: 's1', name: 'Escudo Rachado', type: 'shield', bonus: 1, price: 0, description: 'Madeira lascada, quase inútil.', image: shieldCracked },
  { id: 's2', name: 'Escudo de Madeira Firme', type: 'shield', bonus: 2, price: 18, description: 'Madeira densa, aguenta alguns golpes.', image: shieldWood },
  { id: 's3', name: 'Escudo Ferrado', type: 'shield', bonus: 4, price: 34, description: 'Reforçado com tiras de ferro.', image: shieldIron },
  { id: 's4', name: 'Escudo do Portão', type: 'shield', bonus: 6, price: 55, description: 'Feito para defender o portão da vila.', image: shieldGate },
];

export const POTION_PRICE = 8;
export const POTION_HEAL = 15;
export const POTION_IMAGE = potionHealth;
