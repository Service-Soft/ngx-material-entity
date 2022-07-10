import { Entity } from '../../classes/entity-model.class';
import { PropertyDecoratorConfigInternal } from '../base/property-decorator-internal.data';
import { DefaultObjectDecoratorConfig } from './object-decorator.data';

export class DefaultObjectDecoratorConfigInternal<EntityType extends Entity>
    extends PropertyDecoratorConfigInternal implements DefaultObjectDecoratorConfig<EntityType> {

    displayStyle: 'inline';
    type: new (entity?: EntityType) => EntityType;

    constructor(data: DefaultObjectDecoratorConfig<EntityType>) {
        super(data);
        this.displayStyle = data.displayStyle;
        this.type = data.type;
    }
}