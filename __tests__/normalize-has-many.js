import { expect } from 'chai';
import { normalize } from '../source';
import Entity from '../source/entity';

const Father = new Entity('fathers');
const Child = new Entity('children');

Father.define({
  children: {
    entity: Child,
    type: 'hasMany',
    foreignKey: 'fatherId',
  },
});

describe('simple has many', () => {
  describe('single entity', () => {
    it('should decompose a father', () => {
      const input = {
        id: 1,
        name: 'homer',
        children: [
          {
            id: 2,
            name: 'lisa',
          },
          {
            id: 3,
            name: 'maggie',
          },
          {
            id: 4,
            name: 'bart',
          },
        ],
      };
      const output = {
        result: 1,
        entities: {
          fathers: {
            1: {
              id: 1,
              name: 'homer',
            },
          },
          children: {
            2: {
              id: 2,
              name: 'lisa',
              fatherId: 1,
            },
            3: {
              id: 3,
              name: 'maggie',
              fatherId: 1,
            },
            4: {
              id: 4,
              name: 'bart',
              fatherId: 1,
            },
          },
        },
      };
      expect(normalize(input, Father)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = [
        {
          id: 1,
          name: 'homer',
          children: [
            {
              id: 2,
              name: 'lisa',
            },
            {
              id: 3,
              name: 'maggie',
            },
            {
              id: 4,
              name: 'bart',
            },
          ],
        },
        {
          id: 5,
          name: 'ned',
          children: [
            {
              id: 6,
              name: 'rod',
            },
            {
              id: 7,
              name: 'todd',
            },
          ],
        },
      ];
      const output = {
        result: [1, 5],
        entities: {
          fathers: {
            1: {
              id: 1,
              name: 'homer',
            },
            5: {
              id: 5,
              name: 'ned',
            },
          },
          children: {
            2: {
              id: 2,
              name: 'lisa',
              fatherId: 1,
            },
            3: {
              id: 3,
              name: 'maggie',
              fatherId: 1,
            },
            4: {
              id: 4,
              name: 'bart',
              fatherId: 1,
            },
            6: {
              id: 6,
              name: 'rod',
              fatherId: 5,
            },
            7: {
              id: 7,
              name: 'todd',
              fatherId: 5,
            },
          },
        },
      };
      expect(normalize(input, Father)).to.eql(output);
    });
  });
});
