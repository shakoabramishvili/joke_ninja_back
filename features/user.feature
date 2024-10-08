Feature: User creation
  As a user of the system
  I want to create a new user
  So that I can verify that the user creation works

  Background: We will create new users
    Given I create a new user with externalId: '333' and email: 'testUser@jokeninja.me'
    And I create a new user with externalId: '444' and email: 'duoTestable@jokeninja.me'

  Scenario: Search user by email
    When I search user by email: 'testUser@jokeninja.me'
    Then User externalId must be: '333'
  
  Scenario: Search by externalId
    When I search user by externalId: '444'
    Then User externalId must be: '444'
    