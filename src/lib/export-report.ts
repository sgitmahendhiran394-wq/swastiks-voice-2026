import * as ExcelJS from "exceljs";
import type { FeedbackRow } from "./admin.functions";
import { formatDateTime } from "./admin-analytics";

export async function exportToExcel(rows: FeedbackRow[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Feedback Data");

  worksheet.columns = [
    { header: "Submission Date", key: "submitted_at", width: 22 },
    { header: "Name", key: "employee_name", width: 25 },
    { header: "Email", key: "employee_email", width: 30 },
    { header: "Employee ID", key: "employee_id", width: 15 },
    { header: "Department", key: "department", width: 20 },
    { header: "Q1 - Organization", key: "q1", width: 18 },
    { header: "Q2 - Venue", key: "q2", width: 12 },
    { header: "Q3 - Engagement", key: "q3", width: 15 },
    { header: "Q4 - Food", key: "q4", width: 12 },
    { header: "Q5 - Awards", key: "q5", width: 15 },
    { header: "Q6 - Leadership", key: "q6", width: 18 },
    { header: "Q7 - Collaboration", key: "q7", width: 18 },
    { header: "Q8 - Overall", key: "q8", width: 15 },
    { header: "Q9 - Highlights", key: "q9", width: 40 },
    { header: "Q10 - Suggestions", key: "q10", width: 40 },
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD4AF37" }, // Gold color
  };

  rows.forEach((row) => {
    worksheet.addRow({
      submitted_at: formatDateTime(row.submitted_at),
      employee_name: row.employee_name,
      employee_email: row.employee_email,
      employee_id: row.employee_id ?? "N/A",
      department: row.department ?? "N/A",
      q1: row.q1,
      q2: row.q2,
      q3: row.q3,
      q4: row.q4,
      q5: row.q5,
      q6: row.q6,
      q7: row.q7,
      q8: row.q8,
      q9: row.q9 || "—",
      q10: row.q10 || "—",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Swastiks_Feedback_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
