import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import {
  degrees, grayscale, PDFDocument, rgb, StandardFonts,
} from 'pdf-lib';
import download from 'downloadjs';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [pdf, setPDF] = useState<string>();

  const getPDF = async () => {
    const cmInPx = 37.795275591;
    // const abntSuperiorMargin = 3 * cmInPx;
    // const abntInferiorMargin = 2 * cmInPx;
    // const abntRightMargin = 2 * cmInPx;
    const abntLeftMargin = 3 * cmInPx;

    const fontSize = 24;
    const headerHeight = 50;

    const url = 'https://firebasestorage.googleapis.com/v0/b/cientelive.appspot.com/o/paperFinalVersion%2F5925e4da-35fe-4400-b6cb-c341749805dc.pdf?alt=media&token=a04c3c52-5a16-46a6-9fa6-9b1a3598990a';
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Courier);

    const pages = pdfDoc.getPages();

    // Fetch image
    const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png';
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const image = await pdfDoc.embedPng(imageBytes);
    const imageDims = {
      width: 25,
      height: 25,
    };

    // eslint-disable-next-line array-callback-return
    pages.map((page, index) => {
      if (index === 0) return;

      const { width, height } = page.getSize();

      // ==== HEADER ====
      page.drawRectangle({
        x: 0,
        y: height - headerHeight,
        width,
        height: headerHeight,
        rotate: degrees(0),
        borderWidth: 0,
        borderColor: grayscale(0),
        color: rgb(1, 0, 1),
        opacity: 1,
        borderOpacity: 1,
      });

      page.drawImage(image, {
        x: 20,
        y: height - ((headerHeight / 2) + imageDims.height / 2),
        width: imageDims.width,
        height: imageDims.height,
      });

      page.drawText('Esse é o header modificado', {
        x: abntLeftMargin,
        y: height - (headerHeight / 2) - (fontSize / 2) + 1,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0), // black
      });
      // ==== HEADER ====

      // ==== FOOTER ====
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: headerHeight,
        rotate: degrees(0),
        borderWidth: 0,
        borderColor: grayscale(0),
        color: rgb(1, 0, 0),
        opacity: 1,
        borderOpacity: 1,
      });

      page.drawText('Esse é o footer', {
        x: abntLeftMargin,
        y: (headerHeight / 2) - (fontSize / 2) + 1,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0), // black
      });

      page.drawText(`${index}`, {
        x: width - 100,
        y: (headerHeight / 2) - (fontSize / 2) + 1,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0), // black
      });
      // ==== FOOTER ====
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  };

  const displayPDF = async () => {
    const pdfdData = await getPDF().then((res) => res);

    const blob = new Blob([pdfdData], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    setPDF(blobUrl);
  };

  const downloadPDF = async () => {
    const pdfdData = await getPDF().then((res) => res);

    download(pdfdData, 'pdf-lib_modification_example.pdf', 'application/pdf');
  };

  useEffect(() => { displayPDF(); }, []);

  return (
    <div className={styles.container}>
      <h1>Softaliza - Test PDF Edit</h1>
      <div className={styles.main}>
        <iframe
          title="PDF"
          src={pdf}
          width="80%"
          height="100%"
        />
        <button
          type="button"
          className={styles.downloadButton}
          onClick={() => downloadPDF()}
        >
          Baixar pdf
        </button>
      </div>
    </div>
  );
};

export default Home;
