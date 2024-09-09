import React, { useRef, useState } from 'react';
import { TextureLoader } from 'three';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import ProgressBar from './ProgressBar';

pdfjsLib.GlobalWorkerOptions.workerSrc = '../public/pdf.worker.mjs';

function HandleTextureUpload({ setTextureFront, setTextureBack, setPdfUrl, meshWidth, meshHeight, dpi, triggerUploadFront, triggerUploadBack }) {
  const inputRefFront = useRef();
  const inputRefBack = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);

  const handleTextureUpload = async (event, isFront) => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    const file = event.target.files[0];
    if (!file) {
      setIsUploading(false);
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const imageSrc = reader.result;
        processImage(imageSrc, isFront);
      };
    } else if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      const numPages = pdf.numPages;
      const pages = Array.from({ length: numPages }, (_, index) => index + 1);
      setPdfPages(pages);

      const selected = prompt(`This PDF has ${numPages} pages. Enter the page number you want to upload (1-${numPages}):`, "1");
      const pageNumber = parseInt(selected);

      if (pageNumber > 0 && pageNumber <= numPages) {
        setSelectedPage(pageNumber);
        const page = await pdf.getPage(pageNumber);
        const scale = 10;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        const imageSrc = canvas.toDataURL('image/jpeg');
        processImage(imageSrc, isFront);
      } else {
        alert("Invalid page number.");
        setIsUploading(false);
      }
    } else {
      setIsUploading(false);
    }
  };

  const processImage = (imageSrc, isFront) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const texture = new TextureLoader().load(
        imageSrc,
        () => {
          let loadProgress = 0;
          const interval = setInterval(() => {
            if (loadProgress < 100) {
              loadProgress += 10;
              setProgress(loadProgress);
            } else {
              clearInterval(interval);
              setIsUploading(false);
            }
          }, 100);

          URL.revokeObjectURL(imageSrc);
        }
      );

      const widthInInches = (image.width / dpi) / 2.57143 + (.25);
      const heightInInches = (image.height / dpi) / 2.7 + (.25);

      if (widthInInches > meshWidth + 0.25 || heightInInches > meshHeight + 0.25) {
        alert(`Your image exceeds the print boundary! Your image size is ${widthInInches.toFixed(2)}" x ${heightInInches.toFixed(2)}".\nOur Business card size is ${meshWidth}" x ${meshHeight}" (trimmed).`);
      } else if (widthInInches < meshWidth || heightInInches < meshHeight) {
        alert(`Your image is undersized! Your image size is ${widthInInches.toFixed(2)}" x ${heightInInches.toFixed(2)}".\nOur Business card size is ${meshWidth}" x ${meshHeight}" (trimmed).`);
      } else if (widthInInches == meshWidth + 0.25 || heightInInches == meshHeight + 0.25) {
        alert(`Your image has bleed 👍 Your image size is ${widthInInches.toFixed(2)}" x ${heightInInches.toFixed(2)}".\nOur Business card size is ${meshWidth}" x ${meshHeight}" (trimmed).`);
      }

      if (isFront) {
        setTextureFront({ texture, width: image.width, height: image.height });
      } else {
        setTextureBack({ texture, width: image.width, height: image.height });
      }

      const pdf = new jsPDF({
        orientation: widthInInches > heightInInches ? 'landscape' : 'portrait',
        unit: 'in',
        format: [widthInInches, heightInInches],
      });
      pdf.addImage(imageSrc, 'JPEG', 0, 0, widthInInches, heightInInches);
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    };
  };

  triggerUploadFront.current = () => {
    if (inputRefFront.current) {
      inputRefFront.current.click();
    }
  };

  triggerUploadBack.current = () => {
    if (inputRefBack.current) {
      inputRefBack.current.click();
    }
  };

  return (
    <>
      {isUploading && <ProgressBar progress={progress} />}

      <input
        ref={inputRefFront}
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => handleTextureUpload(e, true)}
        style={{ display: 'none' }}
      />
      <input
        ref={inputRefBack}
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => handleTextureUpload(e, false)}
        style={{ display: 'none' }}
      />
    </>
  );
}

export default HandleTextureUpload;