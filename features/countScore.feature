Feature: We have a score counter
  Counter takes answers
  We figure out if the user will get the correct score

  Scenario: Calculate user score based on medium high clicked count
    Given I have the following answers with counts 427 358 172
    When I calculate the total score is 957
    Then total score of answer num 0 should be 2

  Scenario: Calculate user score based on medium low clicked count
    Given I have the following answers with counts 427 358 172
    When I calculate the total score is 957
    Then total score of answer num 1 should be 1

  Scenario: Calculate user score based on medium low clicked count
    Given I have the following answers with counts 427 358 172
    When I calculate the total score is 957
    Then total score of answer num 2 should be -2

  Scenario: Calculate user score based on super high clicked count
    Given I have the following answers with counts 950 40 10
    When I calculate the total score is 1000
    Then total score of answer num 0 should be 9

  Scenario: Calculate user score based on very low clicked count
    Given I have the following answers with counts 950 40 10
    When I calculate the total score is 1000
    Then total score of answer num 1 should be -4


  Scenario: Calculate user score based on minimum clicked count
    Given I have the following answers with counts 950 40 10
    When I calculate the total score is 1000
    Then total score of answer num 2 should be -5


  Scenario: Calculate user score when first one answer is clicked
    Given I have the following answers with counts 1000 0 0
    When I calculate the total score is 1000
    Then total score of answer num 0 should be 10
    