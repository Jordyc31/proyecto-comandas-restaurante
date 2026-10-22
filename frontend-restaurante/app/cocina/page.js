'use client';
import { useState, useEffect } from 'react';

export default function VistaCocina() {
  const [comandas, setComandas] = useState([]);

  const cargarComandas = () => {
    fetch('http://localhost:8080/api/comandas/cocina')
      .then(r => r.json())
      .then(data => setComandas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error al cargar comandas:", err));
  };

  useEffect(() => {
    cargarComandas();
    // Revisa automáticamente si entran nuevos pedidos cada 3 segundos
    const interval = setInterval(cargarComandas, 3000);
    return () => clearInterval(interval);
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await fetch(`http://localhost:8080/api/comandas/${id}/estado?nuevoEstado=${nuevoEstado}`, { method: 'PUT' });
      cargarComandas();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans bg-white min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
        Módulo Cocina - Comandera Digital
      </h1>

      {comandas.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 font-semibold bg-gray-50">
          No hay comandas pendientes en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comandas.map(c => (
            <div key={c.id} className="border-2 border-orange-400 p-4 rounded-lg shadow-md bg-amber-50 flex flex-col justify-between">
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex justify-between items-center border-b border-orange-300 pb-2 mb-3">
                  <span className="font-extrabold text-xl text-gray-900">
                    Mesa {c.mesa?.numeroMesa || c.mesa?.id}
                  </span>
                  <span className="text-xs font-bold bg-orange-200 text-orange-900 px-2 py-1 rounded-full uppercase">
                    {c.estado}
                  </span>
                </div>

                {/* Lista de Detalles */}
                <div className="space-y-2 mb-4">
                  {c.detalles && c.detalles.length > 0 ? (
                    c.detalles.map((d, i) => (
                      <div key={i} className="flex justify-between text-gray-900 text-sm font-semibold bg-white p-2 rounded border border-orange-200 shadow-sm">
                        <span>• {d.producto?.nombre || 'Producto'}</span>
                        <span className="text-blue-700 font-bold">x{d.cantidad}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-gray-500">Sin detalles registrados</p>
                  )}
                </div>
              </div>

              {/* Botón para Despachar */}
              <button
                onClick={() => cambiarEstado(c.id, 'ATENDIDO')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-md transition-colors text-sm shadow"
              >
                ✔ Marcar como Listo / Despachado
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}