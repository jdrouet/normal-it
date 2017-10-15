import { belongsTo, hasMany, hasManyThrough } from './index';

const getIdAttribute = field => object => object[field];
const noop = (parent, parentEntity, parentRelation, input) => input;
const mergeExisting = (existingEntity, processedEntity) => ({
  ...existingEntity,
  ...processedEntity,
});

export default class Entity {
  constructor(name, definition = {}, options = {}) {
    this.name = name;
    if (options.idAttribute && typeof options.idAttribute === 'string') {
      this.getId = getIdAttribute(options.id);
    } else if (options.idAttribute && typeof options.idAttribute === 'function') {
      this.getId = options.idAttribute;
    } else {
      this.getId = getIdAttribute('id');
    }
    if (options.beforeNormalize && typeof options.beforeNormalize === 'function') {
      this.beforeNormalize = options.beforeNormalize;
    } else {
      this.beforeNormalize = noop;
    }
    if (options.merge && typeof options.merge === 'function') {
      this.merge = options.merge;
    } else {
      this.merge = mergeExisting;
    }
    this.define(definition);
  }

  define(definition) {
    this.schema = Object.keys(definition).reduce((res, key) => {
      const schema = definition[key];
      return { ...res, [key]: schema };
    }, this.schema || {});
    this.schemaKeys = Object.keys(this.schema);
  }

  beforeDecompose(parent, parentEntity, parentRelation, input) {
    const cleaned = Object
      .entries(input)
      .filter(([key]) => !this.schemaKeys.includes(key))
      .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {});
    if (parentRelation && parentRelation.type === hasMany) {
      const id = parentEntity.getId(parent);
      return { ...cleaned, [parentRelation.foreignKey]: id };
    }
    return cleaned;
  }

  decompose(input, relation, child, addEntity) {
    if (relation.type === hasMany && Array.isArray(child)) {
      child.forEach(item => relation.entity.normalize(input, this, relation, item, addEntity));
      return {};
    }
    if (relation.type === hasManyThrough && Array.isArray(child)) {
      const keys = child.map(item =>
        relation.entity.normalize(input, this, relation, item, addEntity));
      return { [relation.foreignKey]: keys };
    }
    if (relation.type === belongsTo) {
      const value = relation.entity.normalize(input, this, relation, child, addEntity);
      return { [relation.foreignKey]: value };
    }
    return {};
  }

  normalize(parent, parentEntity, parentRelation, input, addEntity) {
    const preProcessed = this.beforeNormalize(parent, parentEntity, parentRelation, input);
    const entity = this.beforeDecompose(parent, parentEntity, parentRelation, preProcessed);
    const finalEntity = this.schemaKeys.reduce((res, key) => {
      if (input[key]) {
        const relation = this.schema[key];
        return {
          ...res,
          ...this.decompose(input, relation, input[key], addEntity),
        };
      }
      return res;
    }, entity);
    addEntity(this, finalEntity);
    return this.getId(input);
  }

  denormalize(entity, denormalizer) {
    return this.schemaKeys.reduce((res, key) => {
      if (!this.schema[key]) return res;
      const relation = this.schema[key];
      res[key] = denormalizer.getForRelation(entity, this, relation);
      return res;
    }, entity);
  }
}
