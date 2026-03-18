import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>
      <p>Benvenuto nel gestionale negozio</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
