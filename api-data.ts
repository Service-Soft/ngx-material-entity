import { Person } from 'projects/ngx-material-entity-showcase/src/models/person.model';

interface ApiData {
    persons: Person[]
}
export const data: ApiData = {
    persons: [
        {
            id: '1',
            firstname: 'Tim',
            lastname: 'Fabian',
            formOfAddress: 'Herr',
            address: {
                id: '1',
                street: 'Schultenstraße',
                number: '5',
                postcode: '45739',
                city: 'Oer-Erkenschwick',
                omitForCreate: 'omitForCreate',
                omitForEdit: 'omitForEdit'
            }
        }
    ]
};