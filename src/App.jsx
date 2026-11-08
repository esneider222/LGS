import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Seleccion from './pages/Seleccion'
import Inicio from './pages/Inicio'
import Guia from './pages/Guia'
import Examen from './pages/Examen'
import Chat from './pages/Chat'
import Practica from './pages/Practica'
import Juegos from './pages/Juegos'
import Material from './pages/Material'
import Recursos from './pages/Recursos'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/seleccion" element={<Seleccion />} />

      {/* Estas pantallas comparten el menú lateral (AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/guia" element={<Guia />} />
        <Route path="/examen" element={<Examen />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/practica" element={<Practica />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/material" element={<Material />} />
        <Route path="/recursos" element={<Recursos />} />
      </Route>

      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  )
}

export default App