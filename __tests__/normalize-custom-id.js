import { expect } from 'chai';
import { normalize } from '../source';
import Entity from '../source/entity';

const Conversation = new Entity('conversations');
const Participant = new Entity('participants', {}, {
  idAttribute: item => `${item.conversationId}-${item.userId}`,
});
const User = new Entity('users');
const Message = new Entity('messages');

Conversation.define({
  participants: {
    entity: Participant,
    type: 'hasMany',
    foreignKey: 'conversationId',
  },
  messages: {
    entity: Message,
    type: 'hasMany',
    foreignKey: 'conversationId',
  },
});

Participant.define({
  conversation: {
    entity: Conversation,
    type: 'belongsTo',
    foreignKey: 'conversationId',
  },
  user: {
    entity: User,
    type: 'belongsTo',
    foreignKey: 'userId',
  },
});

Message.define({
  author: {
    entity: User,
    type: 'belongsTo',
    foreignKey: 'authorId',
  },
});

describe('simple has many', () => {
  describe('single entity', () => {
    it('should decompose a father', () => {
      const input = {
        id: 1,
        participants: [
          {
            conversationId: 1,
            userId: 1,
            user: {
              id: 1,
              name: 'homer',
            },
          },
          {
            conversationId: 1,
            userId: 2,
            user: {
              id: 2,
              name: 'marge',
            },
          },
        ],
        messages: [
          {
            id: 1,
            conversationId: 1,
            authorId: 1,
            author: {
              id: 1,
              name: 'homer',
            },
            content: 'hey !',
          },
          {
            id: 2,
            conversationId: 1,
            authorId: 2,
            author: {
              id: 2,
              name: 'marge',
            },
            content: 'bring some milk',
          },
        ],
      };
      const output = {
        result: 1,
        entities: {
          users: {
            1: {
              id: 1,
              name: 'homer',
            },
            2: {
              id: 2,
              name: 'marge',
            },
          },
          participants: {
            '1-1': {
              conversationId: 1,
              userId: 1,
            },
            '1-2': {
              conversationId: 1,
              userId: 2,
            },
          },
          messages: {
            1: {
              id: 1,
              conversationId: 1,
              authorId: 1,
              content: 'hey !',
            },
            2: {
              id: 2,
              conversationId: 1,
              authorId: 2,
              content: 'bring some milk',
            },
          },
          conversations: {
            1: {
              id: 1,
            },
          },
        },
      };
      // console.log(JSON.stringify(normalize(input, Conversation), null, 2));
      expect(normalize(input, Conversation)).to.eql(output);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      const input = [
        {
          id: 1,
          participants: [
            {
              conversationId: 1,
              userId: 1,
              user: {
                id: 1,
                name: 'homer',
              },
            },
            {
              conversationId: 1,
              userId: 2,
              user: {
                id: 2,
                name: 'marge',
              },
            },
          ],
          messages: [
            {
              id: 1,
              conversationId: 1,
              authorId: 1,
              author: {
                id: 1,
                name: 'homer',
              },
              content: 'hey !',
            },
            {
              id: 2,
              conversationId: 1,
              authorId: 2,
              author: {
                id: 2,
                name: 'marge',
              },
              content: 'bring some milk',
            },
          ],
        },
        {
          id: 2,
          participants: [
            {
              conversationId: 1,
              userId: 1,
              user: {
                id: 1,
                name: 'homer',
              },
            },
            {
              conversationId: 2,
              userId: 3,
              user: {
                id: 3,
                name: 'moe',
              },
            },
          ],
          messages: [
            {
              id: 3,
              conversationId: 2,
              authorId: 1,
              author: {
                id: 1,
                name: 'homer',
              },
              content: 'Prepare the beer!',
            },
            {
              id: 4,
              conversationId: 2,
              authorId: 3,
              author: {
                id: 3,
                name: 'moe',
              },
              content: 'here we go!',
            },
          ],
        },
      ];
      const output = {
        result: [1, 2],
        entities: {
          users: {
            1: {
              id: 1,
              name: 'homer',
            },
            2: {
              id: 2,
              name: 'marge',
            },
            3: {
              id: 3,
              name: 'moe',
            },
          },
          participants: {
            '1-1': {
              conversationId: 1,
              userId: 1,
            },
            '1-2': {
              conversationId: 1,
              userId: 2,
            },
            '2-1': {
              conversationId: 2,
              userId: 1,
            },
            '2-3': {
              conversationId: 2,
              userId: 3,
            },
          },
          messages: {
            1: {
              id: 1,
              conversationId: 1,
              authorId: 1,
              content: 'hey !',
            },
            2: {
              id: 2,
              conversationId: 1,
              authorId: 2,
              content: 'bring some milk',
            },
            3: {
              id: 3,
              conversationId: 2,
              authorId: 1,
              content: 'Prepare the beer!',
            },
            4: {
              id: 4,
              conversationId: 2,
              authorId: 3,
              content: 'here we go!',
            },
          },
          conversations: {
            1: {
              id: 1,
            },
            2: {
              id: 2,
            },
          },
        },
      };
      // console.log(JSON.stringify(normalize(input, Conversation), null, 2));
      expect(normalize(input, Conversation)).to.eql(output);
    });
  });
});
