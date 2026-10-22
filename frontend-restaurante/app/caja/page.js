'use client';
import { useState } from 'react';

export default function VistaCaja() {
  const [mesaNum, setMesaNum] = useState('');
  const [precuenta, setPrecuenta] = useState(null);

  const buscarPrecuenta = async () => {
    const res = await fetch(`http://localhost:8080/api/comandas/precuenta/${mesaNum}`);
    const data = await res.json();
    setPrecuenta(data);
  };

  const calcularTotal = () => {
    if (!precuenta) return 0;
    return precuenta.reduce((acc, c) => {
      return acc + c.detalles.reduce((sub, d) => sub + (d.precioUnitario * d.cantidad), 0);
    }, 0);
  };

  return (
    <div className="p-6 max-w-lg mx-auto font-sans border rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Módulo Caja - Pre-cuenta</h1>
      <div className="flex gap-2 mb-4">
        <input 
          type="number" 
          placeholder="N° Mesa" 
          value={mesaNum} 
          onChange={e => setMesaNum(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={buscarPrecuenta} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
          Calcular
        </button>
      </div>

      {precuenta && (
        <div className="border-t pt-4">
          <h2 className="font-bold text-center text-lg mb-2">DETALLE DE PRE-CUENTA</h2>
          {precuenta.map(c => (
            <div key={c.id}>
              {c.detalles.map((d, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{d.producto.nombre} x{d.cantidad}</span>
                  <span>S/. {(d.precioUnitario * d.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="border-t mt-4 pt-2 flex justify-between font-bold text-lg">
            <span>TOTAL A COBRAR:</span>
            <span>S/. {calcularTotal().toFixed(2)}</span>
          </div>
          <button onClick={() => window.print()} className="mt-4 w-full bg-gray-800 text-white py-2 rounded font-bold">
            Imprimir Ticket en Etiquetera
          </button>
        </div>
      )}
    </div>
  );
}