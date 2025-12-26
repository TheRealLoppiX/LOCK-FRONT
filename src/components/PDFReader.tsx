import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { CaretLeft, CaretRight, BookmarkSimple } from '@phosphor-icons/react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './PDFReader.css'; // Vamos criar abaixo

// Configuração do Worker (Obrigatório para o react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFReaderProps {
  pdfUrl: string;
  initialPage: number;
  onPageChange: (page: number, total: number) => void;
}

const PDFReader: React.FC<PDFReaderProps> = ({ pdfUrl, initialPage, onPageChange }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage || 1);
  const [scale, setScale] = useState(1.0);

  // Carrega a página salva quando o componente monta
  useEffect(() => {
    setPageNumber(initialPage || 1);
  }, [initialPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
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
      <div className="pdf-controls">
        <button disabled={pageNumber <= 1} onClick={() => changePage(-1)}>
          <CaretLeft /> Anterior
        </button>
        
        <span className="page-info">
           Página {pageNumber} de {numPages}
        </span>

        <button disabled={pageNumber >= numPages} onClick={() => changePage(1)}>
          Próxima <CaretRight />
        </button>

        <div className="zoom-controls">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
            <span>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>+</button>
        </div>
      </div>

      <div className="pdf-document-wrapper">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="loading-pdf">Decriptando arquivo...</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={false} 
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFReader;