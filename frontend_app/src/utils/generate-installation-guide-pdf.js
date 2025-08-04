import 'jspdf-autotable';
import { jsPDF as JsPDF } from 'jspdf';

import { CONFIG } from 'src/config-global';

import { fCurrency } from './format-number';
import { fDate, fDateTime } from './format-time';
import { filteredDescriptionJson } from './project-tasks-utils';
import logoBase64 from '../../public/files/color_white_background/icon_with_text/NWS-HOME-REPORT.png';


export const generateInstallationGuideFormReport = ({ currentProject, userLogged }) => {
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
    doc.text("INSTALLATION ORDER GUIDE", 105, 25, null, null, "center");

    const customerName = currentProject?.salesOrder?.customer?.customer_name || currentProject?.salesOrder?.customer_name || "";
    const customerEmail = currentProject?.salesOrder?.customer?.email || "";
    const customerPhone = currentProject?.salesOrder?.customer?.phone || currentProject?.salesOrder?.customer?.mobile || "";
    // Project Details
    doc.setFontSize(12);
    const salesOrderDetails = [
        [{ content: "SO #:", styles: { fontStyle: 'bold' } }, currentProject?.salesOrder.salesorder_number || ""],
        [{ content: "DATE:", styles: { fontStyle: 'bold' } }, fDate(currentProject?.salesOrder.date) || ""],
        [{ content: "CUSTOMER:", styles: { fontStyle: 'bold' } }, customerName],
        [{ content: "PHONE:", styles: { fontStyle: 'bold' } }, customerPhone],
        [{ content: "EMAIL:", styles: { fontStyle: 'bold' } }, customerEmail],

    ];

    doc.autoTable({
        startY: 30,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "SALES ORDER DETAILS", colSpan: 2, styles: { halign: 'center' } }
        ]],
        body: salesOrderDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 58 },
        },
    });

    const salesOrderFinalX = doc.internal.pageSize.width / 2 + 10;
    const firstTableHeight = doc.lastAutoTable.finalY;

    const workOrderDetails = [
        [{ content: "INSTALLATION DATE:", styles: { fontStyle: 'bold' } }, fDate(currentProject?.startDate) || ""],
        [{ content: "PACKED:", styles: { fontStyle: 'bold' } }, ""],
        [{ content: "HAS PERMIT?:", styles: { fontStyle: 'bold' } }, currentProject?.hasPermission ? "YES" : "NO"],
        [{ content: "INSTALLATION ADDRESS:", styles: { fontStyle: 'bold' } }, currentProject?.address ? currentProject?.address : ""],
        []
    ];


    doc.autoTable({
        startY: 30,
        margin: { left: salesOrderFinalX - 25 },
        head: [[
            { content: "WORK ORDER DETAILS", colSpan: 2, styles: { halign: 'center' } }
        ]],
        body: workOrderDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 54 },
            1: { cellWidth: 60 },
        },
    });

    const secondTableHeight = doc.lastAutoTable.finalY;

    const statusDetails = [
        [
            { content: CONFIG.stages.preparation.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
            { content: CONFIG.stages.coordination.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
            { content: CONFIG.stages.installation.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
            { content: CONFIG.stages.permission.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
            { content: CONFIG.stages.closing.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
            { content: CONFIG.stages.finished.toUpperCase(), styles: { fontStyle: 'bold', fontSize: 10 } },
        ],
        [
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.preparation.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 }
            },
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.coordination.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 },
            },
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.installation.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 },
            },
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.permission.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 }
            },
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.closing.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 }
            },
            {
                content: currentProject?.currentStage?.name.toLowerCase().indexOf(CONFIG.stages.finished.toLowerCase()) !== -1 ? "X" : "",
                styles: { fontStyle: 'bold', fontSize: 10 }
            },
        ],
    ]

    doc.autoTable({
        startY: secondTableHeight,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "STATUS", colSpan: 6, styles: { halign: 'center' } }
        ]],
        body: statusDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 33.3, halign: 'center' },
            1: { cellWidth: 33.4, halign: 'center' },
            2: { cellWidth: 33.3, halign: 'center' },
            3: { cellWidth: 33.3, halign: 'center' },
            4: { cellWidth: 33.3, halign: 'center' },
            5: { cellWidth: 33.3, halign: 'center' },
        },
    });

    const thirdTableHeight = doc.lastAutoTable.finalY;

    const workScopeDetails = [
        [{ content: "WORK SCOPE & DESCRIPTION:", styles: { fontStyle: 'bold' } }, currentProject?.workScope || ""],
    ];


    doc.autoTable({
        startY: thirdTableHeight + 0.5,
        startX: margin + 5,
        margin: { left: margin + 3 },
        body: workScopeDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2, minCellHeight: 25 },
        columnStyles: {
            0: { cellWidth: 65 },
            1: { cellWidth: 135 },
        },
    });

    const fourTableHeight = doc.lastAutoTable.finalY;

    const totalProducts = currentProject?.projectGuideProducts?.reduce((acc, product) => acc + product.price * product.quantity, 0);

    let productsGuideDetails = currentProject?.projectGuideProducts?.map((product) => [
        { content: product.name, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: fCurrency(product.price), styles: { halign: 'left' } },
        { content: product.quantity, styles: { halign: 'center' } },
        { content: fCurrency(product.price * product.quantity), styles: { halign: 'left' } },
        { content: product.notes, styles: { halign: 'left' } },
    ]) || [];

    productsGuideDetails = [
        ...productsGuideDetails,
        [
            { content: "TOTALS:", colSpan: 3, styles: { halign: 'left', fontStyle: 'bold' } },
            { content: fCurrency(totalProducts), styles: { halign: 'left', fontStyle: 'bold' } },
            { content: "", styles: { halign: 'center', fontStyle: 'bold' } },
        ]
    ]

    doc.autoTable({
        startY: fourTableHeight,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "", styles: { halign: 'left' } },
            { content: "PAY PER UNIT", styles: { halign: 'left', fontStyle: 'bold' } },
            { content: "QTY", styles: { halign: 'center', fontStyle: 'bold' } },
            { content: "TOTAL", styles: { halign: 'left', fontStyle: 'bold' } },
            { content: "NOTES", styles: { halign: 'left', fontStyle: 'bold' } },
        ]],
        body: productsGuideDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 65, halign: 'left' },
            1: { cellWidth: 30, halign: 'left' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25, halign: 'left' },
            4: { cellWidth: 60, halign: 'left' },
        },
    });

    doc.addPage();
    doc.addImage(logoBase64, 'PNG', margin, margin, logoWidth, logoHeight);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("NEW WINDOW SYSTEM", 170, 10, null, null, "center");
    doc.setFont("helvetica", "normal");

    doc.setFontSize(12);

    const totalMaterials = currentProject?.projectMaterials?.reduce((acc, product) => acc + (product.quantity * product.cost), 0);

    let materialsDetails = currentProject?.projectMaterials?.map((product) => [
        { content: product.name, styles: { halign: 'left', fontStyle: 'bold' } },
        { content: product.quantity, styles: { halign: 'center' } },
        // { content: product.ticket, styles: { halign: 'left' } },
        { content: fCurrency(product.cost), styles: { halign: 'left' } },
        // { content: product.store, styles: { halign: 'left' } },
        { content: product.notes, styles: { halign: 'left' } },
    ]) || [];

    materialsDetails = [
        ...materialsDetails,
        [
            { content: "TOTALS:", colSpan: 2, styles: { halign: 'left', fontStyle: 'bold' } },
            { content: fCurrency(totalMaterials), styles: { halign: 'left', fontStyle: 'bold' } },
            // { content: "", styles: { halign: 'center', fontStyle: 'bold' } },
            { content: "", styles: { halign: 'center', fontStyle: 'bold' } },
        ]
    ]

    doc.autoTable({
        startY: 30,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "MATERIALS", colSpan: 7, styles: { halign: 'center' } }
        ]],
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 200, halign: 'center' },
        },
    });

    const fifthTableHeight = doc.lastAutoTable.finalY;

    doc.autoTable({
        startY: fifthTableHeight,
        startX: margin + 5,
        margin: { left: margin + 3 },
        head: [[
            { content: "NAME", styles: { halign: 'left' } },
            { content: "QTY", styles: { halign: 'center', fontStyle: 'bold' } },
            // { content: "TICKET", styles: { halign: 'left', fontStyle: 'bold' } },
            { content: "COST", styles: { halign: 'left', fontStyle: 'bold' } },
            // { content: "STORE", styles: { halign: 'left', fontStyle: 'bold' } },
            { content: "NOTES", styles: { halign: 'left', fontStyle: 'bold' } },
        ]],
        body: materialsDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 65, halign: 'left' },
            1: { cellWidth: 25, halign: 'center' },
            // 2: { cellWidth: 25, halign: 'left' },
            2: { cellWidth: 30, halign: 'left' },
            // 4: { cellWidth: 25, halign: 'left' },
            3: { cellWidth: 80, halign: 'left' },
        }
    });

    const sixthTableHeight = doc.lastAutoTable.finalY;

    const otherNotesDetails = [
        [{ content: "OTHER NOTES:", styles: { fontStyle: 'bold' } }, currentProject?.projectMaterialsOtherNotes || ""],
    ];


    doc.autoTable({
        startY: sixthTableHeight,
        startX: margin + 5,
        margin: { left: margin + 3 },
        body: otherNotesDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2, minCellHeight: 100 },
        columnStyles: {
            0: { cellWidth: 65 },
            1: { cellWidth: 135 },
        },
    });

    const seventhTableHeight = doc.lastAutoTable.finalY;

    const preparedByDetails = [
        [
            {
                content: "PREPARED BY:", styles: { fontStyle: 'bold' }
            },
            `${userLogged?.data.first_name} ${userLogged?.data.last_name}` || ""],
    ];

    doc.autoTable({
        startY: seventhTableHeight,
        startX: margin + 5,
        margin: { left: margin + 3 },
        body: preparedByDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2, minCellHeight: 25 },
        columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 50 },
        },
    });

    const preparedByFinalX = doc.internal.pageSize.width / 2 + 10;

    const aprovedByDetails = [
        [{ content: "APROVED BY:", styles: { fontStyle: 'bold' } }, ""],
    ];


    doc.autoTable({
        startY: seventhTableHeight,
        margin: { left: preparedByFinalX - 25 },
        body: aprovedByDetails,
        theme: "grid",
        styles: { fontSize: 11, cellPadding: 2, minCellHeight: 25 },
        columnStyles: {
            0: { cellWidth: 55 },
            1: { cellWidth: 60 },
        },
    });


    doc.save(`Installation_Guide_${fDateTime(new Date(), 'YYYY_MM_DD_HH_mm_ss')}.pdf`);

    const pdfBlob = doc.output('blob');

    const blobUrl = URL.createObjectURL(pdfBlob);

    window.open(blobUrl, '_blank');
}

