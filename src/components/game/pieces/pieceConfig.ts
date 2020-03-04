import blackLevyImageSvg from '../../../resources/levyBlack.svg';
import blackLegionImageSvg from '../../../resources/legionBlack.svg';
import blackWarElephantImageSvg from '../../../resources/warElephantBlack.svg';
import blackLightCavalryImageSvg from '../../../resources/lightCavalryBlack.svg';
import blackArcherImageSvg from '../../../resources/archerBlack.svg';
import blackCataphractImageSvg from '../../../resources/cataphractBlack.svg';
import blackCentaurImageSvg from '../../../resources/centaurBlack.svg';
import blackChariotImageSvg from '../../../resources/chariotBlack.svg';
import blackGeneralImageSvg from '../../../resources/generalBlack.svg';
// TODO: there must be a way to set the color through css while loding the svg files... didn't work initially
import whiteLevyImageSvg from '../../../resources/levyWhite.svg';
import whiteLegionImageSvg from '../../../resources/legionWhite.svg';
import whiteWarElephantImageSvg from '../../../resources/warElephantWhite.svg';
import whiteLightCavalryImageSvg from '../../../resources/lightCavalryWhite.svg';
import whiteArcherImageSvg from '../../../resources/archerWhite.svg';
import whiteCataphractImageSvg from '../../../resources/cataphractWhite.svg';
import whiteCentaurImageSvg from '../../../resources/centaurWhite.svg';
import whiteChariotImageSvg from '../../../resources/chariotWhite.svg';
import whiteGeneralImageSvg from '../../../resources/generalWhite.svg';

export default {
  levy: {
    displayName: 'Levy',
    svgSource: blackLevyImageSvg,
    whiteSvgSource: whiteLevyImageSvg,
    health: 3,
    attack: 1,
    speed: 2,
    range: null,
    lore:
      'Peasants and laborers are often conscripted into the army or join out of sheer desperation. Equipped with a small shield and spear, they are even more poorly trained than they are armed. They can none the less overwhelm careless foes in sufficient numbers.',
    gameplay: 'Levies are best used to protect more valuable soldiers by distracting enemies.',
  },
  archer: {
    displayName: 'Archer',
    svgSource: blackArcherImageSvg,
    whiteSvgSource: whiteArcherImageSvg,
    attack: 2,
    health: 2,
    speed: 2,
    range: 3,
    lore:
      'Skilled archers are always in short supply, as a good marksman require years of practice or experience from hunting since a young age. While a sword cannot strike from a distance like an arrow, these men are lightly armed and will fall quickly in melee combat.',
    gameplay: '',
  },
  legion: {
    displayName: 'Legion',
    svgSource: blackLegionImageSvg,
    whiteSvgSource: whiteLegionImageSvg,
    health: 8,
    attack: 3,
    speed: 1,
    range: null,
    lore:
      'Legions are professional, heavily armed infantry that form the backbone of our army. They are able to stand their ground and are particularly resistant against arrows as they march in a tight, solid formation. Though as a result, they move very slowly.',
    gameplay: '',
  },
  cataphract: {
    displayName: 'Cataphract',
    svgSource: blackCataphractImageSvg,
    whiteSvgSource: whiteCataphractImageSvg,
    health: 10,
    attack: 6,
    speed: 5,
    range: null,
    lore:
      'Recent developments in horsemanship have given rise to a new class of warrior. Cataphracts are wealthy aristocrats who ride into battle very heavily armed on powerful horses. There are few mortals who can withstand their crushing charge.',
    gameplay: '',
  },
  chariot: {
    displayName: 'Chariot',
    svgSource: blackChariotImageSvg,
    whiteSvgSource: whiteChariotImageSvg,
    health: 8,
    attack: 3,
    speed: 4,
    range: null,
    lore:
      'Horse drawn chariots have been dominant war machines since the times of our ancestors, and master blacksmiths continue to perfect their construction. While slower than mounted units, they can easily chase down infantry and have impressive durability due to their solid build and disciplined crews.',
  },
  warElephant: {
    displayName: 'War Elephant',
    svgSource: blackWarElephantImageSvg,
    whiteSvgSource: whiteWarElephantImageSvg,
    health: 24,
    attack: 7,
    speed: 3,
    range: null,
    lore:
      'These massive beasts, imported from the far east, are a terrifying sight to any opponent. They throw men around like chickens with thier unmatched strength and it will take many blows to bring one down. Their large size does however make then an easy target for any marksman.',
    gameplay: '',
  },
  lightCavalry: {
    displayName: 'Light Cavalry',
    svgSource: blackLightCavalryImageSvg,
    whiteSvgSource: whiteLightCavalryImageSvg,
    health: 4,
    attack: 2,
    speed: 7,
    range: null,
    lore:
      'Migrant barbarians and more reckless youths of the nobility not yet old enough to join elite units often serve as irregular cavalry. What they lack in discipline and amor, they make up for with speed and daring.',
    gameplay: '',
  },
  centaur: {
    displayName: 'Centaur',
    svgSource: blackCentaurImageSvg,
    whiteSvgSource: whiteCentaurImageSvg,
    health: 4,
    attack: 3,
    speed: 6,
    range: 4,
    lore:
      'Centaurs are reclusive forest folk who rarely venture into the realms of men; in fact, most rational people do not believe they exist. They do make outstanding marksman and for the right price, they can potentially be hired as mercenaries.',
    gameplay: '',
  },
  general: {
    displayName: 'General',
    svgSource: blackGeneralImageSvg,
    whiteSvgSource: whiteGeneralImageSvg,
    health: 12,
    attack: 6,
    speed: 5,
    range: null,
    lore:
      "You have been given command of one of The Empire's grandest armies and are protected by a bodyguard of elite cataphracts. While a formidable warrior yourself, you are needed to issue orders, and if you fall, your army will fall into disarray and rout.",
    gameplay: '',
  },
};
