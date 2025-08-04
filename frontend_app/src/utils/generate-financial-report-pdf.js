import 'jspdf-autotable';
import { jsPDF as JsPDF } from 'jspdf';

import { fDateTime } from './format-time';
import { fCurrency } from './format-number';
import logoBase64 from '../../public/files/color_white_background/icon_with_text/NWS-HOME-REPORT.png';


export const generateFinancialReport = ({ reportData }) => {
    const doc = new JsPDF();

    const margin = 2;
    const logoWidth = 25;
    const logoHeight = 15;
    const columnSpacing = 105;

    doc.addImage(logoBase64, 'PNG', margin, margin, logoWidth, logoHeight);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("NEW WINDOW SYSTEM", 170, 10, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`FINANCIAL REPORT: ${reportData?.project?.name}`, 105, 25, null, null, "center");


    // Project Details
    doc.setFontSize(12);
    const salesOrderDetails = [
        [
            { content: "" },
            { content: "Total", styles: { halign: 'center' } }
        ],
        [
            { content: "Windows & Doors Installed in this project" },
            { content: fCurrency(reportData?.salesOrder?.totalItems) || "", styles: { halign: 'center' } }
        ],
        [
            { content: "Installation sell and structural modifications" },
            { content: fCurrency(reportData?.salesOrder?.totalInstallation) || "", styles: { halign: 'center' } }
        ],
        [
            { content: "Permits, Fee, Design, etc." },
            { content: fCurrency(reportData?.salesOrder?.totalOthers) || "", styles: { halign: 'center' } }
        ],
        [
            { content: "SUBTOTAL", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency(reportData?.salesOrder?.subTotalSalesOrder) || "", styles: { halign: 'center', fontStyle: 'bold' } }
        ],
        [
            { content: "TAXES", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency(reportData?.salesOrder?.taxTotalSalesOrder) || "", styles: { halign: 'center', fontStyle: 'bold' } }
        ],
        [
            { content: "TOTAL", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency(reportData?.salesOrder?.totalSalesOrder) || "", styles: { halign: 'center', fontStyle: 'bold' } }
        ],
    ];

    doc.autoTable({
        startY: 30,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "SELL PRICES", colSpan: 2, styles: { halign: 'center' } }
        ]],
        body: salesOrderDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 52 },
            1: { cellWidth: 48 },
        },
    });

    const salesOrderFinalX = doc.internal.pageSize.width / 2 + 10;
    const firstTableHeight = doc.lastAutoTable.finalY;

    const installationDetails = [
        [
            { content: "" },
            { content: "Total", styles: { halign: 'center' } }
        ],
        [
            { content: "Subcontractors for the project" },
            { content: fCurrency((-1) * reportData.installation.totalSubcontractor) || "", styles: { halign: 'center', textColor: 'red' } }
        ],
        [
            { content: "Construction materials for the project" },
            { content: fCurrency((-1) * reportData.installation.totalMaterials) || "", styles: { halign: 'center', textColor: 'red' } }
        ],
        [
            { content: "" },
            { content: "" }
        ],
        [
            { content: "SUBTOTAL", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency((-1) * reportData.installation.totalInstalling) || "", styles: { halign: 'center', fontStyle: 'bold', textColor: 'red' } }
        ],
        [
            { content: "TAXES", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency(0) || "", styles: { halign: 'center', fontStyle: 'bold', textColor: 'red' } }
        ],
        [
            { content: "TOTAL", styles: { halign: 'right', fontStyle: 'bold' } },
            { content: fCurrency((-1) * reportData.installation.totalInstalling) || "", styles: { halign: 'center', fontStyle: 'bold', textColor: 'red' } }
        ],
    ];


    doc.autoTable({
        startY: 30,
        margin: { left: salesOrderFinalX - 10 },
        head: [[
            { content: "INSTALLATION COSTS", colSpan: 2, styles: { halign: 'center' } }
        ]],
        body: installationDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 52 },
            1: { cellWidth: 48 },
        },
    });


    const label = "INSTALLATION PROFIT: ";
    const value = fCurrency(reportData?.diff);
    
    doc.setFontSize(14);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); 
    const labelWidth = doc.getTextWidth(label);
    
    doc.setFont('helvetica', 'bold');
    if (reportData?.diff > 0) {
        doc.setTextColor(0, 128, 0); 
    } else {
        doc.setTextColor(255, 0, 0); 
    }
    const valueWidth = doc.getTextWidth(value);
    
    const totalWidth = labelWidth + valueWidth;
    const centerX = 160; 
    const startX = centerX - totalWidth / 2;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(label, startX, firstTableHeight + 10);
    
    doc.setFont('helvetica', 'bold');
    if (reportData?.diff > 0) {
        doc.setTextColor(0, 128, 0);
    } else {
        doc.setTextColor(255, 0, 0);
    }
    doc.text(value, startX + labelWidth + 5, firstTableHeight + 10);




    // doc.setFontSize(14);
    // if (reportData?.diff > 0) {
    //     doc.setTextColor(0, 128, 0);
    // } else {
    //     doc.setTextColor(255, 0, 0);
    // }
    // doc.text(`DIFF: ${fCurrency(reportData?.diff)}`, 200, firstTableHeight + 10, null, null, "right");


    doc.save(`Financial_Report_${fDateTime(new Date(), 'YYYY_MM_DD_HH_mm_ss')}.pdf`);

    const pdfBlob = doc.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);

    window.open(blobUrl, '_blank');
}
