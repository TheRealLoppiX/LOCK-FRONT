import React from 'react';
import HexagonBackground from '../components/hexagonobg';
import './FormViewer.css';

interface FormViewerProps {
  src: string;
  title: string;
}

const FormViewer: React.FC<FormViewerProps> = ({ src, title }) => {
  return (
    <div className="form-viewer-container">
      <HexagonBackground />
      <div className="form-viewer-header">
        <h1>{title}</h1>
        <p>Este é um questionário externo incorporado via Google Forms.</p>
      </div>
      <div className="form-viewer-frame-container">
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title={title}
        >
          Carregando…
        </iframe>
      </div>
    </div>
  );
};

export default FormViewer;