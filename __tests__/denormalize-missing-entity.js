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

describe('missing entity', () => {
  describe('belongs to', () => {
    it('should recompose', () => {
      const input = {
        result: 1,
        entities: {
          persons: {
            1: {
              id: 1,
              name: 'homer',
              genderId: 3,
            },
          },
          genders: {
            10: {
              id: 10,
              name: 'male',
            },
            11: {
              id: 11,
              name: 'female',
            },
          },
        },
      };
      const output = {
        id: 1,
        name: 'homer',
        genderId: 3,
        gender: null,
        baskets: [],
      };
      expect(denormalize(input.result, Person, input.entities)).to.eql(output);
    });
  });
});
