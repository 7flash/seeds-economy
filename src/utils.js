const R = require('ramda')

const reduceHarvest = (initialBalance, harvest) =>
  R.reduce(
    (acc, value) =>
      acc instanceof Array ?
        acc.concat(acc[acc.length - 1] + value) :
        [acc, acc + value]
  )(initialBalance, harvest)

const harvestAll = (harvestFn, stats) =>
  R.compose(
    R.transpose,
    R.map(
      ({ seedsAmount, total, users }) =>
        R.map(
          (currentUser) => harvestFn(seedsAmount, total, currentUser),
          users
        )
    )
  )(stats)

const buildDatasets = (users, harvests) =>
  R.zipWith((user, harvest) => ({
    label: user.accountName,
    data: reduceHarvest(user.initialBalance, harvest)
  }))(users, harvests)

module.exports = {
  harvestAll, buildDatasets
}