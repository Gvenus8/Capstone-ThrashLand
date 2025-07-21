export const updateUserArtWithTitle = (userArtId, title) => {
    return fetch(`http://localhost:8088/userArt/${userArtId}`)
        .then(res => res.json())
        .then(existingUserArt => {
            return fetch(`http://localhost:8088/userArt/${userArtId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...existingUserArt,
                    title: title
                })
            }).then(res => res.json());
        });
};