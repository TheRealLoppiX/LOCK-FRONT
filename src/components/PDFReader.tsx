import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { CaretLeft, CaretRight, MagnifyingGlassPlus, MagnifyingGlassMinus } from '@phosphor-icons/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFReader.css'; 

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js`;

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

  // Reinicia estados quando muda o PDF
  useEffect(() => {
    setPageNumber(initialPage || 1);
    setError(null);
  }, [initialPage, pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error("Erro PDF Reader:", err);
    // Mensagem amigável para o usuário
    setError("Erro ao carregar o PDF. Verifique a conexão ou se o link é válido.");
  }

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      onPageChange(newPage, numPages);
    }
  };

  return (
    <div className="pdf-reader-container">
      {/* Controles */}
      <div className="pdf-controls">
        <div className="nav-group">
            <button 
                disabled={pageNumber <= 1} 
                onClick={() => changePage(-1)}
                className="control-btn"
            >
              <CaretLeft size={20} />
            </button>
            
            <span className="page-info">
               {pageNumber} / {numPages || '--'}
            </span>

            <button 
                disabled={pageNumber >= numPages} 
                onClick={() => changePage(1)}
                className="control-btn"
            >
              <CaretRight size={20} />
            </button>
        </div>

        <div className="zoom-group">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="zoom-btn">
                <MagnifyingGlassMinus size={18} />
            </button>
            <span className="zoom-info">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} className="zoom-btn">
                <MagnifyingGlassPlus size={18} />
            </button>
        </div>
      </div>

      {/* Visualizador */}
      <div className="pdf-document-wrapper">
        {error ? (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Tentar Novamente
                </button>
            </div>
        ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading-pdf">Carregando PDF...</div>}
              noData={<div className="loading-pdf">PDF não encontrado.</div>}
              // Opções extras para evitar CORS no arquivo PDF em si
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@4.4.168/cmaps/`,
                cMapPacked: true,
              }}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale} 
                renderTextLayer={false} 
                renderAnnotationLayer={false}
                className="pdf-page"
              />
            </Document>
        )}
      </div>
    </div>
  );
};

export default PDFReader;