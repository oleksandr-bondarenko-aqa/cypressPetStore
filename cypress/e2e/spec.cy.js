import {faker} from "@faker-js/faker";
import pet from '../fixtures/pet.json';

pet.id = parseInt(faker.random.numeric(5))
pet.name = faker.animal.crocodilia()
pet.category.id = parseInt(faker.random.numeric(3))
pet.category.name = faker.animal.type()

it(`Create pet with id ${pet.id}`, () => {
    cy.log(pet.id);
    cy.request('POST', '/pet', pet).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.id).to.be.eql(pet.id);
        expect(response.body.name).to.be.eql(pet.name);
        expect(response.body.category).to.be.eql(pet.category);
    })
})

it(`Get pet by id ${pet.id}`, () => {
    cy.log(pet.id);
    cy.request('GET', `/pet/${pet.id}`).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.id).to.be.eq(pet.id);
        expect(response.body.name).to.be.eq(pet.name);
        expect(response.body.category.name).to.be.eql(pet.category.name);
        expect(response.body.category.id).to.be.eql(pet.category.id);
    })
})

it(`Update pet name ${pet.name} and status ${pet.status}`, () => {
    pet.name = 'UpdatedPetName';
    pet.status = 'sold';

    cy.log(pet.id);
    cy.request('PUT', '/pet', pet).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.id).to.be.eq(pet.id);
        expect(response.body.name).to.be.eq(pet.name);
        expect(response.body.category).to.be.eql(pet.category);
        expect(response.body.status).to.be.eql(pet.status);
    })
})

it(`Get pet by status ${pet.status}`, () => {
    cy.log(pet.id);
    cy.request('GET', `/pet/findByStatus/?status=${pet.status}`).then(response => {
        expect(response.status).to.be.eq(200);

        let pets = response.body;

        console.log(pets);

        let petFromResponse = pets.filter(mypet => {
            return mypet.id === pet.id
        })
        expect(petFromResponse[0].id).to.be.eq(pet.id);
        expect(petFromResponse[0].name).to.be.eq(pet.name);
        expect(petFromResponse[0].category).to.be.eql(pet.category);
        expect(petFromResponse[0].status).to.be.eql(pet.status);
    })
})

it('Update pet with form data', () => {
    pet.name = 'UpdatedWithFormData';
    pet.status = 'qwwqew';

    cy.request({
        method: 'POST',
        url: `/pet/${pet.id}`,
        form: true,
        body: `name=${pet.name}&status=${pet.status}`
    }).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.message).to.be.eq(JSON.stringify(pet.id));
        expect(response.body.code).to.be.eq(200);
    })
})

it(`Delete pet with id ${pet.id}`, () => {
    cy.request('DELETE', `/pet/${pet.id}`,).then(response => {
        expect(response.status).to.be.eq(200);
        expect(response.body.message).to.be.eq(JSON.stringify(pet.id));
        expect(response.body.code).to.be.eq(200);
    }).then(() => {
        cy.request({
            method: 'GET',
            url: `/pet/${pet.id}`,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(404);
        })
    })
})