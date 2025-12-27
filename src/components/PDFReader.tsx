import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFReader.css'; 

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFReaderProps {
  pdfUrl: string;
  initialPage: number;
  onPageChange: (page: number, total: number) => void;
}

const PDFReader: React.FC<PDFReaderProps> = ({ pdfUrl, initialPage, onPageChange }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage || 1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  // Carrega a página salva quando o componente monta ou muda o initialPage
  useEffect(() => {
    setPageNumber(initialPage || 1);
  }, [initialPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error("Erro ao carregar PDF:", err);
    setError("Não foi possível carregar o documento. Verifique sua conexão.");
  }

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      onPageChange(newPage, numPages); // Salva no pai (que chama a API)
    }
  };

  return (
    <div className="pdf-reader-container">
      {/* Controles do PDF */}
      <div className="pdf-controls">
        <button 
            disabled={pageNumber <= 1} 
            onClick={() => changePage(-1)}
            className="control-btn"
        >
          <CaretLeft size={20} /> Anterior
        </button>
        
        <span className="page-info">
           Página {pageNumber} de {numPages || '--'}
        </span>

        <button 
            disabled={pageNumber >= numPages} 
            onClick={() => changePage(1)}
            className="control-btn"
        >
          Próxima <CaretRight size={20} />
        </button>

        <div className="zoom-controls">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
            <span>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>+</button>
        </div>
      </div>

      {/* Área do Documento */}
      <div className="pdf-document-wrapper">
        {error ? (
            <div className="error-message">{error}</div>
        ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading-pdf">Baixando arquivo da Matrix...</div>}
              noData={<div className="loading-pdf">Nenhum PDF encontrado.</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
              />
            </Document>
        )}
      </div>
    </div>
  );
};

export default PDFReader;