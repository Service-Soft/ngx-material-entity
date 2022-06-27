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
            addresses: [
                {
                    id: '2',
                    street: 'Schultenstraße',
                    number: '5',
                    postcode: '45739',
                    city: 'Oer-Erkenschwick',
                    omitForCreate: 'omitForCreate',
                    omitForEdit: 'omitForEdit'
                },
                {
                    id: '3',
                    street: 'Hufschmiedstraße',
                    number: '17',
                    postcode: '45665',
                    city: 'Recklinghausen',
                    omitForCreate: 'omitForCreate',
                    omitForEdit: 'omitForEdit'
                }
            ],
            categories: [
                'AJKSHD',
                'saiduohjk'
            ],
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