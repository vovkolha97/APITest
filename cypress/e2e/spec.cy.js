beforeEach(function () {
  cy.fixture('APIData').then(function(data) {
    this.data = data;
  })
}) 

describe('CRUD API testing', () => {

  it('GET list of users', function () {
    cy.request('GET', Cypress.env('apiurl') + '/api/users?page=2').then(function (response) {
      expect(response.status).to.eq(200)
      expect(response).property('body').to.contain({
        "page": 2,
        "per_page": 6,
        "total": 12,
        "total_pages": 2,
      })
      expect(response.body.data[0]).to.not.be.empty
      expect(response.body.data[0].id).to.not.be.null
      expect(response.body.data[0].email).to.be.a('string')
      expect(response.body.data[0].email).to.not.be.empty
      expect(response.body.data[0].first_name).to.be.a('string')
      expect(response.body.data[0].first_name).to.not.be.empty
      expect(response.body.data[0].last_name).to.be.a('string')
      expect(response.body.data[0].last_name).to.not.be.empty
      expect(response.body.data[0].avatar).to.be.a('string')
      expect(response.body.data[0].avatar).to.not.be.empty
    })
  })

  it('GET single user by ID', function () {
    cy.request('GET', Cypress.env('apiurl') + '/api/users/2').then(function (response) {
      expect(response.status).to.eq(200)

      expect(response.body.data).to.not.be.empty
      expect(response.body.data.id).to.not.be.null
      expect(response.body.data.id).to.eq(2)
      expect(response.body.data.email).to.be.a('string')
      expect(response.body.data.email).to.not.be.empty
      expect(response.body.data.first_name).to.be.a('string')
      expect(response.body.data.first_name).to.not.be.empty
      expect(response.body.data.last_name).to.be.a('string')
      expect(response.body.data.last_name).to.not.be.empty
      expect(response.body.data.avatar).to.be.a('string')
      expect(response.body.data.avatar).to.not.be.empty
    })
  })

  it('GET single user by ID: user not found', function () {
    cy.request({method:'GET', url:Cypress.env('apiurl') + '/api/users/23', failOnStatusCode: false}).then(function (response){
      expect(response.status).to.eq(404)
      expect(response.body).to.be.empty
    })
  })

  it('POST create new user', function () {
    cy.request({
      method: 'POST',
      url:Cypress.env('apiurl') + '/api/users',
      body: {
        "name": this.data.create_user_name,
        "job": this.data.create_user_job 
      }
    }).then(function (response){
      expect(response.status).to.eq(201)
      expect(response.body.name).to.eq(this.data.create_user_name)
      expect(response.body.job).to.eq(this.data.create_user_job)
      expect(response.body.id).to.be.a('string')
      expect(response.body.createdAt).to.be.a('string')
      expect(Date.parse(response.body.createdAt) - Date.now()).to.be.lessThan(30000) 
    })
  })

  it('PUT update user', function () {
    cy.request({
      method: 'PUT',
      url:Cypress.env('apiurl') + '/api/users/2',
      body: {
        "name": this.data.update_user_name,
        "job": this.data.update_user_job 
      }
    }).then(function (response){
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq(this.data.update_user_name)
      expect(response.body.job).to.eq(this.data.update_user_job)
      expect(response.body.updatedAt).to.be.a('string') 
      expect(Date.parse(response.body.updatedAt) - Date.now()).to.be.lessThan(30000) 
    })
  })

  it('PATCH update user', function () {
    cy.request({
      method: 'PATCH',
      url:Cypress.env('apiurl') + '/api/users/2',
      body: {
        "name": this.data.update_user_name,
        "job": this.data.update_user_job 
      }
    }).then(function (response){
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq(this.data.update_user_name)
      expect(response.body.job).to.eq(this.data.update_user_job)
      expect(response.body.updatedAt).to.be.a('string')
      expect(Date.parse(response.body.updatedAt) - Date.now()).to.be.lessThan(30000) 
    })
  })

  it('DELETE user by ID', function(){
    cy.request('DELETE', Cypress.env('apiurl')+'/api/users/2')
    .then(function (response){
      expect(response.status).to.eq(204)
    })
  })

  it('POST register user: successful', function () {
    cy.request({
      method: 'POST',
      url:Cypress.env('apiurl') + '/api/register',
      body: {
      "email": this.data.register_user_email,
      "password": this.data.register_user_password
      }
    }).then(function(response){
      expect(response.status).to.eq(200)
      expect(response.body).to.not.be.empty
      expect(response.body.id).to.not.be.null
      expect(response.body.token).to.be.a('string')
    })
  })

  it('POST register user: unsuccessful', function () {
    cy.request({method:'POST', url:Cypress.env('apiurl') + '/api/register', failOnStatusCode: false,
        body: {
        "email": this.data.reqister_only_email,
        }
      }).then(function(response){
        expect(response.status).to.eq(400)
        expect(response).property('body').to.contain({
        "error": "Missing password"
      })
    })
  })

  it('POST login: successful', function () {
    cy.request({
      method: 'POST',
      url:Cypress.env('apiurl') + '/api/login',
      body: {
      "email": this.data.login_email,
      "password": this.data.login_password
      }
    }).then(function(response){
      expect(response.status).to.eq(200)
      expect(response.body).to.not.be.empty
      expect(response.body.token).to.be.a('string')
    })
  })

  it('POST login: unsuccessful', function () {
    cy.request({
      method: 'POST',
      url:Cypress.env('apiurl') + '/api/login',
      failOnStatusCode: false,
      body: {
      "email": this.data.login_email
      }
    }).then(function(response){
      expect(response.status).to.eq(400)
      expect(response).property('body').to.contain({
        "error": "Missing password"
      })
    })
  })

  it('GET list of users with timeout', function () {
    cy.request({
      method: 'GET',
      url:Cypress.env('apiurl') + '/api/users?delay=3',
      timeout:50000
    }).then(function (response) {
      expect(response.status).to.eq(200)
      expect(response).property('body').to.contain({
        "page": 1,
        "per_page": 6,
        "total": 12,
        "total_pages": 2,
      })
      expect(response.body.data[0]).to.not.be.empty
      expect(response.body.data[0].id).to.not.be.null
      expect(response.body.data[0].email).to.be.a('string')
      expect(response.body.data[0].email).to.not.be.empty
      expect(response.body.data[0].first_name).to.be.a('string')
      expect(response.body.data[0].first_name).to.not.be.empty
      expect(response.body.data[0].last_name).to.be.a('string')
      expect(response.body.data[0].last_name).to.not.be.empty
      expect(response.body.data[0].avatar).to.be.a('string')
      expect(response.body.data[0].avatar).to.not.be.empty
    })
  })
})
