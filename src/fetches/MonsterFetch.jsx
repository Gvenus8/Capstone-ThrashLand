export const getMonsterById = (userArt) => {
  return fetch(`http://localhost:8088/monsters?id=${userArt}`).then((res) =>
    res.json()
  )
}