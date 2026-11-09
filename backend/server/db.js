import pg from "pg";

// Les paramètres de connexion viennent du fichier .env (PGHOST, PGUSER, PGPASSWORD, PGDATABASE…).
// Les dates (type DATE) restent des chaînes « AAAA-MM-JJ » : pas de décalage de fuseau horaire.
pg.types.setTypeParser(1082, (v) => v);

export const pool = new pg.Pool({ max: 10 });

pool.on("error", (err) => console.error("[db] erreur inattendue :", err.message));

export const query = (text, params) => pool.query(text, params);
