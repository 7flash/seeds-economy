const R = require('ramda')
const { describe } = require('riteway')
const harvest = require('../src/harvest.js')

describe('Seeds', async assert => {
  const stats = {
    seedsAmount: 100,
    total: {
      seedsPlanted: 36,
      transactionsVolume: 14.25,
      transactionsCount: 9,
      transactionsPartners: 4,
      reputation: 8
    },
    users: [
      {
        seedsPlanted: 12,
        transactionsVolume: 6.25,
        transactionsCount: 6,
        transactionsPartners: 1,
        reputation: 2
      },
      {
        seedsPlanted: 24,
        transactionsVolume: 8,
        transactionsCount: 3,
        transactionsPartners: 3,
        reputation: 6
      }
    ]
  }

  const harvestForUser = R.partial(harvest, [stats.seedsAmount, stats.total])

  assert({
    given: 'period stats for first account',
    should: 'return harvest reward for account',
    actual: harvestForUser(stats.users[0]),
    expected: 34.5029
  })

  assert({
    given: 'period stats for second account',
    should: 'return harvest reward for account',
    actual: harvestForUser(stats.users[1]),
    expected: 65.4971
  })
})