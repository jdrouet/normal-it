# Normal-it

[![CircleCI](https://img.shields.io/circleci/project/jdrouet/normal-it.svg?maxAge=2592000)](https://circleci.com/gh/jdrouet/normal-it)
[![codecov](https://codecov.io/gh/jdrouet/normal-it/branch/master/graph/badge.svg)](https://codecov.io/gh/jdrouet/normal-it)
![Dependencies](https://david-dm.org/jdrouet/normal-it.svg)

## Quick Start

```json
{
  "id": 1,
  "name": "Homer",
  "level": {
    "id": 2,
    "label": "level 1"
  }
}
```

```js
import { normalize, Entity } from 'normal-it';


const Account = new Entity('accounts');
const Level = new Entity('levels');

Account.define({
  level: {
    entity: Level,
    type: 'belongsTo',
    foreignKey: 'levelId',
  },
});

const normalizedData = normalize(originalData, Account);
```

will produce

```json
{
  "result": 1,
  "entities": {
    "accounts": {
      "1": {
        "id": 1,
        "name": "Homer",
        "levelId": 2
      }
    },
    "levels": {
      "2": {
        "id": 2,
        "label": "level 1"
      }
    }
  }
}
```