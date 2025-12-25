import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Portfolio } from "@shared/schema";

export interface ResumeGeneratorOptions {
  portfolio: Portfolio;
  userName: string;
  filename?: string;
}

/**
 * Generate and download a PDF resume from portfolio data
 */
export async function generateResumePDF(options: ResumeGeneratorOptions): Promise<void> {
  const { portfolio, userName, filename = `${userName.replace(/\s+/g, "_")}_Resume.pdf` } = options;

  // Create a temporary container for the resume
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px"; // A4-ish width
  document.body.appendChild(container);

  try {
    // Import Resume component dynamically to render
    const { Resume } = await import("@/components/Resume");
    const { createRoot } = await import("react-dom/client");

    // Create a temporary root and render the resume
    const root = createRoot(container);

    // Render the resume component
    await new Promise<void>((resolve) => {
      root.render(
        // @ts-ignore - createElement is available
        React.createElement(Resume, { portfolio, userName })
      );
      // Wait for render to complete
      setTimeout(resolve, 100);
    });

    // Convert the HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate dimensions for PDF (A4 size)
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);

    // Cleanup
    root.unmount();
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Alternative simpler method using jsPDF text API (no html2canvas)
 * This creates a basic text-based PDF without styling
 */
export function generateSimpleResumePDF(options: ResumeGeneratorOptions): void {
  const { portfolio, userName, filename = `${userName.replace(/\s+/g, "_")}_Resume.pdf` } = options;

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const leftMargin = 15;
  const rightMargin = 195;
  const centerX = pageWidth / 2;
  let yPosition = 20;
  const lineHeight = 6;

  // Helper to add centered text
  const addCenteredText = (text: string, fontSize: number, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    const textWidth = pdf.getTextWidth(text);
    pdf.text(text, centerX - textWidth / 2, yPosition);
    yPosition += fontSize * 0.4;
  };

  // Helper for section headers
  const addSection = (title: string) => {
    yPosition += 4;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(title.toUpperCase(), leftMargin, yPosition);
    pdf.setLineWidth(0.5);
    pdf.line(leftMargin, yPosition + 1, rightMargin, yPosition + 1);
    yPosition += 6;
  };

  // Helper for body text with wrapping
  const addText = (text: string, x: number = leftMargin, fontSize: number = 10, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = pdf.splitTextToSize(text, rightMargin - x);
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, x, yPosition);
      yPosition += lineHeight;
    });
  };

  // Helper for text with right-aligned date
  const addTextWithDate = (text: string, date: string, fontSize: number = 10, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");

    // Add main text on left
    pdf.text(text, leftMargin, yPosition);

    // Add date on right
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    const dateWidth = pdf.getTextWidth(date);
    pdf.text(date, rightMargin - dateWidth, yPosition);

    yPosition += lineHeight;
  };


  // === HEADER SECTION ===
  // Profile picture (centered, circular)
  if ((portfolio as any).profilePicture) {
    try {
      const imgSize = 25; // Slightly larger for better visibility
      const imgData = (portfolio as any).profilePicture;

      // Auto-detect image format from base64 string
      let format = 'JPEG';
      if (imgData.includes('data:image/png')) {
        format = 'PNG';
      } else if (imgData.includes('data:image/jpeg') || imgData.includes('data:image/jpg')) {
        format = 'JPEG';
      } else if (imgData.includes('data:image/webp')) {
        format = 'WEBP';
      }

      // Add circular clipping path for profile picture
      const imgX = centerX - imgSize / 2;
      const imgY = yPosition;

      // Draw circle (approximated with arc)
      pdf.setFillColor(255, 255, 255);
      pdf.circle(centerX, imgY + imgSize / 2, imgSize / 2, 'F');

      // Add image
      pdf.addImage(imgData, format, imgX, imgY, imgSize, imgSize);

      // Draw border around circular image
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.circle(centerX, imgY + imgSize / 2, imgSize / 2, 'S');

      yPosition += imgSize + 5;
    } catch (error) {
      console.error('Failed to add profile picture to PDF:', error);
      // Continue without image if it fails
      yPosition += 3;
    }
  }

  // Name (centered, large, bold)
  addCenteredText(userName, 18, true);
  yPosition += 2;

  // Title (centered, medium)
  if (portfolio.title) {
    addCenteredText(portfolio.title, 12, false);
    yPosition += 2;
  }

  // Contact info (centered, small, compact)
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  const contactParts: string[] = [];
  if (portfolio.location) contactParts.push(portfolio.location);
  if (portfolio.github) contactParts.push(portfolio.github);
  if (portfolio.linkedin) contactParts.push(portfolio.linkedin);
  if (portfolio.website) contactParts.push(portfolio.website);

  if (contactParts.length > 0) {
    const contactLine = contactParts.join("  |  ");
    const contactWidth = pdf.getTextWidth(contactLine);
    pdf.text(contactLine, centerX - contactWidth / 2, yPosition);
    yPosition += 5;
  }

  // === PROFILE SECTION ===
  if (portfolio.bio) {
    addSection("PROFILE");
    addText(portfolio.bio, leftMargin, 10, false);
    yPosition += 1;
  }

  // === EDUCATION SECTION ===
  if (portfolio.education && portfolio.education.length > 0) {
    addSection("EDUCATION");
    portfolio.education.forEach((edu) => {
      const dateRange = `${edu.startDate} – ${edu.current ? "Present" : edu.endDate}`;
      const degreeLine = `${edu.degree}${edu.field ? " - " + edu.field : ""}`;

      addTextWithDate(degreeLine, dateRange, 10, true);
      addText(edu.institution, leftMargin, 10, false);
      yPosition += 1;
    });
  }

  // === SKILLS SECTION ===
  if (portfolio.skills && portfolio.skills.length > 0) {
    addSection("SKILLS");

    // Group skills by category (simple approach - just list them)
    const skillsText = portfolio.skills.join(", ");
    addText(skillsText, leftMargin, 10, false);
    yPosition += 1;
  }

  // === EXPERIENCE SECTION ===
  if (portfolio.experience && portfolio.experience.length > 0) {
    addSection("PROFESSIONAL EXPERIENCE");
    portfolio.experience.forEach((exp) => {
      const dateRange = `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`;

      addTextWithDate(exp.position, dateRange, 10, true);
      addText(exp.company, leftMargin, 10, false);

      if (exp.description) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const descLines = pdf.splitTextToSize(exp.description, rightMargin - leftMargin - 5);
        descLines.forEach((line: string) => {
          pdf.text("• " + line, leftMargin + 3, yPosition);
          yPosition += lineHeight;
        });
      }
      yPosition += 2;
    });
  }

  // === PROJECTS SECTION ===
  if (portfolio.projects && portfolio.projects.length > 0) {
    addSection("PROJECTS");
    portfolio.projects.forEach((project) => {
      // Project title (bold)
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(project.title, leftMargin, yPosition);
      yPosition += lineHeight;

      // Technologies used
      if (project.technologies && project.technologies.length > 0) {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "italic");
        const techText = "Tech Used: " + project.technologies.join(", ");
        addText(techText, leftMargin, 9, false);
      }

      // Description
      if (project.description) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const descLines = pdf.splitTextToSize(project.description, rightMargin - leftMargin - 5);
        descLines.forEach((line: string) => {
          pdf.text("• " + line, leftMargin + 3, yPosition);
          yPosition += lineHeight;
        });
      }

      // Link
      if (project.link) {
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 255);
        pdf.text(project.link, leftMargin, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += lineHeight;
      }

      yPosition += 2;
    });
  }

  // Download
  pdf.save(filename);
}
