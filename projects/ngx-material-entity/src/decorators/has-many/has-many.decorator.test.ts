import { expect } from '@jest/globals';
import { Entity } from '../../classes/entity.model';
import { EntityService } from '../../services/entity.service';
import { EntityUtilities } from '../../utilities/entity.utilities';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { string } from '../string/string.decorator';
import { HasManyDecoratorConfigInternal } from './has-many-decorator-internal.data';
import { hasMany } from './has-many.decorator';

class TestEntityService extends EntityService<TestEntity> {
    override baseUrl: string = '/test';
}

class HasManyEntityService extends EntityService<HasManyEntity> {
    override baseUrl: string = '/has-many';
}

class HasManyEntity extends Entity {
    @string({
        displayStyle: 'line',
        displayName: 'Example Value'
    })
    exampleValue!: string;

    constructor(entity?: HasManyEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

class TestEntity extends Entity {
    @hasMany({
        tableData: {
            baseData: {
                title: 'Has Many Entities',
                displayColumns: [
                    {
                        displayName: 'Example Value',
                        value: (e: HasManyEntity) => e.exampleValue
                    }
                ],
                EntityServiceClass: HasManyEntityService,
                EntityClass: HasManyEntity
            },
            createData: {}
        },
        RelatedEntityServiceClass: TestEntityService,
        displayName: 'Has Many Entities'
    })
    hasManyEntities!: HasManyEntity[];

    constructor(entity?: TestEntity) {
        super();
        EntityUtilities.new(this, entity);
    }
}

const testEntity: TestEntity = new TestEntity();

test('should have default has many metadata', () => {
    // eslint-disable-next-line typescript/no-explicit-any
    const metadata: HasManyDecoratorConfigInternal<any, any> | undefined = EntityUtilities.getPropertyMetadata(testEntity, 'hasManyEntities', DecoratorTypes.HAS_MANY);
    expect(metadata).toBeDefined();
    expect(metadata?.defaultWidths).toEqual([12, 12, 12]);
});