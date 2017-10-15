import { expect } from 'chai';
import { normalize } from '../source';
import Entity from '../source/entity';

const Gender = new Entity('genders');
const Parent = new Entity('parents');
const Child = new Entity('children');

Parent.define({
  gender: {
    entity: Gender,
    type: 'belongsTo',
    foreignKey: 'genderId',
  },
  children: {
    entity: Child,
    type: 'hasMany',
    foreignKey: 'parentId',
  },
});

Child.define({
  gender: {
    entity: Gender,
    type: 'belongsTo',
    foreignKey: 'genderId',
  },
  parent: {
    entity: Parent,
    type: 'belongsTo',
    foreignKey: 'parentId',
  },
});

describe('simple has many', () => {
  describe('single entity', () => {
    it('should decompose a father', () => {
      const input = {
        id: 1,
        name: 'homer',
        gender: {
          id: 20,
          label: 'male',
        },
        children: [
          {
            id: 2,
            name: 'lisa',
            gender: {
              id: 21,
              label: 'female',
            },
          },
          {
            id: 3,
            name: 'maggie',
            gender: {
              id: 21,
              label: 'female',
            },
          },
          {
            id: 4,
            name: 'bart',
            gender: {
              id: 20,
              label: 'male',
            },
          },
        ],
      };
      const output = {
        result: 1,
        entities: {
          parents: {
            1: {
              id: 1,
              name: 'homer',
              genderId: 20,
            },
          },
          genders: {
            20: {
              id: 20,
              label: 'male',
            },
            21: {
              id: 21,
              label: 'female',
            },
          },
          children: {
            2: {
              id: 2,
              name: 'lisa',
              parentId: 1,
              genderId: 21,
            },
            3: {
              id: 3,
              name: 'maggie',
              parentId: 1,
              genderId: 21,
            },
            4: {
              id: 4,
              name: 'bart',
              parentId: 1,
              genderId: 20,
            },
          },
        },
      };
      // console.log(JSON.stringify(normalize(input, Parent), null, 2));
      expect(normalize(input, Parent)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = [
        {
          id: 1,
          name: 'homer',
          gender: {
            id: 20,
            label: 'male',
          },
          children: [
            {
              id: 2,
              name: 'lisa',
              gender: {
                id: 21,
                label: 'female',
              },
            },
            {
              id: 3,
              name: 'maggie',
              gender: {
                id: 21,
                label: 'female',
              },
            },
            {
              id: 4,
              name: 'bart',
              gender: {
                id: 20,
                label: 'male',
              },
            },
          ],
        },
        {
          id: 5,
          name: 'ned',
          gender: {
            id: 20,
            label: 'male',
          },
          children: [
            {
              id: 6,
              name: 'rod',
              gender: {
                id: 20,
                label: 'male',
              },
            },
            {
              id: 7,
              name: 'todd',
              gender: {
                id: 20,
                label: 'male',
              },
            },
          ],
        },
      ];
      const output = {
        result: [1, 5],
        entities: {
          parents: {
            1: {
              id: 1,
              name: 'homer',
              genderId: 20,
            },
            5: {
              id: 5,
              name: 'ned',
              genderId: 20,
            },
          },
          genders: {
            20: {
              id: 20,
              label: 'male',
            },
            21: {
              id: 21,
              label: 'female',
            },
          },
          children: {
            2: {
              id: 2,
              name: 'lisa',
              parentId: 1,
              genderId: 21,
            },
            3: {
              id: 3,
              name: 'maggie',
              parentId: 1,
              genderId: 21,
            },
            4: {
              id: 4,
              name: 'bart',
              parentId: 1,
              genderId: 20,
            },
            6: {
              id: 6,
              name: 'rod',
              parentId: 5,
              genderId: 20,
            },
            7: {
              id: 7,
              name: 'todd',
              parentId: 5,
              genderId: 20,
            },
          },
        },
      };
      // console.log(JSON.stringify(normalize(input, Parent), null, 2));
      expect(normalize(input, Parent)).to.eql(output);
    });
  });
});
