const R = require('ramda')
const { describe } = require('riteway')
const seeds = require('./utils.js')

const harvestFn = (...args) => args.toString()

describe('seeds utils', async assert => {
  const harvestAll = R.partial(seeds.harvestAll, [harvestFn])
  const buildDatasets = seeds.buildDatasets

  const users = [{
    accountName: 'First User',
    initialBalance: 100
  }, {
    accountName: 'Second User',
    initialBalance: 200
  }]

  const firstPeriodSeedsAmount = 'fpsa'
  const firstPeriodTotal = 'fpt'
  const firstPeriodFirstUser = 'fpfu'
  const firstPeriodSecondUser = 'fpsu'
  const secondPeriodSeedsAmount = 'spsa'
  const secondPeriodTotal = 'spt'
  const secondPeriodFirstUser = 'spfu'
  const secondPeriodSecondUser = 'spsu'

  const stats = [{
    seedsAmount: firstPeriodSeedsAmount,
    total: firstPeriodTotal,
    users: [ firstPeriodFirstUser, firstPeriodSecondUser ]
  }, {
    seedsAmount: secondPeriodSeedsAmount,
    total: secondPeriodTotal,
    users: [ secondPeriodFirstUser, secondPeriodSecondUser ]
  }]

  const expectedHarvests = [[
    harvestFn(firstPeriodSeedsAmount, firstPeriodTotal, firstPeriodFirstUser),
    harvestFn(secondPeriodSeedsAmount, secondPeriodTotal, secondPeriodFirstUser)
  ], [
    harvestFn(firstPeriodSeedsAmount, firstPeriodTotal, firstPeriodSecondUser),
    harvestFn(secondPeriodSeedsAmount, secondPeriodTotal, secondPeriodSecondUser)
  ]]

  const expectedDatasets = [{
    label: users[0].accountName,
    data: [
      users[0].initialBalance,
      users[0].initialBalance + expectedHarvests[0][0],
      users[0].initialBalance + expectedHarvests[0][0] + expectedHarvests[0][1]
    ]
  }, {
    label: users[1].accountName,
    data: [
      users[1].initialBalance,
      users[1].initialBalance + expectedHarvests[1][0],
      users[1].initialBalance + expectedHarvests[1][0] + expectedHarvests[1][1]
    ]
  }]

  assert({
    given: 'statistics for multiple periods',
    should: 'calculate harvest for each user in each period',
    actual: harvestAll(stats),
    expected: expectedHarvests
  })

  assert({
    given: 'initial balances with changes after harvests',
    should: 'build datasets for each user',
    actual: buildDatasets(users, expectedHarvests),
    expected: expectedDatasets
  })
})