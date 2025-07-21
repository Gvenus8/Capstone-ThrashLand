export const createUser = (customer) => {
  return fetch("http://localhost:8088/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  }).then((res) => res.json())
}

export const getUserByEmail = (email) => {
  return fetch(`http://localhost:8088/users?email=${email}`).then((res) =>
    res.json()
  )

}

export const getUserById = (id) => {
  return fetch(`http://localhost:8088/users?id=${id}`).then((res) =>
    res.json()
  )
}
export const getUserArtById = (userId) => {
  return fetch(`http://localhost:8088/userArt?userId=${userId}`)
    .then(res => res.json());
};


export const expandUserChoices = async (selectedMusic, selectedColor, selectedEmotion, selectedAdjective) => {
  const [music, color, emotion, adjective] = await Promise.all([
    fetch(`http://localhost:8088/favMusicChoices/${selectedMusic}`).then(r => r.json()),
    fetch(`http://localhost:8088/favColorChoices/${selectedColor}`).then(r => r.json()),
    fetch(`http://localhost:8088/currentEmotionChoices/${selectedEmotion}`).then(r => r.json()),
    fetch(`http://localhost:8088/adjectiveChoices/${selectedAdjective}`).then(r => r.json())
  ]);

  return { music, color, emotion, adjective };
};