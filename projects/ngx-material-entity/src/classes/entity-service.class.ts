import { Entity } from './entity-model.class';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { isNil, omit, omitBy } from 'lodash';
import { EntityUtilities } from './entity-utilities.class';

/**
 * A generic EntityService class.
 * Offers basic CRUD-functionality.
 * You should create a service for every Entity you have.
 * If you extend from this you need to make sure that the extended Service can be injected.
 */
export abstract class EntityService<EntityType extends Entity> {
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
        const body = omit(entity, EntityUtilities.getOmitForCreate(entity));
        const e = await firstValueFrom(this.http.post<EntityType>(this.baseUrl, body));
        this.entities.push(e);
        this.entitiesSubject.next(this.entities);
        return e;
    }

    /**
     * Gets all existing entities and pushes them to the entites array.
     *
     * @returns A Promise of all received Entities.
     */
    async read(): Promise<EntityType[]> {
        const e = await firstValueFrom(this.http.get<EntityType[]>(this.baseUrl));
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
        const reqBody = omit(
            EntityUtilities.difference(entity, entityPriorChanges),
            EntityUtilities.getOmitForUpdate(entity)
        );
        const updatedEntity = await firstValueFrom(
            this.http.patch<EntityType>(
                `${this.baseUrl}/${entityPriorChanges.id}`,
                omitBy(reqBody, isNil)
            )
        );
        this.entities[this.entities.findIndex((e) => e.id === entityPriorChanges.id)] = updatedEntity;
        this.entitiesSubject.next(this.entities);
    }

    /**
     * Deletes a specific Entity.
     *
     * @param id - The id of the element to delete.
     */
    async delete(id: string): Promise<void> {
        await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
        this.entities.splice(
            this.entities.findIndex((e) => e.id === id), 1
        );
        this.entitiesSubject.next(this.entities);
    }
}