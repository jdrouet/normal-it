import { expect } from 'chai';
import { denormalize } from '../source';
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
      const store = {
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
      };
      const output = {
        id: 1,
        name: 'toto',
        levelId: 2,
        level: {
          id: 2,
          label: 'level 1',
        },
      };
      expect(denormalize(1, Account, store)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const store = {
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
      };
      const output = [
        {
          id: 1,
          name: 'toto',
          levelId: 2,
          level: {
            id: 2,
            label: 'level 1',
          },
        },
        {
          id: 3,
          name: 'tata',
          levelId: 2,
          level: {
            id: 2,
            label: 'level 1',
          },
        },
      ];
      expect(denormalize([1, 3], Account, store)).to.eql(output);
    });
  });
});
