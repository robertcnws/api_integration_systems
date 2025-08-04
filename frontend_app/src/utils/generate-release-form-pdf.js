import 'jspdf-autotable';
import { jsPDF as JsPDF } from 'jspdf';

import { fDate, fDateTime } from './format-time';
import logoBase64 from '../../public/files/color_white_background/icon_with_text/NWS-HOME-REPORT.png';

export const generateReleaseFormReport = ({ project }) => {
    const doc = new JsPDF();
    const margin = 2;
    const logoWidth = 25;
    const logoHeight = 15;

    doc.addImage(logoBase64, 'PNG', margin, margin, logoWidth, logoHeight);

    // Title

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("NEW WINDOW SYSTEM", 170, 10, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("INSTALLATION FINAL RELEASE FORM", 105, 25, null, null, "center");

    // Project Details
    
    doc.setFontSize(12);

    const customerName = (project?.salesOrder?.customer || project?.salesOrder?.contact_person_details)?.customer_name || project?.salesOrder?.customer_name;

    const details = [
        ["CUSTOMER NAME:", customerName || ""],
        ["ORDER NUMBER:", project?.salesOrder?.salesorder_number || ""],
        ["DATE:", fDate(project?.salesOrder?.date) || ""],
        ["ADDRESS:", project?.address || ""],
        ["CONTACT PHONE:", (project?.salesOrder?.customer || project?.salesOrder?.contact_person_details)?.phone || ""],
    ];
    doc.autoTable({
        startY: 30,
        body: details,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
    });

    // Checklist Table
    doc.text("PLEASE MARK IF THE FOLLOWING HAS BEEN COMPLETED:", 14, doc.lastAutoTable.finalY + 10);

    const checklist = [
        [project?.allProductsMarked, "All Products (Windows, doors, hardware, screens) are installed and working properly."],
        [project?.allWindowsMarked, "All windows hardware/screens are installed and working properly."],
        [project?.allScrewMarked, "All screw covers/caps are installed on ALL window(s)/door(s)."],
        [project?.allTrashMarked, "All trash has been removed."],
    ];

    // Draw Table with Checkboxes
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [["", "Installation Checklist"]],
        body: checklist.map(([checked, text]) => [
            checked ? "X" : " ",
            text,
        ]),
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 180 },
        },
        margin: { left: 10, right: 10 },
        theme: "grid",
    });

    // Feedback Section
    doc.text("FEEDBACK:", 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        body: [[project?.feedback || "No feedback provided."]],
        styles: { fontSize: 11, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 180 },
        },
    });

    const autoFillUnderscoard = (text, width) => {
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const spaces = Math.floor((width - textWidth) / 3);
        return '_'.repeat(spaces);
    }

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Customer Name & Signature:", "Date Signed:"]],
        body: [[`${customerName} ${autoFillUnderscoard(customerName, 150)}`, fDate(new Date())]],
        styles: { fontSize: 11, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 150 },
            1: { cellWidth: 40, halign: "center" },
        },
        margin: { left: 10, right: 10 },
        theme: "grid",
    });

    // Disclaimer
    doc.setFontSize(9);

    const firstText = doc.splitTextToSize(
        "By Signing this you agree there are no installation issues pending, the customer(s) above have inspected the window(s)/door(s) for quality of product, completeness of order, quality of installation performed and agree all the marked items above have been completed in a satisfactory manner.",
        180 
    );

    doc.text(firstText, 102, doc.lastAutoTable.finalY + 45, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    const secondText = doc.splitTextToSize(
        "PLEASE DO NOT SIGN THIS DOCUMENT IF YOU HAVE ANY PENDING INSTALLATION/PRODUCT ISSUES.",
        180
    );
    doc.text(secondText, 102, doc.lastAutoTable.finalY + 42, { align: "center" });

    // Save PDF

    doc.save(`Installation_Final_Release_Form_${fDateTime(new Date(), 'YYYY_MM_DD_HH_mm_ss')}.pdf`);

    const pdfBlob = doc.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);

    window.open(blobUrl, '_blank');
}
