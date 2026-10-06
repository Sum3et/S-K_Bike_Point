# S K Bike Point — System Architecture & Diagrams Book

This directory contains the consolidated software engineering architectural diagrams, UML models, Entity-Relationship schemas, sequence flows, process flowchart, and timeline roadmap for the **S K Bike Point Multi-Brand Two-Wheeler Workshop Management System**.

Structured strictly with **Master Diagrams** and focused **Sub-Diagrams** (maximum 2 diagrams per topic/pointer), formatted for **A4 Landscape High-Resolution Printing & Vector SVG rendering** with zero personal or sensitive details.

---

## 📁 Directory Structure

```
diagrams-book/
├── diagrams/                              # Mermaid Source Definitions (.mmd)
│   ├── 01_use_case.mmd                    # Pointer 1 (Master): System Use Case Model
│   ├── 01a_use_case_roles.mmd             # Pointer 1 (Sub): Workshop Floor Operations & RBAC
│   ├── 02_er_diagram.mmd                  # Pointer 2 (Master): Complete Database Schema
│   ├── 02a_er_workshop_operations.mmd    # Pointer 2 (Sub): Jobs, Spares & Billing Schema
│   ├── 03_class_diagram.mmd               # Pointer 3 (Master): System Class Diagram
│   ├── 04a_sequence_service_tracking.mmd  # Pointer 4 (Sequence A): Live Repair Tracker & Booking
│   ├── 04b_sequence_job_invoice.mmd       # Pointer 4 (Sequence B): Floor Repair & GST Invoicing
│   ├── 05_flowchart.mmd                   # Pointer 5 (Master): Workshop Process Flowchart
│   └── 06_gantt.mmd                       # Pointer 6 (Master): Engineering Implementation Timeline
├── svg/                                   # High-DPI Vector Diagrams (Crisp on Any Zoom)
│   └── 01_use_case.svg ... 06_gantt.svg
├── png/                                   # High-Resolution Raster Diagrams
│   └── 01_use_case.png ... 06_gantt.png
├── print-book.html                        # A4 Landscape Formatted Diagram Book (Ready to Print)
├── SK_Bike_Point_Architecture_Diagrams.pdf # Standalone Multi-Page PDF Document
├── generate-pngs.js                        # Vector SVG & High-Res PNG Generator
├── export-pdf.js                           # Headless PDF Compiler
└── README.md                              # This Documentation Index
```

---

## 📊 Consolidated Diagram Book (Max 2 per Pointer)

| # | Pointer / Category | Diagram Role | File Name | Description |
| :---: | :--- | :--- | :--- | :--- |
| **1.0** | **Use Case Model** | **Master** | [`01_use_case.svg`](file:///diagrams-book/svg/01_use_case.svg) | High-level actor interactions across Guest, Customer, Mechanic, and Admin roles. |
| **1.1** | **Use Case Model** | **Sub-Diagram** | [`01a_use_case_roles.svg`](file:///diagrams-book/svg/01a_use_case_roles.svg) | Detailed floor workflows: Job allocation, spare parts requisition, and GST billing. |
| **2.0** | **Database Schema (ER)** | **Master** | [`02_er_diagram.svg`](file:///diagrams-book/svg/02_er_diagram.svg) | Full database schema showing all primary/foreign keys, cardinality, and constraints. |
| **2.1** | **Database Schema (ER)** | **Sub-Diagram** | [`02a_er_workshop_operations.svg`](file:///diagrams-book/svg/02a_er_workshop_operations.svg) | Dedicated operational tables: Service Jobs, stage milestones, inventory stock ledger, and tax invoices. |
| **3.0** | **System Class Diagram** | **Master** | [`03_class_diagram.svg`](file:///diagrams-book/svg/03_class_diagram.svg) | Spring Boot REST Controllers, JPA Entities, Service interfaces, and Data Transfer Objects. |
| **4.1** | **Sequence Flows** | **Flow A** | [`04a_sequence_service_tracking.svg`](file:///diagrams-book/svg/04a_sequence_service_tracking.svg) | Public status lookup, real-time repair tracker polling, and customer appointment booking. |
| **4.2** | **Sequence Flows** | **Flow B** | [`04b_sequence_job_invoice.svg`](file:///diagrams-book/svg/04b_sequence_job_invoice.svg) | Mechanic stage updates, inventory stock decrement, and GST 18% tax invoice settlement. |
| **5.0** | **Process Flowchart** | **Master** | [`05_flowchart.svg`](file:///diagrams-book/svg/05_flowchart.svg) | Complete physical workshop lifecycle from customer intake, 24-point check, repair, wash to gate pass. |
| **6.0** | **Project Roadmap** | **Master** | [`06_gantt.svg`](file:///diagrams-book/svg/06_gantt.svg) | Timeline Gantt chart covering system requirements, architecture, frontend/backend build, and validation. |

---

## 🖨️ How to View & Print

1. **Open the HTML Diagram Book in Browser**:
   - Double-click [`diagrams-book/print-book.html`](file:///diagrams-book/print-book.html) or open in any browser.
   - Click the orange **"Print / Save as PDF"** button at the top (or press `Ctrl + P`).
   - Print layout is pre-configured for **A4 Landscape** with clean page breaks and large readable text.

2. **Standalone PDF**:
   - The compiled PDF is available directly at [`diagrams-book/SK_Bike_Point_Architecture_Diagrams.pdf`](file:///diagrams-book/SK_Bike_Point_Architecture_Diagrams.pdf).

3. **Re-generating PNG & SVG**:
   ```bash
   node diagrams-book/generate-pngs.js
   node diagrams-book/export-pdf.js
   ```

