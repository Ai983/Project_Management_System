import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToPDF = (data: any[], title = 'Report') => {
  const doc = new jsPDF();
  doc.text(title, 14, 20);
  autoTable(doc, {
    startY: 30,
    head: [Object.keys(data[0])],
    body: data.map(obj => Object.values(obj)),
  });
  doc.save(`${title}.pdf`);
};

export const exportToExcel = (data: any[], title = 'Report') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${title}.xlsx`);
};
