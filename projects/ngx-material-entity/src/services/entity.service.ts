import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { BaseEntityType } from '../classes/entity.model';
import { DecoratorTypes } from '../decorators/base/decorator-types.enum';
import { FileData } from '../decorators/file/file-decorator.data';
import { LodashUtilities } from '../encapsulation/lodash.utilities';
import { EntityUtilities } from '../utilities/entity.utilities';
import { FileUtilities } from '../utilities/file.utilities';
import { DefaultFileDecoratorConfigInternal } from '../decorators/file/file-decorator-internal.data';

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
     * The default route segment that comes before the id when editing an entity in a separate page, if no extra route has been provided.
     */
    readonly editBaseRoute: string = 'entities';

    /**
     * The complete route that is used to create an entity in a separate page, if no extra route has been provided.
     */
    readonly createBaseRoute: string = 'entities/create';

    /**
     * The key which holds the id value.
     * @default 'id'
     */
    readonly idKey: keyof EntityType = 'id' as keyof EntityType;

    /**
     * A subject of all the entity values.
     * Can be subscribed to when you want to do a specific thing whenever the entities change.
     */
    readonly entitiesSubject: BehaviorSubject<EntityType[]> = new BehaviorSubject<EntityType[]>([]);


    /**
     * When frequently trying to find a single entity by an id (eg. When nesting relations)
     * you might send a lot of unnecessary requests.
     * Therefore the findById method tries to look in the already existing entities first,
     * IF the entities have been requested in the last READ_EXPIRATION_IN_MS milliseconds.
     * @default 900000 (5 minutes)
     */
    protected readonly READ_EXPIRATION_IN_MS: number = 900000;

    /**
     * Gets the entities in an array from the internal entitiesSubject.
     * @returns The current entities in form of an array.
     */
    get entities(): EntityType[] {
        return this.entitiesSubject.value;
    }

    /**
     * The last time that the entities have been requested from the api.
     */
    lastRead?: Date;

    constructor(protected readonly http: HttpClient, protected readonly injector: EnvironmentInjector) {}

    /**
     * Creates a new Entity and pushes it to the entities array.
     * @param entity - The data of the entity to create.
     * All values that should be omitted will be removed from it inside this method.
     * @param baseUrl - The base url to send the post request to.
     * This can be used if you want to create an entity belonging to another, like "customers/{id}/invoices".
     * @returns A Promise of the created entity.
     */
    async create(entity: EntityType, baseUrl: string = this.baseUrl): Promise<EntityType> {
        const body: Partial<EntityType> = EntityUtilities.getWithoutOmitCreateValues(entity);
        const filePropertyKeys: (keyof EntityType)[] = EntityUtilities.getFileProperties(entity);
        if (!filePropertyKeys.length) {
            return await this.createWithJson(body, baseUrl);
        }
        else {
            return await this.createWithFormData(body, filePropertyKeys, entity, baseUrl);
        }
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Imports everything from the provided json file.
     * @param file - The json file to import from.
     * @returns All entities that have been imported.
     */
    async import(file: File): Promise<EntityType[]> {
        const formData: FormData = new FormData();
        formData.append('import', file);
        const result: EntityType[] = await firstValueFrom(this.http.post<EntityType[]>(`${this.baseUrl}/import`, formData));
        this.entities.push(...result);
        this.entitiesSubject.next(this.entities);
        return result;
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Creates the entity with form data when the entity contains files in contrast to creating it with a normal json body.
     * All file values are stored inside their respective property key and their name.
     * Form data is able to handle setting multiple files to the same key.
     * @param body - The body Of the request.
     * @param filePropertyKeys - All property keys that are files and need to be added to the form data.
     * @param entity - The entity to create. This is needed in addition to the body because the body doesn't contain any metadata.
     * @param baseUrl - The base url to send the post request to.
     * This can be used if you want to create an entity belonging to another, like "customers/{id}/invoices".
     * @returns The created entity from the server.
     */
    protected async createWithFormData(
        body: Partial<EntityType>,
        filePropertyKeys: (keyof EntityType)[],
        entity: EntityType,
        baseUrl: string = this.baseUrl
    ): Promise<EntityType> {
        const formData: FormData = new FormData();
        formData.append('body', JSON.stringify(LodashUtilities.omit(body, filePropertyKeys)));
        for (const key of filePropertyKeys) {
            if ((EntityUtilities.getPropertyMetadata(entity, key, DecoratorTypes.FILE_DEFAULT) as DefaultFileDecoratorConfigInternal).multiple) {
                const fileDataValues: FileData[] = body[key] as FileData[];
                for (const value of fileDataValues) {
                    formData.append(key as string, (await FileUtilities.getFileData(value, this.http)).file, value.name);
                }
            }
            else {
                const fileData: FileData = body[key] as FileData;
                formData.append(key as string, (await FileUtilities.getFileData(fileData, this.http)).file, fileData.name);
            }
        }
        const e: EntityType | undefined = await firstValueFrom(this.http.post<EntityType | undefined>(baseUrl, formData));
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
     * @param body - The body Of the request.
     * @param baseUrl - The base url to send the post request to.
     * This can be used if you want to create an entity belonging to another, like "customers/{id}/invoices".
     * @returns The created entity from the server.
     */
    protected async createWithJson(body: Partial<EntityType>, baseUrl: string = this.baseUrl): Promise<EntityType> {
        const e: EntityType | undefined = await firstValueFrom(this.http.post<EntityType | undefined>(baseUrl, body));
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
     * @param baseUrl - The base url for the request. Defaults to the baseUrl on the service.
     * @returns A Promise of all received Entities.
     */
    async read(baseUrl = this.baseUrl): Promise<EntityType[]> {
        const e: EntityType[] = await firstValueFrom(this.http.get<EntityType[]>(baseUrl));
        this.entitiesSubject.next(e);
        this.lastRead = new Date();
        return e;
    }

    /**
     * Tries to find an entity with the given id.
     * @param id - The id of the entity to find.
     * @returns The found entity.
     */
    async findById(id: EntityType[keyof EntityType]): Promise<EntityType> {
        if (
            this.lastRead == null
            || (new Date().getTime() - this.lastRead.getTime()) > this.READ_EXPIRATION_IN_MS
        ) {
            return firstValueFrom(this.http.get<EntityType>(`${this.baseUrl}/${id}`));
        }
        return this.entities.find(e => e[this.idKey] === id) ?? firstValueFrom(this.http.get<EntityType>(`${this.baseUrl}/${id}`));
    }

    /**
     * Updates a specific Entity.
     * @param entity - The updated Entity
     * All values that should be omitted will be removed from it inside this method.
     * @param entityPriorChanges - The current Entity.
     * It Is used to get changed values and only update them instead of sending the whole entity data.
     */
    async update(entity: EntityType, entityPriorChanges: EntityType): Promise<void> {
        const filePropertyKeys: (keyof EntityType)[] = EntityUtilities.getFileProperties(entityPriorChanges);
        const body: Partial<EntityType> = await this.entityToUpdateRequestBody(entity, entityPriorChanges);
        if (!filePropertyKeys.length) {
            await this.updateWithJson(body, entityPriorChanges[this.idKey]);
        }
        else {
            await this.updateWithFormData(body, filePropertyKeys, entity, entityPriorChanges[this.idKey]);
        }
    }

    /**
     * Builds the update request body from the given entity before and after its changes.
     * @param entity - The entity with changed values.
     * @param entityPriorChanges - The entity before any changes.
     * @returns A partial of only the changed values.
     */
    protected async entityToUpdateRequestBody(entity: EntityType, entityPriorChanges: EntityType): Promise<Partial<EntityType>> {
        return await EntityUtilities.getWithoutOmitUpdateValues(entity, entityPriorChanges, this.http, this.injector);
    }

    // TODO: Find a way to use blobs with jest
    /* istanbul ignore next */
    /**
     * Updates the entity with form data when the entity contains files in contrast to creating it with a normal json body.
     * All file values are stored inside their respective property key and their name.
     * Form data is able to handle setting multiple files to the same key.
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
        formData.append('body', JSON.stringify(LodashUtilities.omit(body, filePropertyKeys)));
        for (const key of filePropertyKeys) {

            if ((EntityUtilities.getPropertyMetadata(entity, key, DecoratorTypes.FILE_DEFAULT) as DefaultFileDecoratorConfigInternal).multiple) {
                const fileDataValues: FileData[] = body[key] as FileData[];
                for (const value of fileDataValues) {
                    formData.append(key as string, (await FileUtilities.getFileData(value, this.http)).file, value.name);
                }
            }
            else {
                const fileData: FileData = body[key] as FileData;
                formData.append(key as string, (await FileUtilities.getFileData(fileData, this.http)).file, fileData.name);
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
     * @param body - The body of the Request. Has already removed all unnecessary values.
     * @param id - The id of the entity to update.
     */
    protected async updateWithJson(body: Partial<EntityType>, id: EntityType[keyof EntityType]): Promise<void> {
        const updatedEntity: EntityType | undefined = await firstValueFrom(
            this.http.patch<EntityType | undefined>(`${this.baseUrl}/${id}`, body)
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
     * @param entity - The entity to delete.
     */
    async delete(entity: EntityType): Promise<void> {
        await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${entity[this.idKey]}`));
        // the == comparison instead of === is to catch ids that are numbers.
        this.entities.splice(this.entities.findIndex(e => e[this.idKey] === entity[this.idKey]), 1);
        this.entitiesSubject.next(this.entities);
    }
}