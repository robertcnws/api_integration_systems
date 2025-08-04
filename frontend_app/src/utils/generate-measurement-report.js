import 'jspdf-autotable';
import { jsPDF as JsPDF } from 'jspdf';

import { fDate, fDateTime } from './format-time';
import logoBase64 from '../../public/files/color_white_background/icon_with_text/NWS-HOME-REPORT.png';

export const generateMeasurementReport = ({ measurement, empty }) => {
    const doc = new JsPDF();

    const margin = 2;
    const logoWidth = 25;
    const logoHeight = 15;

    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    doc.addImage(logoBase64, 'PNG', margin, margin, logoWidth, logoHeight);

    // Title
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("NWS HOMES", 190, 7, null, null, "center");
    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.text("(305) 851-5798", 190, 13, null, null, "center");
    doc.setFont("helvetica", "italic");
    doc.text("9373 SW 56TH ST MIAMI FL 33165", 170, 19, null, null, "center");
    doc.setFont("helvetica", "normal");


    const pageWidth = doc.internal.pageSize.getWidth();
    const lineY = 22;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(
        margin - 2,
        lineY,
        pageWidth - margin + 2,
        lineY
    );

    // Project Details
    const initialReportY = 9;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Client Name:", margin + 15, lineY + initialReportY, null, null, "center");
    if (!empty) {
        doc.setFont("helvetica", "normal");
        const clientName = measurement?.salesOrder?.customer_name || measurement?.customer?.name || 'N/A';
        doc.text(clientName, margin + 31, lineY + initialReportY, null, null, "left");
    }
    doc.line(
        margin + 28,
        lineY + initialReportY + 1,
        pageWidth * 0.6,
        lineY + initialReportY + 1
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", margin + (pageWidth * 0.6) + 14, lineY + initialReportY, null, null, "center");
    if (!empty) {
        doc.setFont("helvetica", "normal");
        const phoneNumber = (measurement?.salesOrder?.customer || measurement?.salesOrder?.contact_person_details)?.phone ||
            (measurement?.salesOrder?.customer || measurement?.salesOrder?.contact_person_details)?.mobile ||
            measurement?.phone || measurement?.customer?.phone || 'N/A';
        doc.text(phoneNumber, margin + (pageWidth * 0.6) + 25, lineY + initialReportY, null, null, "left");
    }
    doc.line(
        margin + (pageWidth * 0.6) + 22,
        lineY + initialReportY + 1,
        pageWidth - margin - 1,
        lineY + initialReportY + 1
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Address:", margin + 11, lineY + initialReportY + 10, null, null, "center");
    if (!empty) {
        doc.setFont("helvetica", "normal");
        const address = measurement?.address || 'N/A';
        doc.text(address, margin + 24, lineY + initialReportY + 10, null, null, "left");
    }
    doc.line(
        margin + 21,
        lineY + initialReportY + 11,
        pageWidth * 0.985,
        lineY + initialReportY + 11
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Date & Time:", margin + 15, lineY + initialReportY + 20, null, null, "center");
    if (!empty) {
        doc.setFont("helvetica", "normal");
        let date = 'N/A';
        if (measurement?.checkDate || measurement?.firstDate) {
            date = `${fDate(measurement?.checkDate || measurement?.firstDate)} 08:00 AM` || 'N/A';
        }
        doc.text(date, margin + 31, lineY + initialReportY + 20, null, null, "left");
    }
    doc.line(
        margin + 28,
        lineY + initialReportY + 21,
        pageWidth * 0.6,
        lineY + initialReportY + 21
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Color:", margin + (pageWidth * 0.6) + 14, lineY + initialReportY + 20, null, null, "center");
    if (!empty) {
        doc.setFont("helvetica", "normal");
        const date = measurement?.color?.name || 'N/A';
        doc.text(date, margin + (pageWidth * 0.6) + 25, lineY + initialReportY + 20, null, null, "left");
    }
    doc.line(
        margin + (pageWidth * 0.6) + 22,
        lineY + initialReportY + 21,
        pageWidth - margin - 1,
        lineY + initialReportY + 21
    );

    doc.line(
        margin - 2,
        lineY + initialReportY + 29,
        pageWidth - margin + 2,
        lineY + initialReportY + 29,
    );

    // Table Header
    const tableHeaderY = lineY + initialReportY + 33;

    const statusDetails = []

    if (!empty) {
        measurement?.marks?.forEach((item, index) => {
            const mark = ABC[index] || 'N/A';
            const type = item?.type || '';
            const config = item?.config || '';
            const width = item?.dimensions?.[0] || '';
            const height = item?.dimensions?.[1] || '';
            const notes = item?.notes || '';

            statusDetails.push([
                { content: mark, styles: { fontSize: 10 } },
                { content: type, styles: { fontSize: 10 } },
                { content: config, styles: { fontSize: 10 } },
                { content: width, styles: { fontSize: 10 } },
                { content: height, styles: { fontSize: 10 } },
                { content: notes, styles: { fontSize: 10 } },
            ])
        })
    }
    else {
        ABC.split('').forEach((item, index) => {
            const mark = item || 'N/A';
            const type = '';
            const config = '';
            const width = '';
            const height = '';
            const notes = '';

            statusDetails.push([
                { content: mark, styles: { fontSize: 10 } },
                { content: type, styles: { fontSize: 10 } },
                { content: config, styles: { fontSize: 10 } },
                { content: width, styles: { fontSize: 10 } },
                { content: height, styles: { fontSize: 10 } },
                { content: notes, styles: { fontSize: 10 } },
            ])
        });
    }

    doc.autoTable({
        startY: tableHeaderY,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [
            [
                { content: 'MARK', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
                { content: 'TYPE', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
                { content: 'CONFIG', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
                { content: 'WIDTH', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
                { content: 'HEIGHT', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
                { content: 'NOTES', styles: { fontStyle: 'bold', fontSize: 10, halign: 'center' } },
            ],
            [
                { content: '', styles: { fontSize: 6, halign: 'center' } },
                { content: 'HR-SH-CAS-FIX-FD-SGD', styles: { fontSize: 6, halign: 'center' } },
                { content: 'XX-OXO-HR-HL', styles: { fontSize: 6, halign: 'center' } },
                { content: 'INCHES', styles: { fontSize: 6, halign: 'center' } },
                { content: 'INCHES', styles: { fontSize: 6, halign: 'center' } },
                { content: '', styles: { fontSize: 6, halign: 'center' } },
            ]
        ],
        body: statusDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 23.3, halign: 'center' },
            1: { cellWidth: 37.3, halign: 'left' },
            2: { cellWidth: 35.3, halign: 'left' },
            3: { cellWidth: 30.3, halign: 'center' },
            4: { cellWidth: 30.3, halign: 'center' },
            5: { cellWidth: 43.4, halign: 'left' },
        },
    });

    // General Notes

    const generalNotesY = tableHeaderY + (statusDetails.length + 1) * 10 + 7;
    
    const usableWidth = pageWidth - margin * 2 - 10; 
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('General Notes:', margin + 5, generalNotesY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const generalNotes = !empty
        ? (measurement.generalNotes || 'N/A')
        : '';

    doc.text(
        generalNotes,
        margin + 5,
        generalNotesY + 10,
        {
            maxWidth: usableWidth,
            align: 'justify'
        }
    );


    // Save PDF

    doc.save(`Measurement_Form_${!empty ? measurement?.number : 'Empty'}_${fDateTime(new Date(), 'YYYY_MM_DD_HH_mm_ss')}.pdf`);

    const pdfBlob = doc.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);

    window.open(blobUrl, '_blank');
}
