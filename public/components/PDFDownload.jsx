import React, { useState } from 'react';

function PDFDownload({ pdfUrl }) {
  const [pdfName, setPdfName] = useState('converted_image');

  return (
    <div>
      <input
        className='pdf-name-input'
        type="text"
        placeholder="Enter PDF name"
        value={pdfName}
        onChange={(e) => setPdfName(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
        disabled={!pdfUrl}
      />
      <a
        className='pdf-download-button'
        href={pdfUrl || '#'}
        download={pdfUrl ? `${pdfName}.pdf` : undefined}
        style={{
          textTransform: 'uppercase',
          textAlign: 'center',
          display: 'block',
          padding: '10px',
          background: pdfUrl ? '#4CAF50' : '#ccc',
          color: '#fff',
          borderRadius: '5px',
          textDecoration: 'none',
          pointerEvents: pdfUrl ? 'auto' : 'none',
          cursor: pdfUrl ? 'pointer' : 'default',
        }}
      >
        Download PDF
      </a>
    </div>
  );
}

export default PDFDownload;