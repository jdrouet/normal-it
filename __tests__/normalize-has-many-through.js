import { expect } from 'chai';
import { normalize } from '../source';
import Entity from '../source/entity';

const Basket = new Entity('baskets');
const Article = new Entity('articles');

Basket.define({
  articles: {
    entity: Article,
    type: 'hasManyThrough',
    foreignKey: 'articleIds',
  },
});

describe('simple has many through', () => {
  describe('single entity', () => {
    it('should decompose a basket', () => {
      const input = {
        id: 1,
        name: 'homer',
        articles: [
          {
            id: 2,
            name: 'beer',
          },
          {
            id: 3,
            name: 'french fries',
          },
        ],
      };
      const output = {
        result: 1,
        entities: {
          baskets: {
            1: {
              id: 1,
              name: 'homer',
              articleIds: [2, 3]
            },
          },
          articles: {
            2: {
              id: 2,
              name: 'beer',
            },
            3: {
              id: 3,
              name: 'french fries',
            },
          },
        },
      };
      expect(normalize(input, Basket)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = [
        {
          id: 1,
          name: 'homer',
          articles: [
            {
              id: 2,
              name: 'beer',
            },
            {
              id: 3,
              name: 'french fries',
            },
          ],
        },
        {
          id: 5,
          name: 'ned',
          articles: [
            {
              id: 6,
              name: 'tomato',
            },
            {
              id: 7,
              name: 'bible',
            },
          ],
        },
      ];
      const output = {
        result: [1, 5],
        entities: {
          baskets: {
            1: {
              id: 1,
              name: 'homer',
              articleIds: [2, 3]
            },
            5: {
              id: 5,
              name: 'ned',
              articleIds: [6, 7]
            },
          },
          articles: {
            2: {
              id: 2,
              name: 'beer',
            },
            3: {
              id: 3,
              name: 'french fries',
            },
            6: {
              id: 6,
              name: 'tomato',
            },
            7: {
              id: 7,
              name: 'bible',
            },
          },
        },
      };
      expect(normalize(input, Basket)).to.eql(output);
    });
  });
});
