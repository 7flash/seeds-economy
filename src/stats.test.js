const { describe } = require('riteway')
const stats = require('./stats')

describe('stats', async assert => {
  const numberOfPeriods = 3
  const numberOfUsers = 2

  const actual = stats.randomStats(numberOfPeriods, numberOfUsers)

  const check = (actual) => ({
    numberOfPeriods: actual.length,
    numberOfUsers: actual[0].users ? actual[0].users.length : 0,
  })

  assert({
    given: 'number of periods and users',
    should: 'generate random stats',
    actual: check(actual),
    expected: {
      numberOfPeriods, numberOfUsers
    }
  })
})