const R = require('ramda')

const seedsCurrencyFormat = (number) => Number(number.toFixed(4))

const plantedSeedsScore = R.divide
const reputationScore = R.divide
const transactionsScore = R.compose(
  R.divide(R.__, 3),
  R.sum,
  (userTransactionStats, totalTransactionStats) =>
    [
      R.divide(userTransactionStats.transactionsVolume, totalTransactionStats.transactionsVolume),
      R.divide(userTransactionStats.transactionsCount, totalTransactionStats.transactionsCount),
      R.divide(userTransactionStats.transactionsPartners, totalTransactionStats.transactionsPartners)
    ]
)

const contributionScore = R.compose(
    R.divide(R.__, 3),
    R.sum,
    (totalStats, userStats) =>
      [
        plantedSeedsScore(
          userStats.seedsPlanted,
          totalStats.seedsPlanted
        ),
        reputationScore(
          userStats.reputation,
          totalStats.reputation
        ),
        transactionsScore({
          transactionsVolume: userStats.transactionsVolume,
          transactionsCount: userStats.transactionsCount,
          transactionsPartners: userStats.transactionsPartners
        }, {
          transactionsVolume: totalStats.transactionsVolume,
          transactionsCount: totalStats.transactionsCount,
          transactionsPartners: totalStats.transactionsPartners
        })
      ]
  )

const harvest = (seedsAmount, totalStats, userStats) =>
  R.compose(
    seedsCurrencyFormat,
    R.multiply(seedsAmount),
    R.memoizeWith(R.identical, contributionScore)
  )(totalStats, userStats)

module.exports = harvest