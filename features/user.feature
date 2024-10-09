Feature: User creation
  As a user of the system
  I want to create a new user
  So that I can verify that the user creation works

  Scenario: Search user by email
    Given I create a new user with externalId: '333' and email: 'testUser@jokeninja.me' and name: 'test-gela'
    When I search user by email: 'testUser@jokeninja.me'
    Then I should see error code: 0
    Then User externalId must be: '333'
  
  Scenario: Search by externalId
    Given I create a new user with externalId: '444' and email: 'duoTestable@jokeninja.me' and name: 'test-shak-ex'
    When I search user by externalId: '444'
    Then User externalId must be: '444'
    
  Scenario: try to create already existing user
    When I create a new user with externalId: '333' and email: 'testUser@jokeninja.me' and name: 'test-gela'
    Then I should see error code: 11000
    
