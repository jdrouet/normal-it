export { default as Entity } from './entity';

export const belongsTo = 'belongsTo';
export const hasMany = 'hasMany';
export const hasManyThrough = 'hasManyThrough';

const addEntities = entities => (schema, entity) => {
  const schemaKey = schema.name;
  const id = schema.getId(entity);
  if (!(schemaKey in entities)) {
    Object.assign(entities, { [schemaKey]: {} });
  }
  const existingEntity = entities[schemaKey][id];
  if (existingEntity) {
    Object.assign(entities[schemaKey], {
      [id]: schema.merge(existingEntity, entity),
    });
  } else {
    Object.assign(entities[schemaKey], {
      [id]: entity,
    });
  }
};

export const normalize = (input, schema) => {
  const result = Array.isArray(input)
    ? input.map(item => schema.getId(item))
    : schema.getId(input);
  const entities = {};
  const addEntity = addEntities(entities);
  if (Array.isArray(input)) {
    input.forEach(item =>
      schema.normalize(null, null, null, item, addEntity));
  } else {
    schema.normalize(null, null, null, input, addEntity);
  }
  return {
    result,
    entities,
  };
};

class Denormalizer {
  constructor(entities) {
    this.cache = {};
    this.entities = entities;
  }

  getEntity(id, schema) {
    return this.entities[schema.name][id];
  }

  getForRelation(parent, parentSchema, relation) {
    if (relation.type === hasMany) {
      const parentId = parentSchema.getId(parent);
      const keys = Object
        .entries(this.entities[relation.entity.name])
        .filter(entry => entry[1][relation.foreignKey] === parentId)
        .map(([key]) => key);
      return keys.map(key => this.extractEntity(key, relation.entity));
    }
    const child = parent[relation.foreignKey];
    if (relation.type === hasManyThrough && Array.isArray(child)) {
      return child.map(item => this.extractEntity(item, relation.entity));
    }
    if (relation.type === belongsTo) {
      return this.extractEntity(child, relation.entity);
    }
    return null;
  }

  extractEntity(id, schema) {
    const entity = this.getEntity(id, schema);
    if (!this.cache[schema.name]) {
      this.cache[schema.name] = {};
    }
    if (!this.cache[schema.name][id]) {
      const copy = { ...entity };
      this.cache[schema.name][id] = copy;
      this.cache[schema.name][id] = schema.denormalize(copy, this);
    }
    return this.cache[schema.name][id];
  }

  process(id, schema) {
    if (!Array.isArray(id)) {
      return this.extractEntity(id, schema);
    }
    return id.map(item => this.extractEntity(item, schema));
  }
}

export const denormalize = (id, schema, entities) => {
  const instance = new Denormalizer(entities);
  return instance.process(id, schema);
};