export const createScopeArray = ({ listItems, loadedDefaultGuideProducts }) => {
    const scopeArray = loadedDefaultGuideProducts?.map((item) => ({
        id: item.order,
        name: item.name,
        price: item.price,
        quantity: 0,
        predefined: true,
    })) || [];

    listItems?.forEach((item) => {
        // const dimensions = extractDimensions(item.description);
        const propertiesJson = filteredDescriptionJson(item.description);
        const dimensions = propertiesJson?.Size ? extractDimensions(item.description) : item.description ? extractDimensions(item.description) : null;
        const config = propertiesJson?.Config || propertiesJson?.config || propertiesJson?.Size || propertiesJson?.size;
        if (config?.length > 0) {
            scopeArray[2] = {
                ...scopeArray[2],
                quantity: scopeArray[2].quantity + countChar(config, 'O'),
            }


        }
        if (dimensions) {
            const [width, height] = dimensions;
            if (item.name.toLowerCase().includes('window')) {
                if (Number(width) <= 74) {
                    scopeArray[0] = {
                        ...scopeArray[0],
                        quantity: scopeArray[0].quantity + item.quantity,
                    }
                } else if (Number(width) > 74) {
                    scopeArray[1] = {
                        ...scopeArray[1],
                        quantity: scopeArray[1].quantity + item.quantity,
                    }
                }
            }
            else if ((item.name.toLowerCase().includes('french') &&
                item.name.toLowerCase().includes('door')) ||
                (item.description.toLowerCase().includes('french') &&
                    item.description.toLowerCase().includes('door')) ||
                item.description.toLowerCase().includes('fd')) {
                if (Number(width) <= 39) {
                    scopeArray[3] = {
                        ...scopeArray[3],
                        quantity: countChar(config, 'X') > 1 ? scopeArray[3].quantity + countChar(config, 'X') : scopeArray[3].quantity + item.quantity,
                    }
                } else if (Number(width) > 39) {
                    scopeArray[4] = {
                        ...scopeArray[4],
                        quantity: countChar(config, 'X') > 1 ? scopeArray[4].quantity + countChar(config, 'X') : scopeArray[4].quantity + item.quantity,
                    }
                }
            }
            else if ((item.name.toLowerCase().includes('slid') &&
                item.name.toLowerCase().includes('door')) ||
                (item.description.toLowerCase().includes('slid') &&
                    item.description.toLowerCase().includes('door')) ||
                item.name.toLowerCase().includes('sgd') ||
                item.description.toLowerCase().includes('sgd')) {
                if (Number(width) <= 72) {
                    scopeArray[5] = {
                        ...scopeArray[5],
                        quantity: scopeArray[5].quantity + item.quantity,
                    }
                } else if (Number(width) > 72) {
                    scopeArray[6] = {
                        ...scopeArray[6],
                        quantity: scopeArray[6].quantity + item.quantity,
                    }
                }
            }
            else if ((item.name.toLowerCase().includes('store') &&
                item.name.toLowerCase().includes('front'))) {
                scopeArray[7] = {
                    ...scopeArray[7],
                    quantity: scopeArray[7].quantity + item.quantity,
                    price: ((Number(width) * Number(height)) / 144) * 10,
                }
            }
            else {
                scopeArray.push({
                    id: scopeArray.length,
                    name: item.name,
                    price: 0,
                    quantity: item.quantity,
                    predefined: false,
                    itemId: item.line_item_id,
                });
            }
        }
        else {
            scopeArray.push({
                id: scopeArray.length,
                name: item.name,
                price: 0,
                quantity: item.quantity,
                predefined: false,
                itemId: item.line_item_id,
            });
        }
    });

    const finalArray = combineByName(scopeArray);

    return combineByName(finalArray);
}


