# Normal-it

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