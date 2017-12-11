import { expect } from 'chai';
import { denormalize } from '../source';
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

const store = {
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
};

const homer = {
  id: 1,
  name: 'homer',
};

const marge = {
  id: 2,
  name: 'marge',
};

const moe = {
  id: 3,
  name: 'moe',
};

const output = [
  {
    id: 1,
    participants: [
      {
        conversationId: 1,
        userId: 1,
        user: homer,
      },
      {
        conversationId: 1,
        userId: 2,
        user: marge,
      },
    ],
    messages: [
      {
        id: 1,
        conversationId: 1,
        authorId: 1,
        author: homer,
        content: 'hey !',
      },
      {
        id: 2,
        conversationId: 1,
        authorId: 2,
        author: marge,
        content: 'bring some milk',
      },
    ],
  },
  {
    id: 2,
    participants: [
      {
        conversationId: 2,
        userId: 1,
        user: homer,
      },
      {
        conversationId: 2,
        userId: 3,
        user: moe,
      },
    ],
    messages: [
      {
        id: 3,
        conversationId: 2,
        authorId: 1,
        author: homer,
        content: 'Prepare the beer!',
      },
      {
        id: 4,
        conversationId: 2,
        authorId: 3,
        author: moe,
        content: 'here we go!',
      },
    ],
  },
];


output.forEach((conversation) => {
  conversation.participants.forEach((participant) => {
    Object.assign(participant, { conversation });
  });
});

output[0].participants[0].user = homer;
output[0].participants[1].user = marge;
output[1].participants[0].user = homer;
output[1].participants[1].user = moe;

output[0].messages[0].author = output[0].participants[0].user;
output[0].messages[1].author = output[0].participants[1].user;
output[1].messages[0].author = output[0].participants[0].user;
output[1].messages[1].author = output[1].participants[1].user;

describe('simple has many through', () => {
  describe('single entity', () => {
    it('should decompose a basket', () => {
      // console.log(denormalize(1, Conversation, store));
      expect(denormalize(1, Conversation, store)).to.deep.eql(output[0]);
    });
  });

  describe('array of entities', () => {
    it('should decompose the accounts', () => {
      // denormalize([1, 2], Conversation, store).forEach((item, index) => {
      //   console.log(output[index]);
      //   console.log(item);
      // });
      expect(denormalize([1, 2], Conversation, store)).to.deep.eql(output);
    });
  });
});
