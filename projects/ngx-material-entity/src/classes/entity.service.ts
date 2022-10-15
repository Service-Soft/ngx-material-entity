import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { EntityUtilities } from './entity.utilities';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { FileData } from '../decorators/file/file-decorator.data';
import { FileUtilities } from './file.utilities';
import { BaseEntityType } from './entity.model';

/**
 * A generic EntityService class.
 * Offers basic CRUD-functionality.
 * You should create a service for every Entity you have.
 * If you extend from this you need to make sure that the extended Service can be injected.
 */
export abstract class EntityService<EntityType extends BaseEntityType<EntityType>> {
    /**
     * The base url used for api requests. If u want to have more control over this,
     * you can override the create, read, update and delete methods.
     *
     * Create Sends a POST-Request to baseUrl.
     *
     * Read Sends a GET-Request to baseUrl.
     *
     * Update Sends a PATCH-Request to baseUrl/{id}.
     *
     * Delete Sends a DEL-Request to baseUrl/{id}.
     */
    abstract readonly baseUrl: string;
    /**
     * The key which holds the id value.
     *
     * @default 'id'
     */
    readonly idKey: keyof EntityType = 'id' as keyof EntityType;

    /**
     * A subject of all the entity values.
     * Can be subscribed to when you want to do a specific thing whenever the entities change.
     */
    readonly entitiesSubject: BehaviorSubject<EntityType[]> = new BehaviorSubject<EntityType[]>([]);

    /**
     * Gets the entities in an array from the internal entitiesSubject.
     *
     * @returns The current entities in form of an array.
     */
    get entities(): EntityType[] {
        return this.entitiesSubject.value;
    }

    constructor(private readonly http: HttpClient) {}

