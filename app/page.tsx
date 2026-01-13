"use client";

import { useState } from "react";

type Matrix = number[][];

export default function MatrixCalculator() {
  const [rowsA, setRowsA] = useState<number>(2);
  const [colsA, setColsA] = useState<number>(2);
  const [rowsB, setRowsB] = useState<number>(2);
  const [colsB, setColsB] = useState<number>(2);

  const [A, setA] = useState<Matrix>([]);
  const [B, setB] = useState<Matrix>([]);
  const [result, setResult] = useState<Matrix | null>(null);
  const [error, setError] = useState<string>("");

  const generateMatrices = () => {
    if (colsA !== rowsB) {
      setError("Les colonnes de A doivent être égales aux lignes de B.");
      return;
    }

    setError("");
    setResult(null);

    setA(Array.from({ length: rowsA }, () => Array(colsA).fill(0)));
    setB(Array.from({ length: rowsB }, () => Array(colsB).fill(0)));
  };

  const updateMatrix = (
    matrix: Matrix,
    setMatrix: React.Dispatch<React.SetStateAction<Matrix>>,
    i: number,
    j: number,
    value: number
  ) => {
    const copy = matrix.map(row => [...row]);
    copy[i][j] = value;
    setMatrix(copy);
  };

  const multiply = () => {
    const res: Matrix = Array.from({ length: rowsA }, () =>
      Array(colsB).fill(0)
    );

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          res[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    setResult(res);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
         Calculatrice de Produit Matriciel
      </h1>

      {/* Dimensions */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <DimensionBlock
          title="Matrice A"
          rows={rowsA}
          cols={colsA}
          setRows={setRowsA}
          setCols={setColsA}
        />
        <DimensionBlock
          title="Matrice B"
          rows={rowsB}
          cols={colsB}
          setRows={setRowsB}
          setCols={setColsB}
        />
      </div>

      <div className="text-center mt-6">
        <button
          onClick={generateMatrices}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Générer les matrices
        </button>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      {/* Matrices */}
      <div className="flex flex-col md:flex-row justify-center gap-10 mt-10">
        {A.length > 0 && (
          <MatrixUI title="A" matrix={A} setMatrix={setA} update={updateMatrix} />
        )}
        {B.length > 0 && (
          <MatrixUI title="B" matrix={B} setMatrix={setB} update={updateMatrix} />
        )}
      </div>

      {/* Calcul */}
      {A.length > 0 && B.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={multiply}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Calculer A × B
          </button>
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-semibold mb-4">Résultat</h2>
          <MatrixUI matrix={result} readOnly />
        </div>
      )}
    </main>
  );
}

/* ================= COMPONENTS ================= */

type DimensionProps = {
  title: string;
  rows: number;
  cols: number;
  setRows: (v: number) => void;
  setCols: (v: number) => void;
};

function DimensionBlock({
  title,
  rows,
  cols,
  setRows,
  setCols,
}: DimensionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="flex gap-4">
        <input
          type="number"
          min={1}
          value={rows}
          onChange={e => setRows(+e.target.value)}
          className="w-20 border rounded px-2 py-1"
          placeholder="Lignes"
        />
        <input
          type="number"
          min={1}
          value={cols}
          onChange={e => setCols(+e.target.value)}
          className="w-24 border rounded px-2 py-1"
          placeholder="Colonnes"
        />
      </div>
    </div>
  );
}

type MatrixProps = {
  title?: string;
  matrix: Matrix;
  setMatrix?: React.Dispatch<React.SetStateAction<Matrix>>;
  update?: (
    matrix: Matrix,
    setMatrix: React.Dispatch<React.SetStateAction<Matrix>>,
    i: number,
    j: number,
    value: number
  ) => void;
  readOnly?: boolean;
};

function MatrixUI({
  title,
  matrix,
  setMatrix,
  update,
  readOnly = false,
}: MatrixProps) {
  return (
    <div>
      {title && <h3 className="font-semibold mb-2 text-center">Matrice {title}</h3>}
      <div className="inline-block bg-white p-4 rounded-xl shadow">
        {matrix.map((row, i) => (
          <div key={i} className="flex">
            {row.map((val, j) => (
              <input
                key={j}
                type="number"
                value={val}
                disabled={readOnly}
                onChange={e =>
                  update &&
                  setMatrix &&
                  update(matrix, setMatrix, i, j, +e.target.value)
                }
                className="w-14 h-10 m-1 text-center border rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
