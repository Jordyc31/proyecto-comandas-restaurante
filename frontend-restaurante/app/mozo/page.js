'use client';
import { useState, useEffect } from 'react';

export default function VistaMozo() {
  const [mesas, setMesas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/mesas')
      .then(r => r.json())
      .then(data => setMesas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando mesas:", err));

    fetch('http://localhost:8080/api/productos')
      .then(r => r.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const agregarProducto = (prod) => {
    // Si el producto ya está en la lista, aumenta la cantidad
    const existente = carrito.find(item => item.producto.id === prod.id);
    if (existente) {
      setCarrito(carrito.map(item => 
        item.producto.id === prod.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto: prod, cantidad: 1, precioUnitario: prod.precio }]);
    }
  };

  const enviarComanda = async () => {
    if (!mesaSeleccionada) {
      alert('Por favor, seleccione una mesa.');
      return;
    }
    if (carrito.length === 0) {
      alert('Por favor, agregue al menos un producto al pedido.');
      return;
    }

    // Formato exacto de JSON para Spring Boot
    const payload = {
      mesa: { id: Number(mesaSeleccionada) },
      estado: 'ENVIADO',
      detalles: carrito.map(item => ({
        producto: { id: item.producto.id },
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      }))
    };

    try {
      const res = await fetch('http://localhost:8080/api/comandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('✅ Comanda enviada a cocina con éxito');
        setCarrito([]);
        setMesaSeleccionada(null);
      } else {
        alert('❌ Error al enviar la comanda. Revisa la consola del servidor.');
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert('❌ Error de conexión con el Backend.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans text-gray-900 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
        Módulo Mozo - Registro de Comanda
      </h1>

      {/* Selector de Mesas */}
      <h2 className="text-lg font-semibold mb-2 text-gray-800">1. Seleccionar Mesa:</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
        {mesas.map(m => (
          <button
            key={m.id}
            onClick={() => setMesaSeleccionada(m.id)}
            className={`p-3 rounded border font-bold text-center transition-colors ${
              mesaSeleccionada === m.id
                ? 'bg-blue-600 text-white border-blue-700 shadow'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'
            }`}
          >
            Mesa {m.numeroMesa}
          </button>
        ))}
      </div>

      {/* Selector de Productos */}
      <h2 className="text-lg font-semibold mb-2 text-gray-800">2. Seleccionar Platos y Bebidas:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {productos.map(p => (
          <button
            key={p.id}
            onClick={() => agregarProducto(p)}
            className="p-3 border border-gray-300 rounded text-left bg-gray-50 hover:bg-blue-50 text-gray-800 font-medium flex justify-between items-center transition-colors"
          >
            <span>{p.nombre}</span>
            <span className="font-bold text-blue-700">S/. {Number(p.precio).toFixed(2)}</span>
          </button>
        ))}
      </div>

      {/* Resumen del Pedido */}
      <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm">
        <h3 className="font-bold text-lg border-b border-gray-300 pb-2 text-gray-900">
          Resumen Pedido: {mesaSeleccionada ? `Mesa ${mesas.find(m => m.id === mesaSeleccionada)?.numeroMesa}` : 'Ninguna mesa seleccionada'}
        </h3>

        {carrito.length === 0 ? (
          <p className="text-gray-500 py-4 text-center italic">No hay productos agregados al carrito.</p>
        ) : (
          <div className="divide-y divide-gray-200 my-3">
            {carrito.map((item, idx) => (
              <div key={idx} className="flex justify-between py-2 text-gray-800 text-sm font-semibold">
                <span>{item.producto.nombre} (x{item.cantidad})</span>
                <span>S/. {(item.precioUnitario * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={enviarComanda}
          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg shadow transition-colors"
        >
          Enviar a Cocina
        </button>
      </div>
    </div>
  );
}