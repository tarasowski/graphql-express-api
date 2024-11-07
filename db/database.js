import sqlite3 from 'sqlite3';

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    // Open the database
    const db = new sqlite3.Database('./db/db.sqlite', (err) => {
      if (err) {
        console.error('Error opening database', err);
        reject(err);
      } else {
        console.log('Database opened successfully');
      }
    });

    // SQL to create table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        role TEXT
      )
    `;

    // Run the create table SQL
    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating table', err);
        reject(err);
      } else {
        console.log('Table created or already exists');
        resolve(db);
      }
    });
  });
}

export function getUsers(db) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, (err, rows) => {
      if (err) {
        console.error('Error getting users', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export function getUser(db, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE userId = ?';
    db.get(sql, [userId], (err, row) => {
      if (err) {
        console.error('Error getting users', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function createUser(db, user) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (firstName, lastName, role) VALUES (?, ?, ?)';
    db.run(sql, [user.firstName, user.lastName, user.role], function(err) {
      if (err) {
        console.error('Error creating user', err);
        reject(err);
      } else {
        resolve({ userId: this.lastID, ...user });
      }
    });
  });
}

export function updateUser(db, user) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, role = ? WHERE userId = ?';
    db.run(sql, [user.firstName, user.lastName, user.role, user.userId], function(err) {
      if (err) {
        console.error('Error updating user', err);
        reject(err);
      } else {
        resolve({ userId: user.userId, ...user });
      }
    });
  });
}

export function deleteUser(db, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE userId = ?';
    db.run(sql, [userId], function(err) {
      if (err) {
        console.error('Error deleting user', err);
        reject(err);
      } else {
        resolve('User deleted');
      }
    });
  });
}


