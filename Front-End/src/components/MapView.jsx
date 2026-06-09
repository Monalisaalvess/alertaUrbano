import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Ícones coloridos por status
const criarIcone = (cor) => L.divIcon({
  className: '',
  html: `<div style="
    width: 14px;
    height: 14px;
    background-color: ${cor};
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const icones = {
  pendente:   criarIcone('#ffba00'),
  em_analise: criarIcone('#0c266d'),
  resolvida:  criarIcone('#0c3b2e'),
}

const MapaVisualizacao = ({ reclamacoes = [] }) => {
  const centro = [-7.2341, -39.4093]

  return (
    <MapContainer
      center={centro}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reclamacoes.map((r) => (
        r.latitude && r.longitude && (
          <Marker
            key={r._id}
            position={[r.latitude, r.longitude]}
            icon={icones[r.status] || icones.pendente}
          >
            <Popup>
              <strong>{r.title}</strong><br />
              {r.location?.neighborhood}<br />
              <span style={{ color: '#71717a', fontSize: '0.85rem' }}>{r.category}</span>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  )
}

export default MapaVisualizacao