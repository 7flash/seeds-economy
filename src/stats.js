const R = require('ramda')

const SEEDS_PER_HARVEST = 32400

const basicUserPeriod = () => ({
  seedsPlanted: 1000,
  transactionsVolume: 10,
  transactionsCount: 5,
  transactionsPartners: 5,
  reputation: 5
})

const randomUserPeriod =
  R.compose(
    (user) => ({
      seedsPlanted: (() =>
          Math.random() > 0.5 ?
            Number(user.seedsPlanted + Math.random() * user.seedsPlanted * 10) :
            Number(user.seedsPlanted - Math.random() * user.seedsPlanted)
      )(),
      transactionsVolume: Number(user.transactionsVolume + Math.random() * user.transactionsVolume).toFixed(4),
      transactionsCount: Number.parseInt(user.transactionsCount + Math.random() * user.transactionsCount),
      transactionsPartners: Number.parseInt(user.transactionsPartners + Math.random() * user.transactionsPartners),
      reputation: Number.parseInt(user.reputation + Math.random() * user.reputation)
    }),
    basicUserPeriod
  )

const sumByAttr = (attr, list) =>
  R.reduce((acc, item) => Number(acc) + Number(item[attr]), 0, list)

const randomPeriodStats =
  R.compose(
    (users) => ({
      users: [
        ...users
      ],
      total: {
        seedsPlanted: sumByAttr('seedsPlanted', users),
        transactionsVolume: sumByAttr('transactionsVolume', users),
        transactionsCount: sumByAttr('transactionsCount', users),
        transactionsPartners: sumByAttr('transactionsPartners', users),
        reputation: sumByAttr('reputation', users)
      },
      seedsAmount: SEEDS_PER_HARVEST
    }),
    R.times(randomUserPeriod)
  )

const randomStats =
  R.compose(
    R.reduce((acc, value) =>
        acc instanceof Array ?
          acc.concat({
            ...value,
            seedsAmount: acc[acc.length - 1].total.transactionsVolume * 1000 + acc[acc.length - 1].total.transactionsCount * 1000,
            users: R.addIndex(R.map)((user, index) => ({
              ...user,
              seedsPlanted: user.seedsPlanted + acc[acc.length - 1].users[index].seedsPlanted
            }), value.users)
          }) : [value], 0),
    (numberOfPeriods, numberOfUsers) =>
      R.times(() => randomPeriodStats(numberOfUsers), numberOfPeriods)
  )

module.exports = {
  randomStats
}