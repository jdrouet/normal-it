import { expect } from 'chai';
import { denormalize } from '../source';
import Entity from '../source/entity';

const Article = new Entity('articles');
const Basket = new Entity('baskets');
const Gender = new Entity('genders');
const Person = new Entity('persons');

Person.define({
  baskets: {
    entity: Basket,
    type: 'hasMany',
    foreignKey: 'personId',
  },
  gender: {
    entity: Gender,
    type: 'belongsTo',
    foreignKey: 'genderId',
  },
});

Basket.define({
  articles: {
    entity: Article,
    type: 'hasManyThrough',
    foreignKey: 'articleIds',
  },
});

const store = {
  articles: {
    10: {
      id: 10,
      label: 'beer',
    },
    11: {
      id: 11,
      label: 'cola',
    },
    12: {
      id: 12,
      label: 'pork',
    },
    13: {
      id: 13,
      label: 'beef',
    },
    14: {
      id: 14,
      label: 'popcorn',
    },
    15: {
      id: 15,
      label: 'cucumber',
    },
    16: {
      id: 16,
      label: 'brocoli',
    },
  },
  persons: {
    20: {
      id: 20,
      name: 'homer',
      genderId: 40,
    },
    21: {
      id: 21,
      name: 'ned',
      genderId: 40,
    },
    22: {
      id: 22,
      name: 'marge',
      genderId: 41,
    },
  },
  baskets: {
    30: {
      id: 30,
      label: 'alcohol list',
      personId: 20,
      articleIds: [10, 11],
    },
    31: {
      id: 31,
      label: 'junk list',
      personId: 20,
      articleIds: [12, 14],
    },
    32: {
      id: 32,
      label: 'normal food list',
      personId: 22,
      articleIds: [13, 15, 16],
    },
  },
  genders: {
    40: {
      id: 40,
      label: 'male',
    },
    41: {
      id: 41,
      label: 'female',
    },
  },
};

const output = [
  {
    id: 20,
    name: 'homer',
    genderId: 40,
    gender: {
      id: 40,
      label: 'male',
    },
    baskets: [
      {
        id: 30,
        label: 'alcohol list',
        personId: 20,
        articleIds: [10, 11],
        articles: [
          {
            id: 10,
            label: 'beer',
          },
          {
            id: 11,
            label: 'cola',
          },
        ],
      },
      {
        id: 31,
        label: 'junk list',
        personId: 20,
        articleIds: [12, 14],
        articles: [
          {
            id: 12,
            label: 'pork',
          },
          {
            id: 14,
            label: 'popcorn',
          },
        ],
      },
    ],
  },
  {
    id: 22,
    name: 'marge',
    genderId: 41,
    gender: {
      id: 41,
      label: 'female',
    },
    baskets: [
      {
        id: 32,
        label: 'normal food list',
        personId: 22,
        articleIds: [13, 15, 16],
        articles: [
          {
            id: 13,
            label: 'beef',
          },
          {
            id: 15,
            label: 'cucumber',
          },
          {
            id: 16,
            label: 'brocoli',
          },
        ],
      },
    ],
  },
];

describe('simple has many through', () => {
  describe('single entity', () => {
    it('should decompose a basket', () => {
      // console.log(JSON.stringify(denormalize(20, Person, store), null, 2));
      expect(denormalize(20, Person, store)).to.eql(output[0]);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      // console.log(JSON.stringify(denormalize(20, Person, store), null, 2));
      expect(denormalize([20, 22], Person, store)).to.eql(output);
    });
  });
});