    /**
     * Creates a new Entity and pushes it to the entities array.
     *
     * @param entity - The data of the entity to create.
     * All values that should be omitted will be removed from it inside this method.
     * @returns A Promise of the created entity.
     */
    async create(entity: EntityType): Promise<EntityType> {
        const body: Partial<EntityType> = LodashUtilities.omit(entity, EntityUtilities.getOmitForCreate(entity)) as Partial<EntityType>;
        const filePropertyKeys: (keyof EntityType)[] = EntityUtilities.getFileProperties(entity);
        if (!filePropertyKeys.length) {
            return await this.createWithJson(body);
        }
        else {
            return await this.createWithFormData(body, filePropertyKeys, entity);
        }
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Creates the entity with form data when the entity contains files in contrast to creating it with a normal json body.
     * All file values are stored inside their respective property key and their name.
     * Form data is able to handle setting multiple files to the same key.
     *
     * @param body - The body Of the request.
     * @param filePropertyKeys - All property keys that are files and need to be added to the form data.
     * @param entity - The entity to create. This is needed in addition to the body because the body doesn't contain any metadata.
     * @returns The created entity from the server.
     */
    protected async createWithFormData(
        body: Partial<EntityType>,
        filePropertyKeys: (keyof EntityType)[],
        entity: EntityType
    ): Promise<EntityType> {
        const formData: FormData = new FormData();
        formData.append('body', JSON.stringify(LodashUtilities.omit(body, filePropertyKeys)));
        for (const key of filePropertyKeys) {
            if (EntityUtilities.getPropertyMetadata(entity, key, DecoratorTypes.FILE_DEFAULT).multiple) {
                const fileDataValues: FileData[] = body[key] as FileData[];
                for (const value of fileDataValues) {
                    formData.append(key as string, (await FileUtilities.getFileData(value)).file, value.name);
                }
            }
            else {
                const fileData: FileData = body[key] as FileData;
                formData.append(key as string, (await FileUtilities.getFileData(fileData)).file, fileData.name);
            }
        }
        const e: EntityType | undefined = await firstValueFrom(this.http.post<EntityType | undefined>(this.baseUrl, formData));
        if (!e) {
            throw new Error(`
                The created entity was not returned in the response.
                If you want to provide a logic that allows that
                you need to override the create methods of this class.
            `);
        }
        this.entities.push(e);
        this.entitiesSubject.next(this.entities);
        return e;
    }

    /**
     * Creates the entity with a normal json body in contrast to creating it with form data when the entity contains files.
     *
     * @param body - The body Of the request.
     * @returns The created entity from the server.
     */
    protected async createWithJson(body: Partial<EntityType>): Promise<EntityType> {
        const e: EntityType | undefined = await firstValueFrom(this.http.post<EntityType | undefined>(this.baseUrl, body));
        if (!e) {
            throw new Error(`
                The created entity was not returned in the response.
                If you want to provide a logic that allows that
                you need to override the create methods of this class.
            `);
        }
        this.entities.push(e);
        this.entitiesSubject.next(this.entities);
        return e;
    }

    /**
     * Gets all existing entities and pushes them to the entities array.
     *
     * @returns A Promise of all received Entities.
     */
    async read(): Promise<EntityType[]> {
        const e: EntityType[] = await firstValueFrom(this.http.get<EntityType[]>(this.baseUrl));
        this.entitiesSubject.next(e);
        return e;
    }

    /**
     * Updates a specific Entity.
     *
     * @param entity - The updated Entity
     * All values that should be omitted will be removed from it inside this method.
     * @param entityPriorChanges - The current Entity.
     * It Is used to get changed values and only update them instead of sending the whole entity data.
     */
    async update(entity: EntityType, entityPriorChanges: EntityType): Promise<void> {
        const body: Partial<EntityType> = LodashUtilities.omit(
            await EntityUtilities.difference(entity, entityPriorChanges),
            EntityUtilities.getOmitForUpdate(entity)
        ) as unknown as Partial<EntityType>;
        const filePropertyKeys: (keyof EntityType)[] = EntityUtilities.getFileProperties(entityPriorChanges);
        if (!filePropertyKeys.length) {
            await this.updateWithJson(body, entityPriorChanges[this.idKey]);
        }
        else {
            await this.updateWithFormData(body, filePropertyKeys, entity, entityPriorChanges[this.idKey]);
        }
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Updates the entity with form data when the entity contains files in contrast to creating it with a normal json body.
     * All file values are stored inside their respective property key and their name.
     * Form data is able to handle setting multiple files to the same key.
     *
     * @param body - The request body. Already contains only properties that have changed.
     * @param filePropertyKeys - The keys of all properties which are files and need to separately be appended to the form data.
     * @param entity - The original entity. Is needed to get the metadata of all the files.
     * @param id - The id of the entity to update.
     */
    protected async updateWithFormData(
        body: Partial<EntityType>,
        filePropertyKeys: (keyof EntityType)[],
        entity: EntityType,
        id: EntityType[keyof EntityType]
    ): Promise<void> {
        const formData: FormData = new FormData();
        formData.append('body', JSON.stringify(LodashUtilities.omitBy(body, LodashUtilities.isNil)));
        for (const key of filePropertyKeys) {
            if (EntityUtilities.getPropertyMetadata(entity, key, DecoratorTypes.FILE_DEFAULT).multiple) {
                const fileDataValues: FileData[] = body[key] as FileData[];
                for (const value of fileDataValues) {
                    formData.append(key as string, (await FileUtilities.getFileData(value)).file, value.name);
                }
            }
            else {
                const fileData: FileData = body[key] as FileData;
                formData.append(key as string, (await FileUtilities.getFileData(fileData)).file, fileData.name);
            }
        }
        const updatedEntity: EntityType | undefined = await firstValueFrom(
            this.http.patch<EntityType | undefined>(`${this.baseUrl}/${id}`, formData)
        );
        if (!updatedEntity) {
            // eslint-disable-next-line no-console
            console.warn('The updated entity was not returned in the response. Applying the changes from the request body.');
            for (const key in body) {
                this.entities[this.entities.findIndex(e => e[this.idKey] === id)][key]
                    = body[key] as EntityType[Extract<keyof EntityType, string>];
            }
            this.entitiesSubject.next(this.entities);
            return;
        }
        this.entities[this.entities.findIndex(e => e[this.idKey] === id)] = updatedEntity;
        this.entitiesSubject.next(this.entities);
    }

    /**
     * Updates the entity with a normal json body in contrast to updating it with form data when the entity contains files.
     *
     * @param body - The body of the Request. Has already removed all unnecessary values.
     * @param id - The id of the entity to update.
     */
    protected async updateWithJson(body: Partial<EntityType>, id: EntityType[keyof EntityType]): Promise<void> {
        const updatedEntity: EntityType | undefined = await firstValueFrom(
            this.http.patch<EntityType | undefined>(
                `${this.baseUrl}/${id}`,
                LodashUtilities.omitBy(body, LodashUtilities.isNil)
            )
        );
        if (!updatedEntity) {
            // eslint-disable-next-line no-console
            console.warn('The updated entity was not returned in the response. Applying the changes from the request body.');
            const foundEntity: EntityType = this.entities[this.entities.findIndex(e => e[this.idKey] === id)];
            for (const key in body) {
                foundEntity[key]
                    = body[key] as EntityType[Extract<keyof EntityType, string>];
            }
            this.entitiesSubject.next(this.entities);
            return;
        }
        this.entities[this.entities.findIndex(e => e[this.idKey] === id)] = updatedEntity;
        this.entitiesSubject.next(this.entities);
    }

    /**
     * Deletes a specific Entity.
     *
     * @param entity - The entity to delete.
     */
    async delete(entity: EntityType): Promise<void> {
        await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${entity[this.idKey]}`));
        // the == comparison instead of === is to catch ids that are numbers.
        this.entities.splice(this.entities.findIndex(e => e[this.idKey] === entity[this.idKey]), 1);
        this.entitiesSubject.next(this.entities);
    }
}