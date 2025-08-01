export const scorePut = (userId, score) => {
   
    if (typeof userId !== 'number') {
        userId = parseInt(userId);
    }
    
    return fetch(`http://localhost:8088/users/${userId}`)
        .then(res => res.json())
        .then(existingUser => {
            return fetch(`http://localhost:8088/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...existingUser,
                    totalScore: parseInt(score)  
                })
            }).then(res => res.json());
        });
};