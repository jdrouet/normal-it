# Normal-it

[![CircleCI](https://img.shields.io/circleci/project/jdrouet/normal-it.svg?maxAge=2592000)](https://circleci.com/gh/jdrouet/normal-it)
[![codecov](https://codecov.io/gh/jdrouet/normal-it/branch/master/graph/badge.svg)](https://codecov.io/gh/jdrouet/normal-it)
![Dependencies](https://david-dm.org/jdrouet/normal-it.svg)

## Why?

This library is inspired by [Normalizr](https://github.com/paularmstrong/normalizr) and comes with an improvement of the relational point of view.
What does it do more than `normalizr`? With `normal-it` you can normalize and denormalize entities in a relational way, including `hasMany` and `hasManyThrough` relations.

## Quick Start

```json
{
  "id": 20,
  "name": "homer",
  "genderId": 40,
  "gender": {
    "id": 40,
    "label": "male"
  },
  "baskets": [
    {
      "id": 30,
      "label": "alcohol list",
      "personId": 20,
      "articleIds": [
        10,
        11
      ],
      "articles": [
        {
          "id": 10,
          "label": "beer"
        },
        {
          "id": 11,
          "label": "cola"
        }
      ]
    },
    {
      "id": 31,
      "label": "junk list",
      "personId": 20,
      "articleIds": [
        12,
        14
      ],
      "articles": [
        {
          "id": 12,
          "label": "pork"
        },
        {
          "id": 14,
          "label": "popcorn"
        }
      ]
    }
  ]
}
```

```js
import { normalize, Entity } from 'normal-it';

const Article = new Entity('articles');
const Basket = new Entity('baskets');
const Gender = new Entity('genders');
const Person = new Entity('persons');

Person.define({
  baskets: {
    entity: Basket,
    type: 'hasMany',
    foreignKey: 'personId',
  },
  gender: {
    entity: Gender,
    type: 'belongsTo',
    foreignKey: 'genderId',
  },
});

Basket.define({
  articles: {
    entity: Article,
    type: 'hasManyThrough',
    foreignKey: 'articleIds',
  },
});

const normalizedData = normalize(originalData, Person);
```

will produce

```json
{
  "result": 20,
  "entities": {
    "articles": {
      "10": {
        "id": 10,
        "label": "beer"
      },
      "11": {
        "id": 11,
        "label": "cola"
      },
      "12": {
        "id": 12,
        "label": "pork"
      },
      "14": {
        "id": 14,
        "label": "popcorn"
      },
    },
    "persons": {
      "20": {
        "id": 20,
        "name": "homer",
        "genderId": 40
      },
    },
    "baskets": {
      "30": {
        "id": 30,
        "label": "alcohol list",
        "personId": 20,
        "articleIds": [
          10,
          11
        ]
      },
      "31": {
        "id": 31,
        "label": "junk list",
        "personId": 20,
        "articleIds": [
          12,
          14
        ]
      },
    },
    "genders": {
      "40": {
        "id": 40,
        "label": "male"
      },
    }
  }
}
```