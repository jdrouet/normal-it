import { expect } from 'chai';
import { normalize } from '../source';
import Entity from '../source/entity';

const Account = new Entity('accounts');
const Level = new Entity('levels');

Account.define({
  level: {
    entity: Level,
    type: 'belongsTo',
    foreignKey: 'levelId',
  },
});

describe('simple belongs to', () => {
  describe('single entity', () => {
    it('should decompose an account', () => {
      const input = {
        id: 1,
        name: 'toto',
        level: {
          id: 2,
          label: 'level 1',
        },
      };
      const output = {
        result: 1,
        entities: {
          accounts: {
            1: {
              id: 1,
              name: 'toto',
              levelId: 2,
            },
          },
          levels: {
            2: {
              id: 2,
              label: 'level 1',
            },
          },
        },
      };
      expect(normalize(input, Account)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = [
        {
          id: 1,
          name: 'toto',
          level: {
            id: 2,
            label: 'level 1',
          },
        },
        {
          id: 3,
          name: 'tata',
          level: {
            id: 2,
            label: 'level 1',
          },
        },
      ];
      const output = {
        result: [1, 3],
        entities: {
          accounts: {
            1: {
              id: 1,
              name: 'toto',
              levelId: 2,
            },
            3: {
              id: 3,
              name: 'tata',
              levelId: 2,
            },
          },
          levels: {
            2: {
              id: 2,
              label: 'level 1',
            },
          },
        },
      };
      expect(normalize(input, Account)).to.eql(output);
    });
  });
});
