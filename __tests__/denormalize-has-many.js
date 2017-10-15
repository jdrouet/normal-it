import { expect } from 'chai';
import { denormalize } from '../source';
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
      const output = {
        id: 1,
        name: 'homer',
        children: [
          {
            id: 2,
            name: 'lisa',
            fatherId: 1,
          },
          {
            id: 3,
            name: 'maggie',
            fatherId: 1,
          },
          {
            id: 4,
            name: 'bart',
            fatherId: 1,
          },
        ],
      };
      expect(denormalize(input.result, Father, input.entities)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = {
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
      const output = [
        {
          id: 1,
          name: 'homer',
          children: [
            {
              id: 2,
              name: 'lisa',
              fatherId: 1,
            },
            {
              id: 3,
              name: 'maggie',
              fatherId: 1,
            },
            {
              id: 4,
              name: 'bart',
              fatherId: 1,
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
              fatherId: 5,
            },
            {
              id: 7,
              name: 'todd',
              fatherId: 5,
            },
          ],
        },
      ];
      expect(denormalize(input.result, Father, input.entities)).to.eql(output);
    });
  });
});
