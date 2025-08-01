import { useState, useEffect } from "react"
import { getAllUsers } from "../../fetches/AdminFetches"
import "./Community.css"

export const Community = () => {
   const [ users , setUsers] = useState([])


useEffect(() => {
    getAllUsers()
        .then(users => {
            setUsers(users)
        })
},[])

return (
  <>
        <div className="community-container">
            <div className="community-header"></div>
            <div className="h1">LEADERBOARD</div>
            <table className="user-table">
                <thead>
                    <tr className="tr">
                         <th className="th">Rank</th> 
                        <th className="th">Name</th>
                        <th className="th">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {users.sort((a, b) => b.totalScore - a.totalScore)
                       .map((user, index) => ( 
                       <tr key={user.id}>
                              <td className="td rank-cell">
                                       
                                       {index === 0 && '🥇'}
                                       {index === 1 && '🥈'}
                                       {index === 2 && '🥉'}
                                       #{index + 1}
                                   </td>
                            <td className="td">{user.name}</td>
                            <td className="td">{user.totalScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
)
}