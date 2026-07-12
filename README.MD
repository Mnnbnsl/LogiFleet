<div align="center">

# 🚚 LogiFleet
### Intelligent Fleet & Logistics Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" alt="JWT" />
  <img src="https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

### Enterprise Fleet Management System for Modern Logistics Companies
**Manage Vehicles • Drivers • Trips • Maintenance • Fuel • Expenses • Reports • Analytics**

---

</div>

# 📖 Table of Contents
- [Introduction](#-introduction)
- [Problem Statement](#-problem-statement)
- [Existing System vs Proposed Solution](#-existing-system-vs-proposed-solution)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Technology Stack](#-technology-stack)
- [System Architecture & Workflow Design](#-system-architecture--workflow-design)
- [Database Architecture](#-database-architecture)
- [API Documentation](#-api-documentation)
- [Security & Request Validation](#-security--request-validation)
- [Performance Optimizations](#-performance-optimizations)
- [Project Layout](#-project-layout)
- [Future Enhancements](#-future-enhancements)
- [Contributors & License](#-contributors--license)

---

# 🚛 Introduction

Fleet management is one of the most critical components of modern logistics and transportation industries. Organizations managing fleets of vehicles often struggle with maintaining accurate records of drivers, vehicle utilization, maintenance schedules, fuel consumption, operational costs, and overall business analytics.

Traditional fleet management systems rely heavily on spreadsheets, manual records, disconnected software solutions, and human intervention. These methods introduce delays, increase operational costs, and make data-driven decision-making difficult.

**LogiFleet** is a modern full-stack Fleet Management System that digitizes the complete fleet lifecycle. It enables organizations to efficiently manage vehicles, drivers, maintenance activities, trips, fuel usage, expenses, and reports while ensuring secure access through Role-Based Access Control (RBAC). 

The application is built using **React**, **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**, following a scalable layered architecture suitable for enterprise-grade deployments.

---

# ❗ Problem Statement

Logistics companies today face numerous operational challenges that impact productivity, efficiency, and profitability:

*   **Manual Vehicle Management:** Vehicle information is typically stored in Excel sheets or physical registers, making it difficult to track availability, maintenance history, and utilization rates.
*   **Driver Mismanagement:** Organizations struggle to monitor driver license expirations, active availabilities, safety metrics, and historical trip logs.
*   **Poor Maintenance Tracking:** Maintenance schedules are often managed reactively rather than proactively, resulting in delayed servicing, unexpected on-road breakdowns, and high asset depreciation.
*   **Fuel Leakage & Cost Tracking:** Without centralized, trip-tied logging, fuel expenses become difficult to audit, introducing severe vulnerabilities to operational financial losses.
*   **Lack of Business Intelligence:** Managers cannot accurately determine critical Key Performance Indicators (KPIs) such as Fleet Utilization rates, Vehicle ROI, exact Operational Cost-per-mile, Fuel Efficiency metrics, and Driver Productivity profiles.
*   **Weak Security:** Legacy systems lack granular authentication and authorization mechanisms, exposing highly sensitive logistics data to unauthorized eyes.

---

# 🔍 Existing System vs Proposed Solution

### The Legacy Landscape
