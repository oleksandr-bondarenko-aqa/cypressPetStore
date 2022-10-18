import {faker} from "@faker-js/faker";
import pet from '../fixtures/pet.json'

pet.id = parseInt(faker.random.numeric(5))
pet.name = faker.animal.crocodilia()
pet.category.id = parseInt(faker.random.numeric(3))
pet.category.name = faker.animal.type()

it('Create pet', () => {
    cy.log(pet.id);
    cy.request('POST', '/pet', pet).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.id).to.be.eql(pet.id);
        expect(response.body.name).to.be.eql(pet.name);
        expect(response.body.category).to.be.eql(pet.category);
    })
})

it('Get pet by id', () => {
    cy.log(pet.id);
    cy.request('GET', `/pet/${pet.id}`).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.id).to.be.eql(pet.id);
        expect(response.body.name).to.be.eql(pet.name);
        expect(response.body.category.name).to.be.eql(pet.category.name);
        expect(response.body.category.id).to.be.eql(pet.category.id);
    })
})
