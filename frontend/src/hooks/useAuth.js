import { useContext } from "react"
import { AuthContext } from "../provider/AuthProvider"

export const useAuth = () => {
    return useContext(AuthContext)
}