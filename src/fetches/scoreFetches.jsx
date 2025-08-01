export const addToUserScore = async (userId, scoreToAdd) => {
    try {
      
        const response = await fetch(`http://localhost:8088/users/${userId}`);
        const existingUser = await response.json();
        
      
        const currentTotal = existingUser.totalScore || 0;
        const newTotal = currentTotal + scoreToAdd;
        
       
        return fetch(`http://localhost:8088/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...existingUser,
                totalScore: newTotal  
            })
        }).then(res => res.json());
        
    } catch (error) {
        console.error('Error adding score:', error);
        throw error;
    }
};