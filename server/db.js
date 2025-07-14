const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'saasbudget.db');

class SQLitePool {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      // Handle different query types
      if (sql.trim().toLowerCase().startsWith('select')) {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Convert SQLite integer booleans to JavaScript booleans
            const processedRows = rows.map(row => {
              const processedRow = { ...row };
              // Convert boolean fields from integer to boolean
              if (processedRow.is_admin !== undefined) {
                processedRow.is_admin = Boolean(processedRow.is_admin);
              }
              if (processedRow.is_predefined !== undefined) {
                processedRow.is_predefined = Boolean(processedRow.is_predefined);
              }
              return processedRow;
            });
            resolve({ rows: processedRows });
          }
        });
      } else if (sql.trim().toLowerCase().startsWith('insert')) {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ 
              rows: [{ id: this.lastID }],
              rowCount: this.changes
            });
          }
        });
      } else {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ 
              rows: [],
              rowCount: this.changes
            });
          }
        });
      }
    });
  }

}

const pool = new SQLitePool();

module.exports = pool;
