import express from 'express';

declare global {
    namespace Express {
      interface Request {
        reportPermission: any
      }
    }
  }


export async function findReportPermission() {

}