export function combineByName(arr) {
    const grouped = arr.reduce((acc, cur) => {
        const key = cur.name.trim().toLowerCase();
        if (!acc[key]) {
            acc[key] = { ...cur };
        } else {
            acc[key].quantity = Number(acc[key].quantity) + Number(cur.quantity);
        }
        return acc;
    }, {});
    return Object.values(grouped);
}


export function extractDimensions(text) {
    const patterns = [
        // // Formato estándar: 36.0" x 48.0" o 36.0x48.0 o 36.0 x 48.0 (con o sin comillas)
        // /(\d+(?:\.\d+)?)(?:["])?\s*[xX]\s*(\d+(?:\.\d+)?)(?:["])?/,
        // 1) decimal o fracción (como "36", "36.5", "36 3/4", "3/8"), opcional comilla, separador X, luego lo mismo, y luego opcional sufijo de letras
        /(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)(?:["”])?\s*[xX]\s*(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)(?:["”])?(?:\s*[A-Za-z]+)?/,
        // Variante sin 'x', solo con comillas: 36.0" 48.0"
        /(\d+(?:\.\d+)?)(?:["])\s+(\d+(?:\.\d+)?)(?:["])/,
        // Formato con "W=" y "H1=" (que pueden incluir fracciones), por ejemplo: "W=48 X H1=57 1/8"
        /W\s*=\s*([\d\s/]+)\s*[xX]\s*H1\s*=\s*([\d\s/]+)/i,
        // Nuevo patrón: opcionalmente "Mg" seguido de dígitos y espacios, luego un número con comillas, espacio, otro número con comillas.
        /(?:Mg\d+\s+)?(\d+(?:\.\d+)?)(?:["])\s+(\d+(?:\.\d+)?)(?:["])/i,
    ];

    // Función auxiliar para convertir una cadena con fracción a número.
    // Ejemplo: "57 1/8" => 57 + (1/8) = 57.125
    const parseFraction = (str) => {
        str = str.trim();
        if (str.includes(' ') && str.includes('/')) {
            const parts = str.split(/\s+/);
            if (parts.length === 2) {
                const whole = parseFloat(parts[0]);
                const fractionParts = parts[1].split('/');
                if (fractionParts.length === 2) {
                    const numerator = parseFloat(fractionParts[0]);
                    const denominator = parseFloat(fractionParts[1]);
                    if (!Number.isNaN(whole) && !Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
                        return whole + numerator / denominator;
                    }
                }
            }
        }
        return parseFloat(str);
    };

    // Recorremos los patrones usando map() y find() para obtener el primer match válido
    const match = patterns
        .map((pattern) => text.match(pattern))
        .find((result) => result !== null);

    if (match) {
        // match[1] y match[2] contienen los valores capturados
        const width = parseFraction(match[1]);
        const height = parseFraction(match[2]);
        return [width, height];
    }
    return null;
}



function countChar(str, char) {
    const escapedChar = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedChar, 'gi');
    const matches = str?.match(regex);
    return matches ? matches.length : 0;
}
