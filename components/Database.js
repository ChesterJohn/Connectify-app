import * as SQLite from 'expo-sqlite'; 

const db = SQLite.openDatabase("contact_directory.db");

const init = () => {
  const query = ` 
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    facebook TEXT,
    instagram TEXT,
    xApp TEXT,
    favorite INTEGER NOT NULL DEFAULT 0, 
    imageUri TEXT,
    audioNote BLOB
  );`;

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(query, [],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

export const addContact = async (name, phone, email, facebook, instagram, xApp, favorite) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO contacts (name, phone, email, facebook, instagram, xApp, favorite) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [name, phone, email, facebook, instagram, xApp, favorite ? 1 : 0],
            (_, result) => { 
            resolve(result);
            },
            (_, error) => {
            console.error('Error adding contact:', error);
            reject(error);
            }
        );
        });
    });
};

export const fetchContactById = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM contacts WHERE id = ?;`,
                [id],
                (_, { rows: { _array } }) => resolve(_array.length > 0 ? _array[0] : null),
                (_, error) => reject(error)
            );
        });
    });
};



  
  
export const updateContact = async (id, name, phone, email, facebook, instagram, xApp) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            `UPDATE contacts 
            SET name = ?, phone = ?, email = ?, 
                facebook = ?, instagram = ?, xApp = ?
            WHERE id = ?;`,
            [name, phone, email, facebook, instagram, xApp, id],
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
        });
    });
};

export const deleteContact = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            `DELETE FROM contacts WHERE id = ?;`,
            [id],
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
        });
    });
};

export const toggleFavorite = async (id, isFavorite) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
        tx.executeSql(
            `UPDATE contacts SET favorite = ? WHERE id = ?;`,
            [isFavorite ? 0 : 1, id], // Toggle the current state
            (_, result) => resolve(result),
            (_, error) => reject(error)
        );
        });
    });
};
  
export const updateContactImage = async (id, imageUri) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE contacts SET imageUri = ? WHERE id = ?;`,
                [imageUri, id],
                (_, result) => { 
                    resolve(result);
                },
                (_, error) => reject(error)
            );
        });
    });
};


export const fetchContacts = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM contacts;`, [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

export const saveRecordingURI = async (id, uri) => { 
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE contacts SET audioNote = ? WHERE id = ?;`,
                [uri, id],
                (_, result) => resolve(result),
                (_, error) => reject(error)
            );
        });
    });
};

export const loadRecordingURI = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT audioNote FROM contacts WHERE id = ?;`,
                [id],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].audioNote);
                    } else {
                        resolve(null);
                    }
                },
                (_, error) => reject(error)
            );
        });
    });
};

 
init().then(() => {
  console.log("Database initialized");
}).catch(err => {
  console.error("Failed to initialize database:", err);
});
